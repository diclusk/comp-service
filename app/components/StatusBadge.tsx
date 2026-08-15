'use client';

import { useSyncExternalStore } from 'react';

const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;

function getIsOpenNow(): boolean {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    hour12: false,
    weekday: 'short',
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === 'hour')?.value);
  const weekday = parts.find((p) => p.type === 'weekday')?.value;

  if (weekday === 'Sun') return false;
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

function subscribeToClock(callback: () => void) {
  const timer = setInterval(callback, 60_000);
  return () => clearInterval(timer);
}

function getServerSnapshot() {
  return false;
}

export default function StatusBadge({ className = '' }: { className?: string }) {
  const isOpen = useSyncExternalStore(subscribeToClock, getIsOpenNow, getServerSnapshot);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isOpen ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/5 text-slate-400'
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      </span>
      {isOpen ? 'Buka Sekarang' : 'Tutup'}
    </span>
  );
}
