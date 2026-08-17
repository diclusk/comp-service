import { getSupabase } from '@/lib/supabase';

export type SaveLeadInput = {
  name: string;
  phone: string;
  email?: string | null;
  device_info?: Record<string, unknown> | null;
  budget?: number | null;
  qualified?: boolean;
};

export async function saveLead(input: SaveLeadInput) {
  const { name, phone, email, device_info, budget, qualified } = input;

  if (!name || !phone) {
    throw new Error('name dan phone wajib diisi');
  }

  const supabase = getSupabase();

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
    return { lead: data, created: false };
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
  return { lead: data, created: true };
}
