import { MenuItem } from './types';

// CONFIGURATION
// Replace this with your published Google Sheet CSV link
export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRIxcb0O9WvQrbEiSBHAl1UUxC8GidCDaOP3sKrrVZVTxUKhpDtcRFVv3CsecM9KhsTE4D0MjoO-LK/pub?output=csv";

// Replace this with your Make.com (or similar) Webhook URL
export const WEBHOOK_URL = "https://hook.us1.make.com/your-webhook-id";

export const CAFE_NAME = "KOS Café";
export const CONTACT_PHONE = "+91 7060 40 3965";
export const CONTACT_WEBSITE = "www.kosportscafe.com";

// FALLBACK DATA (Extracted from your PDF)
// This is used if the Google Sheet connection isn't set up yet.
export const FALLBACK_MENU: MenuItem[] = [
  // Sandwiches
  { id: 's1', category: 'Sandwiches', name: 'Bombay Masala', description: 'Classic spiced potato filling', priceReg: 59 },
  { id: 's2', category: 'Sandwiches', name: 'Veg Grilled', description: 'Fresh vegetables grilled to perfection', priceReg: 85, priceMed: 155 },
  { id: 's3', category: 'Sandwiches', name: 'Paneer Tikka', description: 'Spiced cottage cheese sandwich', priceReg: 135, priceMed: 235 },
  { id: 's4', category: 'Sandwiches', name: 'Club Sandwich', description: 'Double decker loaded veggie sandwich', priceReg: 125, priceMed: 225 },

  // Rolls & Wraps
  { id: 'r1', category: 'Rolls & Wraps', name: 'Mexican Burrito Rolls', description: 'Spicy beans and rice filling', priceReg: 179 },
  { id: 'r2', category: 'Rolls & Wraps', name: 'Paneer Tikka Burrito', description: 'Fusion of Indian tikka in a wrap', priceReg: 199 },
  { id: 'r3', category: 'Rolls & Wraps', name: 'BBQ Potato Burrito', description: 'Smoky potato filling', priceReg: 189 },

  // Bowls & Meals
  { id: 'b1', category: 'Bowls & Meals', name: 'Mexican Burrito Rice', description: 'Deconstructed burrito bowl', priceReg: 179 },
  { id: 'b2', category: 'Bowls & Meals', name: 'BBQ Paneer Burrito Rice', description: 'Smoky paneer with seasoned rice', priceReg: 199 },

  // Pizzas
  { id: 'p1', category: 'Pizzas', name: 'Margherita', description: 'Classic cheese and tomato', priceReg: 119, priceMed: 179 },
  { id: 'p2', category: 'Pizzas', name: 'Double Cheese Margherita', description: 'Extra loaded cheese', priceReg: 149, priceMed: 219 },
  { id: 'p3', category: 'Pizzas', name: 'Paneer Power Play', description: 'Spiced paneer toppings', priceReg: 189, priceMed: 279 },
  { id: 'p4', category: 'Pizzas', name: 'Makhani Paneer', description: 'Rich makhani sauce base', priceReg: 189, priceMed: 279 },

  // Burgers
  { id: 'bg1', category: 'Burgers', name: 'Aloo Patty', description: 'Classic potato patty burger', priceReg: 39 },
  { id: 'bg2', category: 'Burgers', name: 'Paneer Patty', description: 'Crispy paneer patty', priceReg: 149 },
  { id: 'bg3', category: 'Burgers', name: 'Jumbo', description: 'The big appetite burger', priceReg: 169 },

  // Momos
  { id: 'm1', category: 'Momos', name: 'Veg Steamed', description: 'Delicate dumplings', priceReg: 49, priceMed: 79 },
  { id: 'm2', category: 'Momos', name: 'Fried Veg', description: 'Crispy fried dumplings', priceReg: 59, priceMed: 89 },
  { id: 'm3', category: 'Momos', name: 'Kurkure Paneer', description: 'Crunchy coated paneer momos', priceReg: 109, priceMed: 189 },

  // Chinese
  { id: 'c1', category: 'Chinese & Noodles', name: 'Veg Hakka Noodles', description: 'Wok tossed noodles', priceReg: 199, priceMed: 199 },
  { id: 'c2', category: 'Chinese & Noodles', name: 'Chili Potato', description: 'Crispy potatoes in spicy sauce', priceReg: 189 },

  // Drinks
  { id: 'd1', category: 'Drinks', name: 'Lime Crusher', description: 'Refreshing lime cooler', priceReg: 59 },
  { id: 'd2', category: 'Drinks', name: 'Mint Mojito', description: 'Classic mint virgin mojito', priceReg: 59 },
  { id: 'd3', category: 'Drinks', name: 'Cold Drink', description: 'Assorted sodas', priceReg: 29 },
  { id: 'd4', category: 'Drinks', name: 'Oreo Shake', description: 'Thick creamy oreo shake', priceReg: 129 },

  // Thalis
  { id: 't1', category: 'Thalis', name: 'Premium Thali', description: '1 Daal, 1 Veggie, 3 Tawa Rotis, Rice, Salad', priceReg: 159 },
  { id: 't2', category: 'Thalis', name: 'Maharaja Thali', description: '1 Daal, 1 Veggie, 1 Paneer, 3 Rotis, Rice, Salad, Sweet', priceReg: 249 },
];
