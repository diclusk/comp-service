'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: FormEvent) {
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
  }

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-navy-900">Cek email kamu</h1>
          <p className="mt-2 text-sm text-navy-600">
            Kami sudah kirim link konfirmasi ke <span className="font-medium">{email}</span>.
            Klik link itu dulu sebelum login.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-block rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700"
          >
            Ke Halaman Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-navy-900">Daftar Akun</h1>
        <p className="mt-1 text-sm text-navy-500">
          Riwayat booking kamu tersimpan selamanya selama akun masih ada.
        </p>

        <label className="mt-6 block text-xs font-medium text-navy-600">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-400"
        />

        <label className="mt-4 block text-xs font-medium text-navy-600">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-navy-400"
        />
        <p className="mt-1 text-xs text-navy-400">Minimal 8 karakter.</p>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </button>

        <p className="mt-4 text-center text-xs text-navy-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-navy-900 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}