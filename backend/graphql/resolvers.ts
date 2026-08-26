import {
  initialRestaurantInfo,
  initialCategories,
  initialMenuItems,
  initialChefs,
  initialWhyChooseUs,
  initialTestimonials,
  heroSauceOptions,
  RestaurantInfo,
  Category,
  MenuItem,
  Chef,
  WhyChooseItem,
  Testimonial,
  Order,
  TableBooking,
  SauceOption,
} from '../data/restaurantData';
import { getDb, isMongoConnected } from '../db/mongo';

// In-memory fallback data store for resilient real-time state
let restaurantInfo: RestaurantInfo = { ...initialRestaurantInfo };
let categories: Category[] = [...initialCategories];
let menuItems: MenuItem[] = [...initialMenuItems];
let chefs: Chef[] = [...initialChefs];
let whyChooseUs: WhyChooseItem[] = [...initialWhyChooseUs];
let testimonials: Testimonial[] = [...initialTestimonials];
let sauceOptions: SauceOption[] = [...heroSauceOptions];
const orders: Order[] = [
  {
    id: "ORD-9481",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    customerPhone: "+91 98450 12345",
    orderType: "DELIVERY",
    deliveryAddress: "Flat 402, Shanti Niketan Apts, 12th Main, Indiranagar, Bengaluru - 560038",
    items: [
      {
        menuItemId: "item-spicy-wings",
        name: "Signature Spicy Tandoori Wings",
        price: 349,
        quantity: 2,
        selectedSauce: "Fiery Guntur Chilli Glaze",
      },
      {
        menuItemId: "item-paneer-tikka",
        name: "Paneer Tikka Angara",
        price: 299,
        quantity: 1,
        selectedSauce: "Pudina Coriander Chutney",
      }
    ],
    subtotal: 997,
    discount: 249.25,
    deliveryFee: 0,
    total: 747.75,
    status: "PREPARING",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimatedTime: "20-25 mins",
  }
];

const tableBookings: TableBooking[] = [
  {
    id: "TB-3021",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 98765 43210",
    guests: 4,
    date: "2026-08-28",
    time: "19:30",
    seatingArea: "PATIO",
    specialRequests: "Anniversary celebration, romantic rooftop cabana table please.",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  }
];

const subscribers: Set<string> = new Set(["welcome@foodspice.in"]);

export const rootResolvers = {
  // Query Resolvers
  restaurantInfo: async () => {
    try {
      const db = await getDb();
      if (db) {
        const doc = await db.collection('restaurant_info').findOne({ _id: 'singleton_info' as any });
        if (doc) {
          const { _id, ...rest } = doc;
          return rest as RestaurantInfo;
        }
      }
    } catch (err) {
      console.error('Mongo restaurantInfo error:', err);
    }
    return restaurantInfo;
  },

  categories: async () => {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('categories').find().toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...c }) => c as Category);
        }
      }
    } catch (err) {
      console.error('Mongo categories error:', err);
    }
    return categories;
  },

  category: async ({ slug }: { slug: string }) => {
    try {
      const db = await getDb();
      if (db) {
        const doc = await db.collection('categories').findOne({ slug: new RegExp(`^${slug}$`, 'i') });
        if (doc) {
          const { _id, ...c } = doc;
          return c as Category;
        }
      }
    } catch (err) {
      console.error('Mongo category error:', err);
    }
    return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
  },

  menuItems: async ({
    categorySlug,
    search,
    isSpicy,
    isVegan,
    popularOnly,
  }: {
    categorySlug?: string;
    search?: string;
    isSpicy?: boolean;
    isVegan?: boolean;
    popularOnly?: boolean;
  }) => {
    let itemsList: MenuItem[] = menuItems;
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('menu_items').find().toArray();
        if (docs.length > 0) {
          itemsList = docs.map(({ _id, ...item }) => item as MenuItem);
        }
      }
    } catch (err) {
      console.error('Mongo menuItems error:', err);
    }

    return itemsList.filter((item) => {
      if (categorySlug && categorySlug !== 'all') {
        if (item.categorySlug.toLowerCase() !== categorySlug.toLowerCase()) {
          return false;
        }
      }
      if (search && search.trim() !== '') {
        const query = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIngredient = item.ingredients?.some((ing) => ing.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesIngredient) {
          return false;
        }
      }
      if (isSpicy !== undefined && item.isSpicy !== isSpicy) {
        return false;
      }
      if (isVegan !== undefined && item.isVegan !== isVegan) {
        return false;
      }
      if (popularOnly && !item.isPopular) {
        return false;
      }
      return true;
    });
  },

  menuItem: async ({ id }: { id: string }) => {
    try {
      const db = await getDb();
      if (db) {
        const doc = await db.collection('menu_items').findOne({ id });
        if (doc) {
          const { _id, ...m } = doc;
          return m as MenuItem;
        }
      }
    } catch (err) {
      console.error('Mongo menuItem error:', err);
    }
    return menuItems.find((item) => item.id === id) || null;
  },

  chefs: async () => {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('chefs').find().toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...c }) => c as Chef);
        }
      }
    } catch (err) {
      console.error('Mongo chefs error:', err);
    }
    return chefs;
  },

  whyChooseUs: async () => {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('why_choose_us').find().toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...w }) => w as WhyChooseItem);
        }
      }
    } catch (err) {
      console.error('Mongo whyChooseUs error:', err);
    }
    return whyChooseUs;
  },

  testimonials: async () => {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('testimonials').find().sort({ _id: -1 }).toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...t }) => t as Testimonial);
        }
      }
    } catch (err) {
      console.error('Mongo testimonials error:', err);
    }
    return testimonials;
  },

  sauceOptions: () => sauceOptions,

  stats: () => ({
    totalHappyCustomers: "45,000+",
    expertChefsCount: chefs.length,
    signatureDishesCount: menuItems.length,
    averageRating: 4.9,
  }),

  orders: async () => {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('orders').find().sort({ createdAt: -1 }).toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...ord }) => ord as Order);
        }
      }
    } catch (err) {
      console.error('Mongo orders error:', err);
    }
    return orders;
  },

  order: async ({ id }: { id: string }) => {
    try {
      const db = await getDb();
      if (db) {
        const doc = await db.collection('orders').findOne({ id });
        if (doc) {
          const { _id, ...ord } = doc;
          return ord as Order;
        }
      }
    } catch (err) {
      console.error('Mongo order error:', err);
    }
    return orders.find((ord) => ord.id === id) || null;
  },

  tableBookings: async () => {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('table_bookings').find().sort({ createdAt: -1 }).toArray();
        if (docs.length > 0) {
          return docs.map(({ _id, ...b }) => b as TableBooking);
        }
      }
    } catch (err) {
      console.error('Mongo tableBookings error:', err);
    }
    return tableBookings;
  },

  // Mutation Resolvers
  createOrder: async ({ input }: { input: any }) => {
    try {
      let subtotal = 0;
      const orderItems = input.items.map((item: any) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity) || 1;
        subtotal += price * quantity;
        return {
          menuItemId: item.menuItemId,
          name: item.name,
          price,
          quantity,
          selectedSauce: item.selectedSauce || undefined,
          specialInstructions: item.specialInstructions || undefined,
        };
      });

      let discount = 0;
      if (input.couponCode) {
        const code = input.couponCode.toUpperCase().trim();
        if (code.includes('50') || code === 'INDIA50') {
          discount = +(subtotal * 0.50).toFixed(2);
        } else if (code.includes('25') || code === 'DESI25' || code === 'WELCOME25') {
          discount = +(subtotal * 0.25).toFixed(2);
        }
      }

      const deliveryFee = input.orderType === 'DELIVERY' && subtotal < 499 ? 40 : 0;
      const total = +(subtotal - discount + deliveryFee).toFixed(2);
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        orderType: input.orderType || 'DELIVERY',
        tableNumber: input.tableNumber || undefined,
        deliveryAddress: input.deliveryAddress || undefined,
        items: orderItems,
        subtotal: +subtotal.toFixed(2),
        discount,
        deliveryFee,
        total,
        status: 'RECEIVED',
        createdAt: new Date().toISOString(),
        estimatedTime: '25-35 mins',
      };

      orders.unshift(newOrder);

      // Persist to MongoDB Atlas
      try {
        const db = await getDb();
        if (db) {
          await db.collection('orders').insertOne({ _id: newOrder.id as any, ...newOrder });
          console.log(`[MongoDB Atlas] Order #${newOrder.id} saved to cluster.`);
        }
      } catch (dbErr) {
        console.error('Mongo save order error:', dbErr);
      }

      return {
        success: true,
        message: 'Order placed successfully! Chef has received your ticket.',
        order: newOrder,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to create order: ${err?.message || 'Internal server error'}`,
        order: null,
      };
    }
  },

  bookTable: async ({ input }: { input: any }) => {
    try {
      const newBooking: TableBooking = {
        id: `TB-${Math.floor(1000 + Math.random() * 9000)}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        guests: Number(input.guests) || 2,
        date: input.date,
        time: input.time,
        seatingArea: input.seatingArea || 'MAIN_HALL',
        specialRequests: input.specialRequests || undefined,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString(),
      };

      tableBookings.unshift(newBooking);

      // Persist to MongoDB Atlas
      try {
        const db = await getDb();
        if (db) {
          await db.collection('table_bookings').insertOne({ _id: newBooking.id as any, ...newBooking });
          console.log(`[MongoDB Atlas] Table booking #${newBooking.id} saved to cluster.`);
        }
      } catch (dbErr) {
        console.error('Mongo save table booking error:', dbErr);
      }

      return {
        success: true,
        message: `Table reserved successfully for ${input.guests} guests on ${input.date} at ${input.time}!`,
        booking: newBooking,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Failed to book table: ${err?.message || 'Internal error'}`,
        booking: null,
      };
    }
  },

  subscribeNewsletter: async ({ email }: { email: string }) => {
    if (!email || !email.includes('@')) {
      return {
        success: false,
        message: 'Please provide a valid email address.',
        discountCode: null,
        discountPercent: 0,
      };
    }

    const normalizedEmail = email.toLowerCase().trim();
    subscribers.add(normalizedEmail);

    try {
      const db = await getDb();
      if (db) {
        await db.collection('subscribers').updateOne(
          { email: normalizedEmail },
          { $set: { email: normalizedEmail, subscribedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.error('Mongo subscribe error:', dbErr);
    }

    return {
      success: true,
      message: 'Thank you for subscribing! Your 25% discount coupon is ready.',
      discountCode: 'FOODSPICE25',
      discountPercent: 25,
    };
  },

  addReview: async ({ input }: { input: any }) => {
    const newReview: Testimonial = {
      id: `test-${Date.now()}`,
      name: input.name,
      role: input.role || 'Guest Diner',
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(input.name)}`,
      rating: Math.min(5, Math.max(1, Number(input.rating) || 5)),
      comment: input.comment,
      date: 'Just now',
      favoriteItem: input.favoriteItem || 'Signature Glazed Spicy Wings',
    };

    testimonials.unshift(newReview);

    try {
      const db = await getDb();
      if (db) {
        await db.collection('testimonials').insertOne({ _id: newReview.id as any, ...newReview });
      }
    } catch (dbErr) {
      console.error('Mongo addReview error:', dbErr);
    }

    return newReview;
  },

  sendSupportMessage: async ({
    name,
    email,
    message,
    topic,
  }: {
    name: string;
    email: string;
    message: string;
    topic?: string;
  }) => {
    const ticketId = `SUP-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const db = await getDb();
      if (db) {
        await db.collection('support_tickets').insertOne({
          _id: ticketId as any,
          ticketId,
          name,
          email,
          message,
          topic: topic || 'General',
          createdAt: new Date(),
          status: 'OPEN',
        });
      }
    } catch (dbErr) {
      console.error('Mongo support ticket error:', dbErr);
    }

    return {
      success: true,
      ticketId,
      replyMessage: `Hello ${name}, we received your inquiry regarding "${topic || 'General'}" (${ticketId}). Our dining support team will follow up at ${email} shortly!`,
    };
  },

  updateOrderStatus: async ({ id, status }: { id: string; status: string }) => {
    const target = orders.find((ord) => ord.id.toLowerCase() === id.toLowerCase());
    if (!target) {
      return {
        success: false,
        message: `Order with ID "${id}" not found.`,
        order: null,
      };
    }

    target.status = status as any;
    if (status === 'PREPARING') {
      target.estimatedTime = '15-20 mins';
    } else if (status === 'OUT_FOR_DELIVERY' || status === 'READY') {
      target.estimatedTime = target.orderType === 'DELIVERY' ? '8-12 mins' : 'Ready at Counter/Table';
    } else if (status === 'DELIVERED') {
      target.estimatedTime = 'Completed & Enjoyed';
    }

    try {
      const db = await getDb();
      if (db) {
        await db.collection('orders').updateOne(
          { id: target.id },
          { $set: { status: target.status, estimatedTime: target.estimatedTime, updatedAt: new Date() } }
        );
      }
    } catch (dbErr) {
      console.error('Mongo updateOrderStatus error:', dbErr);
    }

    return {
      success: true,
      message: `Order status updated to ${status}.`,
      order: target,
    };
  },

  advanceOrderStatus: async ({ id }: { id: string }) => {
    const target = orders.find((ord) => ord.id.toLowerCase() === id.toLowerCase());
    if (!target) {
      return {
        success: false,
        message: `Order with ID "${id}" not found.`,
        order: null,
      };
    }

    const flow = target.orderType === 'DELIVERY' 
      ? ['RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']
      : ['RECEIVED', 'PREPARING', 'READY', 'DELIVERED'];

    const currentIndex = flow.indexOf(target.status);
    const nextStatus = currentIndex >= 0 && currentIndex < flow.length - 1 
      ? flow[currentIndex + 1] 
      : flow[0]; // loop around or complete

    target.status = nextStatus as any;
    if (nextStatus === 'PREPARING') {
      target.estimatedTime = '15-20 mins';
    } else if (nextStatus === 'OUT_FOR_DELIVERY' || nextStatus === 'READY') {
      target.estimatedTime = target.orderType === 'DELIVERY' ? '8-12 mins' : 'Ready at counter';
    } else if (nextStatus === 'DELIVERED') {
      target.estimatedTime = 'Completed';
    } else {
      target.estimatedTime = '25-35 mins';
    }

    try {
      const db = await getDb();
      if (db) {
        await db.collection('orders').updateOne(
          { id: target.id },
          { $set: { status: target.status, estimatedTime: target.estimatedTime, updatedAt: new Date() } }
        );
      }
    } catch (dbErr) {
      console.error('Mongo advanceOrderStatus error:', dbErr);
    }

    return {
      success: true,
      message: `Order #${target.id} advanced to status ${nextStatus}.`,
      order: target,
    };
  },

  addMenuItem: async ({ input }: { input: any }) => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: input.name,
      category: input.category,
      categorySlug: input.categorySlug,
      price: Number(input.price),
      rating: 5.0,
      reviewCount: 1,
      description: input.description,
      longDescription: input.longDescription || input.description,
      image: input.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      badge: input.badge || undefined,
      isSpicy: !!input.isSpicy,
      isVegan: !!input.isVegan,
      isPopular: !!input.isPopular,
      calories: Number(input.calories) || 350,
      prepTime: input.prepTime || '15-20 mins',
      ingredients: input.ingredients || ['Spices', 'Garnish', 'Herb Infusion'],
      sauces: heroSauceOptions,
    };

    menuItems.unshift(newItem);

    try {
      const db = await getDb();
      if (db) {
        await db.collection('menu_items').insertOne({ _id: newItem.id as any, ...newItem });
      }
    } catch (dbErr) {
      console.error('Mongo addMenuItem error:', dbErr);
    }

    return newItem;
  },

  updateMenuItem: async ({ id, input }: { id: string; input: any }) => {
    const index = menuItems.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Menu item with ID "${id}" not found`);
    }

    const updated: MenuItem = {
      ...menuItems[index],
      name: input.name ?? menuItems[index].name,
      category: input.category ?? menuItems[index].category,
      categorySlug: input.categorySlug ?? menuItems[index].categorySlug,
      price: input.price !== undefined ? Number(input.price) : menuItems[index].price,
      description: input.description ?? menuItems[index].description,
      longDescription: input.longDescription ?? menuItems[index].longDescription,
      image: input.image ?? menuItems[index].image,
      badge: input.badge !== undefined ? input.badge : menuItems[index].badge,
      isSpicy: input.isSpicy !== undefined ? !!input.isSpicy : menuItems[index].isSpicy,
      isVegan: input.isVegan !== undefined ? !!input.isVegan : menuItems[index].isVegan,
      isPopular: input.isPopular !== undefined ? !!input.isPopular : menuItems[index].isPopular,
      calories: input.calories !== undefined ? Number(input.calories) : menuItems[index].calories,
      prepTime: input.prepTime ?? menuItems[index].prepTime,
      ingredients: input.ingredients ?? menuItems[index].ingredients,
    };

    menuItems[index] = updated;

    try {
      const db = await getDb();
      if (db) {
        await db.collection('menu_items').updateOne({ id }, { $set: updated });
      }
    } catch (dbErr) {
      console.error('Mongo updateMenuItem error:', dbErr);
    }

    return updated;
  },

  deleteMenuItem: async ({ id }: { id: string }) => {
    const prevCount = menuItems.length;
    menuItems = menuItems.filter((item) => item.id !== id);

    try {
      const db = await getDb();
      if (db) {
        const res = await db.collection('menu_items').deleteOne({ id });
        return res.deletedCount > 0 || menuItems.length < prevCount;
      }
    } catch (dbErr) {
      console.error('Mongo deleteMenuItem error:', dbErr);
    }

    return menuItems.length < prevCount;
  },

  updateTableBookingStatus: async ({ id, status }: { id: string; status: string }) => {
    const booking = tableBookings.find((b) => b.id.toLowerCase() === id.toLowerCase());
    if (!booking) {
      return {
        success: false,
        message: `Booking #${id} not found`,
        booking: null,
      };
    }

    booking.status = status as any;

    try {
      const db = await getDb();
      if (db) {
        await db.collection('table_bookings').updateOne(
          { id: booking.id },
          { $set: { status: booking.status, updatedAt: new Date() } }
        );
      }
    } catch (dbErr) {
      console.error('Mongo updateTableBookingStatus error:', dbErr);
    }

    return {
      success: true,
      message: `Booking #${id} marked as ${status}`,
      booking,
    };
  },

  deleteTableBooking: async ({ id }: { id: string }) => {
    const index = tableBookings.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
    if (index > -1) {
      tableBookings.splice(index, 1);
    }

    try {
      const db = await getDb();
      if (db) {
        const res = await db.collection('table_bookings').deleteOne({ id });
        return res.deletedCount > 0 || index > -1;
      }
    } catch (dbErr) {
      console.error('Mongo deleteTableBooking error:', dbErr);
    }

    return index > -1;
  },

  updateRestaurantInfo: async ({ input }: { input: any }) => {
    restaurantInfo = {
      ...restaurantInfo,
      ...input,
      socials: restaurantInfo.socials,
    };

    try {
      const db = await getDb();
      if (db) {
        await db.collection('restaurant_info').updateOne(
          { _id: 'singleton_info' as any },
          { $set: { ...restaurantInfo, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.error('Mongo updateRestaurantInfo error:', dbErr);
    }

    return restaurantInfo;
  },

  deleteReview: async ({ id }: { id: string }) => {
    const prevCount = testimonials.length;
    testimonials = testimonials.filter((t) => t.id !== id);

    try {
      const db = await getDb();
      if (db) {
        const res = await db.collection('testimonials').deleteOne({ id });
        return res.deletedCount > 0 || testimonials.length < prevCount;
      }
    } catch (dbErr) {
      console.error('Mongo deleteReview error:', dbErr);
    }

    return testimonials.length < prevCount;
  },
};
