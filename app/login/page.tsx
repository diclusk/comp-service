'use client';

import { useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import BorderGlow from '@/app/components/BorderGlow';
import Turnstile from '@/app/components/Turnstile';
import { getSupabaseBrowser } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

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

      const redirect = searchParams.get('redirect') || '/my-bookings';
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