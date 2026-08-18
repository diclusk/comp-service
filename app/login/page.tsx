'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import BorderGlow from '@/app/components/BorderGlow';
import Turnstile from '@/app/components/Turnstile';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { getSafeRedirect } from '@/lib/safeRedirect';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    const redirect = getSafeRedirect(searchParams.get('redirect'), '/my-bookings');
    const supabase = getSupabaseBrowser();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (oauthError) {
      setError('Gagal login dengan Google');
      setGoogleLoading(false);
    }
    // Kalau sukses, browser langsung di-redirect ke Google — nggak perlu setGoogleLoading(false) lagi.
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!captchaToken) {
      setError('Selesaikan verifikasi captcha dulu');
      setLoading(false);
      return;
    }

    try {
      
      const supabase = getSupabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: { captchaToken },
      });

      if (signInError) {
        throw new Error('Email atau password salah');
      }

      const redirect = getSafeRedirect(searchParams.get('redirect'), '/my-bookings');
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060a13] flex items-center justify-center px-4 py-24">
      <div className="relative w-full max-w-md">
        <BorderGlow
          edgeSensitivity={40}
          glowColor="14 184 166"
          backgroundColor="#071225"
          borderRadius={16}
          glowRadius={20}
          glowIntensity={0.8}
          coneSpread={30}
          animated={true}
          fillOpacity={0.15}
          className="p-0.5"
        >
          {/* card */}
          <div className="relative rounded-2xl bg-[#0b111d] border border-white/6 px-8 py-10 shadow-2xl shadow-black/40">
          <h1 className="text-2xl font-bold text-white">Masuk</h1>
          <p className="mt-1 text-sm text-slate-400">
            Masuk untuk melihat riwayat booking kamu.
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
                className="mt-1.5 w-full rounded-lg bg-[#0f1826] border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20"
                placeholder="••••••••••"
              />
            </div>

            <Turnstile onVerify={setCaptchaToken} onExpire={() => setCaptchaToken('')} />

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
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">atau</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-lg border border-white/10 bg-[#0f1826] py-2.5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-[#141f30] disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.87 2.7-6.62Z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
              <path fill="#FBBC05" d="M3.95 10.7a5.4 5.4 0 0 1 0-3.4V4.97H.95a9 9 0 0 0 0 8.06l3-2.33Z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
            </svg>
            {googleLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
              Daftar
            </Link>
          </p>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}