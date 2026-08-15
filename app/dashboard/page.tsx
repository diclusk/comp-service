import Link from 'next/link';
import { LeadDashboard } from '@/app/components/LeadDashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#060a13] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 transition hover:text-slate-300"
          >
            ← Kembali ke Beranda
          </Link>
          <a
            href="/api/admin/logout"
            className="text-xs font-medium text-slate-500 transition hover:text-red-300"
          >
            Keluar →
          </a>
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
          Admin Panel
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pantau leads dari chatbot & booking servis yang masuk.
        </p>

        <div className="mt-8">
          <LeadDashboard />
        </div>
      </div>
    </div>
  );
}