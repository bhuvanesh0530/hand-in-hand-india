export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  name: string;
  created_at: string;
}

export interface Beneficiary {
  id: string;
  name?: string;               // ✅ ADDED: personal/owner name
  business_name: string;
  about: string;
  services: string[];
  mobile_number: string;
  location: string;
  district?: string;
  whatsapp?: string;
  working_hours?: string;
  order_types?: string;
  map_link?: string;
  landmark?: string;
  gallery_images?: string[];
  instagram?: string;
  facebook?: string;
  social_instagram?: string;
  social_facebook?: string;
  profile_image?: string;
  work_images: string[];
  business_card?: string;
  category_id: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface AppState {
  categories: Category[];
  beneficiaries: Beneficiary[];
  isLoading: boolean;
  toasts: Toast[];
}