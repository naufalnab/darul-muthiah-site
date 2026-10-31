/** Foto dipadankan mengikut susunan yang diberikan oleh pihak maahad. */
export interface AlumniProfile {
  id: string;
  name: string;
  year: number;
  achievement: string;
  institution?: string;
  portrait: string | null;
  portraitWidth?: number;
  portraitHeight?: number;
}

export const alumniProfiles: AlumniProfile[] = [
  { id: 'sharifah-umairah', name: 'Sharifah Umairah binti Sayyid Anwar', year: 2022,
    achievement: 'Degree in Al Quran Sunnah', institution: 'Uni Islam Selangor', portrait: '/assets/phase3/portrait-00000257.webp' },
  { id: 'insyirah', name: 'Insyirah binti Ulwi', year: 2016,
    achievement: 'Ustazah (Hafazan Al Quran)', portrait: '/assets/phase3/portrait-00000259.webp' },
  { id: 'nurul-wafa', name: 'Nurul Wafa bt Tajul Ariffin', year: 2018,
    achievement: 'Master of Arts in Arabic Studies', institution: 'IIUM/UIA', portrait: '/assets/phase3/portrait-00000262.webp' },
  { id: 'nur-zulaikha', name: 'Nur Zulaikha Suffiah bt Mohammad Zaini', year: 2019,
    achievement: 'Doctor in Medicine', institution: 'Kursk State Medical University, Russia', portrait: '/assets/phase3/portrait-00000266.webp' },
  { id: 'putri-balqis', name: 'Putri Balqis', year: 2019,
    achievement: 'Ustazah (Hafazan Al Quran)', portrait: '/assets/phase3/portrait-00000269.webp' },
  { id: 'nor-balqis-maisara', name: 'Nor Balqis Maisara binti Mohd Yassin', year: 2022,
    achievement: 'Bachelor in Shariah & Law', institution: 'USIM', portrait: '/assets/phase3/portrait-00000271.webp' }
];

// Verbatim supplied testimonial; never infer statements for the other alumni.
export const alumniTestimonial = {
  name: 'Nur Zulaikha Suffiah bt Mohammad Zaini',
  text: 'Alhamdulillah, Darul Muthiah banyak mendidik saya bukan sahaja dalam hafazan Al-Quran, tetapi juga dalam membentuk akhlak dan disiplin diri. Ilmu dan kenangan di sini akan sentiasa terpahat di hati. Terima kasih Puan Pengetua dan semua tenaga pengajar.'
};
