import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSupabaseServer } from '@/lib/supabase/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';
import type { Booking } from '@/lib/types';

const VALID_STATUSES = ['pending', 'confirmed', 'in progress', 'completed', 'cancelled'];

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return (await verifySessionToken(token)) !== null;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    const {
      name,
      phone,
      email,
      device_type,
      service_type,
      description,
      scheduled_date,
      guest_session_id,
    } = body;

    if (!name || !phone || !service_type || !scheduled_date) {
      return NextResponse.json(
        { error: 'name, phone, service_type, dan scheduled_date wajib diisi' },
        { status: 400 }
      );
    }

    const supabaseAuth = await getSupabaseServer();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    const customerPayload: Record<string, unknown> = { name, phone, email };
    if (user) {
      customerPayload.user_id = user.id;

      const { data: existing } = await supabase
        .from('customers')
        .select('user_id')
        .eq('phone', phone)
        .maybeSingle();

      if (existing?.user_id && existing.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Nomor telepon ini sudah terdaftar di akun lain' },
          { status: 409 }
        );
      }
    }

    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert(customerPayload, { onConflict: 'phone' })
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
          guest_session_id: user ? null : guest_session_id || null,
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
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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