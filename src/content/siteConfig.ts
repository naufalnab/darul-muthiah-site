import rawConfig from './siteConfig.json';

export type PublicationMode = 'internal' | 'public';

export interface ReleaseApprovals {
  feesApproved: boolean;
  historyApproved: boolean;
  studentMediaConsentApproved: boolean;
  officialContactApproved: boolean;
  jaisUsageApproved: boolean;
}

export interface SiteAddress {
  street: string;
  subdistrict: string;
  cityStatePostcode: string;
  full: string;
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
  address: SiteAddress;
  mailingAddress: SiteAddress;
  googleMapsUrl: string;
  developerName: string;
  developerUrl: string;
  publicationMode: PublicationMode;
  releaseApprovals: ReleaseApprovals;
  jaisCode: string;
  jaisRegistrationNo: string;
  jaisExpiryDate: string;
  lzsAgentCode: string;
}

// Single structured source of truth loaded from siteConfig.json
export const siteConfig: SiteConfig = rawConfig as SiteConfig;
