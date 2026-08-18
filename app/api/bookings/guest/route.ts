import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { Booking } from '@/lib/types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId || !UUID_RE.test(sessionId)) {
      return NextResponse.json({ error: 'session_id tidak valid' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, customers(name, phone)')
      .eq('guest_session_id', sessionId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ bookings: (data || []) as Booking[] });
  } catch (error) {
    console.error('Guest bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}