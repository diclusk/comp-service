import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSupabaseServer } from '@/lib/supabase/server';
import type { Booking } from '@/lib/types';

export async function GET() {
  try {
    const supabaseAuth = await getSupabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('bookings')
      .select('*, customers!inner(name, phone, user_id)')
      .eq('customers.user_id', user.id)
      .order('scheduled_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ bookings: (data || []) as Booking[] });
  } catch (error) {
    console.error('My bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
