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
    alt: 'Placeholder aktiviti: Tasmi’ dan bacaan Al-Quran'
  },
  {
    id: 'photo-2',
    src: '/assets/hero-kelas.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Suasana kelas pengajian',
    alt: 'Placeholder aktiviti: Suasana kelas pengajian MADUM'
  },
  {
    id: 'photo-3',
    src: '/assets/kelas-akademik.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Pembelajaran akademik',
    alt: 'Placeholder aktiviti: Pembelajaran subjek akademik'
  },
  {
    id: 'photo-4',
    src: '/assets/majlis-ilmu.webp',
    cat: 'ilmiah',
    catLabel: 'Majlis & Ilmiah',
    title: 'Majlis ilmu pelajar',
    alt: 'Placeholder aktiviti: Majlis ilmu dan perjumpaan pengajian'
  },
  {
    id: 'photo-5',
    src: '/assets/seminar.webp',
    cat: 'ilmiah',
    catLabel: 'Majlis & Ilmiah',
    title: 'Penglibatan dalam program ilmiah',
    alt: 'Placeholder aktiviti: Program seminar dan motivasi ilmiah'
  },
  {
    id: 'photo-6',
    src: '/assets/kemahiran-tvet.webp',
    cat: 'tvet',
    catLabel: 'TVET & Latihan',
    title: 'Aktiviti kemahiran TVET',
    alt: 'Placeholder aktiviti: Amali kemahiran TVET vokasional'
  },
  {
    id: 'photo-7',
    src: '/assets/keselamatan.webp',
    cat: 'tvet',
    catLabel: 'TVET & Latihan',
    title: 'Taklimat keselamatan',
    alt: 'Placeholder aktiviti: Taklimat dan latihan keselamatan bomba'
  },
  {
    id: 'photo-8',
    src: '/assets/sukan-pelajar.webp',
    cat: 'sukan',
    catLabel: 'Sukan & Rehlah',
    title: 'Riadah & bola tampar',
    alt: 'Placeholder aktiviti: Riadah dan sukan kokurikulum'
  },
  {
    id: 'photo-9',
    src: '/assets/rehlah-pelajar.webp',
    cat: 'sukan',
    catLabel: 'Sukan & Rehlah',
    title: 'Lawatan sambil belajar',
    alt: 'Placeholder aktiviti: Lawatan sambil belajar dan rehlah'
  },
  {
    id: 'photo-10',
    src: '/assets/outdoor.webp',
    cat: 'sukan',
    catLabel: 'Sukan & Rehlah',
    title: 'Aktiviti luar berkumpulan',
    alt: 'Placeholder aktiviti: Aktiviti luar dan pembinaan sahsiah'
  },
  {
    id: 'photo-11',
    src: '/assets/lawatan-ilmu.webp',
    cat: 'ilmiah',
    catLabel: 'Majlis & Ilmiah',
    title: 'Kunjungan ilmiah',
    alt: 'Placeholder aktiviti: Kunjungan dan ziarah pendidikan ilmiah'
  },
  {
    id: 'photo-12',
    src: '/assets/aktiviti-tarbiah.webp',
    cat: 'kelas',
    catLabel: 'Hafazan & Kelas',
    title: 'Perbincangan & tarbiah',
    alt: 'Placeholder aktiviti: Perbincangan halaqah dan tarbiah'
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
