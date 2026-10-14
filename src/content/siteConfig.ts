export interface ReleaseApprovals {
  feesApproved: boolean;
  historyApproved: boolean;
  studentMediaConsentApproved: boolean;
  officialContactApproved: boolean;
  jaisUsageApproved: boolean;
}

export interface SiteConfig {
  institutionName: string;
  brandName: string;
  brandSubtitle: string;
  locale: string;
  canonicalBase: string;
  admissionsSession: string;
  admissionsTargetAge: string;
  targetGender: string;
  whatsappE164: string;
  whatsappDisplay: string;
  phoneOffice: string;
  emailOffice: string;
  address: {
    street: string;
    subdistrict: string;
    cityStatePostcode: string;
    full: string;
  };
  mailingAddress: {
    street: string;
    subdistrict: string;
    cityStatePostcode: string;
    full: string;
  };
  googleMapsUrl: string;
  developerName: string;
  developerUrl: string;
  publicationMode: 'internal' | 'public';
  releaseApprovals: ReleaseApprovals;
  jaisCode: string;
  jaisRegistrationNo: string;
  jaisExpiryDate: string;
  lzsAgentCode: string;
}

export const siteConfig: SiteConfig = {
  institutionName: 'Maahad Tahfiz Al Quran Darul Muthiah (1)',
  brandName: 'Darul Muthiah',
  brandSubtitle: 'MAAHAD TAHFIZ AL QURAN (1)',
  locale: 'ms-MY',
  canonicalBase: 'https://madum.ilmuniaga.com',
  admissionsSession: '2026/2027',
  admissionsTargetAge: '10–17 tahun',
  targetGender: 'Pelajar perempuan / Puteri',
  whatsappE164: '60123108902',
  whatsappDisplay: '+60 12-310 8902',
  phoneOffice: '03-5524 7296',
  emailOffice: 'nunature@yahoo.com',
  address: {
    street: 'No. 61, Jalan Gunung Nuang U11/28',
    subdistrict: 'Seksyen U11, Bukit Bandaraya',
    cityStatePostcode: '40170 Shah Alam, Selangor',
    full: 'No. 61, Jalan Gunung Nuang U11/28, Seksyen U11, Bukit Bandaraya, 40170 Shah Alam, Selangor.'
  },
  mailingAddress: {
    street: 'No. 7, Jalan Pilus Dua 27/24B',
    subdistrict: 'Seksyen 27',
    cityStatePostcode: '40400 Shah Alam, Selangor',
    full: 'No. 7, Jalan Pilus Dua 27/24B, Seksyen 27, 40400 Shah Alam, Selangor.'
  },
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=No+61+Jalan+Gunung+Nuang+U11%2F28+Shah+Alam+Selangor',
  developerName: 'ILMU NIAGA',
  developerUrl: 'https://ilmuniaga.com',
  // DEFAULT: internal preview mode. Fails-closed if toggled to 'public' without formal approvals.
  publicationMode: 'internal',
  releaseApprovals: {
    feesApproved: false,
    historyApproved: false,
    studentMediaConsentApproved: false,
    officialContactApproved: false,
    jaisUsageApproved: false
  },
  jaisCode: 'BZH8026',
  jaisRegistrationNo: '13S(8)18/59',
  jaisExpiryDate: '13 Oktober 2028',
  lzsAgentCode: '1290'
};
