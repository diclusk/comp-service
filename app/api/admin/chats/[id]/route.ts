import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return (await verifySessionToken(token)) !== null;
}

// Riwayat pesan lengkap satu session, urut lama -> baru.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Chat messages fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat messages' }, { status: 500 });
  }
}

// Admin balas chat. Begitu admin kirim pesan, session langsung dikunci ke mode
// manual ('handed_off') — AI tidak akan pernah balas otomatis lagi di session ini,
// walaupun sebelumnya masih status 'bot' (admin ambil alih lebih awal, sebelum
// giliran AI habis, juga dibolehkan).
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!content) {
      return NextResponse.json({ error: 'content wajib diisi' }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert([{ session_id: id, role: 'admin', content }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase
      .from('chat_sessions')
      .update({ status: 'handed_off', last_message_at: new Date().toISOString() })
      .eq('id', id);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Admin chat reply error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}

const ALLOWED_STATUSES = ['bot', 'handed_off', 'closed'] as const;

// Admin ubah status sesi manual — misalnya tutup sesi yang udah selesai dilayani,
// atau buka lagi sesi yang ke-tutup gak sengaja. Beda dari POST di atas: ini gak
// nulis pesan apapun, cuma ganti status.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const status = body.status;

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status harus salah satu dari: ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const { data: session, error } = await supabase
      .from('chat_sessions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Admin chat status update error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
