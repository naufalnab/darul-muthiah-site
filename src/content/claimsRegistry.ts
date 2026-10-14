export type ClaimStatus =
  | 'VERIFIED'
  | 'VERIFIED_DOC_PENDING_USAGE_PERMISSION'
  | 'PENDING_VERIFICATION'
  | 'PENDING_APPROVAL'
  | 'PENDING_EDITORIAL_HARMONIZATION'
  | 'PENDING_PARENTAL_INSTITUTIONAL_CONSENT'
  | 'CONFLICTED';

export type PublicDisplayPolicy =
  | 'show'
  | 'hide'
  | 'replace_with_contact_cta'
  | 'show_with_disclaimer';

export interface ClaimItem {
  id: string;
  field: string;
  value: string;
  source: string;
  sourcePage?: string;
  codeLocation?: string;
  status: ClaimStatus;
  approved_by: string | null;
  approved_at: string | null;
  public_display_policy: PublicDisplayPolicy;
  disclaimerText?: string;
  fallbackText?: string;
  actionRequired?: string;
  dataType: 'HISTORICAL_REFERENCE' | 'ACTIVE_REGISTRATION_DATA';
}

export const claimsRegistry: Record<string, ClaimItem> = {
  admissions_session: {
    id: 'admissions_session',
    field: 'Sesi Pengambilan Semasa',
    value: '2026/2027',
    source: 'Pesan awal Cik Yatt & Profil PDF h.10 vs Poster 00000125 (Sesi 2027)',
    sourcePage: 'Profil PDF h.10 & Poster 00000125',
    codeLocation: 'src/content/siteConfig.ts:34',
    status: 'PENDING_VERIFICATION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Maklumat kemasukan tertakluk kepada pengesahan sesi rasmi pihak maahad.',
    actionRequired: 'Pihak maahad perlu mengesahkan sama ada sesi kemasukan semasa adalah 2026/2027 atau 2027.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  whatsapp_cta: {
    id: 'whatsapp_cta',
    field: 'Nombor WhatsApp Kemasukan (CTA)',
    value: '+60 12-310 8902',
    source: 'HTML awal dipersetujui Cik Yatt vs Poster 00000125 & Profil PDF h.7 (+60 12-202 3024)',
    sourcePage: 'HTML prototaip & Profil PDF h.7',
    codeLocation: 'src/content/siteConfig.ts:37',
    status: 'PENDING_VERIFICATION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Nombor pertanyaan sementara untuk fasa pratonton dalaman.',
    actionRequired: 'Sahkan sama ada talian Cik Yatt (+60 12-310 8902) atau nombor pentadbir PDF (+60 12-202 3024) yang menjadi talian rasmi pendaftaran.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  phone_office: {
    id: 'phone_office',
    field: 'Telefon Pejabat',
    value: '03-5524 7296',
    source: 'Poster promosi MADUM 00000125 vs Profil PDF h.7 (+60 12-202 3024)',
    sourcePage: 'Poster 00000125 & Profil PDF h.7',
    codeLocation: 'src/content/siteConfig.ts:39',
    status: 'PENDING_VERIFICATION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Talian pejabat menunggu pengesahan keaktifan terkini.',
    actionRequired: 'Lakukan panggilan ujian dan sahkan nombor telefon pejabat yang beroperasi.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  email_office: {
    id: 'email_office',
    field: 'E-mel Rasmi Institusi',
    value: 'nunature@yahoo.com',
    source: 'Profil PDF h.7',
    sourcePage: 'Profil PDF h.7',
    codeLocation: 'src/content/siteConfig.ts:40',
    status: 'PENDING_VERIFICATION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Alamat e-mel menunggu pengesahan institusi.',
    actionRequired: 'Sahkan sama ada e-mel Yahoo ini masih dipantau atau terdapat domain emel institusi yang baru.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  domain_primary: {
    id: 'domain_primary',
    field: 'Domain Utama Laman Web',
    value: 'madum.ilmuniaga.com',
    source: 'Arahan Cik Yatt (pratonton) vs Poster 00000125 (www.madum.edu.my)',
    sourcePage: 'Poster 00000125 & arahan klien',
    codeLocation: 'src/content/siteConfig.ts:33',
    status: 'PENDING_VERIFICATION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    actionRequired: 'Sahkan sama ada penyiaran akhir akan menggunakan domain .edu.my atau subdomain ilmuniaga.com.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  address_physical: {
    id: 'address_physical',
    field: 'Alamat Premis Pengajian & Asrama',
    value: 'No. 61, Jalan Gunung Nuang U11/28, Seksyen U11, Bukit Bandaraya, 40170 Shah Alam, Selangor',
    source: 'Profil PDF h.7 & Salinan Perakuan Pendaftaran JAIS h.13',
    sourcePage: 'Profil PDF h.7 & h.13',
    codeLocation: 'src/content/siteConfig.ts:42-45',
    status: 'VERIFIED',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show',
    actionRequired: 'Sahkan waktu operasi lawatan ibu bapa dan penandaan pin koordinat Google Maps sebenar.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  address_mailing: {
    id: 'address_mailing',
    field: 'Alamat Surat-Menyurat Pentadbiran',
    value: 'No. 7, Jalan Pilus Dua 27/24B, Seksyen 27, 40400 Shah Alam, Selangor',
    source: 'Profil PDF h.7',
    sourcePage: 'Profil PDF h.7',
    codeLocation: 'src/content/siteConfig.ts:47-50',
    status: 'VERIFIED',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show',
    actionRequired: 'Kekalkan sebagai rekod rasmi surat-menyurat pentadbiran institusi.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  fee_registration_annual: {
    id: 'fee_registration_annual',
    field: 'Yuran Pendaftaran & Tahunan',
    value: 'RM 1,310',
    source: 'Profil PDF h.10 (Jadual Terperinci Yuran Sesi 2026/2027)',
    sourcePage: 'Profil PDF h.10 (Image 86)',
    codeLocation: 'src/content/claimsRegistry.ts & src/content/fees.ts:16',
    status: 'PENDING_APPROVAL',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'replace_with_contact_cta',
    fallbackText: 'Sila hubungi pihak pentadbiran maahad untuk struktur yuran pendaftaran sesi semasa.',
    disclaimerText: 'Nilai daripada dokumen profil sesi 2026/2027. Tertakluk kepada pengesahan rasmi pihak maahad.',
    actionRequired: 'Dapatkan pengesahan bertulis pihak maahad sama ada angka RM 1,310 (pecahan: pendaftaran 450, tahunan 250, mutabaah 100, selenggara 250, insuran 10, motivasi 250) masih diguna pakai.',
    dataType: 'HISTORICAL_REFERENCE'
  },
  fee_hostel_monthly: {
    id: 'fee_hostel_monthly',
    field: 'Yuran Pengajian Asrama (Bulanan)',
    value: 'RM 500',
    source: 'Profil PDF h.10 (Jadual Yuran Bulanan Sesi 2026/2027)',
    sourcePage: 'Profil PDF h.10 (Image 86)',
    codeLocation: 'src/content/claimsRegistry.ts & src/content/fees.ts:25',
    status: 'PENDING_APPROVAL',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'replace_with_contact_cta',
    fallbackText: 'Sila hubungi pihak pentadbiran maahad untuk maklumat yuran pengajian asrama terkini.',
    disclaimerText: 'Kadar bulanan rujukan dokumen profil (termasuk kelas tuisyen & tadabbur). Belum disahkan sebagai yuran semasa.',
    actionRequired: 'Sahkan sama ada kadar bulanan asrama RM 500 masih kekal bagi sesi pengambilan semasa.',
    dataType: 'HISTORICAL_REFERENCE'
  },
  fee_day_monthly: {
    id: 'fee_day_monthly',
    field: 'Yuran Pengajian Harian (Bulanan)',
    value: 'RM 450',
    source: 'Profil PDF h.10 (Jadual Yuran Bulanan Sesi 2026/2027)',
    sourcePage: 'Profil PDF h.10 (Image 86)',
    codeLocation: 'src/content/claimsRegistry.ts & src/content/fees.ts:34',
    status: 'PENDING_APPROVAL',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'replace_with_contact_cta',
    fallbackText: 'Sila hubungi pihak pentadbiran maahad untuk maklumat yuran pengajian harian terkini.',
    disclaimerText: 'Kadar bulanan harian rujukan dokumen profil (termasuk tuisyen B.Arab & tadabbur). Belum disahkan sebagai yuran semasa.',
    actionRequired: 'Sahkan sama ada pilihan pelajar harian RM 450 masih dibuka dan ditawarkan.',
    dataType: 'HISTORICAL_REFERENCE'
  },
  asnaf_welfare_policy: {
    id: 'asnaf_welfare_policy',
    field: 'Dasar Pengecualian / Bantuan Yuran Asnaf',
    value: 'Pengecualian penuh yuran asnaf; bayaran fleksibel mengikut kemampuan keluarga',
    source: 'Profil PDF h.10 (Nota Yuran) & h.12 (Carta Organisasi Kebajikan/Zakat)',
    sourcePage: 'Profil PDF h.10 & h.12',
    codeLocation: 'src/pages/kemasukan.astro:106',
    status: 'VERIFIED_DOC_PENDING_USAGE_PERMISSION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Syarat dan kelayakan bantuan asnaf atau kurang mampu perlu dirujuk terus kepada pihak maahad.',
    actionRequired: 'Sahkan prosedur dan borang permohonan bantuan asnaf bersama jawatankuasa kebajikan maahad.',
    dataType: 'HISTORICAL_REFERENCE'
  },
  institution_history_2003_rejection: {
    id: 'institution_history_2003_rejection',
    field: 'Klaim Sejarah Penubuhan Tahun 2003',
    value: 'DITOLAK / TIDAK BERASAS (Tiada dalam dokumen sumber)',
    source: 'Tiada rujukan dalam PDF profil atau poster rasmi; dokumen menyebut permulaan 2012',
    sourcePage: 'Profil PDF h.3, h.6, h.7',
    codeLocation: 'Ditolak dari seluruh kod sumber',
    status: 'CONFLICTED',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'hide',
    disclaimerText: 'Klaim penubuhan tahun 2003 tidak disokong oleh mana-mana dokumen bukti institusi.',
    actionRequired: 'DILARANG menyiarkan tahun 2003 di mana-mana bahagian laman web. Kekalkan kronologi 2012/2018.',
    dataType: 'HISTORICAL_REFERENCE'
  },
  institution_timeline: {
    id: 'institution_timeline',
    field: 'Kronologi Sejarah Rasmi (2012 & 2018)',
    value: 'Permulaan aktiviti April/Akhir 2012; penamaan rasmi MADUM (1) pada 20 Februari 2018',
    source: 'Profil PDF h.3 (mesyuarat akhir 2012), h.6 (nama MADUM 2018), h.7 (mula pengajian April 2012)',
    sourcePage: 'Profil PDF h.3, h.6, h.7',
    codeLocation: 'src/pages/profil.astro:107-120',
    status: 'PENDING_EDITORIAL_HARMONIZATION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Tarikh permulaan pengajian 2012 dirujuk daripada dokumen profil; kronologi penuh tertakluk kepada pengesahan editorial.',
    actionRequired: 'Pihak pentadbiran maahad perlu mengesahkan tarikh penubuhan rasmi sama ada dikira dari April 2012 atau tarikh pendaftaran JAIS.',
    dataType: 'HISTORICAL_REFERENCE'
  },
  jais_registration: {
    id: 'jais_registration',
    field: 'Pendaftaran JAIS (Institusi Tahfiz Persendirian)',
    value: 'Kod Sekolah: BZH8026 | No. Perakuan: 13S(8)18/59 (Tamat Tempoh: 13 Oktober 2028)',
    source: 'Salinan Perakuan Pendaftaran Sekolah Agama Islam JAIS dalam Profil PDF h.13',
    sourcePage: 'Profil PDF h.13 (Image 130)',
    codeLocation: 'src/content/siteConfig.ts:55-57 & src/pages/profil.astro',
    status: 'VERIFIED_DOC_PENDING_USAGE_PERMISSION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Dipaparkan sebagai status rujukan pendaftaran rasmi. Penggunaan logo JAIS memerlukan kebenaran bertulis.',
    actionRequired: 'Dapatkan keizinan bertulis sama ada nombor perakuan boleh dipaparkan secara terbuka pada footer/laman profil.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  lzs_amil: {
    id: 'lzs_amil',
    field: 'Tauliah Penolong Amil LZS',
    value: 'Penolong Amil Institusi Pendidikan Islam Swasta (Kod PA IPIS: 1290)',
    source: 'Salinan Sijil Pelantikan Lembaga Zakat Selangor dalam Profil PDF h.14',
    sourcePage: 'Profil PDF h.14 (Image 134)',
    codeLocation: 'src/content/siteConfig.ts:58 & src/pages/profil.astro',
    status: 'VERIFIED_DOC_PENDING_USAGE_PERMISSION',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'show_with_disclaimer',
    disclaimerText: 'Rujukan tauliah kutipan zakat institusi; laman web ini tidak menerima sebarang transaksi wang secara langsung.',
    actionRequired: 'Sahkan status pembaharuan tauliah LZS tahunan bersama pihak pentadbiran maahad.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  },
  student_media_consent: {
    id: 'student_media_consent',
    field: 'Hak Penerbitan Media Pelajar Bawah Umur',
    value: '12 Foto Dokumentasi Aktiviti & 2 Rakaman Video Pelajar (10–17 tahun)',
    source: 'Dokumentasi asal pihak maahad (Fail JPEG/MP4)',
    sourcePage: 'Profil PDF h.15 & arkib media klien',
    codeLocation: 'src/content/gallery.ts & src/pages/galeri.astro',
    status: 'PENDING_PARENTAL_INSTITUTIONAL_CONSENT',
    approved_by: null,
    approved_at: null,
    public_display_policy: 'hide', // Wajib disekat/fail-closed jika beralih ke mod awam tanpa izin
    disclaimerText: 'Pratonton dalaman · Kebenaran penerbitan foto/video pelajar bawah umur diperlukan sebelum go-live.',
    actionRequired: 'Dapatkan borang kebenaran bertulis ibu bapa/penjaga (parental consent) dan pihak pentadbir untuk penyiaran awam.',
    dataType: 'ACTIVE_REGISTRATION_DATA'
  }
};
