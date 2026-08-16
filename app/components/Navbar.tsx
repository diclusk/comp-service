'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/services', label: 'Layanan' },
];

// Satu aksen tunggal (biru terdesaturasi) — bukan gradient biru cerah.
// Dipakai konsisten di seluruh navbar: logo, garis aktif, border tombol.
const ACCENT = '#7C99B3';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    supabase.auth
      .getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user))
      .catch(() => setIsLoggedIn(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await getSupabaseBrowser().auth.signOut();
    } finally {
      setLoggingOut(false);
      setIsOpen(false);
      router.push('/');
      router.refresh();
    }
  }

  const authHref = isLoggedIn ? '/my-bookings' : '/login';
  const authActive = pathname === '/my-bookings' || pathname === '/login';
  const authLabel = isLoggedIn ? 'Riwayat Saya' : 'Masuk';

  return (
    <header className="top-0 z-50 border-b border-white/10 bg-navy-900/95 backdrop-blur-xl relative overflow-hidden">
      {/* Dot-grid skematik di belakang navbar, seperti garis referensi PCB */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(${ACCENT}55 1px, transparent 1px)`,
          backgroundSize: '18px 18px',
        }}
      />

      {/* Corner ticks — tanda registrasi ala lembar gambar teknik */}
      <span className="pointer-events-none absolute bottom-0 left-4 h-2 w-2 border-b border-l sm:left-6" style={{ borderColor: `${ACCENT}66` }} />
      <span className="pointer-events-none absolute bottom-0 right-4 h-2 w-2 border-b border-r sm:right-6" style={{ borderColor: `${ACCENT}66` }} />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Navigasi utama">
        {/* Logo */}
        <Link href="/" onClick={() => setIsOpen(false)} className="group flex items-center gap-3">
          <span
            className="font-mono text-lg font-bold tracking-tight transition-opacity group-hover:opacity-80"
            style={{ color: ACCENT }}
          >
            [FK]
          </span>
          <div className="hidden leading-none sm:block">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white">
              Servis<span style={{ color: ACCENT }}>.</span>Komputer
            </div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-500">
              Cepat // Profesional // Terpercaya
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <NavLink href={authHref} active={authActive}>
              {authLabel}
            </NavLink>
          )}

          {!isLoggedIn && (
            <NavLink href="/booking/riwayat" active={pathname === '/booking/riwayat'}>
              Riwayat
            </NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden h-9 items-center border border-white/15 px-3.5 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-50 sm:inline-flex"
            >
              {loggingOut ? 'Keluar...' : 'Keluar'}
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden h-9 items-center border border-white/15 px-3.5 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:border-white/30 hover:text-white sm:inline-flex"
            >
              Login
            </Link>
          )}

          {/* CTA utama — satu-satunya elemen berisi (filled), sisanya outline */}
          <Link
            href="/booking"
            className="hidden h-9 items-center px-4 font-mono text-xs font-semibold uppercase tracking-wider text-navy-900 transition hover:brightness-110 sm:inline-flex"
            style={{ backgroundColor: ACCENT }}
          >
            Booking Sekarang ›
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            className="flex h-9 w-9 items-center justify-center border border-white/15 text-slate-300 transition hover:border-white/30 hover:text-white lg:hidden"
          >
            {isOpen ? <IconClose className="h-4 w-4" /> : <IconMenu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-nav" className="relative border-t border-white/10 bg-navy-900 px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} active={pathname === link.href} onClick={() => setIsOpen(false)} mobile>
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn && (
              <NavLink href={authHref} active={authActive} onClick={() => setIsOpen(false)} mobile>
                {authLabel}
              </NavLink>
            )}

            {!isLoggedIn && (
              <NavLink href="/booking/riwayat" active={pathname === '/booking/riwayat'} onClick={() => setIsOpen(false)} mobile>
                Riwayat
              </NavLink>
            )}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-2 flex items-center justify-center border border-white/15 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-50"
              >
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 flex items-center justify-center border border-white/15 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-slate-300 transition hover:border-white/30 hover:text-white"
              >
                Login
              </Link>
            )}

            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-navy-900"
              style={{ backgroundColor: ACCENT }}
            >
              Booking Sekarang ›
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  onClick,
  mobile,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'relative px-3.5 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-150',
        mobile ? 'block' : '',
        active ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
      ].join(' ')}
    >
      {children}
      {active && (
        <span
          className={mobile ? 'absolute inset-y-0 left-0 w-0.5' : 'absolute inset-x-3.5 -bottom-px h-0.5'}
          style={{ backgroundColor: ACCENT }}
        />
      )}
    </Link>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}