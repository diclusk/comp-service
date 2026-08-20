'use client';

import type { ComponentType } from 'react';
import Link from 'next/link';
import {
  Wrench,
  DownloadSimple,
  Database,
  Lightning,
  Fan,
  ShieldCheck,
  ArrowRight,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { Service } from '@/lib/types';
import { SERVICE_BOOKING_TYPE } from '@/lib/services';

const ICONS: Record<Service['icon'], ComponentType<IconProps>> = {
  Wrench,
  DownloadSimple,
  Database,
  Lightning,
  Fan,
  ShieldCheck,
};

export function ServiceCard({
  service,
  index,
  featured = false,
}: {
  service: Service;
  index: number;
  featured?: boolean;
}) {
  const IconComponent = ICONS[service.icon];
  const ticketId = `SVC/${String(index + 1).padStart(2, '0')}`;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-white/20 ${
        featured ? 'p-7 sm:p-8' : 'p-6'
      }`}
    >
      {/* dot-grid ambient, samar — senada sama motif navbar */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(#7C99B3 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* corner ticks, ala lembar gambar teknik — sama seperti navbar */}
      <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 border-t border-l border-white/15" />
      <span className="pointer-events-none absolute top-3 right-3 h-2 w-2 border-t border-r border-white/15" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-2 w-2 border-b border-l border-white/15" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-white/15" />

      {/* header baris tiket: id + status */}
      <div className="relative flex items-center justify-between font-mono text-[11px] tracking-[0.15em] text-muted uppercase">
        <span>{ticketId}</span>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status" />
          </span>
          Tersedia
        </span>
      </div>

      <div className={`relative flex items-start gap-4 ${featured ? 'mt-6' : 'mt-5'}`}>
        <div
          className={`inline-flex shrink-0 items-center justify-center rounded-xl border border-icon/25 bg-icon/10 text-icon ${
            featured ? 'h-14 w-14' : 'h-12 w-12'
          }`}
        >
          <IconComponent size={featured ? 28 : 24} weight="bold" />
        </div>
        <div>
          {featured && (
            <span className="mb-1 inline-block rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent/60">
              Paling sering dipesan
            </span>
          )}
          <h3 className={`font-semibold text-white ${featured ? 'text-2xl' : 'text-lg'}`}>
            {service.name}
          </h3>
        </div>
      </div>

      <p className={`relative text-sm leading-relaxed text-muted ${featured ? 'mt-3 max-w-lg' : 'mt-2'}`}>
        {service.tagline}
      </p>

      <ul className={`relative space-y-2 ${featured ? 'mt-5 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2 sm:space-y-0' : 'mt-4'}`}>
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-muted">
            <ShieldCheck size={14} weight="bold" className="mt-0.5 shrink-0 text-status" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-6">
        <div className="grid grid-cols-2 divide-x divide-border overflow-hidden rounded-xl border border-border bg-black/20">
          <div className="px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Mulai dari</p>
            <p className="mt-1 font-mono text-base font-semibold text-white">{service.price}</p>
          </div>
          <div className="px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Estimasi</p>
            <p className="mt-1 font-mono text-base font-semibold text-amber-50">{service.duration}</p>
          </div>
        </div>

        <Link
          href={`/booking?service=${encodeURIComponent(SERVICE_BOOKING_TYPE[service.slug] ?? '')}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2.5 font-mono text-xs uppercase tracking-wider text-white transition-colors duration-200 group-hover:border-blue-50/50 group-hover:text-blue-400/90 "
        >
          Pesan servis ini
          <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}