import Link from 'next/link';
import {
  ClipboardText,
  HandCoins,
  ClockCountdown,
  ShieldCheck,
  ChatCircleDots,
  ArrowRight,
} from '@phosphor-icons/react/dist/ssr';
import { services } from '@/lib/services';
import { ServiceCard } from '@/app/components/ServiceCard';
import BorderGlow from '@/app/components/BorderGlow';

const TRUST_BADGES = [
  { icon: ClipboardText, label: 'Diagnosa gratis di awal' },
  { icon: HandCoins, label: 'Bayar setelah harga oke' },
  { icon: ClockCountdown, label: 'Direspon cepat lewat chat' },
  { icon: ShieldCheck, label: 'Garansi di tiap servis' },
];

const STEPS = [
  {
    code: '01',
    title: 'Chat & diagnosa',
    desc: 'Ceritakan keluhannya ke admin atau AI kami — diagnosa awal gratis, tanpa komitmen.',
  },
  {
    code: '02',
    title: 'Setuju harga dulu',
    desc: 'Kami kasih estimasi biaya & waktu. Servis baru jalan setelah kamu oke-kan.',
  },
  {
    code: '03',
    title: 'Dikerjakan + garansi',
    desc: 'Teknisi kerjakan sesuai jadwal, dan hasilnya dijamin garansi resmi.',
  },
];

export default function ServicesPage() {
  const [featuredService, ...restServices] = services;

  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16 md:px-12">
      {/* dot-grid ambient di seluruh halaman, senada navbar */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(#7C99B3 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Hero */}
      <div className="relative max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-blue-300/90">
          &gt;_ Menu servis
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tighter md:text-5xl">
          Layanan Kami
        </h1>
        <p className="mt-2 text-zinc-400 md:text-lg">
          Servis cepat, terpercaya, harga bersahabat buat pelajar.
        </p>
      </div>

      {/* Trust badges */}
      <div className="relative mt-8 flex w-full max-w-4xl flex-wrap items-center justify-center gap-3">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-full border border-dashed border-white/15 px-4 py-2 font-mono text-xs text-zinc-300"
          >
            <Icon size={14} weight="bold" className="text-status" />
            {label}
          </div>
        ))}
      </div>

      {/* Alur kerja */}
      <div className="relative mt-14 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.code} className="relative flex items-start gap-2">
            <div className="relative flex-1 rounded-2xl border border-border bg-surface/60 p-5">
              <span className="pointer-events-none absolute top-3 left-3 h-2 w-2 border-t border-l border-white/15" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-white/15" />
              <span className="font-mono text-xs tracking-[0.2em] text-muted">
                STEP {step.code}
              </span>
              <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.desc}</p>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowRight
                size={18}
                weight="bold"
                className="mt-6 hidden shrink-0 text-white/15 sm:block"
              />
            )}
          </div>
        ))}
      </div>

      {/* Layanan unggulan */}
      <div className="relative mt-16 w-full max-w-6xl">
        <BorderGlow
          edgeSensitivity={40}
          glowColor="14 184 166"
          backgroundColor="#071225"
          borderRadius={16}
          glowRadius={24}
          glowIntensity={0.8}
          coneSpread={30}
          animated={false}
          fillOpacity={0.15}
          className="w-full"
        >
          <ServiceCard service={featuredService} index={0} featured />
        </BorderGlow>
      </div>

      {/* Layanan lainnya */}
      <div className="mt-6 grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restServices.map((service, i) => (
          <BorderGlow
            key={service.slug}
            edgeSensitivity={40}
            glowColor="14 184 166"
            backgroundColor="#071225"
            borderRadius={16}
            glowRadius={20}
            glowIntensity={0.8}
            coneSpread={30}
            animated={false}
            fillOpacity={0.15}
            className="h-full"
          >
            <ServiceCard service={service} index={i + 1} />
          </BorderGlow>
        ))}
      </div>

      {/* CTA penutup */}
      <div className="relative mt-16 flex w-full max-w-4xl flex-col items-center gap-4 rounded-2xl border border-dashed border-white/15 bg-surface/40 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-status/20 bg-status/10 text-status">
            <ChatCircleDots size={22} weight="bold" />
          </div>
          <div>
            <p className="font-semibold text-white">Belum yakin servis mana yang pas?</p>
            <p className="text-sm text-muted">Tanya AI kami dulu, gratis dan langsung dibalas.</p>
          </div>
        </div>
        <Link
          href="/booking"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-navy-700 px-6 py-3 font-mono text-sm font-semibold text-white transition-transform duration-150 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-blue-300 active:scale-95"
        >
          Booking sekarang
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </div>
  );
}