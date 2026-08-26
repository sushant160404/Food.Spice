export interface SauceOption {
  id: string;
  name: string;
  color: string;
  description: string;
  spiceLevel: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  longDescription: string;
  image: string;
  badge?: string;
  isSpicy?: boolean;
  isVegan?: boolean;
  isPopular?: boolean;
  calories: number;
  prepTime: string;
  ingredients: string[];
  sauces?: SauceOption[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  pillColor: string;
  description: string;
}

export interface Chef {
  id: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  signatureText: string;
  experience: string;
  bio: string;
  favoriteDish: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badgeColor: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  favoriteItem?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSauce?: string;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'DELIVERY' | 'TAKEOUT' | 'DINE_IN';
  tableNumber?: string;
  deliveryAddress?: string;
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    selectedSauce?: string;
    specialInstructions?: string;
  }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'READY' | 'DELIVERED';
  createdAt: string;
  estimatedTime: string;
}

export interface TableBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  seatingArea: string;
  specialRequests?: string;
  status: string;
  createdAt: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  heroHeadline: string;
  heroDescription: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  deliveryNotice: string;
  fssaiNumber?: string;
  gstNumber?: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    pinterest: string;
    twitter: string;
  };
}

export interface Stats {
  totalHappyCustomers: string;
  expertChefsCount: number;
  signatureDishesCount: number;
  averageRating: number;
}
