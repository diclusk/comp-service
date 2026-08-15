'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { IconShieldCheck, IconCpu, IconClipboard } from './Icons';

function FloatingBadge({
  className,
  delay,
  icon: Icon,
  title,
  subtitle,
}: {
  className: string;
  delay: number;
  icon: typeof IconShieldCheck;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 },
      }}
      className={`absolute z-20 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex ${className}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="leading-tight">
        <p className="text-xs font-semibold text-white">{title}</p>
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-lg">
      {/* ambient glow layers */}
      <motion.div
        className="absolute inset-6 rounded-full bg-blue-500/25 blur-[80px]"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-6 left-4 h-40 w-40 rounded-full bg-cyan-400/20 blur-[70px]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* decorative rotating rings */}
      <div className="absolute inset-10 rounded-full border border-white/8" />
      <div className="absolute inset-[18%] animate-[spin_50s_linear_infinite] rounded-full border border-dashed border-blue-400/20" />

      {/* orbiting dot */}
      <div className="absolute inset-10 animate-[spin_14s_linear_infinite]">
        <span className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_4px_rgba(34,211,238,0.6)]" />
      </div>

      {/* product image */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: [0, -16, 0], scale: 1 }}
        transition={{
          opacity: { duration: 0.9, ease: 'easeOut' },
          scale: { duration: 0.9, ease: 'easeOut' },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.9 },
        }}
        className="relative z-10 flex h-full w-full items-center justify-center"
      >
        <Image
          src="/hero-pc.png"
          alt="PC desktop dan monitor siap servis"
          width={640}
          height={640}
          priority
          className="w-[85%] drop-shadow-[0_35px_45px_rgba(8,15,35,0.55)]"
        />
      </motion.div>

      {/* platform shadow */}
      <div className="absolute bottom-6 left-1/2 h-6 w-2/3 -translate-x-1/2 rounded-full bg-blue-950/60 blur-xl" />

      {/* floating glass badges */}
      <FloatingBadge
        className="top-2 left-0"
        delay={0.9}
        icon={IconShieldCheck}
        title="Garansi Servis"
        subtitle="2 bulan"
      />
      <FloatingBadge
        className="right-0 top-1/3"
        delay={1.15}
        icon={IconCpu}
        title="Teknisi Berpengalaman"
        subtitle="Hardware & software"
      />
      <FloatingBadge
        className="bottom-4 left-2"
        delay={1.4}
        icon={IconClipboard}
        title="Harga Transparan"
        subtitle="Jaminan tanpa biaya tersembunyi"
      />
    </div>
  );
}
