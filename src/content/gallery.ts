export interface GalleryPhoto {
  id: string;
  src: string;
  cat: 'kelas' | 'ilmiah' | 'tvet' | 'sukan';
  catLabel: string;
  title: string;
  alt: string;
}

export interface GalleryVideo {
  id: string;
  src: string;
  poster: string;
  title: string;
  description: string;
}

export const galleryFilters = [
  { key: 'all', label: 'Semua' },
  { key: 'kelas', label: 'Hafazan & Kelas' },
  { key: 'ilmiah', label: 'Majlis & Ilmiah' },
  { key: 'tvet', label: 'TVET & Latihan' },
  { key: 'sukan', label: 'Sukan & Rehlah' }
] as const;

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: 'photo-1',
    src: '/assets/belajar-halaqah.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Tasmi’ & bacaan Al-Quran',
    alt: 'Pelajar maahad dalam sesi bacaan dan tasmi Al-Quran'
  },
  {
    id: 'photo-2',
    src: '/assets/hero-kelas.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Suasana kelas pengajian',
    alt: 'Dokumentasi sebenar suasana kelas pelajar MADUM'
  },
  {
    id: 'photo-3',
    src: '/assets/kelas-akademik.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Pembelajaran akademik',
    alt: 'Pelajar belajar bersama dalam kelas akademik'
  },
  {
    id: 'photo-4',
    src: '/assets/majlis-ilmu.webp',
    cat: 'ilmiah',
    catLabel: 'Majlis & Ilmiah',
    title: 'Majlis ilmu pelajar',
    alt: 'Majlis ilmu dan perjumpaan pengajian pelajar'
  },
  {
    id: 'photo-5',
    src: '/assets/seminar.webp',
    cat: 'ilmiah',
    catLabel: 'Majlis & Ilmiah',
    title: 'Penglibatan dalam program ilmiah',
    alt: 'Pelajar menyertai sesi seminar dan program pengajian'
  },
  {
    id: 'photo-6',
    src: '/assets/kemahiran-tvet.webp',
    cat: 'tvet',
    catLabel: 'TVET & Latihan',
    title: 'Aktiviti kemahiran TVET',
    alt: 'Pelajar mempelajari kemahiran amali menghasilkan sabun'
  },
  {
    id: 'photo-7',
    src: '/assets/keselamatan.webp',
    cat: 'tvet',
    catLabel: 'TVET & Latihan',
    title: 'Taklimat keselamatan',
    alt: 'Sesi taklimat dan demonstrasi keselamatan bomba bersama warga maahad'
  },
  {
    id: 'photo-8',
    src: '/assets/sukan-pelajar.webp',
    cat: 'sukan',
    catLabel: 'Sukan & Rehlah',
    title: 'Riadah & bola tampar',
    alt: 'Pelajar menyertai aktiviti riadah bola tampar di perkarangan'
  },
  {
    id: 'photo-9',
    src: '/assets/rehlah-pelajar.webp',
    cat: 'sukan',
    catLabel: 'Sukan & Rehlah',
    title: 'Lawatan sambil belajar',
    alt: 'Aktiviti lawatan sambil belajar dan rehlah pelajar MADUM'
  },
  {
    id: 'photo-10',
    src: '/assets/outdoor.webp',
    cat: 'sukan',
    catLabel: 'Sukan & Rehlah',
    title: 'Aktiviti luar berkumpulan',
    alt: 'Aktiviti luar dan program pembinaan pasukan berkumpulan'
  },
  {
    id: 'photo-11',
    src: '/assets/lawatan-ilmu.webp',
    cat: 'ilmiah',
    catLabel: 'Majlis & Ilmiah',
    title: 'Kunjungan ilmiah',
    alt: 'Kunjungan ilmiah dan ziarah pendidikan pelajar'
  },
  {
    id: 'photo-12',
    src: '/assets/aktiviti-tarbiah.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Perbincangan & tarbiah',
    alt: 'Pelajar menyertai perbincangan halaqah dan tarbiah berkumpulan'
  }
];

export const galleryVideos: GalleryVideo[] = [
  {
    id: 'video-1',
    src: '/assets/intro-madum.mp4',
    poster: '/assets/video-intro.webp',
    title: 'Identiti MADUM',
    description: 'Animasi pengenalan logo institusi.'
  },
  {
    id: 'video-2',
    src: '/assets/nasyid-pelajar.mp4',
    poster: '/assets/video-nasyid.webp',
    title: 'Aktiviti persembahan pelajar',
    description: 'Rakaman persembahan kumpulan pelajar.'
  }
];
