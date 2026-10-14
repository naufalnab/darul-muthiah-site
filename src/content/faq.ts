export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export const faqList: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Siapa yang boleh memohon?',
    answer: 'Berdasarkan maklumat pengambilan yang dibekalkan, calon ialah pelajar perempuan berumur 10–17 tahun yang memenuhi syarat asas. Pengesahan akhir bergantung kepada pihak maahad.',
    defaultOpen: true
  },
  {
    id: 'faq-2',
    question: 'Bagaimana mendapatkan yuran semasa?',
    answer: 'Hubungi pihak maahad melalui WhatsApp untuk mengesahkan jadual yuran, kemudahan asrama dan perkara berkaitan pengajian.',
    defaultOpen: false
  },
  {
    id: 'faq-3',
    question: 'Bolehkah ibu bapa datang melawat?',
    answer: 'Sila hubungi pihak maahad terlebih dahulu untuk mendapatkan aturan lawatan yang sesuai dan mengesahkan lokasi.',
    defaultOpen: false
  },
  {
    id: 'faq-4',
    question: 'Adakah terdapat bantuan bagi keluarga kurang berkemampuan?',
    answer: 'Dokumen profil menerangkan tentang kemudahan bagi asnaf dan keluarga kurang berkemampuan. Syarat dan ketersediaan semasa perlu disahkan terus kepada pihak maahad.',
    defaultOpen: false
  }
];
