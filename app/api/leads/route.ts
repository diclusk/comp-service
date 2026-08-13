import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(req.url);
    const qualified = searchParams.get('qualified'); // 'true' | 'false' | null
    const sort = searchParams.get('sort'); // 'asc' | 'desc'
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: sort === 'asc' })
      .range(offset, offset + limit - 1);

    if (qualified === 'true') {
      query = query.eq('qualified', true);
    } else if (qualified === 'false') {
      query = query.eq('qualified', false);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      leads: data || [],
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Leads fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// Create a lead (used by chatbot qualifying flow)
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { name, phone, email, device_info, budget, qualified } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'name dan phone wajib diisi' },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('leads')
        .update({
          name: name || existing.name,
          email: email ?? existing.email,
          device_info: device_info ?? existing.device_info,
          budget: budget ?? existing.budget,
          qualified: qualified ?? existing.qualified,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ lead: data, created: false });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          phone,
          email: email || null,
          device_info: device_info || null,
          budget: budget ?? null,
          qualified: qualified ?? false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ lead: data, created: true }, { status: 201 });
  } catch (error) {
    console.error('Lead create error:', error);
    return NextResponse.json({ error: 'Failed to create/update lead' }, { status: 500 });
  }
}

// Toggle qualified (used by dashboard)
export async function PATCH(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await req.json();
    const { id, qualified } = body;

    if (!id || typeof qualified !== 'boolean') {
      return NextResponse.json(
        { error: 'id dan qualified (boolean) wajib diisi' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('leads')
      .update({ qualified, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ lead: data });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

