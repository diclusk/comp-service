'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';
import {
  IconArrowRight,
  IconMessage,
  IconCalendar,
  IconClipboard,
  IconCpu,
  IconCode,
  IconUpload,
  IconBroom,
  IconHardDrive,
  IconShieldCheck,
} from './Icons';

const ICONS = {
  message: IconMessage,
  calendar: IconCalendar,
  clipboard: IconClipboard,
  cpu: IconCpu,
  code: IconCode,
  upload: IconUpload,
  broom: IconBroom,
  hardDrive: IconHardDrive,
  shieldCheck: IconShieldCheck,
} as const;

export type IconKey = keyof typeof ICONS;

type WhyItem = { title: string; description: string; icon: IconKey };
type ServiceItem = { title: string; description: string; icon: IconKey };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

export default function HomeSections({
  whyUs,
  services,
  children,
}: {
  whyUs: WhyItem[];
  services: ServiceItem[];
  children: ReactNode;
}) {
  return (
    <>
      {/* Kenapa Pilih Kami — floating card bridging hero & light section */}
      <section className="relative px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto -mt-16 max-w-6xl rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-2xl shadow-navy-900/10 backdrop-blur-sm sm:p-8"
        >
          <div className="grid gap-8 sm:grid-cols-3">
            {whyUs.map((item, i) => {
              const Icon = ICONS[item.icon];
              return (
                <motion.div
                  key={item.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  className="group flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Layanan */}
      <section className="px-6 pt-16 pb-16 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              Layanan Kami
            </p>
            <h2 className="mt-1 text-3xl font-bold text-navy-900 sm:text-3xl">
              <span className="font-bold bg-linear-to-r from-gray-900 via-gray-600 to-gray-500 bg-clip-text text-transparent">
              Apa Yang Bisa Kami Bantu
              </span>
            </h2>
            <span className="mx-auto mt-3 block h-1 w-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-400" />
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = ICONS[service.icon];
              return (
                <motion.div
                  key={service.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-navy-900/10"
                >
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-50/0 via-blue-50/0 to-blue-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700 transition-all duration-300 group-hover:bg-navy-900 group-hover:text-blue-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="relative mt-4 text-sm font-semibold text-navy-900">{service.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-500">{service.description}</p>
                  <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600">
                    Selengkapnya
                    <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {children}
    </>
  );
}
