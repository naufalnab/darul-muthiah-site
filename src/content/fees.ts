import { siteConfig } from './siteConfig';
import { claimsRegistry } from './claimsRegistry';

export interface FeeItem {
  id: string;
  category: string;
  value: string;
  period: string;
  description: string;
  claimId: string;
}

const isPublic = siteConfig.publicationMode === 'public';
const feesApproved = siteConfig.releaseApprovals.feesApproved;

export const feeItems: FeeItem[] = [
  {
    id: 'pendaftaran',
    category: 'PENDAFTARAN & TAHUNAN',
    value: isPublic && !feesApproved ? 'Hubungi Kami' : claimsRegistry.fee_registration_annual.value,
    period: isPublic && !feesApproved ? 'Pengesahan diperlukan' : 'Rujukan dokumen 2026/2027',
    description: isPublic && !feesApproved
      ? 'Sila hubungi pihak pentadbiran maahad untuk mendapatkan struktur yuran pendaftaran sesi semasa.'
      : 'Jumlah beberapa komponen yuran pendaftaran dan tahunan.',
    claimId: 'fee_registration_annual'
  },
  {
    id: 'asrama',
    category: 'PENGAJIAN ASRAMA',
    value: isPublic && !feesApproved ? 'Hubungi Kami' : claimsRegistry.fee_hostel_monthly.value,
    period: isPublic && !feesApproved ? 'sebulan · hubungi maahad' : 'sebulan · rujukan dokumen',
    description: isPublic && !feesApproved
      ? 'Sila hubungi pihak pentadbiran maahad untuk maklumat yuran pengajian asrama terkini.'
      : 'Maklumat kemudahan dan yuran semasa perlu disahkan kepada pihak maahad.',
    claimId: 'fee_hostel_monthly'
  },
  {
    id: 'harian',
    category: 'PENGAJIAN HARIAN',
    value: isPublic && !feesApproved ? 'Hubungi Kami' : claimsRegistry.fee_day_monthly.value,
    period: isPublic && !feesApproved ? 'sebulan · hubungi maahad' : 'sebulan · rujukan dokumen',
    description: isPublic && !feesApproved
      ? 'Sila hubungi pihak pentadbiran maahad untuk maklumat yuran pengajian harian terkini.'
      : 'Pilihan pengajian harian dengan syarat dan susunan terkini yang perlu disahkan.',
    claimId: 'fee_day_monthly'
  }
];

export const admissionsSteps = [
  {
    num: '01',
    title: 'Semak kelayakan',
    description: 'Pastikan calon pelajar memenuhi syarat asas yang dinyatakan untuk sesi pendaftaran.'
  },
  {
    num: '02',
    title: 'Pilih program',
    description: 'Kenali laluan Hafazan, Syahadah atau SPM Fast Track JAIS yang diminati.'
  },
  {
    num: '03',
    title: 'Hubungi maahad',
    description: 'Hantar pertanyaan melalui WhatsApp untuk langkah seterusnya. Ini bukan pengesahan pendaftaran.'
  }
];

export const admissionsChecklist = [
  'Pelajar perempuan berumur 10–17 tahun',
  'Berminat dalam hafazan Al-Quran',
  'Boleh membaca, mengira dan mengeja (3M)',
  'Bersedia mengikuti proses tarbiah',
  'Mempunyai akhlak yang baik',
  'Sihat tubuh badan'
];
