export type AvailabilityStatus =
  | 'stocked'
  | 'usually'
  | 'out'
  | 'unverified';

export type CategoryId =
  | 'grocery'
  | 'hardware'
  | 'electrical'
  | 'stationery'
  | 'pharmacy'
  | 'household';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string; // lucide icon name
  color: string;
}

export interface Shop {
  id: string;
  name: string;
  category: CategoryId;
  coverImage: string;
  rating: number;
  ratingCount: number;
  distanceKm: number;
  address: string;
  area: string;
  openHour: string; // "09:00"
  closeHour: string; // "21:00"
  phone: string;
  whatsapp: string;
  mapQuery: string; // address used for a maps link
  // mock lat/lng used by the custom map view (relative coords 0..1)
  coord: { x: number; y: number };
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  shopId: string;
  // all names/aliases that should match this product (lowercased)
  aliases: string[];
}

export interface AvailabilityRecord {
  productId: string;
  shopId: string;
  status: AvailabilityStatus;
  lastVerifiedAt: number; // epoch ms
  lastVerifiedBy: string | null;
}

export interface Contribution {
  id: string;
  productId: string;
  shopId: string;
  status: AvailabilityStatus;
  confirmedAt: number;
  // whether the user confirmed available / not available
  confirmedAvailable: boolean;
}

export interface UserProfile {
  name: string;
  area: string;
  avatar: string;
  joined: string;
}
