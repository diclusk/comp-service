import Link from 'next/link';
import { CheckCircle } from '@phosphor-icons/react/dist/ssr';
import BorderGlow from '@/app/components/BorderGlow';

export default function VerifiedPage() {
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
          <div className="relative rounded-2xl bg-[#0b111d] border border-white/6 px-8 py-10 text-center shadow-2xl shadow-black/40">
            <CheckCircle weight="fill" className="mx-auto h-14 w-14 text-teal-400" />
            <h1 className="mt-4 text-2xl font-bold text-white">Email Terverifikasi</h1>
            <p className="mt-2 text-sm text-slate-400">
              Akun kamu sudah aktif. Kamu sekarang bisa booking servis dan lihat riwayatnya kapan
              saja.
            </p>
            <Link
              href="/my-bookings"
              className="mt-6 inline-block rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-[#06110f] transition hover:bg-teal-300"
            >
              Lihat Riwayat Booking
            </Link>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}
