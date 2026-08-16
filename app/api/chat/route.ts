import { NextRequest, NextResponse } from 'next/server';
import { streamChat } from '@/lib/openrouter';
import { saveLead } from '@/lib/leads';
import type { ChatMessage } from '@/lib/types';

const SAVE_LEAD_RE = /\[SAVE_LEAD\]([\s\S]*?)\[\/SAVE_LEAD\]/;

// Cabut block [SAVE_LEAD]{...}[/SAVE_LEAD] dari balasan AI: simpan lead-nya ke DB
// (best-effort, gagal simpan tidak boleh gagalin balasan ke customer), lalu
// kembalikan teks yang sudah bersih buat ditampilkan ke customer.
async function extractAndSaveLead(content: string): Promise<string> {
  const match = content.match(SAVE_LEAD_RE);
  if (!match) return content;

  const cleaned = content.replace(SAVE_LEAD_RE, '').trim();

  try {
    const parsed = JSON.parse(match[1]);
    if (parsed?.name && parsed?.phone) {
      await saveLead(parsed);
    }
  } catch (err) {
    console.error('SAVE_LEAD parse/save error:', err);
  }

  return cleaned;
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

2. INITIAL TROUBLESHOOTING (If applicable)
   - Suggest 2-3 simple steps pertama
   - Format: "Coba ini dulu:"
   - Jangan terlalu teknis di awal

3. LEAD QUALIFICATION (As conversation progresses)
   Collect info (satu per satu, jangan borongan):
   - Urgency: "Ini perlu cepat? Kapan bisa diambil?"
   - Budget: "Ada budget estimate berapa?"
   - Type: "Ini bisa DIY atau perlu ke toko?"
   - Nama & nomor telepon customer (WAJIB ditanya sebelum booking offer, supaya tim bisa follow-up): "Boleh minta nama dan nomor WA/telepon untuk kami hubungi?"

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
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: 'messages must be a non-empty array' },
      { status: 400 }
    );
  }

  // 2. Call OpenRouter (via shared lib)
  try {
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

    data.choices[0].message.content = await extractAndSaveLead(
      data.choices[0].message.content
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to call OpenRouter:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}