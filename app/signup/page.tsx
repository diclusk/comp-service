'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error || 'Gagal mendaftar');
      }

      if (body?.needsEmailConfirmation) {
        setNeedsConfirmation(true);
        return;
      }

      router.push('/my-bookings');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <main className="min-h-screen bg-[#060a13] flex items-center justify-center px-4 py-24">
        <div className="relative w-full max-w-md rounded-2xl p-0.5 overflow-hidden">
          <div className="pointer-events-none absolute inset-[-60%] animate-spin-slow spin-ring" />
          <div className="relative rounded-2xl bg-[#0b111d] border border-white/6 px-8 py-10 text-center shadow-2xl shadow-black/40">
            <h1 className="text-2xl font-bold text-white">Cek email kamu</h1>
            <p className="mt-2 text-sm text-slate-400">
              Kami sudah kirim link konfirmasi ke{' '}
              <span className="font-medium text-slate-200">{email}</span>. Klik link itu dulu
              sebelum login.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-[#06110f] transition hover:bg-teal-300"
            >
              Ke Halaman Login
            </Link>
          </div>
        </div>
        <style jsx>{`
          .spin-ring {
            background: conic-gradient(
              from 0deg,
              transparent 0deg,
              #2dd4bf 60deg,
              transparent 140deg,
              transparent 260deg,
              #22d3ee 340deg,
              transparent 360deg
            );
          }
          .animate-spin-slow {
            animation: spin-slow 3.5s linear infinite;
          }
          @keyframes spin-slow {
            to {
              transform: rotate(360deg);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-spin-slow {
              animation: none;
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060a13] flex items-center justify-center px-4 py-24">
      <div className="relative w-full max-w-md rounded-2xl p-0.5 overflow-hidden">
        {/* rotating glow ring — bigger than the box so the sweep reads clearly, clipped by overflow-hidden */}
        <div className="pointer-events-none absolute inset-[-60%] animate-spin-slow spin-ring" />

        {/* card */}
        <div className="relative rounded-2xl bg-[#0b111d] border border-white/6 px-8 py-10 shadow-2xl shadow-black/40">
          <h1 className="text-2xl font-bold text-white">Daftar Akun</h1>
          <p className="mt-1 text-sm text-slate-400">
            Riwayat booking kamu tersimpan selamanya selama akun masih ada.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-lg bg-[#0f1826] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-1.5 w-full rounded-lg bg-[#0f1826] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                placeholder="••••••••••"
              />
              <p className="mt-1.5 text-xs text-slate-500">Minimal 8 karakter.</p>
            </div>

            {error && (
              <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-3.5 py-2.5 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-400 py-2.5 text-sm font-semibold text-[#06110f] transition hover:bg-teal-300 disabled:opacity-60"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .spin-ring {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            #2dd4bf 60deg,
            transparent 140deg,
            transparent 260deg,
            #22d3ee 340deg,
            transparent 360deg
          );
        }
        .animate-spin-slow {
          animation: spin-slow 3.5s linear infinite;
        }
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-slow {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
