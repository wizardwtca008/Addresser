export interface Company {
  id: string;
  name: string;
  short_name: string;
  logo: string; // Base64 data URL or SVG data URL
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CourierAddress {
  id: string;
  company_id: string;
  receiver_name: string;
  designation?: string;
  center_code?: string;
  organization?: string;
  mobile: string;
  alternate_mobile?: string;
  email?: string;
  address_line_1: string;
  address_line_2?: string;
  area?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  reference?: string;
  remarks?: string;
  use_default_sender: boolean;
  custom_sender?: {
    company_name?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
    email?: string;
  };
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
}

export interface PrintLog {
  id: string;
  address_id?: string;
  company_id: string;
  company_name: string;
  receiver_name: string;
  center_code?: string;
  action_type: 'print' | 'pdf_download';
  created_at: string;
}

export interface AppSettings {
  default_company_id: string;
  print_layout: 'corporate' | 'minimal' | 'bold_border';
  label_position: 'top' | 'bottom';
  font_size: 'standard' | 'compact' | 'large';
  border_style: 'double' | 'single' | 'bold';
  show_center_code: boolean;
  show_mobile_number: boolean;
  show_company_tagline: boolean;
  show_sender_address: boolean;
}
