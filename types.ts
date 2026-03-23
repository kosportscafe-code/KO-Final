export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  priceReg: number;
  priceMed?: number; // Some items in PDF have two prices
  image?: string;
}

export interface CartItem extends MenuItem {
  cartId: string;
  selectedSize: 'Regular' | 'Medium' | 'Half' | 'Full';
  price: number;
  quantity: number;
}

export interface SheetRow {
  Category: string;
  Name: string;
  Description: string;
  PriceReg: string;
  PriceMed?: string;
  ImageURL?: string;
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