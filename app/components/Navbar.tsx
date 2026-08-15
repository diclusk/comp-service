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
  const authActive =
    pathname === '/my-bookings' || pathname === '/login';
  const authLabel = isLoggedIn ? 'Riwayat Saya' : 'Masuk';

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className="
          relative mx-auto max-w-7xl
          overflow-hidden rounded-2xl
          border border-white/9
          bg-[#091426]/80
          backdrop-blur-2xl

          shadow-[
            0_16px_50px_rgba(0,0,0,0.38),
            0_4px_14px_rgba(0,0,0,0.22),
            inset_0_1px_0_rgba(255,255,255,0.07)
          ]

          before:pointer-events-none
          before:absolute before:inset-x-0 before:top-0
          before:h-px
          before:bg-linear-to-r
          before:from-transparent
          before:via-white/12
          before:to-transparent

          after:pointer-events-none
          after:absolute after:inset-0
          after:rounded-2xl
          after:bg-linear-to-b
          after:from-white/25
          after:via-transparent
          after:to-transparent
        "
        aria-label="Navigasi utama"
      >
        {/* Main navbar */}
        <div className="relative z-10 flex min-h-17 items-center justify-between px-4 sm:px-5">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-3"
          >
            <div
              className="
                relative flex h-10 w-10 shrink-0 items-center justify-center
                rounded-xl
                border border-blue-300/10
                bg-linear-to-br from-blue-500/20 to-cyan-400/5
                text-blue-300
                shadow-[0_6px_18px_rgba(37,99,235,0.18)]
                transition-all duration-300
                group-hover:-translate-y-0.5
                group-hover:border-blue-300/20
                group-hover:shadow-[0_8px_24px_rgba(37,99,235,0.28)]
              "
            >
              <IconMonitor className="h-5 w-5" />

              {/* tiny glow */}
              <span
                className="
                  absolute inset-0 rounded-xl
                  bg-blue-400/5
                  blur-md
                "
              />
            </div>

            <div className="leading-tight">
              <div className="flex items-baseline gap-1">
                <span className="text-[15px] font-semibold tracking-tight text-white">
                  Servis
                </span>
                <span className="text-[15px] font-semibold tracking-tight text-blue-400">
                  Komputer
                </span>
              </div>

              <p className="hidden text-[10px] tracking-wide text-slate-500 sm:block">
                Cepat · Profesional · Terpercaya
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center lg:flex">
            <div
              className="
                flex items-center gap-1
                rounded-xl
                border border-white/4
                bg-white/2
                p-1
              "
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  active={pathname === link.href}
                >
                  {link.label}
                </NavLink>
              ))}

              {isLoggedIn && (
                <NavLink
                  href={authHref}
                  active={authActive}
                >
                  {authLabel}
                </NavLink>
              )}

              {!isLoggedIn && (
                <NavLink
                  href="/booking/riwayat"
                  active={pathname === '/booking/riwayat'}
                >
                  Riwayat Tamu
                </NavLink>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="
                  hidden h-10 items-center gap-2
                  rounded-xl
                  border border-white/8
                  bg-white/2
                  px-3.5
                  text-sm font-medium text-slate-200

                  transition-all duration-200
                  hover:border-white/[0.14]
                  hover:bg-white/6
                  hover:text-white

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:inline-flex
                "
              >
                <IconUser className="h-4 w-4" />
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            ) : (
              <Link
                href="/login"
                className="
                  hidden h-10 items-center gap-2
                  rounded-xl
                  border border-white/8
                  bg-white/2
                  px-3.5
                  text-sm font-medium text-slate-200

                  transition-all duration-200
                  hover:border-white/[0.14]
                  hover:bg-white/6
                  hover:text-white

                  sm:inline-flex
                "
              >
                <IconUser className="h-4 w-4" />
                Login
              </Link>
            )}

            {/* CTA */}
            <Link
              href="/booking"
              className="
                group relative hidden h-10 items-center
                overflow-hidden rounded-xl
                border border-blue-300/20
                bg-linear-to-br from-blue-500 to-blue-600
                px-4
                text-sm font-medium text-white

                shadow-[0_6px_20px_rgba(37,99,235,0.28)]
                transition-all duration-200

                hover:-translate-y-px
                hover:border-blue-200/30
                hover:from-blue-400
                hover:to-blue-600
                hover:shadow-[0_8px_26px_rgba(37,99,235,0.40)]

                sm:inline-flex
              "
            >
              <span
                className="
                  absolute inset-y-0 -left-10 w-8
                  rotate-12
                  bg-white/20
                  blur-md
                  transition-transform duration-700
                  group-hover:translate-x-45
                "
              />

              <span className="relative">
                Booking Sekarang
              </span>
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                border border-white/8
                bg-white/2
                text-slate-300

                transition-all duration-200
                hover:border-white/14
                hover:bg-white/6
                hover:text-white

                lg:hidden
              "
            >
              {isOpen ? (
                <IconClose className="h-5 w-5" />
              ) : (
                <IconMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            id="mobile-nav"
            className="
              relative z-10
              border-t border-white/[0.07]
              bg-[#071120]/70
              px-4 pb-4
              lg:hidden
            "
          >
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
                  className="
                    mt-2 inline-flex items-center justify-center gap-2
                    rounded-xl
                    border border-white/8
                    bg-white/2
                    px-4 py-2.5
                    text-sm font-medium text-slate-200

                    transition
                    hover:bg-white/6

                    disabled:opacity-50
                  "
                >
                  <IconUser className="h-4 w-4" />
                  {loggingOut ? 'Keluar...' : 'Keluar'}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="
                    mt-2 inline-flex items-center justify-center gap-2
                    rounded-xl
                    border border-white/8
                    bg-white/2
                    px-4 py-2.5
                    text-sm font-medium text-slate-200

                    transition
                    hover:bg-white/6
                  "
                >
                  <IconUser className="h-4 w-4" />
                  Login
                </Link>
              )}

              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="
                  mt-2 inline-flex items-center justify-center
                  rounded-xl
                  border border-blue-300/20
                  bg-linear-to-br from-blue-500 to-blue-600
                  px-4 py-2.5
                  text-sm font-medium text-white

                  shadow-[0_6px_20px_rgba(37,99,235,0.25)]
                "
              >
                Booking Sekarang
              </Link>
            </div>
          </div>
        )}
      </nav>
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
        `
          relative rounded-lg
          px-3.5 py-2
          text-sm font-medium
          transition-all duration-200
        `,
        mobile ? 'block' : '',
        active
          ? `
            bg-white/7
            text-white
            shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
          `
          : `
            text-slate-400
            hover:bg-white/4
            hover:text-slate-200
          `,
      ].join(' ')}
    >
      {children}

      {active && (
        <span
          className={
            mobile
              ? `
                absolute inset-y-2 left-0
                w-0.5 rounded-full
                bg-linear-to-b from-blue-400 to-cyan-300
              `
              : `
                absolute inset-x-3 -bottom-px
                h-px rounded-full
                bg-linear-to-r
                from-transparent
                via-blue-400
                to-transparent
              `
          }
        />
      )}
    </Link>
  );
}

function IconMonitor({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}