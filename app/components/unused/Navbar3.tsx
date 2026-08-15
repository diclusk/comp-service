'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/services', label: 'Layanan' },
];

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

    // getUser() di atas cuma jalan sekali pas mount. Navbar hidup di root layout
    // dan gak ke-remount pas pindah halaman (client-side navigation setelah
    // login/logout), jadi tanpa listener ini isLoggedIn bakal basi (stuck di
    // status awal) walau sesi user sebenarnya sudah berubah.
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
      // Sama kayak login/signup: signOut lewat browser client (bukan fetch ke
      // API route) supaya onAuthStateChange langsung fire di semua komponen
      // yang pakai instance client yang sama.
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
    <header className="sticky top-0 z-40 border-b border-white/8 bg-navy-900/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Navigasi utama">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <IconPulse className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300 ring-2 ring-navy-900" />
            </span>
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-white">Servis</span>
              <span className="text-base font-bold text-blue-400">Komputer</span>
            </div>
            <p className="hidden text-[10px] uppercase tracking-widest text-slate-500 sm:block">
              Cepat &middot; Profesional &middot; Terpercaya
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href}>
              {link.label}
            </NavLink>
          ))}

          {/* NavLink ini cuma muncul pas sudah login (nunjuk ke Riwayat Saya).
              Pas belum login, "Masuk" gak lagi dirender di sini — fungsinya
              sekarang sepenuhnya dipegang link ghost "Masuk" di sisi kanan,
              biar gak ada dua link yang nunjuk ke /login. */}
          {isLoggedIn && (
            <NavLink href={authHref} active={authActive}>
              {authLabel}
            </NavLink>
          )}

          {/* Riwayat tamu — cuma relevan kalau belum login. Bookingnya cuma
              tersimpan di sessionStorage tab ini, hilang begitu tab ditutup. */}
          {!isLoggedIn && (
            <NavLink href="/booking/riwayat" active={pathname === '/booking/riwayat'}>
              Riwayat Tamu
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Login/logout didorong jadi ghost link, bukan pill berbingkai —
              biar cuma ada satu CTA yang benar-benar menonjol (Booking). */}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="hidden text-sm font-medium text-slate-400 transition hover:text-white disabled:opacity-60 sm:inline-flex"
            >
              {loggingOut ? 'Keluar...' : 'Keluar'}
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm font-medium text-slate-400 transition hover:text-white sm:inline-flex"
            >
              Login
            </Link>
          )}

          <ShineLink href="/booking" onClick={() => setIsOpen(false)} className="hidden sm:inline-flex">
            Booking Sekarang
          </ShineLink>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 text-slate-300 transition hover:border-white/20 hover:text-white lg:hidden"
          >
            {isOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-nav" className="border-t border-white/8 bg-navy-900 px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
                onClick={() => setIsOpen(false)}
                mobile
              >
                {link.label}
              </NavLink>
            ))}

            {isLoggedIn && (
              <NavLink
                href={authHref}
                active={authActive}
                onClick={() => setIsOpen(false)}
                mobile
              >
                {authLabel}
              </NavLink>
            )}

            {!isLoggedIn && (
              <NavLink
                href="/booking/riwayat"
                active={pathname === '/booking/riwayat'}
                onClick={() => setIsOpen(false)}
                mobile
              >
                Riwayat Tamu
              </NavLink>
            )}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-2 inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/8 disabled:opacity-60"
              >
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/8"
              >
                Login
              </Link>
            )}

            <ShineLink href="/booking" onClick={() => setIsOpen(false)} className="mt-2 flex w-full justify-center">
              Booking Sekarang
            </ShineLink>
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
        'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
        mobile ? 'block' : '',
        active ? 'text-white' : 'text-slate-400 hover:text-slate-200',
        !mobile && !active ? 'hover:bg-white/5' : '',
      ].join(' ')}
    >
      {children}
      {active && (
        <span
          className={
            mobile
              ? 'absolute inset-y-0 left-0 w-0.5 rounded-full bg-cyan-400'
              : 'absolute inset-x-3.5 -bottom-px h-0.5 rounded-full bg-cyan-400'
          }
        />
      )}
    </Link>
  );
}

// Booking CTA — conic-gradient border yang berputar pelan (shine border, react bits
// style). Satu-satunya elemen "berani" di navbar, jadi CTA lain sengaja dibikin diam.
function ShineLink({
  href,
  children,
  onClick,
  className = '',
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-full p-[1.5px] shadow-lg shadow-blue-600/20 ${className}`}
    >
      <span className="absolute inset-[-1000%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#22d3ee_0%,#3b82f6_50%,#22d3ee_100%)]" />
      <span className="relative inline-flex items-center justify-center rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white transition group-hover:bg-navy-900/80">
        {children}
      </span>
    </Link>
  );
}

function IconPulse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 12h4l1.5 4.5L11 5l3 12 2-5.5h5.5" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}