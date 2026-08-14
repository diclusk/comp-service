import Link from 'next/link';
import { LeadDashboard } from '@/app/components/LeadDashboard';
import { getSupabase } from '@/lib/supabase';

// ...

async function getLeadStats() {
  const supabase = getSupabase();
  const { count: total } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  const { count: qualified } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('qualified', true);

  return { total: total ?? 0, qualified: qualified ?? 0 };
}

export default async function DashboardPage() {
  const stats = await getLeadStats();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs font-medium text-navy-400 hover:text-navy-600">
            ← Kembali ke Beranda
          </Link>
          <a href="/api/admin/logout" className="text-xs font-medium text-navy-400 hover:text-navy-600">
            Logout →
          </a>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-navy-900">Dashboard Leads</h1>
        <p className="mt-1 text-sm text-navy-600">
          Pantau leads yang masuk dari chatbot & booking.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-navy-500">Total Leads</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-navy-500">Qualified</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{stats.qualified}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-navy-500">Belum Qualified</p>
            <p className="mt-1 text-2xl font-bold text-navy-600">{stats.total - stats.qualified}</p>
          </div>
        </div>

        <div className="mt-6">
          <LeadDashboard />
        </div>
      </div>
    </div>
  );
}