import { MenuItem } from './types';

// CONFIGURATION
// Replace this with your published Google Sheet CSV link
export const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRIxcb0O9WvQrbEiSBHAl1UUxC8GidCDaOP3sKrrVZVTxUKhpDtcRFVv3CsecM9KhsTE4D0MjoO-LK/pub?output=csv";

// Replace this with your Make.com (or similar) Webhook URL
export const WEBHOOK_URL = "https://hook.us1.make.com/your-webhook-id";

export const CAFE_NAME = "KOS Café";
export const CONTACT_PHONE = "+91 7060 40 3965";
export const CONTACT_WEBSITE = "www.kosportscafe.com";

// FALLBACK DATA (Extracted from Google Business Profile & Zomato)
// This is used if the Google Sheet connection isn't set up yet.
export const FALLBACK_MENU: MenuItem[] = [
  // Sandwiches
  { id: 's1', category: 'Sandwiches', name: 'Bombay Masala', description: '', priceReg: 59, image: 'https://lh3.googleusercontent.com/geofoodgmb/AC9zUhOTSciUwahlcrGujTT8zmPiP2Qz7ke7NHc3OAVdbAE2qGORSKNn8xdwJqR2RcrvFfxUktaBdSWjP7kIGOUZBfeMXA=s680-w680-h510-rw' },
  { id: 's2', category: 'Sandwiches', name: 'Veg Grilled', description: '', priceReg: 85 },
  { id: 's3', category: 'Sandwiches', name: 'American Grilled', description: '', priceReg: 85, image: 'https://lh3.googleusercontent.com/geofoodgmb/AC9zUhOiNL3Qqzf_X7_DfGpd9_1TqDTBX2y7xxuyeM6HSM3RU8RUI57R71ywZfLPucmrEi7xLuWWuPcnjBqMtXfdRYTIOw=s680-w680-h510-rw' },
  { id: 's4', category: 'Sandwiches', name: 'Paneer Tikka', description: '', priceReg: 135 },
  { id: 's5', category: 'Sandwiches', name: 'Paneer Keema', description: '', priceReg: 135 },
  { id: 's6', category: 'Sandwiches', name: 'Club Sandwich', description: '', priceReg: 125 },

  // Rolls & Wraps
  { id: 'r1', category: 'Rolls & Wraps', name: 'Mexican Burrito Roll', description: '', priceReg: 179 },
  { id: 'r2', category: 'Rolls & Wraps', name: 'Paneer Tikka Burrito', description: '', priceReg: 199, image: 'https://lh3.googleusercontent.com/geofoodgmb/AC9zUhPB0S_c4E48jUZbxjW5vMTFI8qAGbe-OHcowAiQR99pu71sHB5xpwKdXkiqRgR1i9dQhSsRDDhnsw2ZPv78WJe5tg=s680-w680-h510-rw' },
  { id: 'r3', category: 'Rolls & Wraps', name: 'BBQ Paneer Burrito', description: '', priceReg: 199, image: 'https://b.zmtcdn.com/data/dish_photos/20e/5565e1e1f61c308b689611863ba3e20e.png' },
  { id: 'r4', category: 'Rolls & Wraps', name: 'BBQ Potato Burrito', description: '', priceReg: 189 },
  { id: 'r5', category: 'Rolls & Wraps', name: 'Golden Pita Bread', description: 'Filled with Falafel', priceReg: 189, image: 'https://b.zmtcdn.com/data/dish_photos/a3d/4d53c2e42738ab71e0f0b20de0a74a3d.png' },
  { id: 'r6', category: 'Rolls & Wraps', name: 'BBQ Paneer Roll', description: '', priceReg: 199 },
  { id: 'r7', category: 'Rolls & Wraps', name: 'Mexican Roll', description: '', priceReg: 199 },

  // Salads
  { id: 'sl1', category: 'Salads', name: 'Orient Crunch', description: '', priceReg: 179, image: 'https://b.zmtcdn.com/data/dish_photos/49f/cecabf03a0ab838bc9a66d3b3cef249f.jpeg' },

  // Bowls & Meals
  { id: 'b1', category: 'Bowls & Meals', name: 'Mexican Burrito Rice', description: '', priceReg: 179 },
  { id: 'b2', category: 'Bowls & Meals', name: 'Paneer Tikka Burrito Rice', description: '', priceReg: 199 },
  { id: 'b3', category: 'Bowls & Meals', name: 'BBQ Paneer Burrito Rice', description: '', priceReg: 199 },
  { id: 'b4', category: 'Bowls & Meals', name: 'BBQ Potato Burrito Rice', description: '', priceReg: 189 },

  // Hummus
  { id: 'h1', category: 'Hummus', name: 'Falafel Hummus', description: '', priceReg: 179, image: 'https://b.zmtcdn.com/data/dish_photos/30f/e9a908e45c57fb22dee0c5fa3575c30f.jpeg' },
  { id: 'h2', category: 'Hummus', name: 'Hummus', description: '', priceReg: 69 },

  // Pavs
  { id: 'pv1', category: 'Pavs', name: 'Crunchy Vada Pav', description: '', priceReg: 49, image: 'https://b.zmtcdn.com/data/dish_photos/7ad/d27d90f416f66da14914acf4cc3937ad.png' },
  { id: 'pv2', category: 'Pavs', name: 'Pav Bhaji', description: '', priceReg: 99, image: 'https://b.zmtcdn.com/data/dish_photos/09d/495a1e392535c7da19e1479cdab9309d.png' },

  // Momos
  { id: 'm1', category: 'Momos', name: 'Veg Steamed', description: '', priceReg: 49, image: 'https://b.zmtcdn.com/data/dish_photos/a5f/5ff5a173ab70292ffd4d0265eff91a5f.png' },
  { id: 'm2', category: 'Momos', name: 'Fried Veg', description: '', priceReg: 59 },
  { id: 'm3', category: 'Momos', name: 'Kurkure Veg', description: '', priceReg: 89 },
  { id: 'm4', category: 'Momos', name: 'Paneer Steamed', description: '', priceReg: 69 },
  { id: 'm5', category: 'Momos', name: 'Paneer Fried', description: '', priceReg: 79 },
  { id: 'm6', category: 'Momos', name: 'Kurkure Paneer', description: '', priceReg: 109 },
  { id: 'm7', category: 'Momos', name: 'Chili Paneer', description: '', priceReg: 219 },
  { id: 'm8', category: 'Momos', name: 'Chili Veg', description: '', priceReg: 199 },

  // Chinese & Noodles
  { id: 'c1', category: 'Chinese & Noodles', name: 'Soya Sauced Pan', description: '', priceReg: 179 },
  { id: 'c2', category: 'Chinese & Noodles', name: 'Veg Hakka Noodles', description: '', priceReg: 199 },
  { id: 'c3', category: 'Chinese & Noodles', name: 'Veg Singapuri', description: '', priceReg: 199 },
  { id: 'c4', category: 'Chinese & Noodles', name: 'Chili Potato', description: '', priceReg: 189 },
  { id: 'c5', category: 'Chinese & Noodles', name: 'Honey Chili Potato', description: '', priceReg: 189 },

  // Pasta
  { id: 'pt1', category: 'Pasta', name: 'Red Sauce', description: '', priceReg: 189, image: 'https://b.zmtcdn.com/data/dish_photos/700/6a93a26dc82650b82325fae84264f700.png' },
  { id: 'pt2', category: 'Pasta', name: 'White Sauce', description: '', priceReg: 229, image: 'https://b.zmtcdn.com/data/dish_photos/89a/85ace0f4f9f671302e8e7dd62b58b89a.jpeg' },

  // Nachos
  { id: 'n1', category: 'Nachos', name: 'Mexican Nachos', description: '', priceReg: 199 },
  { id: 'n2', category: 'Nachos', name: 'BBQ Paneer', description: '', priceReg: 199 },
  { id: 'n3', category: 'Nachos', name: 'BBQ Potato Nachos', description: '', priceReg: 179 },

  // Tacos
  { id: 'tc1', category: 'Tacos', name: 'Veggie Twist', description: '', priceReg: 109, image: 'https://b.zmtcdn.com/data/dish_photos/73e/b0c05a57ad4fc50e1ee7a4240786773e.png' },
  { id: 'tc2', category: 'Tacos', name: 'Falafel Fiesta', description: '', priceReg: 109, image: 'https://b.zmtcdn.com/data/dish_photos/b83/abe9a3e0e329916463e75a3e7ff49b83.png' },
  { id: 'tc3', category: 'Tacos', name: 'Tangy Paneer', description: '', priceReg: 129 },

  // Fries
  { id: 'f1', category: 'Fries', name: 'Plain Salted', description: '', priceReg: 49, image: 'https://b.zmtcdn.com/data/dish_photos/7b5/a3c7028d7ccf8681a8cabce149d867b5.jpeg' },
  { id: 'f2', category: 'Fries', name: 'Peri Peri', description: '', priceReg: 59, image: 'https://b.zmtcdn.com/data/dish_photos/850/3042d6cc7c55989e059335332bf42850.png' },

  // Thalis
  { id: 't1', category: 'Thalis', name: 'Premium Thali', description: '1 Daal, 1 Veggie, 3 Tawa Rotis, Zeera Rice, Salad', priceReg: 159 },
  { id: 't2', category: 'Thalis', name: 'Maharaja Thali', description: '1 Daal, 1 Veggie, 1 Paneer Veg, 3 Tawa Rotis, Zeera Rice, Salad, Sweet', priceReg: 249 },

  // Pizzas
  { id: 'pz1', category: 'Pizzas', name: 'Margherita', description: '', priceReg: 119, image: 'https://b.zmtcdn.com/data/dish_photos/398/fd02cc5b94f0fc8159b60c7802127398.jpeg' },
  { id: 'pz2', category: 'Pizzas', name: 'Double Cheese Margherita', description: '', priceReg: 149, image: 'https://b.zmtcdn.com/data/dish_photos/c8d/b5a48deb6be2d4e1856435c822397c8d.png' },
  { id: 'pz3', category: 'Pizzas', name: 'Triple Threat', description: '', priceReg: 159, image: 'https://b.zmtcdn.com/data/dish_photos/3aa/119da2f728227023e28eb94ff0dcb3aa.png' },
  { id: 'pz4', category: 'Pizzas', name: 'Paneer Power Play', description: '', priceReg: 189, image: 'https://b.zmtcdn.com/data/dish_photos/77a/b1f89421e845c5fa460a5d275718177a.png' },
  { id: 'pz5', category: 'Pizzas', name: 'Corn & Cheese Loaded', description: '', priceReg: 129, image: 'https://b.zmtcdn.com/data/dish_photos/ee1/9dca69f138d5236c391c1f2de624aee1.png' },
  { id: 'pz6', category: 'Pizzas', name: 'Veggie Delight Goal', description: '', priceReg: 189, image: 'https://b.zmtcdn.com/data/dish_photos/223/42a4d1961bc3dc0c36d90bc0a7766223.png' },
  { id: 'pz7', category: 'Pizzas', name: 'Makhani Paneer', description: '', priceReg: 189, image: 'https://b.zmtcdn.com/data/dish_photos/411/b697098c796a29beb1d41038b8900411.png' },

  // Burgers
  { id: 'bg1', category: 'Burgers', name: 'Aloo Patty Burger', description: '', priceReg: 39, image: 'https://b.zmtcdn.com/data/dish_photos/9d2/8f0a8f2318cbb42e3d09b23da10929d2.png' },
  { id: 'bg2', category: 'Burgers', name: 'Veg Patty Burger', description: '', priceReg: 49, image: 'https://b.zmtcdn.com/data/dish_photos/539/ba68b824801a63f29d254d2fcc256539.jpeg' },
  { id: 'bg3', category: 'Burgers', name: 'Mexican Patty Burger', description: '', priceReg: 69, image: 'https://b.zmtcdn.com/data/dish_photos/c78/193ad3746b1d083e8288090553a79c78.png' },
  { id: 'bg4', category: 'Burgers', name: 'Paneer Patty Burger', description: '', priceReg: 149, image: 'https://b.zmtcdn.com/data/dish_photos/6a7/0560e3971339c619f268acce642a96a7.jpeg' },
  { id: 'bg5', category: 'Burgers', name: 'Jumbo Burger', description: '', priceReg: 169 },

  // Make It A Meal
  { id: 'md1', category: 'Make It A Meal', name: 'Small Meal Add-on', description: '', priceReg: 69 },
  { id: 'md2', category: 'Make It A Meal', name: 'Medium Meal Add-on', description: '', priceReg: 89 },
  { id: 'md3', category: 'Make It A Meal', name: 'Large Meal Add-on', description: '', priceReg: 109 },

  // Shakes & Beverages
  { id: 'sh1', category: 'Shakes & Beverages', name: 'Oreo Shake', description: '', priceReg: 129 },
  { id: 'sh2', category: 'Shakes & Beverages', name: 'Hot Chocolate', description: '', priceReg: 129, image: 'https://b.zmtcdn.com/data/dish_photos/bbc/c9dc7785846b0ccad1eb38c06eb25bbc.jpeg' },
  { id: 'sh3', category: 'Shakes & Beverages', name: 'Strawberry Shake', description: '', priceReg: 129 },
  { id: 'sh4', category: 'Shakes & Beverages', name: 'Butterscotch Shake', description: '', priceReg: 129 },
  { id: 'sh5', category: 'Shakes & Beverages', name: 'Tea', description: '', priceReg: 20 },
  { id: 'sh6', category: 'Shakes & Beverages', name: 'Coffee', description: '', priceReg: 40 },

  // Drinks
  { id: 'd1', category: 'Drinks', name: 'Lime Crusher', description: '', priceReg: 59, image: 'https://lh3.googleusercontent.com/geofoodgmb/AC9zUhPNWb_zD_2_i8W4_4F9_M7_k_eR_s_m_M_E_t_S_G_H_w=s680-w680-h510-rw' },
  { id: 'd2', category: 'Drinks', name: 'Ice Tea', description: '', priceReg: 59 },
  { id: 'd3', category: 'Drinks', name: 'Mint Mojito', description: '', priceReg: 59 },
  { id: 'd4', category: 'Drinks', name: 'Cold Drink', description: '', priceReg: 29 },

  // Gol Gappe
  { id: 'g1', category: 'Gol Gappe', name: 'Ataa', description: '5 Pieces', priceReg: 30 },
  { id: 'g2', category: 'Gol Gappe', name: 'Suji', description: '4 Pieces', priceReg: 30 },
];
