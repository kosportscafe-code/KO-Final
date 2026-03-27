export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  priceReg: number;
  priceMed?: number; // Some items in PDF have two prices
  image_url?: string;
  inStock?: boolean;
  isVeg?: boolean;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  cartId: string;
  selectedSize: 'Regular' | 'Medium' | 'Half' | 'Full';
  price: number;
  qty: number;
}

export interface SheetRow {
  Category: string;
  Name: string;
  Description: string;
  PriceReg: string;
  PriceMed?: string;
  ImageURL?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  category: 'Sports' | 'Standup' | 'Events' | 'Offers' | string;
  author: string;
  createdAt: string;
  metaTitle?: string;
  metaDescription?: string;
  isEventAttached?: boolean;
  eventDate?: string;
  eventTime?: string;
  eventSeatsLeft?: string | number;
}

export interface CafeEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  image: string;
  price?: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// AI Studio Types moved to global scope to avoid module-scope conflicts
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  groundingSources?: Array<{ uri: string; title: string }>;
}