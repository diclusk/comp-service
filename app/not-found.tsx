import Link from "next/link";
import { IconCpu, IconArrowRight } from "./components/Icons";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-surface text-accent">
          <IconCpu className="h-8 w-8" />
        </div>

        <p className="font-mono text-xs tracking-widest text-muted uppercase mb-2">
          ERR/404 · Ticket not found
        </p>

        <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-3">
          Halaman tidak ditemukan
        </h1>

        <p className="text-muted mb-8 leading-relaxed">
          Sepertinya diagnosa gagal — halaman yang kamu cari sudah dipindah, dihapus,
          atau memang belum pernah ada.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-ink hover:opacity-90 transition"
          >
            Kembali ke Beranda
            <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-white hover:bg-surface transition"
          >
            Lihat Layanan
          </Link>
        </div>
      </div>
    </div>
  );
}
