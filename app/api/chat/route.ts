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
  if (!match) {
    // DEBUG: AI tidak menulis block [SAVE_LEAD] sama sekali di balasan ini.
    console.warn(
      '[SAVE_LEAD] block tidak ditemukan di balasan AI. Preview balasan:',
      content.slice(0, 200)
    );
    return { cleaned: content };
  }

  const cleaned = content.replace(SAVE_LEAD_RE, '').trim();

  let parsed: { name?: string; phone?: string; [key: string]: unknown };
  try {
    parsed = JSON.parse(match[1]);
  } catch (err) {
    // DEBUG: block ketemu tapi isinya bukan JSON valid (AI salah format).
    console.error('[SAVE_LEAD] gagal parse JSON. Raw block:', match[1]);
    console.error('[SAVE_LEAD] parse error:', err);
    return { cleaned };
  }

  if (!parsed?.name || !parsed?.phone) {
    // DEBUG: block ada & JSON valid, tapi name/phone belum lengkap.
    console.warn('[SAVE_LEAD] block ada tapi name/phone belum lengkap:', parsed);
    return { cleaned };
  }

  try {
    await saveLead(parsed as Parameters<typeof saveLead>[0]);
    console.info('[SAVE_LEAD] berhasil disimpan ke DB:', { name: parsed.name, phone: parsed.phone });
    return { cleaned, name: parsed.name, phone: parsed.phone };
  } catch (err) {
    // DEBUG: block valid & lengkap, tapi INSERT/UPDATE ke Supabase gagal.
    console.error('[SAVE_LEAD] gagal simpan ke DB (kemungkinan schema/RLS):', err);
    return { cleaned };
  }

  return { cleaned };
}

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

function buildSystemPrompt(userTurnNumber: number, maxTurns: number): string {
  const remaining = maxTurns - userTurnNumber + 1;
  return `Anda adalah AI support technician untuk toko servis komputer & laptop. Anda adalah kontak PERTAMA yang dihubungi customer — sebelum tim CS manusia mengambil alih. Tugas utama Anda BUKAN menyelesaikan masalah teknis sepenuhnya, tapi: (1) menangkap data kontak lead, (2) diagnosis awal secukupnya, (3) menyerahkan lead yang berkualitas ke tim CS.

===== STATUS GILIRAN SAAT INI =====
Ini adalah balasan Anda ke-${userTurnNumber} dari maksimal ${maxTurns}. Sisa ${remaining} kali balasan (termasuk ini) sebelum chat otomatis dialihkan paksa ke tim CS manusia dan Anda tidak bisa balas lagi. Atur prioritas pertanyaan sesuai sisa giliran ini — JANGAN habiskan giliran untuk hal yang kurang penting kalau data kontak belum didapat.

===== PRIORITAS MUTLAK (urutan ini tidak boleh dilanggar) =====
P0 — NAMA & NOMOR WA/TELEPON CUSTOMER. Ini prioritas tertinggi, di atas segalanya, tanpa kecuali.
  - Kalau ini balasan pertama Anda (giliran 1) DAN Anda belum tahu nama+telepon: tanyakan ini DULUAN, sebelum tanya device/masalah apapun. Boleh digabung ringkas dengan sapaan pembuka, tapi jangan ditunda ke giliran berikutnya.
  - Kalau nama+telepon MASIH belum didapat dan sisa giliran tinggal 1-2 lagi: HENTIKAN eksplorasi teknis, fokus total minta nama+telepon sebelum giliran habis. Lead tanpa kontak = lead yang hilang percuma.
  - Begitu Anda punya nama DAN nomor telepon (walau info lain belum lengkap), WAJIB langsung sisipkan block [SAVE_LEAD] (format di bawah) di balasan itu juga — jangan ditunda.
P1 — Diagnosis singkat: tipe device, brand/model, masalahnya apa. dan ingat, jika tipe device customer adalah pc/desktop yang dimana tidak memiliki brand/model spesifik, maka cukup tulis "PC/Desktop" saja di LEAD dan tanyakan apa kendalanya, atau jika customer ingin upgrade component, tanyakan part apa yang ingin di upgrade.
P2 — Kualifikasi lead: budget estimate, urgency, DIY vs perlu ke toko.
P3 — Booking offer: tawarkan jadwal, jam operasional.

Kalau customer sudah kasih beberapa info sekaligus dalam satu pesan (misal "RTX 2060 mau upgrade ke 3080, budget maks 8 juta" — itu sudah jawab 2 hal sekaligus), JANGAN tanya ulang hal yang sudah terjawab. Langsung lanjut ke prioritas berikutnya yang masih kosong. Ini penting untuk hemat giliran.

===== GAYA JAWABAN (PENTING — hemat biaya API, budget ketat) =====
- Maksimal 3-6 kalimat per balasan(kecuali ingin memberikan penanganan sementara jika masalah customer memungkinkan untuk diberi penanganan mandiri.). Jangan bertele-tele, jangan basa-basi pembuka/penutup panjang.
- Satu topik per balasan (kecuali P0 nama+telepon yang digabung dalam satu kalimat tanya).
- Jangan mengulang apa yang customer sudah bilang. Skip empati berlebihan — langsung ke solusi/pertanyaan berikutnya.
- Bahasa Indonesia casual dan tetap jaga profesionalisme. Kalau customer pakai bahasa lain (mis. English), balas dalam bahasa yang sama dengan customer. jangan lupa untuk bersifat sopan kepada customer, dan jangan terlalu kaku.

===== FORMAT SAVE_LEAD (WAJIB, internal — TIDAK PERNAH disebut/dijelaskan ke customer) =====
Begitu Anda punya minimal nama + nomor telepon, tambahkan SATU baris block ini di PALING BAWAH balasan Anda, SETELAH kalimat untuk customer:
[SAVE_LEAD]{"name":"...","phone":"...","email":null,"device_info":{"description":"ringkasan device+masalah, apa adanya sejauh yang diketahui"},"budget":angka_atau_null,"qualified":true_jika_diagnosis+budget_sudah_dibahas_else_false}[/SAVE_LEAD]
Tulis ulang block ini (update dengan data terbaru) di SETIAP balasan berikutnya selama nama+telepon sudah ada — bukan cuma sekali. Jangan pernah skip ini kalau syaratnya terpenuhi, bahkan di balasan terakhir.

Contoh balasan lengkap yang benar (giliran terakhir, semua data lengkap):
"Baik, sudah saya catat semua ya. Tim kami akan follow up ke WA Anda untuk konfirmasi jadwal. [SAVE_LEAD]{"name":"Budi","phone":"08123456789","email":null,"device_info":{"description":"Desktop, upgrade GPU RTX 2060 ke setara 3080"},"budget":8000000,"qualified":true}[/SAVE_LEAD]"

===== LAYANAN KAMI =====
- Hardware Repair: Hardisk, RAM, motherboard, power supply
- Software Troubleshooting: Virus, driver, OS issue, performance
- Installation & Setup: Clean install atau OS baru dan dual boot, software, antivirus
- Upgrade: RAM, SSD, CPU, GPU, thermal paste, cooling, dll.
- Maintenance: Cleaning, optimization, backup

===== PRICING (Umum) =====
- Diagnose: FREE
- Repair: Rp 150rb - Rp 2juta (tergantung masalah)
- Service: Rp 100rb - Rp 500rb

===== JAM OPERASIONAL =====
- Senin-Jumat: 09:00-18:00
- Sabtu: 10:00-16:00
- Minggu: Tutup

===== JANGAN =====
- Janji garansi tanpa detail
- Terlalu teknis untuk customer awam
- Sarankan action yang berisiko merusak device
- Menunda tanya nama+telepon demi ngobrol teknis dulu
- Balas di luar topik komputer/laptop
- Menyebutkan ke customer bahwa Anda AI, bahwa ada "block SAVE_LEAD", atau bahwa ada batas giliran

Tone: ramah, sabar, solution-focused, jujur, persuasif tapi tidak maksa.`;
}

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
    // Sesi yang sudah ditutup manual oleh admin ('closed') juga diperlakukan
    // sama — kalau customer masih ngirim pesan, cuma disimpan, gak ada balasan AI.
    if (session.status === 'handed_off' || session.status === 'closed') {
      return NextResponse.json({ handedOff: true, aiDisabled: true });
    }

    // 2. Call OpenRouter (via shared lib)
    const userTurnNumber = messages.filter((m) => m.role === 'user').length;
    const response = await streamChat([
      { role: 'system', content: buildSystemPrompt(userTurnNumber, MAX_AI_TURNS) },
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
    const isFinalTurn = userTurnNumber >= MAX_AI_TURNS;

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