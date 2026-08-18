export type Service = {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  duration: string;
  icon: string;
  accent: 'volt' | 'punch' | 'cyber';
  points: string[];
};

export const SERVICES: Service[] = [
  {
    slug: 'servis-hardware',
    name: 'Servis Laptop & PC',
    tagline: 'Mati total, layar pecah, keyboard error, engsel patah — kami bongkar dan benerin.',
    price: 'Mulai Rp 150K',
    duration: '1-3 hari',
    icon: 'Wrench',
    accent: 'volt',
    points: ['Diagnosa gratis sebelum eksekusi', 'Sparepart original & KW berkualitas', 'Garansi servis 30 hari'],
  },
  {
    slug: 'install-ulang',
    name: 'Install Ulang OS',
    tagline: 'Windows 10/11 atau Linux, lengkap dengan driver, office, dan software kuliah.',
    price: 'Rp 75K',
    duration: '2-4 jam',
    icon: 'DownloadSimple',
    accent: 'cyber',
    points: ['Windows / Linux / dual-boot', 'Software standar kuliah terpasang', 'Data aman, backup dulu'],
  },
  {
    slug: 'data-recovery',
    name: 'Data Recovery',
    tagline: 'Data berharga terhapus? Harddisk tidak terbaca? Tenang, masih ada harapan.',
    price: 'Mulai Rp 200K',
    duration: '1-5 hari',
    icon: 'Database',
    accent: 'punch',
    points: ['Recovery dari HDD/SSD/flashdisk', 'No data no pay', 'Kerahasiaan data terjamin'],
  },
  {
    slug: 'upgrade',
    name: 'Upgrade RAM & SSD',
    tagline: 'Laptop lemot jadi ngebut. Konsultasi spek dulu, pasang langsung jadi.',
    price: 'Mulai Rp 100K',
    duration: '1-2 jam',
    icon: 'Lightning',
    accent: 'volt',
    points: ['Konsultasi kompatibilitas gratis', 'Migrasi OS ke SSD tanpa install ulang', 'Harga part transparan'],
  },
  {
    slug: 'cleaning',
    name: 'Cleaning & Thermal Paste',
    tagline: 'Laptop panas dan fan berisik? Deep cleaning + ganti pasta biar adem lagi.',
    price: 'Rp 80K',
    duration: '1-2 jam',
    icon: 'Fan',
    accent: 'cyber',
    points: ['Bongkar total, bersih sampai fan', 'Thermal paste premium', 'Suhu turun rata-rata 10-15°C'],
  },
  {
    slug: 'virus-optimasi',
    name: 'Pembersihan Virus & Optimasi',
    tagline: 'Virus, malware, pop-up iklan, startup lemot — disapu bersih semuanya.',
    price: 'Rp 90K',
    duration: '2-3 jam',
    icon: 'ShieldCheck',
    accent: 'punch',
    points: ['Scan menyeluruh + pembersihan', 'Optimasi startup & storage', 'Edukasi biar nggak kena lagi'],
  },
];

export const DEVICE_TYPES = ['Laptop', 'PC / Desktop', 'MacBook', 'Lainnya'];

export const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
