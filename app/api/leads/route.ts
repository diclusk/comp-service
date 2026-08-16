import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminAuth';
import { saveLead } from '@/lib/leads';

// GET & PATCH di bawah ini data pribadi semua lead (nama, telepon, email, budget) —
// harus admin-only, sama kayak bookings/route.ts. POST tetap publik karena dipanggil
// chatbot (belum ada auth customer di titik itu).
async function requireAdmin(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

// Create/update a lead (dipakai manual/dashboard; chatbot sekarang manggil
// saveLead() langsung dari app/api/chat/route.ts, bukan lewat endpoint ini)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await saveLead(body);
    return NextResponse.json(result, { status: result.created ? 201 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create/update lead';
    const status = message === 'name dan phone wajib diisi' ? 400 : 500;
    console.error('Lead create error:', error);
    return NextResponse.json({ error: message }, { status });
  }
}

// Toggle qualified (used by dashboard)
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

