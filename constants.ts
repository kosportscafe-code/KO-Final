import { MenuItem } from './types';

// CONFIGURATION
// Replace this with your published Google Sheet CSV link
export const GOOGLE_SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRIxcb0O9WvQrbEiSBHAl1UUxC8GidCDaOP3sKrrVZVTxUKhpDtcRFVv3CsecM9KhsTE4D0MjoO-LK/pub?output=csv";

// Replace this with your Make.com (or similar) Webhook URL
export const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "https://hook.us1.make.com/your-webhook-id";
export const ORDERS_CSV_URL = import.meta.env.VITE_ORDERS_CSV_URL || ""; // Placeholder for shared orders sheet

export const CAFE_NAME = "KOS Café";
export const CONTACT_PHONE = "+91 7060 40 3965";
export const CONTACT_WEBSITE = "www.kosportscafe.com";
export const MENU_PDF_URL = "/images/pamphlet.webp"; // Link to the menu asset

// FALLBACK DATA (Extracted from Google Business Profile & Zomato)
// This is used if the Google Sheet connection isn't set up yet.
export const FALLBACK_MENU: MenuItem[] = [
  // Sandwiches
  { id: 's1', category: 'Sandwiches', name: 'Bombay Masala', description: '', priceReg: 59, image_url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?w=600&h=450&fit=crop' },
  { id: 's2', category: 'Sandwiches', name: 'Veg Grilled', description: '', priceReg: 85, priceMed: 155, image_url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?w=600&h=450&fit=crop' },
  { id: 's3', category: 'Sandwiches', name: 'American Grilled', description: '', priceReg: 85, priceMed: 155, image_url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?w=600&h=450&fit=crop' },
  { id: 's4', category: 'Sandwiches', name: 'Paneer Tikka', description: '', priceReg: 135, priceMed: 235, image_url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?w=600&h=450&fit=crop' },
  { id: 's5', category: 'Sandwiches', name: 'Paneer Keema', description: '', priceReg: 135, priceMed: 235, image_url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?w=600&h=450&fit=crop' },
  { id: 's6', category: 'Sandwiches', name: 'Champion Club', description: '', priceReg: 125, priceMed: 225, image_url: 'https://images.unsplash.com/photo-1528735602780-22c605cc95dc?w=600&h=450&fit=crop' },

  // Rolls & Wraps
  { id: 'r1', category: 'Rolls & Wraps', name: 'Mexican Burrito Roll', description: '', priceReg: 179, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },
  { id: 'r2', category: 'Rolls & Wraps', name: 'Paneer Tikka Burrito', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },
  { id: 'r3', category: 'Rolls & Wraps', name: 'BBQ Paneer Burrito', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },
  { id: 'r4', category: 'Rolls & Wraps', name: 'BBQ Potato Burrito', description: '', priceReg: 189, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },
  { id: 'r5', category: 'Rolls & Wraps', name: 'Golden Pita Bread', description: 'Filled with Falafel', priceReg: 189, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },
  { id: 'r6', category: 'Rolls & Wraps', name: 'BBQ Paneer Roll', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },
  { id: 'r7', category: 'Rolls & Wraps', name: 'Mexican Roll', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1626700051175-536966f3fb84?w=600&h=450&fit=crop' },

  // Salads
  { id: 'sl1', category: 'Salads', name: 'Orient Crunch', description: '', priceReg: 179, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=450&fit=crop' },

  // Bowls & Meals
  { id: 'b1', category: 'Bowls & Meals', name: 'Mexican Burrito Rice', description: '', priceReg: 179, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop' },
  { id: 'b2', category: 'Bowls & Meals', name: 'Paneer Tikka Burrito Rice', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop' },
  { id: 'b3', category: 'Bowls & Meals', name: 'BBQ Paneer Burrito Rice', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop' },
  { id: 'b4', category: 'Bowls & Meals', name: 'BBQ Potato Burrito Rice', description: '', priceReg: 189, image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop' },

  // Hummus
  { id: 'h1', category: 'Hummus', name: 'Falafel Hummus', description: '', priceReg: 179, image_url: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=600&h=450&fit=crop' },
  { id: 'h2', category: 'Hummus', name: 'Hummus', description: '', priceReg: 69, image_url: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?w=600&h=450&fit=crop' },

  // Pavs
  { id: 'pv1', category: 'Pavs', name: 'Crunchy Vada Pav', description: '', priceReg: 49, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=450&fit=crop' },
  { id: 'pv2', category: 'Pavs', name: 'Pav Bhaji', description: '', priceReg: 99, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&h=450&fit=crop' },

  // Momos
  { id: 'm1', category: 'Momos', name: 'Veg Steamed', description: '', priceReg: 49, priceMed: 79, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm2', category: 'Momos', name: 'Fried Veg', description: '', priceReg: 59, priceMed: 89, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm3', category: 'Momos', name: 'Kurkure Veg', description: '', priceReg: 89, priceMed: 159, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm4', category: 'Momos', name: 'Paneer Steamed', description: '', priceReg: 69, priceMed: 109, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm5', category: 'Momos', name: 'Paneer Fried', description: '', priceReg: 79, priceMed: 129, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm6', category: 'Momos', name: 'Kurkure Paneer', description: '', priceReg: 109, priceMed: 189, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm7', category: 'Momos', name: 'Chili Paneer', description: '', priceReg: 219, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },
  { id: 'm8', category: 'Momos', name: 'Chili Veg', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1625220194771-7eb5a29f728c?w=600&h=450&fit=crop' },

  // Chinese & Noodles
  { id: 'c1', category: 'Chinese & Noodles', name: 'Soya Sauced Pan Fried', description: '', priceReg: 79, priceMed: 149, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=450&fit=crop' },
  { id: 'c2', category: 'Chinese & Noodles', name: 'Veg Hakka Noodles', description: '', priceReg: 99, priceMed: 185, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=450&fit=crop' },
  { id: 'c3', category: 'Chinese & Noodles', name: 'Veg Singapuri', description: '', priceReg: 99, priceMed: 149, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=450&fit=crop' },
  { id: 'c4', category: 'Chinese & Noodles', name: 'Chili Potato', description: '', priceReg: 189, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=450&fit=crop' },
  { id: 'c5', category: 'Chinese & Noodles', name: 'Honey Chili Potato', description: '', priceReg: 189, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=450&fit=crop' },

  // Pasta
  { id: 'pt1', category: 'Pasta', name: 'Red Sauce', description: '', priceReg: 189, image_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=450&fit=crop' },
  { id: 'pt2', category: 'Pasta', name: 'White Sauce', description: '', priceReg: 229, image_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=450&fit=crop' },

  // Nachos
  { id: 'n1', category: 'Nachos', name: 'Mexican Nachos', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=450&fit=crop' },
  { id: 'n2', category: 'Nachos', name: 'BBQ Paneer', description: '', priceReg: 199, image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=450&fit=crop' },
  { id: 'n3', category: 'Nachos', name: 'BBQ Potato Nachos', description: '', priceReg: 179, image_url: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=450&fit=crop' },

  // Tacos
  { id: 'tc1', category: 'Tacos', name: 'Veggie Twist', description: '', priceReg: 109, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop' },
  { id: 'tc2', category: 'Tacos', name: 'Falafel Fiesta', description: '', priceReg: 109, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop' },
  { id: 'tc3', category: 'Tacos', name: 'Tangy Paneer', description: '', priceReg: 129, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=450&fit=crop' },

  // Fries
  { id: 'f1', category: 'Fries', name: 'Plain Salted', description: '', priceReg: 49, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&h=450&fit=crop' },
  { id: 'f2', category: 'Fries', name: 'Peri Peri', description: '', priceReg: 59, image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&h=450&fit=crop' },

  // Thalis
  { id: 't1', category: 'Thalis', name: 'Premium Thali', description: '1 Daal, 1 Veggie, 3 Tawa Rotis, Zeera Rice, Salad', priceReg: 159, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&h=450&fit=crop' },
  { id: 't2', category: 'Thalis', name: 'Maharaja Thali', description: '1 Daal, 1 Veggie, 1 Paneer Veg, 3 Tawa Rotis, Zeera Rice, Salad, Sweet', priceReg: 249, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&h=450&fit=crop' },

  // Pizzas
  { id: 'pz1', category: 'Pizzas', name: 'Margherita', description: '', priceReg: 119, priceMed: 179, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },
  { id: 'pz2', category: 'Pizzas', name: 'Double Cheese Margherita', description: '', priceReg: 149, priceMed: 219, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },
  { id: 'pz3', category: 'Pizzas', name: 'Triple Threat', description: '', priceReg: 159, priceMed: 229, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },
  { id: 'pz4', category: 'Pizzas', name: 'Paneer Power Play', description: '', priceReg: 189, priceMed: 279, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },
  { id: 'pz5', category: 'Pizzas', name: 'Corn & Cheese Loaded', description: '', priceReg: 129, priceMed: 189, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },
  { id: 'pz6', category: 'Pizzas', name: 'Veggie Delight Goal', description: '', priceReg: 189, priceMed: 279, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },
  { id: 'pz7', category: 'Pizzas', name: 'Makhani Paneer', description: '', priceReg: 189, priceMed: 279, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=450&fit=crop' },

  // Burgers
  { id: 'bg1', category: 'Burgers', name: 'Aloo Patty Burger', description: '', priceReg: 39, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop' },
  { id: 'bg2', category: 'Burgers', name: 'Veg Patty Burger', description: '', priceReg: 49, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop' },
  { id: 'bg3', category: 'Burgers', name: 'Mexican Patty Burger', description: '', priceReg: 69, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop' },
  { id: 'bg4', category: 'Burgers', name: 'Paneer Patty Burger', description: '', priceReg: 149, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop' },
  { id: 'bg5', category: 'Burgers', name: 'Jumbo Burger', description: '', priceReg: 169, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop' },

  // Make It A Meal
  { id: 'md1', category: 'Make It A Meal', name: 'Small Meal Add-on', description: '', priceReg: 69, image_url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&h=450&fit=crop' },
  { id: 'md2', category: 'Make It A Meal', name: 'Medium Meal Add-on', description: '', priceReg: 89, image_url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&h=450&fit=crop' },
  { id: 'md3', category: 'Make It A Meal', name: 'Large Meal Add-on', description: '', priceReg: 109, image_url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=600&h=450&fit=crop' },

  // Shakes & Beverages
  { id: 'sh1', category: 'Shakes & Beverages', name: 'Oreo Shake', description: '', priceReg: 129, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=600&h=450&fit=crop' },
  { id: 'sh2', category: 'Shakes & Beverages', name: 'Hot Chocolate', description: '', priceReg: 129, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=600&h=450&fit=crop' },
  { id: 'sh3', category: 'Shakes & Beverages', name: 'Strawberry Shake', description: '', priceReg: 129, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=600&h=450&fit=crop' },
  { id: 'sh4', category: 'Shakes & Beverages', name: 'Butterscotch Shake', description: '', priceReg: 129, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=600&h=450&fit=crop' },
  { id: 'sh5', category: 'Shakes & Beverages', name: 'Tea', description: '', priceReg: 20, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=600&h=450&fit=crop' },
  { id: 'sh6', category: 'Shakes & Beverages', name: 'Coffee', description: '', priceReg: 40, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8ef?w=600&h=450&fit=crop' },

  // Drinks
  { id: 'd1', category: 'Drinks', name: 'Lime Crusher', description: '', priceReg: 59, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=450&fit=crop' },
  { id: 'd2', category: 'Drinks', name: 'Ice Tea', description: '', priceReg: 59, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=450&fit=crop' },
  { id: 'd3', category: 'Drinks', name: 'Mint Mojito', description: '', priceReg: 59, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=450&fit=crop' },
  { id: 'd4', category: 'Drinks', name: 'Cold Drink', description: '', priceReg: 29, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=450&fit=crop' },

  // Gol Gappe
  { id: 'g1', category: 'Gol Gappe', name: 'Ataa', description: '5 Pieces', priceReg: 30, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop' },
  { id: 'g2', category: 'Gol Gappe', name: 'Suji', description: '4 Pieces', priceReg: 30, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop' },
];
