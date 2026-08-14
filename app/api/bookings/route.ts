import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import type { Booking } from '@/lib/types';

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('bookings')
      .select('*, customers(name, phone)')
      .order('scheduled_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ bookings: data || [] });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { name, phone, email, device_type, service_type, description, scheduled_date } = body;

    if (!name || !phone || !service_type || !scheduled_date) {
      return NextResponse.json(
        { error: 'name, phone, service_type, dan scheduled_date wajib diisi' },
        { status: 400 }
      );
    }

    // Upsert customer (by phone) so the dashboard can show the customer name/phone.
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert(
        { name, phone, email },
        { onConflict: 'phone' }
      )
      .select()
      .single();

    if (customerError) {
      return NextResponse.json({ error: customerError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id: customer.id,
          device_type: device_type || null,
          service_type,
          description: description || null,
          scheduled_date,
          status: 'pending',
        },
      ])
      .select('*, customers(name, phone)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ booking: data as Booking }, { status: 201 });
  } catch (error) {
    console.error('Booking create error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'id dan status wajib diisi' },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status harus salah satu dari: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select('*, customers(name, phone)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ booking: data as Booking });
  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

