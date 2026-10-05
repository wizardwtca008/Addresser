import { Company, CourierAddress, PrintLog, AppSettings } from '../types';

// Default SVG Logos encoded as Data URIs for crisp offline rendering
const WIZARD_TECH_ACADEMY_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" width="360" height="80">
  <defs>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="76" height="76" rx="14" fill="url(#blueGrad)" stroke="#172554" stroke-width="2"/>
  <path d="M18 25 L28 55 L38 32 L48 55 L58 25" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="28" cy="55" r="3" fill="#60a5fa"/>
  <circle cx="38" cy="32" r="3" fill="#60a5fa"/>
  <circle cx="48" cy="55" r="3" fill="#60a5fa"/>
  <text x="92" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="#0f172a" letter-spacing="0.5">WIZARD-TECH</text>
  <text x="92" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#2563eb" letter-spacing="1.5">COMPUTER ACADEMY</text>
  <text x="92" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#64748b" letter-spacing="0.8">ISO 9001:2015 CERTIFIED INSTITUTION</text>
</svg>
`)}`;

const SUNLIGHT_SKILLS_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" width="360" height="80">
  <defs>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="76" height="76" rx="14" fill="url(#sunGrad)" stroke="#b45309" stroke-width="2"/>
  <circle cx="40" cy="40" r="16" fill="#ffffff" opacity="0.95"/>
  <circle cx="40" cy="40" r="9" fill="#f59e0b"/>
  <path d="M40 12 L40 18 M40 62 L40 68 M12 40 L18 40 M62 40 L68 40 M20 20 L25 25 M55 55 L60 60 M20 60 L25 55 M55 25 L60 20" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round"/>
  <text x="92" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="#0f172a" letter-spacing="0.5">SUNLIGHT</text>
  <text x="92" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#d97706" letter-spacing="2">SKILLS ACADEMY</text>
  <text x="92" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#64748b" letter-spacing="0.8">VOCATIONAL &amp; TECHNICAL EXCELLENCE</text>
</svg>
`)}`;

const WIZARD_TECH_ADMISSION_LOGO = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" width="360" height="80">
  <defs>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="76" height="76" rx="14" fill="url(#purpleGrad)" stroke="#4338ca" stroke-width="2"/>
  <path d="M22 36 L40 26 L58 36 L40 46 Z" fill="#ffffff"/>
  <path d="M30 42 L30 54 C30 58 50 58 50 54 L50 42" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <line x1="53" y1="38" x2="56" y2="48" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="56" cy="50" r="2" fill="#fcd34d"/>
  <text x="92" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="900" fill="#0f172a" letter-spacing="0.5">WIZARD-TECH</text>
  <text x="92" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#6d28d9" letter-spacing="1.5">ADMISSIONCELL</text>
  <text x="92" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="500" fill="#64748b" letter-spacing="0.8">CAREER GUIDANCE &amp; HIGHER EDUCATION</text>
</svg>
`)}`;

export const DEFAULT_COMPANIES: Company[] = [
  {
    id: 'comp_wtca_01',
    name: 'WIZARD-TECH Computer Academy',
    short_name: 'WTCA',
    logo: WIZARD_TECH_ACADEMY_LOGO,
    tagline: 'Center of Excellence in Computer & IT Education',
    phone: '+91 98765 43210',
    email: 'wtca.chapra@gmail.com',
    website: 'www.wizardtech.in',
    address_line_1: 'Main Road, Near Bus Stand',
    address_line_2: 'Kashi Bazar',
    city: 'Chapra',
    district: 'Saran',
    state: 'Bihar',
    pincode: '841301',
    country: 'India',
    status: 'active',
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'comp_sunlight_02',
    name: 'Sunlight Skills',
    short_name: 'SSK',
    logo: SUNLIGHT_SKILLS_LOGO,
    tagline: 'Empowering Youth with Professional Vocational & Technical Skills',
    phone: '+91 94312 34567',
    email: 'info@sunlightskills.org',
    website: 'www.sunlightskills.org',
    address_line_1: '2nd Floor, Sunlight Complex',
    address_line_2: 'Station Road',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    country: 'India',
    status: 'active',
    created_at: new Date('2026-01-05').toISOString(),
    updated_at: new Date('2026-01-05').toISOString(),
  },
  {
    id: 'comp_admission_03',
    name: 'WIZARD-TECH Admissioncell',
    short_name: 'WTAC',
    logo: WIZARD_TECH_ADMISSION_LOGO,
    tagline: 'Higher Education Guidance, Counseling & Direct Admissions',
    phone: '+91 98765 43211',
    email: 'admission@wizardtech.in',
    website: 'www.wizardtechadmission.com',
    address_line_1: 'Academic Block, Dak Bungalow Road',
    address_line_2: 'Civil Lines',
    city: 'Chapra',
    district: 'Saran',
    state: 'Bihar',
    pincode: '841301',
    country: 'India',
    status: 'active',
    created_at: new Date('2026-01-10').toISOString(),
    updated_at: new Date('2026-01-10').toISOString(),
  },
];

export const DEFAULT_ADDRESSES: CourierAddress[] = [
  {
    id: 'addr_sample_01',
    company_id: 'comp_wtca_01',
    receiver_name: 'Rahul Kumar',
    designation: 'Center Director',
    center_code: 'WTCA001',
    organization: 'WIZARD-TECH COMPUTER ACADEMY',
    mobile: '9876543210',
    alternate_mobile: '9123456780',
    email: 'rahul.wtca@gmail.com',
    address_line_1: 'Main Road, Near XYZ Complex',
    address_line_2: 'Kashi Bazar',
    area: 'Town Area',
    landmark: 'Opposite State Bank',
    city: 'Chapra',
    district: 'Saran',
    state: 'Bihar',
    pincode: '841301',
    reference: 'REF-2026-091',
    remarks: 'Deliver to Admin Office',
    use_default_sender: true,
    created_at: new Date('2026-02-15T10:00:00Z').toISOString(),
    updated_at: new Date('2026-02-15T10:00:00Z').toISOString(),
    last_used_at: new Date('2026-03-01T11:20:00Z').toISOString(),
  },
  {
    id: 'addr_sample_02',
    company_id: 'comp_sunlight_02',
    receiver_name: 'Amitabh Sharma',
    designation: 'Skill Program Coordinator',
    center_code: 'SSK-PAT-102',
    organization: 'Apex Vocational Training Institute',
    mobile: '9835012345',
    alternate_mobile: '',
    email: 'apex.skills@gmail.com',
    address_line_1: 'Plot No. 45, Industrial Area',
    address_line_2: 'Patliputra Colony',
    area: '',
    landmark: 'Behind Water Tank',
    city: 'Patna',
    district: 'Patna',
    state: 'Bihar',
    pincode: '800013',
    reference: 'EXAM-KITS-B2',
    remarks: 'Handle with care - Certificate dispatch',
    use_default_sender: true,
    created_at: new Date('2026-02-18T14:30:00Z').toISOString(),
    updated_at: new Date('2026-02-18T14:30:00Z').toISOString(),
    last_used_at: new Date('2026-03-02T16:45:00Z').toISOString(),
  },
  {
    id: 'addr_sample_03',
    company_id: 'comp_admission_03',
    receiver_name: 'Dr. Priya Ranjan',
    designation: 'Head of Admissions',
    center_code: 'WTAC-MUZ-05',
    organization: 'Institute of Professional Studies',
    mobile: '9431876543',
    alternate_mobile: '9431876544',
    email: 'admissions@ipsmuz.edu.in',
    address_line_1: 'Club Road, Mithanpura',
    address_line_2: 'Near Ramdayalu Nagar',
    area: '',
    landmark: '',
    city: 'Muzaffarpur',
    district: 'Muzaffarpur',
    state: 'Bihar',
    pincode: '842002',
    reference: 'PROSPECTUS-2026',
    remarks: 'Courier via Speed Post or Professional Courier',
    use_default_sender: true,
    created_at: new Date('2026-02-20T09:15:00Z').toISOString(),
    updated_at: new Date('2026-02-20T09:15:00Z').toISOString(),
    last_used_at: new Date('2026-03-03T10:00:00Z').toISOString(),
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  default_company_id: 'comp_wtca_01',
  print_layout: 'corporate',
  label_position: 'top',
  font_size: 'standard',
  border_style: 'double',
  show_center_code: true,
  show_mobile_number: true,
  show_company_tagline: true,
  show_sender_address: true,
};

const STORAGE_KEYS = {
  COMPANIES: 'cam_companies_v1',
  ADDRESSES: 'cam_addresses_v1',
  PRINT_LOGS: 'cam_print_logs_v1',
  SETTINGS: 'cam_settings_v1',
  DRAFT: 'cam_address_draft_v1',
};

// Storage helper functions
export const getStoredCompanies = (): Company[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(DEFAULT_COMPANIES));
      return DEFAULT_COMPANIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COMPANIES;
  } catch {
    return DEFAULT_COMPANIES;
  }
};

export const saveCompany = (company: Company): Company[] => {
  const current = getStoredCompanies();
  const index = current.findIndex((c) => c.id === company.id);
  let updated: Company[];
  const now = new Date().toISOString();
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...company, updated_at: now };
  } else {
    updated = [{ ...company, created_at: now, updated_at: now }, ...current];
  }
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(updated));
  return updated;
};

export const deleteCompany = (id: string): Company[] => {
  const current = getStoredCompanies();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(updated));
  return updated;
};

export const getStoredAddresses = (): CourierAddress[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(DEFAULT_ADDRESSES));
      return DEFAULT_ADDRESSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ADDRESSES;
  } catch {
    return DEFAULT_ADDRESSES;
  }
};

export const saveAddress = (address: CourierAddress): { list: CourierAddress[]; savedItem: CourierAddress } => {
  const current = getStoredAddresses();
  const index = current.findIndex((a) => a.id === address.id);
  const now = new Date().toISOString();
  let updatedList: CourierAddress[];
  let savedItem: CourierAddress;

  if (index >= 0) {
    savedItem = { ...address, updated_at: now };
    updatedList = [...current];
    updatedList[index] = savedItem;
  } else {
    savedItem = {
      ...address,
      id: address.id || `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: now,
      updated_at: now,
    };
    updatedList = [savedItem, ...current];
  }

  localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(updatedList));
  return { list: updatedList, savedItem };
};

export const duplicateAddress = (id: string): CourierAddress | null => {
  const current = getStoredAddresses();
  const item = current.find((a) => a.id === id);
  if (!item) return null;

  const now = new Date().toISOString();
  const duplicated: CourierAddress = {
    ...item,
    id: `addr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    receiver_name: `${item.receiver_name} (Copy)`,
    created_at: now,
    updated_at: now,
    last_used_at: null,
  };

  const updatedList = [duplicated, ...current];
  localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(updatedList));
  return duplicated;
};

export const deleteAddress = (id: string): CourierAddress[] => {
  const current = getStoredAddresses();
  const updated = current.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(updated));
  return updated;
};

export const getPrintLogs = (): PrintLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRINT_LOGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const logPrintAction = (
  addressId: string | undefined,
  companyId: string,
  companyName: string,
  receiverName: string,
  centerCode: string | undefined,
  actionType: 'print' | 'pdf_download'
): PrintLog => {
  const logs = getPrintLogs();
  const newLog: PrintLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    address_id: addressId,
    company_id: companyId,
    company_name: companyName,
    receiver_name: receiverName,
    center_code: centerCode,
    action_type: actionType,
    created_at: new Date().toISOString(),
  };

  const updatedLogs = [newLog, ...logs].slice(0, 500); // keep last 500
  localStorage.setItem(STORAGE_KEYS.PRINT_LOGS, JSON.stringify(updatedLogs));

  // Also update last_used_at if addressId matches or by receiver name
  if (addressId) {
    const addresses = getStoredAddresses();
    const targetIdx = addresses.findIndex((a) => a.id === addressId);
    if (targetIdx >= 0) {
      addresses[targetIdx].last_used_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
    }
  }

  return newLog;
};

export const getStoredSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AppSettings): AppSettings => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
};

// Auto-Save Drafts
export const getAddressDraft = (): Partial<CourierAddress> | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveAddressDraft = (draft: Partial<CourierAddress>): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } catch {
    // Ignore storage quota
  }
};

export const clearAddressDraft = (): void => {
  localStorage.removeItem(STORAGE_KEYS.DRAFT);
};

// Full backup & export/import
export const exportAllDataJSON = (): string => {
  const data = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    companies: getStoredCompanies(),
    addresses: getStoredAddresses(),
    print_logs: getPrintLogs(),
    settings: getStoredSettings(),
  };
  return JSON.stringify(data, null, 2);
};

export const importAllDataJSON = (jsonStr: string): boolean => {
  try {
    const data = JSON.parse(jsonStr);
    if (data.companies && Array.isArray(data.companies)) {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(data.companies));
    }
    if (data.addresses && Array.isArray(data.addresses)) {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(data.addresses));
    }
    if (data.print_logs && Array.isArray(data.print_logs)) {
      localStorage.setItem(STORAGE_KEYS.PRINT_LOGS, JSON.stringify(data.print_logs));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    return true;
  } catch (e) {
    console.error('Failed to import backup', e);
    return false;
  }
};
