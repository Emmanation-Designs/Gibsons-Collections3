
export interface Product {
  id: string;
  created_at: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export const ADMIN_EMAILS = [
  'gibsoncollections1@gmail.com',
  'gibsoncollections2@gmail.com'
];

export const CATEGORIES = [
  // Baby Care
  'Diapers',
  'Wipes',
  'Baby Lotions & Creams',
  'Baby Soaps & Wash',
  'Feeding Essentials',
  'Baby Clothing',
  
  // Bags
  'Diaper Bags',
  'Handbags',
  'School Bags',
  'Lunch Bags',
  'Backpacks',
  'Wallets & Purses',

  // Shoes
  'Ladies Shoes',
  'Kids Shoes',
  'Sneakers',
  'Sandals & Slippers',

  // Accessories
  'Jewelry',
  'Watches',
  'Sunglasses',
  'Hair Accessories',
  'Belts',
  'Perfumes'
];

export const WHATSAPP_NUMBER = '2348033464218';
