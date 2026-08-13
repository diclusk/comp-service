'use client';

import type { ComponentType } from 'react';
import {
  Wrench,
  DownloadSimple,
  Database,
  Lightning,
  Fan,
  ShieldCheck,
} from '@phosphor-icons/react';
import type { IconProps } from '@phosphor-icons/react';
import type { Service } from '@/lib/types';

const ICONS: Record<Service['icon'], ComponentType<IconProps>> = {
  Wrench,
  DownloadSimple,
  Database,
  Lightning,
  Fan,
  ShieldCheck,
};

const ACCENT_STYLES: Record<Service['accent'], string> = {
  volt: 'bg-accent/10 text-accent border-accent/20',
  punch: 'bg-status/10 text-status border-status/20',
  cyber: 'bg-ink/10 text-ink border-ink/20',
};

export function ServiceCard({ service }: { service: Service }) {
  const IconComponent = ICONS[service.icon];
  const accentClass = ACCENT_STYLES[service.accent];

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:shadow-md">
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${accentClass}`}
      >
        <IconComponent size={24} weight="bold" />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-ink">{service.name}</h3>
      <p className="mt-1 text-sm text-muted">{service.tagline}</p>

      <ul className="mt-4 space-y-1.5">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-xs text-muted">Mulai dari</p>
          <p className="text-base font-bold text-ink">{service.price}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Estimasi</p>
          <p className="text-sm font-medium text-ink">{service.duration}</p>
        </div>
      </div>
    </div>
  );
}