'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/services', label: 'Layanan' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getSupabaseBrowser()
      .auth.getUser()
      .then(({ data }) => setIsLoggedIn(!!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6">
      <nav
        className="
          relative mx-auto max-w-7xl overflow-hidden rounded-2xl
          border border-white/10
          bg-slate-900/80
          backdrop-blur-xl

          shadow-[0_12px_40px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.25)]

          before:pointer-events-none
          before:absolute before:inset-0
          before:rounded-2xl
          before:border-t before:border-white/12
          before:content-['']

          after:pointer-events-none
          after:absolute after:inset-0
          after:bg-linear-to-b
          after:from-white/4
          after:via-transparent
          after:to-transparent
          after:content-['']
        "
        aria-label="Navigasi utama"
      >
        {/* Navbar content */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-5">

          {/* Logo */}
          <Link
            href="/"
            className="
              group flex items-center gap-3
              text-white
              transition-opacity hover:opacity-90
            "
            onClick={() => setIsOpen(false)}
          >
            <div
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl
                border border-white/12

                shadow-[0_4px_12px_rgba(0,0,0,0.35)]
                transition
                group-hover:border-white/20
                group-hover:shadow-[0_5px_16px_rgba(0,0,0,0.2)]
              "
            >
              <LogoMark />
            </div>

            <span className="hidden text-sm font-medium tracking-wide text-slate-200 sm:block">
              Servis Komputer
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={pathname === link.href}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Login / My Bookings */}
            <NavLink
              href={isLoggedIn ? '/my-bookings' : '/login'}
              active={
                pathname === '/my-bookings' ||
                pathname === '/login'
              }
            >
              {isLoggedIn ? 'Riwayat Saya' : 'Masuk'}
            </NavLink>

            {/* Booking */}
            <Link
              href="/booking"
              className="
                ml-2 rounded-xl
                border border-teal-400/20
                bg-teal-600
                px-4 py-2
                text-sm font-medium text-white

                shadow-[0_4px_14px_rgba(13,148,136,0.25)]
                transition-all duration-200

                hover:-translate-y-px
                hover:bg-teal-500
                hover:shadow-[0_6px_20px_rgba(13,148,136,0.35)]

                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-teal-400
              "
            >
              Booking Sekarang
            </Link>
          </div>

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
              border border-white/12
              bg-white/4
              text-slate-300

              transition
              hover:border-white/20
              hover:bg-white/8
              hover:text-white

              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-teal-400

              sm:hidden
            "
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            id="mobile-nav"
            className="
              relative z-10
              border-t border-white/8
              bg-slate-950/40
              px-4 pb-4
              sm:hidden
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

              {/* Login / My Bookings */}
              <NavLink
                href={isLoggedIn ? '/my-bookings' : '/login'}
                active={
                  pathname === '/my-bookings' ||
                  pathname === '/login'
                }
                onClick={() => setIsOpen(false)}
                mobile
              >
                {isLoggedIn ? 'Riwayat Saya' : 'Masuk'}
              </NavLink>

              {/* Booking */}
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="
                  mt-2 rounded-xl
                  border border-teal-400/20
                  bg-teal-600
                  px-4 py-2.5
                  text-center
                  text-sm font-medium text-white

                  shadow-[0_4px_14px_rgba(13,148,136,0.25)]
                  transition

                  hover:bg-teal-500
                  hover:shadow-[0_6px_20px_rgba(13,148,136,0.35)]

                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-teal-400
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
          rounded-xl px-3.5 py-2
          text-sm font-medium
          transition-all duration-200

          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-teal-400
        `,
        mobile ? 'block' : '',
        active
          ? `
            border border-white/8
            bg-white/8
            text-white
            shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_3px_10px_rgba(0,0,0,0.18)]
          `
          : `
            text-slate-400
            hover:bg-white/5
            hover:text-slate-200
          `,
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-teal-400"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}