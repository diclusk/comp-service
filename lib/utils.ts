// Small shared utilities.

/** Merge conditional class names, filtering falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

/** Format an ISO date string into the Indonesian locale (short). */
export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a number as Indonesian Rupiah, or a dash when null/0. */
export function formatBudget(budget: number | null | undefined): string {
  return budget ? `Rp ${Number(budget).toLocaleString('id-ID')}` : '—';
}

