'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowsDownUp, ChartBar, CheckSquare, CircleNotch, Funnel, UsersThree, CalendarCheck, WarningCircle,
} from '@phosphor-icons/react';
import type { Lead, Booking } from '@/lib/types';
import { formatDate, formatBudget } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400 text-black',
  confirmed: 'bg-cyber text-black',
  completed: 'bg-volt text-black',
  cancelled: 'bg-punch text-white',
};

export const LeadDashboard = () => {
  const [tab, setTab] = useState<'leads' | 'bookings'>('leads');
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
    let cancelled = false;
    const run = async () => {
      try {
        await load();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
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
    { label: 'TOTAL_LEADS', value: leads.length, icon: UsersThree, color: 'text-cyber' },
    { label: 'QUALIFIED', value: qualifiedCount, icon: CheckSquare, color: 'text-volt' },
    { label: 'BOOKINGS', value: bookings.length, icon: CalendarCheck, color: 'text-punch' },
    { label: 'CONV_RATE', value: leads.length ? `${Math.round((bookings.length / leads.length) * 100)}%` : '0%', icon: ChartBar, color: 'text-white' },
  ];

  const cliBtn = (active: boolean) =>
    `font-mono text-xs font-bold uppercase tracking-widest border border-white/40 px-4 py-2 transition-colors duration-150 ${
      active ? 'bg-volt text-black border-volt' : 'text-zinc-300 hover:border-volt hover:text-volt'
    }`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="lead-dashboard">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-volt mb-3">{'// admin_panel'}</p>
        <h1 className="font-display font-bold text-4xl sm:text-5xl uppercase tracking-tighter mb-10">
          Lead_Dashboard
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 border border-white/20 mb-10">
          {stats.map((s) => (
            <div key={s.label} data-testid={`stat-${s.label.toLowerCase()}`}
              className="border-r border-b lg:border-b-0 border-white/20 last:border-r-0 bg-[#121212] p-6">
              <s.icon size={24} className={`${s.color} mb-4`} weight="duotone" />
              <p className="font-mono text-3xl font-bold">{s.value}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button data-testid="dashboard-tab-leads" onClick={() => setTab('leads')} className={cliBtn(tab === 'leads')}>
            [ LEADS ]
          </button>
          <button data-testid="dashboard-tab-bookings" onClick={() => setTab('bookings')} className={cliBtn(tab === 'bookings')}>
            [ BOOKINGS ]
          </button>
          {tab === 'leads' && (
            <>
              <span className="font-mono text-xs text-zinc-500 ml-4 flex items-center gap-1"><Funnel size={14} /> filter:</span>
              <button data-testid="filter-all" onClick={() => setFilter('all')} className={cliBtn(filter === 'all')}>ALL</button>
              <button data-testid="filter-qualified" onClick={() => setFilter('true')} className={cliBtn(filter === 'true')}>QUALIFIED</button>
              <button data-testid="filter-unqualified" onClick={() => setFilter('false')} className={cliBtn(filter === 'false')}>RAW</button>
              <button data-testid="sort-toggle" onClick={() => setSortAsc(!sortAsc)} className={`${cliBtn(false)} flex items-center gap-1.5`}>
                <ArrowsDownUp size={14} /> {sortAsc ? 'TERLAMA' : 'TERBARU'}
              </button>
            </>
          )}
        </div>

        {error && (
          <div data-testid="dashboard-error" className="border border-punch text-punch font-mono text-sm p-4 mb-6 flex items-center gap-2">
            <WarningCircle size={18} /> {error} — pastikan kredensial Supabase sudah diisi di .env.local
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 font-mono text-sm text-zinc-400 py-20 justify-center" data-testid="dashboard-loading">
            <CircleNotch size={20} className="animate-spin text-volt" /> loading_data...
          </div>
        ) : tab === 'leads' ? (
          <div className="overflow-x-auto border border-white/20" data-testid="leads-table">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="bg-[#121212] text-left">
                  {['NAMA', 'DEVICE_INFO', 'BUDGET', 'STATUS', 'MASUK', 'AKSI'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-volt border-b border-r border-white/20 last:border-r-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500" data-testid="leads-empty">{'// belum ada leads — data dari chatbot akan muncul di sini'}</td></tr>
                ) : leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors duration-150" data-testid={`lead-row-${l.id}`}>
                    <td className="px-4 py-3 border-b border-r border-white/20 font-bold">{l.name}</td>
                    <td className="px-4 py-3 border-b border-r border-white/20 text-zinc-400 text-xs max-w-xs truncate">
                      {l.device_info && Object.keys(l.device_info).length ? Object.entries(l.device_info).map(([k, v]) => `${k}: ${v}`).join(' | ') : '—'}
                    </td>
                    <td className="px-4 py-3 border-b border-r border-white/20">{formatBudget(l.budget)}</td>
                    <td className="px-4 py-3 border-b border-r border-white/20">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${l.qualified ? 'bg-volt text-black' : 'bg-white/10 text-zinc-400'}`}>
                        {l.qualified ? 'QUALIFIED' : 'RAW'}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-r border-white/20 text-zinc-400 text-xs">{formatDate(l.created_at)}</td>
                    <td className="px-4 py-3 border-b border-white/20">
                      <button data-testid={`toggle-qualified-${l.id}`} onClick={() => toggleQualified(l)}
                        className="text-[10px] font-bold uppercase tracking-widest border border-white/40 px-2 py-1 hover:bg-volt hover:text-black hover:border-volt transition-colors duration-150">
                        {l.qualified ? 'UNMARK' : 'MARK ✓'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/20" data-testid="bookings-table">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="bg-[#121212] text-left">
                  {['CUSTOMER', 'SERVIS', 'JADWAL', 'DESKRIPSI', 'STATUS'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] uppercase tracking-[0.25em] text-volt border-b border-r border-white/20 last:border-r-0">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500" data-testid="bookings-empty">{'// belum ada booking'}</td></tr>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors duration-150" data-testid={`booking-row-${b.id}`}>
                    <td className="px-4 py-3 border-b border-r border-white/20">
                      <span className="font-bold">{b.customers?.name || '—'}</span>
                      <span className="block text-xs text-zinc-500">{b.customers?.phone}</span>
                    </td>
                    <td className="px-4 py-3 border-b border-r border-white/20">{b.service_type}</td>
                    <td className="px-4 py-3 border-b border-r border-white/20 text-zinc-400 text-xs">{formatDate(b.scheduled_date)}</td>
                    <td className="px-4 py-3 border-b border-r border-white/20 text-zinc-400 text-xs max-w-xs truncate">{b.description || '—'}</td>
                    <td className="px-4 py-3 border-b border-white/20">
                      <select data-testid={`booking-status-select-${b.id}`} value={b.status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 border-0 outline-none cursor-pointer ${STATUS_COLORS[b.status] || 'bg-white/10'}`}>
                        {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

