import { buildSchema } from 'graphql';

export const typeDefs = `
  type Socials {
    facebook: String!
    instagram: String!
    youtube: String!
    pinterest: String!
    twitter: String!
  }

  type RestaurantInfo {
    name: String!
    tagline: String!
    heroHeadline: String!
    heroDescription: String!
    address: String!
    phone: String!
    email: String!
    openingHours: String!
    deliveryNotice: String!
    fssaiNumber: String
    gstNumber: String
    socials: Socials!
  }

  type SauceOption {
    id: ID!
    name: String!
    color: String!
    description: String!
    spiceLevel: Int!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    itemCount: Int!
    image: String!
    pillColor: String!
    description: String!
  }

  type MenuItem {
    id: ID!
    name: String!
    category: String!
    categorySlug: String!
    price: Float!
    rating: Float!
    reviewCount: Int!
    description: String!
    longDescription: String!
    image: String!
    badge: String
    isSpicy: Boolean
    isVegan: Boolean
    isPopular: Boolean
    calories: Int!
    prepTime: String!
    ingredients: [String!]!
    sauces: [SauceOption!]
  }

  type Chef {
    id: ID!
    name: String!
    role: String!
    specialty: String!
    image: String!
    signatureText: String!
    experience: String!
    bio: String!
    favoriteDish: String!
  }

  type WhyChooseItem {
    id: ID!
    title: String!
    description: String!
    iconName: String!
    badgeColor: String!
  }

  type Testimonial {
    id: ID!
    name: String!
    role: String!
    avatar: String!
    rating: Int!
    comment: String!
    date: String!
    favoriteItem: String
  }

  type OrderItem {
    menuItemId: String!
    name: String!
    price: Float!
    quantity: Int!
    selectedSauce: String
    specialInstructions: String
  }

  type Order {
    id: ID!
    customerName: String!
    customerEmail: String!
    customerPhone: String!
    orderType: String!
    tableNumber: String
    deliveryAddress: String
    items: [OrderItem!]!
    subtotal: Float!
    discount: Float!
    deliveryFee: Float!
    total: Float!
    status: String!
    createdAt: String!
    estimatedTime: String!
  }

  type TableBooking {
    id: ID!
    name: String!
    email: String!
    phone: String!
    guests: Int!
    date: String!
    time: String!
    seatingArea: String!
    specialRequests: String
    status: String!
    createdAt: String!
  }

  type Stats {
    totalHappyCustomers: String!
    expertChefsCount: Int!
    signatureDishesCount: Int!
    averageRating: Float!
  }

  type OrderResponse {
    success: Boolean!
    message: String!
    order: Order
  }

  type TableBookingResponse {
    success: Boolean!
    message: String!
    booking: TableBooking
  }

  type NewsletterResponse {
    success: Boolean!
    message: String!
    discountCode: String
    discountPercent: Int
  }

  type SupportMessageResponse {
    success: Boolean!
    ticketId: String!
    replyMessage: String!
  }

  input OrderItemInput {
    menuItemId: String!
    name: String!
    price: Float!
    quantity: Int!
    selectedSauce: String
    specialInstructions: String
  }

  input OrderInput {
    customerName: String!
    customerEmail: String!
    customerPhone: String!
    orderType: String!
    tableNumber: String
    deliveryAddress: String
    items: [OrderItemInput!]!
    couponCode: String
  }

  input TableBookingInput {
    name: String!
    email: String!
    phone: String!
    guests: Int!
    date: String!
    time: String!
    seatingArea: String!
    specialRequests: String
  }

  input ReviewInput {
    name: String!
    role: String
    rating: Int!
    comment: String!
    favoriteItem: String
  }

  input MenuItemInput {
    name: String!
    category: String!
    categorySlug: String!
    price: Float!
    description: String!
    longDescription: String
    image: String!
    badge: String
    isSpicy: Boolean
    isVegan: Boolean
    isPopular: Boolean
    calories: Int
    prepTime: String
    ingredients: [String!]
  }

  input RestaurantInfoInput {
    name: String
    tagline: String
    heroHeadline: String
    heroDescription: String
    address: String
    phone: String
    email: String
    openingHours: String
    deliveryNotice: String
    fssaiNumber: String
    gstNumber: String
  }

  type Query {
    restaurantInfo: RestaurantInfo!
    categories: [Category!]!
    category(slug: String!): Category
    menuItems(categorySlug: String, search: String, isSpicy: Boolean, isVegan: Boolean, popularOnly: Boolean): [MenuItem!]!
    menuItem(id: ID!): MenuItem
    chefs: [Chef!]!
    whyChooseUs: [WhyChooseItem!]!
    testimonials: [Testimonial!]!
    sauceOptions: [SauceOption!]!
    stats: Stats!
    orders: [Order!]!
    order(id: ID!): Order
    tableBookings: [TableBooking!]!
  }

  type Mutation {
    createOrder(input: OrderInput!): OrderResponse!
    bookTable(input: TableBookingInput!): TableBookingResponse!
    subscribeNewsletter(email: String!): NewsletterResponse!
    addReview(input: ReviewInput!): Testimonial!
    sendSupportMessage(name: String!, email: String!, message: String!, topic: String): SupportMessageResponse!
    updateOrderStatus(id: ID!, status: String!): OrderResponse!
    advanceOrderStatus(id: ID!): OrderResponse!
    addMenuItem(input: MenuItemInput!): MenuItem!
    updateMenuItem(id: ID!, input: MenuItemInput!): MenuItem!
    deleteMenuItem(id: ID!): Boolean!
    updateTableBookingStatus(id: ID!, status: String!): TableBookingResponse!
    deleteTableBooking(id: ID!): Boolean!
    updateRestaurantInfo(input: RestaurantInfoInput!): RestaurantInfo!
    deleteReview(id: ID!): Boolean!
  }
`;

export const schema = buildSchema(typeDefs);
