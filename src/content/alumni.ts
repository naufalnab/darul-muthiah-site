/** Client brief, 28 October 2026. A numbered list is not evidence of photo identity. */
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
    achievement: 'Degree in Al Quran Sunnah', institution: 'Uni Islam Selangor', portrait: null },
  { id: 'insyirah', name: 'Insyirah binti Ulwi', year: 2016,
    achievement: 'Ustazah (Hafazan Al Quran)', portrait: null },
  { id: 'nurul-wafa', name: 'Nurul Wafa bt Tajul Ariffin', year: 2018,
    achievement: 'Master of Arts in Arabic Studies', institution: 'IIUM/UIA', portrait: null },
  { id: 'nur-zulaikha', name: 'Nur Zulaikha Suffiah bt Mohammad Zaini', year: 2019,
    achievement: 'Doctor in Medicine', institution: 'Kursk State Medical University, Russia', portrait: null },
  { id: 'putri-balqis', name: 'Putri Balqis', year: 2019,
    achievement: 'Ustazah (Hafazan Al Quran)', portrait: null },
  { id: 'nor-balqis-maisara', name: 'Nor Balqis Maisara binti Mohd Yassin', year: 2022,
    achievement: 'Bachelor in Shariah & Law', institution: 'USIM', portrait: null }
];

// Verbatim supplied testimonial; never infer statements for the other alumni.
export const alumniTestimonial = {
  name: 'Nur Zulaikha Suffiah bt Mohammad Zaini',
  text: 'Alhamdulillah, Darul Muthiah banyak mendidik saya bukan sahaja dalam hafazan Al-Quran, tetapi juga dalam membentuk akhlak dan disiplin diri. Ilmu dan kenangan di sini akan sentiasa terpahat di hati. Terima kasih Puan Pengetua dan semua tenaga pengajar.'
};
