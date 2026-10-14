export interface ProgramItem {
  id: string;
  num: string;
  title: string;
  description: string;
  duration: string;
  href: string;
}

export interface CurriculumPillar {
  symbol: string;
  title: string;
  description: string;
}

export interface ScheduleItem {
  timeLabel: string;
  title: string;
  description: string;
}

export const programsList: ProgramItem[] = [
  {
    id: 'hafazan',
    num: '01',
    title: 'Hafazan Al-Quran<br />30 Juzuk',
    description: 'Pengajian hafazan dan pemantapan bacaan Al-Quran secara berperingkat.',
    duration: 'Anggaran 3–4 tahun',
    href: '/kemasukan#pertanyaan'
  },
  {
    id: 'syahadah',
    num: '02',
    title: 'Syahadah<br />Al-Quran',
    description: 'Pemantapan hafazan dan persediaan penilaian penguasaan Al-Quran.',
    duration: 'Anggaran 6–12 bulan',
    href: '/kemasukan#pertanyaan'
  },
  {
    id: 'spm',
    num: '03',
    title: 'SPM Fast Track<br />JAIS',
    description: 'Laluan persediaan akademik berfokus bagi peperiksaan SPM, mengikut syarat program.',
    duration: 'Anggaran 1 tahun',
    href: '/kemasukan#pertanyaan'
  }
];

export const curriculumPillars: CurriculumPillar[] = [
  {
    symbol: '۞',
    title: 'Al-Quran',
    description: 'Hafazan, tadabbur, tajwid dan penghayatan ayat Al-Quran.'
  },
  {
    symbol: '✧',
    title: 'Dinniyah',
    description: 'Fardhu Ain, fiqh, pengajian Islam, adab dan akhlak.'
  },
  {
    symbol: '✺',
    title: 'Akademik',
    description: 'Bahasa Arab, bahasa Inggeris, matematik, sains dan ilmu asas.'
  },
  {
    symbol: '✤',
    title: 'Kokurikulum & TVET',
    description: 'Sukan, kemahiran amali dan aktiviti pembangunan diri.'
  }
];

export const dailySchedule: ScheduleItem[] = [
  {
    timeLabel: 'Awal pagi',
    title: "Solat & Saba'",
    description: 'Persediaan, ibadah dan hafazan baharu.'
  },
  {
    timeLabel: 'Pagi',
    title: "Tasmi' & Ulang Kaji",
    description: 'Pembelajaran dan pemantapan hafazan.'
  },
  {
    timeLabel: 'Petang',
    title: 'Dinniyah & Riadah',
    description: 'Pengajian, kemahiran serta aktiviti jasmani.'
  },
  {
    timeLabel: 'Malam',
    title: "Manzil & Para Saba'",
    description: 'Ulang kaji, refleksi dan persediaan berehat.'
  }
];
