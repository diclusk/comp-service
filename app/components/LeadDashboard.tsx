'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowsDownUp,
  ChartBar,
  CheckSquare,
  CircleNotch,
  Funnel,
  UsersThree,
  CalendarCheck,
  WarningCircle,
} from '@phosphor-icons/react';
import type { Lead, Booking } from '@/lib/types';
import { formatDate, formatBudget } from '@/lib/utils';
import { ChatSessionsPanel } from '@/app/components/ChatSessionsPanel';

const BOOKING_STATUS_STYLES: Record<string, string> = {
  pending: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  confirmed: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
  completed: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  cancelled: 'border-red-400/20 bg-red-400/10 text-red-300',
};

export const LeadDashboard = () => {
  const [tab, setTab] = useState<'leads' | 'bookings' | 'chats'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'true' | 'false'>('all');
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const qs = new URLSearchParams();
      if (filter !== 'all') qs.set('qualified', filter);
      qs.set('sort', sortAsc ? 'asc' : 'desc');
      const [lr, br] = await Promise.all([
        fetch(`/api/leads?${qs}`),
        fetch('/api/bookings'),
      ]);
      const ld = await lr.json();
      const bd = await br.json();
      if (!lr.ok) throw new Error(ld.error);
      if (!br.ok) throw new Error(bd.error);
      setLeads(ld.leads || []);
      setBookings(bd.bookings || []);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Gagal memuat data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filter, sortAsc]);

  useEffect(() => {
  const fetchData = async () => {
    await load();
  };
  
  fetchData();
}, [load]);

  const toggleQualified = async (lead: Lead) => {
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, qualified: !lead.qualified }),
    });
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const qualifiedCount = leads.filter((l) => l.qualified).length;
  const stats = [
    { label: 'Total Leads', value: leads.length, icon: UsersThree, color: 'text-teal-400' },
    { label: 'Qualified', value: qualifiedCount, icon: CheckSquare, color: 'text-emerald-400' },
    { label: 'Booking', value: bookings.length, icon: CalendarCheck, color: 'text-amber-300' },
    {
      label: 'Conversion',
      value: leads.length ? `${Math.round((bookings.length / leads.length) * 100)}%` : '0%',
      icon: ChartBar,
      color: 'text-slate-300',
    },
  ];

  const chipBtn = (active: boolean) =>
    `rounded-lg border px-3.5 py-2 text-xs font-medium uppercase tracking-wide transition ${
      active
        ? 'border-teal-400 bg-teal-400 text-[#06110f]'
        : 'border-white/10 text-slate-400 hover:border-teal-400/40 hover:text-teal-300'
    }`;

  return (
    <div data-testid="lead-dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            data-testid={`stat-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="rounded-2xl border border-white/6 bg-[#0b111d] p-5 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          >
            <s.icon size={22} weight="duotone" className={`${s.color} mb-3`} />
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs & filters */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button data-testid="dashboard-tab-leads" onClick={() => setTab('leads')} className={chipBtn(tab === 'leads')}>
          Leads
        </button>
        <button data-testid="dashboard-tab-bookings" onClick={() => setTab('bookings')} className={chipBtn(tab === 'bookings')}>
          Booking
        </button>
        <button data-testid="dashboard-tab-chats" onClick={() => setTab('chats')} className={chipBtn(tab === 'chats')}>
          Live Chat
        </button>

        {tab === 'leads' && (
          <>
            <span className="ml-3 flex items-center gap-1 text-xs text-slate-500">
              <Funnel size={14} /> Filter:
            </span>
            <button data-testid="filter-all" onClick={() => setFilter('all')} className={chipBtn(filter === 'all')}>
              Semua
            </button>
            <button data-testid="filter-qualified" onClick={() => setFilter('true')} className={chipBtn(filter === 'true')}>
              Qualified
            </button>
            <button data-testid="filter-unqualified" onClick={() => setFilter('false')} className={chipBtn(filter === 'false')}>
              Belum
            </button>
            <button
              data-testid="sort-toggle"
              onClick={() => setSortAsc(!sortAsc)}
              className={`${chipBtn(false)} flex items-center gap-1.5`}
            >
              <ArrowsDownUp size={14} /> {sortAsc ? 'Terlama' : 'Terbaru'}
            </button>
          </>
        )}
      </div>

      {error && tab !== 'chats' && (
        <div
          data-testid="dashboard-error"
          className="mt-6 flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-300"
        >
          <WarningCircle size={18} /> {error} — pastikan kredensial Supabase sudah diisi di .env.local
        </div>
      )}

      {tab === 'chats' ? (
        <div className="mt-6">
          <ChatSessionsPanel />
        </div>
      ) : loading ? (
        <div
          data-testid="dashboard-loading"
          className="mt-10 flex items-center justify-center gap-2.5 py-16 text-sm text-slate-500"
        >
          <CircleNotch size={18} className="animate-spin text-teal-400" /> Memuat data...
        </div>
      ) : tab === 'leads' ? (
        <div
          data-testid="leads-table"
          className="mt-6 overflow-x-auto rounded-2xl border border-white/6 bg-[#0b111d]"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0f1826]">
                {['Nama', 'Device', 'Budget', 'Status', 'Masuk', 'Aksi'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-white/6 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-teal-400/80"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} data-testid="leads-empty" className="px-4 py-12 text-center text-slate-500">
                    Belum ada leads — data dari chatbot akan muncul di sini.
                  </td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} data-testid={`lead-row-${l.id}`} className="transition hover:bg-white/3">
                    <td className="border-b border-white/6 px-4 py-3 font-medium text-white">{l.name}</td>
                    <td className="max-w-xs truncate border-b border-white/6 px-4 py-3 text-xs text-slate-400">
                      {l.device_info && Object.keys(l.device_info).length
                        ? Object.entries(l.device_info)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' | ')
                        : '—'}
                    </td>
                    <td className="border-b border-white/6 px-4 py-3 text-slate-300">{formatBudget(l.budget)}</td>
                    <td className="border-b border-white/6 px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                          l.qualified
                            ? 'border-teal-400/20 bg-teal-400/10 text-teal-300'
                            : 'border-white/10 bg-white/5 text-slate-400'
                        }`}
                      >
                        {l.qualified ? 'Qualified' : 'Belum'}
                      </span>
                    </td>
                    <td className="border-b border-white/6 px-4 py-3 text-xs text-slate-500">
                      {formatDate(l.created_at)}
                    </td>
                    <td className="border-b border-white/6 px-4 py-3">
                      <button
                        data-testid={`toggle-qualified-${l.id}`}
                        onClick={() => toggleQualified(l)}
                        className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 transition hover:border-teal-400/40 hover:text-teal-300"
                      >
                        {l.qualified ? 'Batalkan' : 'Tandai ✓'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          data-testid="bookings-table"
          className="mt-6 overflow-x-auto rounded-2xl border border-white/6 bg-[#0b111d]"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0f1826]">
                {['Customer', 'Servis', 'Jadwal', 'Deskripsi', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="border-b border-white/6 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-teal-400/80"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} data-testid="bookings-empty" className="px-4 py-12 text-center text-slate-500">
                    Belum ada booking.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} data-testid={`booking-row-${b.id}`} className="transition hover:bg-white/3">
                    <td className="border-b border-white/6 px-4 py-3">
                      <span className="font-medium text-white">{b.customers?.name || '—'}</span>
                      <span className="block text-xs text-slate-500">{b.customers?.phone}</span>
                    </td>
                    <td className="border-b border-white/6 px-4 py-3 text-slate-300">{b.service_type}</td>
                    <td className="border-b border-white/6 px-4 py-3 text-xs text-slate-500">
                      {formatDate(b.scheduled_date)}
                    </td>
                    <td className="max-w-xs truncate border-b border-white/6 px-4 py-3 text-xs text-slate-400">
                      {b.description || '—'}
                    </td>
                    <td className="border-b border-white/6 px-4 py-3">
                      <select
                        data-testid={`booking-status-select-${b.id}`}
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide outline-none ${
                          BOOKING_STATUS_STYLES[b.status] || 'border-white/10 bg-white/5 text-slate-300'
                        }`}
                      >
                        {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                          <option key={s} value={s} className="bg-[#0b111d] text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};