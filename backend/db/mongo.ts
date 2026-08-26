import { MongoClient, Db } from 'mongodb';
import {
  initialRestaurantInfo,
  initialCategories,
  initialMenuItems,
  initialChefs,
  initialWhyChooseUs,
  initialTestimonials,
} from '../data/restaurantData';

let mongoClient: MongoClient | null = null;
let database: Db | null = null;
let isConnected = false;
let connectionAttempted = false;
let connectionError: string | null = null;

export async function getDb(): Promise<Db | null> {
  if (database && isConnected) {
    return database;
  }
  if (!connectionAttempted) {
    await initMongo();
  }
  return database;
}

export function isMongoConnected(): boolean {
  return isConnected;
}

export function getMongoStatus() {
  return {
    connected: isConnected,
    dbName: 'foodtuck',
    cluster: 'Cluster0 (Atlas ReplicaSet)',
    error: connectionError,
  };
}

export async function initMongo(): Promise<Db | null> {
  if (isConnected && database) {
    return database;
  }

  connectionAttempted = true;
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    isConnected = false;
    connectionError = 'MONGODB_URI is not set in the environment.';
    console.warn('[MongoDB Atlas] No MONGODB_URI configured. Running with resilient in-memory & cloud fallback.');
    return null;
  }

  try {
    console.log('[MongoDB Atlas] Connecting to cluster...');
    mongoClient = new MongoClient(uri, {
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
    });

    await mongoClient.connect();
    database = mongoClient.db('foodtuck');
    isConnected = true;
    connectionError = null;
    console.log('[MongoDB Atlas] Successfully connected to database: "foodtuck"');

    // Run initial seed if collections are empty
    await seedInitialData(database);

    return database;
  } catch (err: any) {
    isConnected = false;
    connectionError = err?.message || 'Failed to connect to MongoDB Atlas';
    console.warn('[MongoDB Atlas] Connection warning:', connectionError);
    console.warn('[MongoDB Atlas] Running with resilient in-memory & cloud fallback.');
    return null;
  }
}

async function seedInitialData(db: Db) {
  try {
    // 1. Restaurant Info
    const infoColl = db.collection('restaurant_info');
    const infoCount = await infoColl.countDocuments();
    if (infoCount === 0) {
      await infoColl.insertOne({
        _id: 'singleton_info' as any,
        ...initialRestaurantInfo,
        updatedAt: new Date(),
      });
      console.log('[MongoDB Atlas] Seeded restaurant_info collection.');
    }

    // 2. Categories
    const catColl = db.collection('categories');
    const catCount = await catColl.countDocuments();
    if (catCount === 0) {
      const docs = initialCategories.map((c) => ({ _id: c.id as any, ...c }));
      await catColl.insertMany(docs);
      console.log(`[MongoDB Atlas] Seeded ${docs.length} categories.`);
    }

    // 3. Menu Items
    const menuColl = db.collection('menu_items');
    const menuCount = await menuColl.countDocuments();
    if (menuCount === 0) {
      const docs = initialMenuItems.map((item) => ({ _id: item.id as any, ...item }));
      await menuColl.insertMany(docs);
      console.log(`[MongoDB Atlas] Seeded ${docs.length} menu items.`);
    }

    // 4. Chefs
    const chefsColl = db.collection('chefs');
    const chefsCount = await chefsColl.countDocuments();
    if (chefsCount === 0) {
      const docs = initialChefs.map((ch) => ({ _id: ch.id as any, ...ch }));
      await chefsColl.insertMany(docs);
      console.log(`[MongoDB Atlas] Seeded ${docs.length} chefs.`);
    }

    // 5. Why Choose Us
    const whyColl = db.collection('why_choose_us');
    const whyCount = await whyColl.countDocuments();
    if (whyCount === 0) {
      const docs = initialWhyChooseUs.map((w) => ({ _id: w.id as any, ...w }));
      await whyColl.insertMany(docs);
      console.log(`[MongoDB Atlas] Seeded ${docs.length} why-choose-us cards.`);
    }

    // 6. Testimonials / Reviews
    const testColl = db.collection('testimonials');
    const testCount = await testColl.countDocuments();
    if (testCount === 0) {
      const docs = initialTestimonials.map((t) => ({ _id: t.id as any, ...t }));
      await testColl.insertMany(docs);
      console.log(`[MongoDB Atlas] Seeded ${docs.length} customer reviews.`);
    }

    // 7. Orders starter demo
    const ordersColl = db.collection('orders');
    const ordersCount = await ordersColl.countDocuments();
    if (ordersCount === 0) {
      await ordersColl.insertOne({
        _id: 'ORD-9481' as any,
        id: 'ORD-9481',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav.sharma@example.com',
        customerPhone: '+91 98450 12345',
        orderType: 'DELIVERY',
        deliveryAddress: 'Flat 402, Shanti Niketan Apts, 12th Main, Indiranagar, Bengaluru - 560038',
        items: [
          {
            menuItemId: 'item-spicy-wings',
            name: 'Signature Spicy Tandoori Wings',
            price: 349,
            quantity: 2,
            selectedSauce: 'Fiery Guntur Chilli Glaze',
          },
          {
            menuItemId: 'item-paneer-tikka',
            name: 'Paneer Tikka Angara',
            price: 299,
            quantity: 1,
            selectedSauce: 'Pudina Coriander Chutney',
          },
        ],
        subtotal: 997,
        discount: 249.25,
        deliveryFee: 0,
        total: 747.75,
        status: 'PREPARING',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        estimatedTime: '20-25 mins',
      });
      console.log('[MongoDB Atlas] Seeded starter order in orders collection.');
    }

    // 8. Table Bookings starter demo
    const bookingsColl = db.collection('table_bookings');
    const bookingsCount = await bookingsColl.countDocuments();
    if (bookingsCount === 0) {
      await bookingsColl.insertOne({
        _id: 'TB-3021' as any,
        id: 'TB-3021',
        name: 'Ananya Iyer',
        email: 'ananya.iyer@example.com',
        phone: '+91 98765 43210',
        guests: 4,
        date: '2026-08-28',
        time: '19:30',
        seatingArea: 'PATIO',
        specialRequests: 'Anniversary celebration, romantic rooftop cabana table please.',
        status: 'CONFIRMED',
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      });
      console.log('[MongoDB Atlas] Seeded starter table booking.');
    }
  } catch (seedErr) {
    console.error('[MongoDB Atlas] Error during seeding:', seedErr);
  }
}
