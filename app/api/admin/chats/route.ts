import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// List semua chat session (bot yang lagi jalan + yang sudah di-handoff),
// diurutkan dari yang paling baru ada aktivitas, plus preview pesan terakhir.
export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabase();

    const { data: sessions, error: sessionsError } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('last_message_at', { ascending: false })
      .limit(100);

    if (sessionsError) {
      return NextResponse.json({ error: sessionsError.message }, { status: 400 });
    }

    const ids = (sessions || []).map((s) => s.id);
    let previews: Record<string, { content: string; role: string }> = {};

    if (ids.length > 0) {
      const { data: recentMessages } = await supabase
        .from('chat_messages')
        .select('session_id, role, content, created_at')
        .in('session_id', ids)
        .order('created_at', { ascending: false });

      previews = (recentMessages || []).reduce(
        (acc, m) => {
          if (!acc[m.session_id]) acc[m.session_id] = { content: m.content, role: m.role };
          return acc;
        },
        {} as Record<string, { content: string; role: string }>
      );
    }

    const withPreview = (sessions || []).map((s) => ({
      ...s,
      last_message: previews[s.id]?.content ?? null,
      last_message_role: previews[s.id]?.role ?? null,
    }));

    return NextResponse.json({ sessions: withPreview });
  } catch (error) {
    console.error('Chat sessions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}
