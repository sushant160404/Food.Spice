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
  favoriteItem: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
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
  items: OrderItem[];
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
  seatingArea: 'MAIN_HALL' | 'PATIO' | 'CHEF_TABLE' | 'ROMANTIC_BOOTH';
  specialRequests?: string;
  status: 'CONFIRMED' | 'PENDING';
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
  fssaiNumber: string;
  gstNumber: string;
  socials: {
    facebook: string;
    instagram: string;
    youtube: string;
    pinterest: string;
    twitter: string;
  };
}

export const initialRestaurantInfo: RestaurantInfo = {
  name: "Food.Spice",
  tagline: "Authentic Flavors & Gourmet Desi Wings",
  heroHeadline: "SPICY TANDOORI WINGS",
  heroDescription: "Discover the perfect blend of crispy, juicy, and spicy Indian tandoori chicken wings. Marinated in hand-ground desi spices and roasted in traditional clay tandoors to golden perfection.",
  address: "Indiranagar 100ft Road, Bengaluru, Karnataka - 560038, India",
  phone: "+91 98765 43210",
  email: "namaste@foodspice.in",
  openingHours: "Mon - Sun: 11:00 AM - 11:30 PM",
  deliveryNotice: "Free 30-min express delivery on orders over ₹499 across Bengaluru, Delhi NCR & Mumbai",
  fssaiNumber: "11223344000551",
  gstNumber: "29AAAAA0000A1Z5",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    pinterest: "https://pinterest.com",
    twitter: "https://twitter.com",
  },
};

export const heroSauceOptions: SauceOption[] = [
  {
    id: "pudina-mint-chutney",
    name: "Pudina Coriander Chutney",
    color: "#488B49",
    description: "Fresh mountain mint and cilantro ground with green chillies, roasted cumin, and black salt.",
    spiceLevel: 2,
  },
  {
    id: "spicy-teekha-glaze",
    name: "Fiery Guntur Chilli Glaze",
    color: "#C93B13",
    description: "Smoked red Guntur chillies simmered with organic jaggery, tamarind, and Kashmiri paprika.",
    spiceLevel: 3,
  },
  {
    id: "creamy-makhani-dip",
    name: "Velvety Makhani Garlic Dip",
    color: "#F4EBD9",
    description: "Rich slow-simmered cashew cream and butter infused with roasted garlic and fragrant kasuri methi.",
    spiceLevel: 0,
  },
];

export const initialCategories: Category[] = [
  {
    id: "cat-starters",
    name: "Tandoor & Starters",
    slug: "meat",
    itemCount: 15,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    pillColor: "#C93B13",
    description: "Smoky tandoori wings, murgh tikka, seekh kebabs, and crispy spiced bites.",
  },
  {
    id: "cat-veg",
    name: "Pure Veg Delights",
    slug: "vegan",
    itemCount: 14,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    pillColor: "#C93B13",
    description: "Paneer tikka angara, dal makhani, quinoa salad, and farm-fresh vegetable gravies.",
  },
  {
    id: "cat-breakfast",
    name: "Desi Breakfast & Toast",
    slug: "breakfast",
    itemCount: 8,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    pillColor: "#C93B13",
    description: "Crispy masala dosa, artisanal sourdough egg toast, poha, and spiced parathas.",
  },
  {
    id: "cat-burgers",
    name: "Naan Burgers & Rolls",
    slug: "burgers",
    itemCount: 9,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    pillColor: "#C93B13",
    description: "Tandoori chicken smash burgers, spiced paneer kathi rolls, and buttered brioche.",
  },
  {
    id: "cat-dessert",
    name: "Mithai & Desserts",
    slug: "dessert",
    itemCount: 10,
    image: "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=800&q=80",
    pillColor: "#C93B13",
    description: "Warm Belgian molten lava cake, Kesar Pista Kulfi, and artisan sprinkle donuts.",
  },
];

export const initialMenuItems: MenuItem[] = [
  {
    id: "item-spicy-wings",
    name: "Signature Spicy Tandoori Wings",
    category: "Tandoor Starters",
    categorySlug: "meat",
    price: 349,
    rating: 4.9,
    reviewCount: 480,
    description: "Charcoal-smoked wings coated in fiery Guntur chili glaze, fresh mint & chaat masala.",
    longDescription: "Our legendary spicy wings are marinated in hung curd, hand-pounded Kashmiri chili, ginger-garlic paste, and 14 secret spices for 24 hours. Roasted in an authentic clay tandoor for a crispy crunch and served with gourmet chutneys.",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    badge: "Chef's Bestseller",
    isSpicy: true,
    isPopular: true,
    calories: 680,
    prepTime: "15-20 min",
    ingredients: ["Fresh Chicken Wings", "Guntur Red Chili", "Hung Curd", "Garlic & Ginger", "Kasuri Methi", "Fresh Mint"],
    sauces: heroSauceOptions,
  },
  {
    id: "item-paneer-tikka",
    name: "Paneer Tikka Angara",
    category: "Pure Veg Delights",
    categorySlug: "vegan",
    price: 299,
    rating: 4.9,
    reviewCount: 312,
    description: "Creamy cottage cheese cubes marinated in tandoori spices, bell peppers & mint chutney.",
    longDescription: "Malai paneer cubes infused with ajwain, mustard oil, and Kashmiri red chili marinade, skewered with crunchy capsicum and onions, charred over glowing coals. 100% Pure Vegetarian.",
    image: "https://images.unsplash.com/photo-1567184109411-b28f5d048457?auto=format&fit=crop&w=800&q=80",
    badge: "Pure Veg",
    isVegan: true,
    isPopular: true,
    calories: 460,
    prepTime: "15 min",
    ingredients: ["Fresh Malai Paneer", "Ajwain & Mustard Oil", "Kashmiri Mirch", "Tricolor Bell Peppers", "Pudina Chutney"],
  },
  {
    id: "item-butter-chicken-combo",
    name: "Old Delhi Butter Chicken with Garlic Naan",
    category: "Curries & Breads",
    categorySlug: "meat",
    price: 449,
    rating: 5.0,
    reviewCount: 520,
    description: "Tender tandoori chicken simmered in rich makhani gravy, served with 2 butter garlic naans.",
    longDescription: "Authentic Purani Dilli recipe with slow-cooked tomato-cashew satin gravy, dollops of white butter, and aromatic fenugreek. Served hot with freshly baked tandoori garlic naan.",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    badge: "Must Try",
    isPopular: true,
    calories: 820,
    prepTime: "20 min",
    ingredients: ["Tandoori Chicken Tikka", "San Marzano Style Tomatoes", "Cashew Paste", "Amul Butter", "Fresh Cream", "Garlic Naan"],
  },
  {
    id: "item-hyderabadi-biryani",
    name: "Royal Hyderabadi Dum Biryani",
    category: "Biryani Special",
    categorySlug: "meat",
    price: 399,
    rating: 4.9,
    reviewCount: 430,
    description: "Aromatic long-grain basmati rice slow-cooked with saffron, caramelized onions & spicy chicken.",
    longDescription: "Prepared using the centuries-old 'Kachhi' dum technique, sealed with wheat dough, infused with whole spices, pure kewra water, and saffron milk. Served with Mirchi ka Salan and Burani Raita.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    badge: "Royal Special",
    isSpicy: true,
    calories: 750,
    prepTime: "20 min",
    ingredients: ["Aged Daawat Basmati Rice", "Tender Chicken Pieces", "Kashmir Saffron", "Crispy Birista Onions", "Desi Ghee", "Raita"],
  },
  {
    id: "item-masala-dosa-toast",
    name: "Masala Dosa & Sourdough Egg Toast",
    category: "Breakfast",
    categorySlug: "breakfast",
    price: 219,
    rating: 4.8,
    reviewCount: 245,
    description: "Artisan sourdough topped with crushed avocado, spiced boiled farm eggs, and podi masala.",
    longDescription: "A fusion delight combining rustic bakery sourdough with Gunpowder (Podi) spice, creamy avocado, organic free-range eggs, served alongside mini crisp Mysore Masala Dosa cones.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    badge: "Breakfast Star",
    calories: 430,
    prepTime: "10 min",
    ingredients: ["Country Sourdough", "Fresh Avocado", "Farm Eggs", "South Indian Gunpowder Podi", "Cold-Pressed Coconut Oil"],
  },
  {
    id: "item-tandoori-burger",
    name: "Gourmet Tandoori Tikka Burger",
    category: "Burgers",
    categorySlug: "burgers",
    price: 269,
    rating: 4.9,
    reviewCount: 310,
    description: "Spiced chicken tikka patty, makhani aioli, pickled red onions, and melted cheese on brioche.",
    longDescription: "Char-grilled juicy spiced patty layered with spiced mint aioli, crunchy laccha pyaaz, English cheddar, and iceberg lettuce tucked into a toasted butter brioche bun with peri-peri seasoned fries.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "Desi Fusion",
    calories: 710,
    prepTime: "15 min",
    ingredients: ["Spiced Tikka Patty", "Makhani Garlic Mayo", "Pickled Sirka Onions", "Melted Cheddar", "Brioche Bun"],
  },
  {
    id: "item-lava-cake",
    name: "Belgian Molten Lava Cake & Gulab Jamun",
    category: "Dessert",
    categorySlug: "dessert",
    price: 199,
    rating: 5.0,
    reviewCount: 380,
    description: "Warm dark chocolate cake with a molten fudge center, topped with mini warm saffron gulab jamun.",
    longDescription: "Rich 70% dark Belgian cocoa baked fresh to order, oozing hot molten ganache, paired with artisanal saffron-soaked warm gulab jamun and pistachio crumble.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    badge: "Sweet Indulgence",
    calories: 510,
    prepTime: "12 min",
    ingredients: ["70% Belgian Dark Chocolate", "Saffron Gulab Jamun", "Amul Butter", "Iranian Pistachio Dust"],
  },
  {
    id: "item-sprinkle-donuts",
    name: "Artisan Cardamom Glazed Sprinkle Donuts",
    category: "Dessert",
    categorySlug: "dessert",
    price: 169,
    rating: 4.9,
    reviewCount: 290,
    description: "Fluffy brioche donuts coated in aromatic cardamom vanilla glaze and festive confetti sprinkles.",
    longDescription: "Trio of handcrafted brioche donuts dipped in fragrant elaichi vanilla bean glaze, topped with rainbow sprinkles and Belgian chocolate drizzle.",
    image: "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=800&q=80",
    calories: 440,
    prepTime: "5 min",
    ingredients: ["Brioche Dough", "Green Cardamom Elaichi Glaze", "Belgian Chocolate", "Rainbow Sprinkles"],
  },
];

export const initialChefs: Chef[] = [
  {
    id: "chef-1",
    name: "Sanjeev Verma",
    role: "Executive Head Chef",
    specialty: "Tandoor Chemistry & Secret Desi Glazes",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=700&q=80",
    signatureText: "Sanjeev Verma",
    experience: "22+ Years Luxury Hospitality",
    bio: "Master of royal tandoori recipes from Lucknow and Old Delhi, creator of Foodtuck India's iconic 14-spice wings marinade.",
    favoriteDish: "Signature Spicy Tandoori Wings & Dal Makhani",
  },
  {
    id: "chef-2",
    name: "Ritu Dalmia",
    role: "Mithai & Pastry Virtuoso",
    specialty: "Artisan Fusion Confectionery",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=700&q=80",
    signatureText: "Ritu Dalmia",
    experience: "15+ Years International Patisserie",
    bio: "Celebrated for harmonizing pure Belgian dark chocolate with aromatic Indian spices like green cardamom and saffron.",
    favoriteDish: "Belgian Molten Chocolate Lava Cake with Gulab Jamun",
  },
  {
    id: "chef-3",
    name: "Rohan D'Souza",
    role: "Modern Grill & Biryani Maestro",
    specialty: "Dum Cooking & Charcoal Grilling",
    image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=700&q=80",
    signatureText: "Rohan D'Souza",
    experience: "12+ Years Master Chef",
    bio: "Pioneering regional Indian street flavors, slow-cooked royal dum biryanis, and gourmet burgers crafted for modern palates.",
    favoriteDish: "Royal Hyderabadi Dum Biryani & Kathi Wraps",
  },
];

export const initialWhyChooseUs: WhyChooseItem[] = [
  {
    id: "why-1",
    title: "Express 30-Min Fast Delivery",
    description: "Hot, insulated thermal packaging with live GPS courier tracking across Bengaluru, Delhi NCR, Mumbai and top cities.",
    iconName: "Bike",
    badgeColor: "#FFF2EC",
  },
  {
    id: "why-2",
    title: "100% Pure & Authentic Spices",
    description: "Hand-pounded Indian spices, fresh farm produce, and zero artificial preservatives or food coloring.",
    iconName: "BookOpen",
    badgeColor: "#FFF8EA",
  },
  {
    id: "why-3",
    title: "Pure Clay Tandoor Roasting",
    description: "Every wing, tikka, and naan is charred over natural charcoal wood fires for authentic smoky perfection.",
    iconName: "Utensils",
    badgeColor: "#FFF3EB",
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Aarav Mehta",
    role: "Food & Travel Critic (Mumbai)",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Foodtuck's Spicy Tandoori Wings are easily the best in India! The smokiness from the clay tandoor combined with the Guntur chilli glaze and mint chutney is sensational. Quick delivery in Bengaluru as well!",
    date: "August 2026",
    favoriteItem: "Signature Spicy Tandoori Wings",
  },
  {
    id: "test-2",
    name: "Priya Sharma",
    role: "Culinary Blogger (Bengaluru)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "The Paneer Tikka Angara and Butter Chicken combo are mindblowing. The gravy is rich without feeling heavy, and the garlic naans were soft and hot. Highly recommend their table reservation service!",
    date: "August 2026",
    favoriteItem: "Butter Chicken & Paneer Tikka",
  },
  {
    id: "test-3",
    name: "Rohan Gupta",
    role: "Food Enthusiast (Delhi NCR)",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Order tracking with live status updates is super smooth. The molten lava cake with saffron gulab jamun is the dream dessert. Truly 5-star experience right here in India.",
    date: "July 2026",
    favoriteItem: "Royal Hyderabadi Dum Biryani",
  },
];
