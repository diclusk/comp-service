import { NextRequest, NextResponse } from 'next/server';
import { streamChat } from '@/lib/openrouter';
import { saveLead } from '@/lib/leads';
import { getSupabase } from '@/lib/supabase';
import { getSupabaseServer } from '@/lib/supabase/server';
import { MAX_AI_TURNS, HANDOFF_NOTICE } from '@/lib/chat';
import type { ChatMessage, ChatSession } from '@/lib/types';

const SAVE_LEAD_RE = /\[SAVE_LEAD\]([\s\S]*?)\[\/SAVE_LEAD\]/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cabut block [SAVE_LEAD]{...}[/SAVE_LEAD] dari balasan AI: simpan lead-nya ke DB
// (best-effort, gagal simpan tidak boleh gagalin balasan ke customer), lalu
// kembalikan teks yang sudah bersih buat ditampilkan ke customer + data lead
// yang berhasil di-parse (buat di-denormalize ke chat_sessions.customer_name/phone).
async function extractAndSaveLead(
  content: string
): Promise<{ cleaned: string; name?: string; phone?: string }> {
  const match = content.match(SAVE_LEAD_RE);
  if (!match) return { cleaned: content };

  const cleaned = content.replace(SAVE_LEAD_RE, '').trim();

  try {
    const parsed = JSON.parse(match[1]);
    if (parsed?.name && parsed?.phone) {
      await saveLead(parsed);
      return { cleaned, name: parsed.name, phone: parsed.phone };
    }
  } catch (err) {
    console.error('SAVE_LEAD parse/save error:', err);
  }

  return { cleaned };
}

// Ambil chat_sessions yang sudah ada, atau buat baru kalau ini pesan pertama
// dari session_id ini. Session dilink ke customer login (kalau ada) sama seperti
// booking — lewat Supabase Auth cookie, bukan dari body request.
async function getOrCreateSession(
  sessionId: string,
  guestSessionId: string | null
): Promise<ChatSession> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle();

  if (existing) return existing as ChatSession;

  let userId: string | null = null;
  try {
    const supabaseAuth = await getSupabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Guest tanpa cookie auth valid — biarkan null, chat tetap jalan sebagai guest.
  }

  let customerId: string | null = null;
  if (userId) {
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    customerId = customer?.id ?? null;
  }

  const { data: created, error } = await supabase
    .from('chat_sessions')
    .insert([
      {
        id: sessionId,
        guest_session_id: guestSessionId,
        customer_id: customerId,
        status: 'bot',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return created as ChatSession;
}

const SYSTEM_PROMPT = `Anda adalah support technician profesional untuk toko servis komputer terpercaya.

ATURAN PANJANG JAWABAN (PENTING — demi hemat biaya API, GAPUNYA DUIT COYYY ;-;):
- Jawab SESINGKAT dan SESEPERLUNYA mungkin. Jangan bertele-tele.
- Maksimal 2-4 kalimat pendek per balasan, kecuali user minta penjelasan detail.
- Kalau nanya sesuatu ke user, tanya SATU hal per balasan — jangan borongan banyak pertanyaan sekaligus.
- Jangan mengulang apa yang user sudah bilang. Jangan basa-basi pembuka/penutup panjang.
- Skip empati berlebihan ("saya paham betul perasaan Anda...") — cukup langsung ke solusi/pertanyaan berikutnya.

KARAKTERISTIK:
- Bahasa: Bahasa Indonesia casual tapi profesional
- Tone: Helpful, empathetic, efficient
- Goal: Diagnose masalah → Suggest solusi → Qualify lead → Offer booking

MULTILANGUAGE (PENTING):
- Deteksi bahasa yang dipakai customer (Indonesia, English, dll).
- Selalu balas MENGGUNAKAN bahasa yang sama dengan customer.
- Contoh: customer tanya "I have a broken screen", jawab dalam bahasa Inggris.
- Contoh: customer tanya "Komputer saya hang", jawab dalam bahasa Indonesia.
- Jika customer bicara bahasa campuran, ikuti bahasa dominannya.
- Selalu pertahankan nada sopan & profesional dalam bahasa apa pun.

PROSES KOMUNIKASI:

1. DIAGNOSIS (Langkah Pertama)
   Tanyakan SPESIFIK:
   - Tipe device: "Apa device Anda? (Laptop/Desktop/Phone)"
   - Merek & model: "Brand dan modelnya apa?"
   - OS: "Pakai OS apa? (Windows/Mac/Linux)"
   - Masalah: "Masalahnya seperti apa? (error apa, tidak bisa apa, dll)"
   - Nama & nomor telepon customer (WAJIB ditanya sebelum booking offer, supaya tim bisa follow-up): "Boleh minta nama dan nomor WA/telepon untuk kami hubungi?"

2. INITIAL TROUBLESHOOTING (If applicable)
   - Suggest 2-3 simple steps pertama
   - Format: "Coba ini dulu:"
   - Jangan terlalu teknis di awal

3. LEAD QUALIFICATION (As conversation progresses)
   Collect info (satu per satu, jangan borongan):
   - Urgency: "Ini perlu cepat? Kapan bisa diambil?"
   - Budget: "Ada budget estimate berapa?"
   - Type: "Ini bisa DIY atau perlu ke toko?"

4. BOOKING OFFER (When ready)
   - "Kita bisa booking appointment hari [hari]. Jam berapa Anda bisa datang?"
   - Atau: "Kami buka hari Senin-Jumat 09:00-18:00, Sabtu 10:00-15:00"

5. SAVE LEAD (Internal, invisible ke customer — WAJIB dilakukan)
   Begitu Anda sudah punya MINIMAL nama + nomor telepon (device/masalah/budget boleh
   menyusul, isi apa yang sudah didapat), tambahkan SATU baris block ini di PALING
   BAWAH balasan Anda, SETELAH kalimat normal untuk customer. Block ini tidak akan
   dilihat customer, jadi jangan sebut/jelaskan block ini ke customer:
   [SAVE_LEAD]{"name":"...","phone":"...","email":null,"device_info":{"description":"ringkasan device+masalah"},"budget":angka_atau_null,"qualified":true_jika_diagnosis+budget_sudah_dibahas}[/SAVE_LEAD]
   Update block ini lagi (ulang dengan data terbaru) tiap kali ada info baru yang
   didapat sepanjang percakapan — bukan cuma sekali di awal.

LAYANAN KAMI:
- Hardware Repair: Hardisk, RAM, motherboard, power supply
- Software Troubleshooting: Virus, driver, OS issue, performance
- Installation & Setup: OS baru, software, antivirus
- Upgrade: RAM, SSD, thermal paste, cooling
- Maintenance: Cleaning, optimization, backup

PRICING (Umum):
- Diagnose: FREE
- Repair: Rp 150rb - Rp 2juta (tergantung masalah)
- Service: Rp 100rb - Rp 500rb

AVAILABILITY:
- Senin-Jumat: 09:00-18:00
- Sabtu: 10:00-15:00
- Minggu: Tutup

JANGAN:
- ❌ Janji garansi tanpa detail
- ❌ Terlalu teknis untuk customer awam
- ❌ Sarankan action risky
- ❌ Langsung minta dibawa, diagnose dulu
- ❌ Balas di luar topik komputer

PERSONALITY:
- Ramah tapi professional
- Patient
- Solution-focused
- Honest
- Persuasive but not pushy`;

export async function POST(req: NextRequest) {
  // 1. Parse & validate request body
  let messages: ChatMessage[];
  let sessionId: string;
  let guestSessionId: string | null;
  try {
    const body = await req.json();
    messages = body.messages;
    sessionId = body.session_id;
    guestSessionId = body.guest_session_id ?? null;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages must be a non-empty array' },
      { status: 400 }
    );
  }
  if (!sessionId || !UUID_RE.test(sessionId)) {
    return NextResponse.json({ error: 'session_id tidak valid' }, { status: 400 });
  }

  const supabase = getSupabase();
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

  try {
    const session = await getOrCreateSession(sessionId, guestSessionId);

    // Simpan pesan user yang baru dikirim (sekali per request — client selalu
    // kirim history penuh, tapi cuma pesan terbaru yang belum ada di DB).
    if (lastUserMessage) {
      await supabase
        .from('chat_messages')
        .insert([{ session_id: sessionId, role: 'user', content: lastUserMessage.content }]);
      await supabase
        .from('chat_sessions')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    // Sesi sudah di-takeover admin (baik lewat batas giliran, atau admin ambil
    // alih manual lebih awal) — AI tidak boleh balas lagi sama sekali. Cukup
    // simpan pesan user-nya, admin yang akan lihat & balas dari dashboard.
    if (session.status === 'handed_off') {
      return NextResponse.json({ handedOff: true, aiDisabled: true });
    }

    // 2. Call OpenRouter (via shared lib)
    const response = await streamChat([
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ]);

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter error:', data);
      return NextResponse.json(
        { error: data?.error?.message || 'OpenRouter API error' },
        { status: response.status }
      );
    }

    if (!data?.choices?.[0]?.message?.content) {
      return NextResponse.json(
        { error: 'Unexpected response from OpenRouter' },
        { status: 502 }
      );
    }

    const { cleaned, name, phone } = await extractAndSaveLead(
      data.choices[0].message.content
    );
    data.choices[0].message.content = cleaned;

    await supabase
      .from('chat_messages')
      .insert([{ session_id: sessionId, role: 'assistant', content: cleaned }]);

    if (name && phone) {
      await supabase
        .from('chat_sessions')
        .update({ customer_name: name, customer_phone: phone })
        .eq('id', sessionId);
    }

    // Giliran AI sudah habis di pesan ini — handoff ke CS, tapi AI tetap sempat
    // balas dulu di atas (fix bug lama: sebelumnya turn terakhir di-skip total).
    const userTurns = messages.filter((m) => m.role === 'user').length;
    const isFinalTurn = userTurns >= MAX_AI_TURNS;

    if (isFinalTurn) {
      await supabase
        .from('chat_messages')
        .insert([{ session_id: sessionId, role: 'assistant', content: HANDOFF_NOTICE }]);
      await supabase
        .from('chat_sessions')
        .update({ status: 'handed_off', last_message_at: new Date().toISOString() })
        .eq('id', sessionId);

      return NextResponse.json({ ...data, handedOff: true, handoffNotice: HANDOFF_NOTICE });
    }

    await supabase
      .from('chat_sessions')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', sessionId);

    return NextResponse.json({ ...data, handedOff: false });
  } catch (error) {
    console.error('Failed to call OpenRouter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}