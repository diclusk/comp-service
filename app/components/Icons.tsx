type IconProps = {
  className?: string;
};

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IconMessage({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5h16v11H9l-4 4z" />
      <circle cx="9" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCalendar({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.2" />
      <line x1="3.5" y1="9.8" x2="20.5" y2="9.8" />
      <line x1="8" y1="2.8" x2="8" y2="6.3" />
      <line x1="16" y1="2.8" x2="16" y2="6.3" />
    </svg>
  );
}

export function IconClipboard({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2.3" width="6" height="3.4" rx="1" />
      <line x1="9" y1="11.2" x2="15" y2="11.2" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

export function IconCpu({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="7" y="7" width="10" height="10" rx="1.6" />
      <rect x="10" y="10" width="4" height="4" rx="0.6" />
      <line x1="9" y1="2.6" x2="9" y2="6" />
      <line x1="15" y1="2.6" x2="15" y2="6" />
      <line x1="9" y1="18" x2="9" y2="21.4" />
      <line x1="15" y1="18" x2="15" y2="21.4" />
      <line x1="2.6" y1="9" x2="6" y2="9" />
      <line x1="2.6" y1="15" x2="6" y2="15" />
      <line x1="18" y1="9" x2="21.4" y2="9" />
      <line x1="18" y1="15" x2="21.4" y2="15" />
    </svg>
  );
}

export function IconCode({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <polyline points="8.5,6.5 3.2,12 8.5,17.5" />
      <polyline points="15.5,6.5 20.8,12 15.5,17.5" />
    </svg>
  );
}

export function IconUpload({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="12" y1="3.2" x2="12" y2="14.5" />
      <polyline points="7.3,8 12,3.2 16.7,8" />
      <path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function IconBroom({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="14" y1="10" x2="5" y2="19" />
      <path d="M14 10l3.3-3.3 2.6 2.6L16.6 12.6z" />
      <line x1="7.2" y1="16.8" x2="4.2" y2="19.8" />
      <line x1="9.5" y1="14.5" x2="7" y2="17" />
    </svg>
  );
}

export function IconHardDrive({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.2" y="7.5" width="17.6" height="11" rx="2" />
      <line x1="3.2" y1="13" x2="20.8" y2="13" />
      <circle cx="8" cy="16" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="11.3" cy="16" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconShieldCheck({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.2l7 2.8v5.6c0 5-3.3 7.9-7 9-3.7-1.1-7-4-7-9V6z" />
      <polyline points="8.8,12.2 10.8,14.2 15.2,9.6" />
    </svg>
  );
}

export function IconHeadset({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 13.5v-1.7a7.5 7.5 0 0 1 15 0v1.7" />
      <rect x="2.5" y="13.2" width="5" height="7" rx="2" />
      <rect x="16.5" y="13.2" width="5" height="7" rx="2" />
      <path d="M19.5 20.2a3 3 0 0 1-3 2.8h-2" />
    </svg>
  );
}

export function IconArrowRight({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="4" y1="12" x2="18.5" y2="12" />
      <polyline points="12.5,6 18.5,12 12.5,18" />
    </svg>
  );
}

export function IconUser({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
    </svg>
  );
}

export function IconMenu({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function IconClose({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function IconMapPin({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21.5S5.5 14.8 5.5 9.8a6.5 6.5 0 1 1 13 0c0 5-6.5 11.7-6.5 11.7z" />
      <circle cx="12" cy="9.6" r="2.2" />
    </svg>
  );
}

export function IconPhone({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6.2 3.5h3l1.3 3.8-2 1.6a12.5 12.5 0 0 0 6.1 6.1l1.6-2 3.8 1.3v3a1.6 1.6 0 0 1-1.7 1.6A16.7 16.7 0 0 1 4.6 5.2a1.6 1.6 0 0 1 1.6-1.7z" />
    </svg>
  );
}

export function IconMail({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5.3" width="18" height="13.4" rx="2" />
      <polyline points="3.5,6.2 12,12.5 20.5,6.2" />
    </svg>
  );
}

export function IconClock({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.8" />
      <polyline points="12,7.2 12,12 15.5,14" />
    </svg>
  );
}

export function IconFacebook({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
      <path d="M14.5 21v-7.2h2.4l.4-2.8h-2.8v-1.8c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H9.4v2.8H12V21z" />
    </svg>
  );
}

export function IconInstagram({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.6" cy="7.4" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconWhatsapp({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 19.5l1.1-3.4a7.7 7.7 0 1 1 3 2.9z" />
      <path d="M9.2 9.6c.2-.5.4-.5.7-.5h.4c.2 0 .4 0 .5.4.2.4.6 1.4.6 1.5.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.3.8 1.2 1.6 1.9.9.8 1.6 1 1.9 1.2.3.1.5.1.6-.1.2-.2.6-.7.8-1 .2-.2.4-.2.6-.1.2.1 1.4.7 1.7.8.3.1.4.2.5.3 0 .2 0 .8-.3 1.3s-1.3 1-1.9 1c-.5 0-1.7-.2-3.3-1.4-2-1.5-3.2-3.4-3.4-3.7-.1-.2-.9-1.3-.9-2.5 0-1.1.6-1.7.8-1.9z" fill="currentColor" strokeWidth="0" />
    </svg>
  );
}

export function IconYoutube({ className = 'h-4 w-4' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <polygon points="10.5,9.4 15.5,12 10.5,14.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMonitor({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4" width="18" height="12.5" rx="2" />
      <line x1="8" y1="20.5" x2="16" y2="20.5" />
      <line x1="12" y1="16.5" x2="12" y2="20.5" />
    </svg>
  );
}
