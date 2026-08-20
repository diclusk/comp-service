import type { Service } from '@/lib/types';

// Map slug servis (halaman /services) -> value dropdown "Jenis Servis" di
// BookingForm.tsx, dipakai buat auto-select saat datang dari tombol
// "Pesan servis ini". Value di sini harus persis sama dengan isi SERVICE_TYPES
// di app/components/BookingForm.tsx.
export const SERVICE_BOOKING_TYPE: Record<string, string> = {
  'servis-hardware': 'Perbaikan Hardware',
  'install-ulang': 'Instalasi Software',
  'data-recovery': 'Lainnya',
  upgrade: 'Upgrade Komponen',
  cleaning: 'Cleaning & Maintenance',
  'virus-optimasi': 'Cleaning & Maintenance',
};

export const services: Service[] = [
  {
    slug: 'servis-hardware',
    name: 'Servis Laptop & PC',
    tagline: 'Mati total, layar pecah, keyboard error, engsel patah — kami bongkar dan benerin.',
    price: 'Rp 150.000 – Rp 500.000+',
    duration: '1-3 hari',
    icon: 'Wrench',
    accent: 'punch',
    points: ['Diagnosa gratis sebelum eksekusi', 'Sparepart original & KW berkualitas', 'Garansi servis 30 hari'],
  },
  {
    slug: 'install-ulang',
    name: 'Install Ulang OS',
    tagline: 'Windows 10/11 atau Linux, lengkap dengan driver, office, dan software kuliah.',
    price: 'Rp 75.000 – Rp 150.000',
    duration: '2-4 jam',
    icon: 'DownloadSimple',
    accent: 'punch',
    points: ['Windows / Linux / dual-boot', 'Software standar kuliah terpasang', 'Data aman, backup dulu'],
  },
  {
    slug: 'data-recovery',
    name: 'Data Recovery',
    tagline: 'Skripsi kehapus? Harddisk tidak terbaca? Tenang, masih ada harapan.',
    price: 'Rp 200.000 – Rp 1.000.000+',
    duration: '1-5 hari',
    icon: 'Database',
    accent: 'punch',
    points: ['Recovery dari HDD/SSD/flashdisk', 'No data no pay', 'Kerahasiaan data terjamin'],
  },
  {
    slug: 'upgrade',
    name: 'Upgrade Components',
    tagline: 'Laptop lemot jadi ngebut. Konsultasi spek dulu, pasang langsung jadi.',
    price: 'Rp 100.000 – Rp 250.000',
    duration: '1-2 jam',
    icon: 'Lightning',
    accent: 'punch',
    points: ['Konsultasi kompatibilitas gratis', 'Migrasi OS ke SSD tanpa install ulang', 'Garansi part & instalasi', 'Catatan: Harga ini hanya untuk jasa pemasangan, belum termasuk harga part.'],
  },
  {
    slug: 'cleaning',
    name: 'Cleaning & Thermal Paste',
    tagline: 'Laptop panas dan fan berisik? Deep cleaning + ganti pasta biar adem lagi.',
    price: 'Rp 125.000 – Rp 300.000',
    duration: '1-3 jam',
    icon: 'Fan',
    accent: 'punch',
    points: ['Bongkar total, bersih sampai fan', 'Thermal paste premium', 'Suhu turun rata-rata 10-15°C', 'Harga tergantung tipe laptop & tingkat kekotoran, konsultasi dulu sebelum eksekusi.'],
  },
  {
    slug: 'virus-optimasi',
    name: 'Pembersihan Virus & Optimasi',
    tagline: 'Virus, malware, pop-up iklan, startup lemot — disapu bersih semuanya.',
    price: 'Rp 90.000 – Rp 175.000',
    duration: '2-5 jam',
    icon: 'ShieldCheck',
    accent: 'punch',
    points: ['Scan menyeluruh + pembersihan', 'Optimasi startup & storage', 'Edukasi terhadap keamanan & backup data agar hal yang sama tidak terulang lagi', 'Harga tergantung tingkat infeksi.'],
  },
];