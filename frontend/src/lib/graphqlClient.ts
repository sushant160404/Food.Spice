import {
  RestaurantInfo,
  Category,
  MenuItem,
  Chef,
  WhyChooseItem,
  Testimonial,
  Order,
  TableBooking,
  Stats,
  SauceOption,
} from '../types';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; locations?: any[]; path?: any[] }[];
}

// Base URL of the backend API. In dev this is proxied by Vite (see vite.config.ts),
// so it can stay empty. In production, set VITE_API_URL to the deployed backend's
// origin (e.g. https://api.example.com).
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function executeGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL Network error: ${response.status} ${response.statusText}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      console.warn('GraphQL API Error:', result.errors);
      throw new Error(result.errors.map((e) => e.message).join(', '));
    }

    if (!result.data) {
      throw new Error('GraphQL returned no data.');
    }

    return result.data;
  } catch (error: any) {
    console.error('executeGraphQL failed:', error);
    throw error;
  }
}

// Queries
export const GET_INITIAL_DATA_QUERY = `
  query GetInitialRestaurantData {
    restaurantInfo {
      name
      tagline
      heroHeadline
      heroDescription
      address
      phone
      email
      openingHours
      deliveryNotice
      socials {
        facebook
        instagram
        youtube
        pinterest
        twitter
      }
    }
    categories {
      id
      name
      slug
      itemCount
      image
      pillColor
      description
    }
    menuItems {
      id
      name
      category
      categorySlug
      price
      rating
      reviewCount
      description
      longDescription
      image
      badge
      isSpicy
      isVegan
      isPopular
      calories
      prepTime
      ingredients
      sauces {
        id
        name
        color
        description
        spiceLevel
      }
    }
    chefs {
      id
      name
      role
      specialty
      image
      signatureText
      experience
      bio
      favoriteDish
    }
    whyChooseUs {
      id
      title
      description
      iconName
      badgeColor
    }
    testimonials {
      id
      name
      role
      avatar
      rating
      comment
      date
      favoriteItem
    }
    sauceOptions {
      id
      name
      color
      description
      spiceLevel
    }
    stats {
      totalHappyCustomers
      expertChefsCount
      signatureDishesCount
      averageRating
    }
  }
`;

export const GET_MENU_ITEMS_QUERY = `
  query GetMenuItems($categorySlug: String, $search: String, $isSpicy: Boolean, $isVegan: Boolean, $popularOnly: Boolean) {
    menuItems(categorySlug: $categorySlug, search: $search, isSpicy: $isSpicy, isVegan: $isVegan, popularOnly: $popularOnly) {
      id
      name
      category
      categorySlug
      price
      rating
      reviewCount
      description
      longDescription
      image
      badge
      isSpicy
      isVegan
      isPopular
      calories
      prepTime
      ingredients
      sauces {
        id
        name
        color
        description
        spiceLevel
      }
    }
  }
`;

// Mutations
export const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        id
        customerName
        customerEmail
        customerPhone
        orderType
        tableNumber
        deliveryAddress
        items {
          menuItemId
          name
          price
          quantity
          selectedSauce
          specialInstructions
        }
        subtotal
        discount
        deliveryFee
        total
        status
        createdAt
        estimatedTime
      }
    }
  }
`;

export const BOOK_TABLE_MUTATION = `
  mutation BookTable($input: TableBookingInput!) {
    bookTable(input: $input) {
      success
      message
      booking {
        id
        name
        email
        phone
        guests
        date
        time
        seatingArea
        specialRequests
        status
        createdAt
      }
    }
  }
`;

export const SUBSCRIBE_NEWSLETTER_MUTATION = `
  mutation SubscribeNewsletter($email: String!) {
    subscribeNewsletter(email: $email) {
      success
      message
      discountCode
      discountPercent
    }
  }
`;

export const ADD_REVIEW_MUTATION = `
  mutation AddReview($input: ReviewInput!) {
    addReview(input: $input) {
      id
      name
      role
      avatar
      rating
      comment
      date
      favoriteItem
    }
  }
`;

export const SEND_SUPPORT_MESSAGE_MUTATION = `
  mutation SendSupportMessage($name: String!, $email: String!, $message: String!, $topic: String) {
    sendSupportMessage(name: $name, email: $email, message: $message, topic: $topic) {
      success
      ticketId
      replyMessage
    }
  }
`;

export const GET_ORDER_QUERY = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      customerName
      customerEmail
      customerPhone
      orderType
      tableNumber
      deliveryAddress
      items {
        menuItemId
        name
        price
        quantity
        selectedSauce
        specialInstructions
      }
      subtotal
      discount
      deliveryFee
      total
      status
      createdAt
      estimatedTime
    }
  }
`;

export const GET_ORDERS_QUERY = `
  query GetOrders {
    orders {
      id
      customerName
      customerEmail
      customerPhone
      orderType
      tableNumber
      deliveryAddress
      items {
        menuItemId
        name
        price
        quantity
        selectedSauce
        specialInstructions
      }
      subtotal
      discount
      deliveryFee
      total
      status
      createdAt
      estimatedTime
    }
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = `
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      success
      message
      order {
        id
        customerName
        customerEmail
        customerPhone
        orderType
        tableNumber
        deliveryAddress
        items {
          menuItemId
          name
          price
          quantity
          selectedSauce
          specialInstructions
        }
        subtotal
        discount
        deliveryFee
        total
        status
        createdAt
        estimatedTime
      }
    }
  }
`;

export const ADVANCE_ORDER_STATUS_MUTATION = `
  mutation AdvanceOrderStatus($id: ID!) {
    advanceOrderStatus(id: $id) {
      success
      message
      order {
        id
        customerName
        customerEmail
        customerPhone
        orderType
        tableNumber
        deliveryAddress
        items {
          menuItemId
          name
          price
          quantity
          selectedSauce
          specialInstructions
        }
        subtotal
        discount
        deliveryFee
        total
        status
        createdAt
        estimatedTime
      }
    }
  }
`;

export const GET_ALL_TABLE_BOOKINGS_QUERY = `
  query GetTableBookings {
    tableBookings {
      id
      name
      email
      phone
      guests
      date
      time
      seatingArea
      specialRequests
      status
      createdAt
    }
  }
`;

export const UPDATE_TABLE_BOOKING_STATUS_MUTATION = `
  mutation UpdateTableBookingStatus($id: ID!, $status: String!) {
    updateTableBookingStatus(id: $id, status: $status) {
      success
      message
      booking {
        id
        name
        email
        phone
        guests
        date
        time
        seatingArea
        specialRequests
        status
        createdAt
      }
    }
  }
`;

export const DELETE_TABLE_BOOKING_MUTATION = `
  mutation DeleteTableBooking($id: ID!) {
    deleteTableBooking(id: $id)
  }
`;

export const ADD_MENU_ITEM_MUTATION = `
  mutation AddMenuItem($input: MenuItemInput!) {
    addMenuItem(input: $input) {
      id
      name
      category
      categorySlug
      price
      rating
      reviewCount
      description
      longDescription
      image
      badge
      isSpicy
      isVegan
      isPopular
      calories
      prepTime
      ingredients
      sauces {
        id
        name
        color
        description
        spiceLevel
      }
    }
  }
`;

export const UPDATE_MENU_ITEM_MUTATION = `
  mutation UpdateMenuItem($id: ID!, $input: MenuItemInput!) {
    updateMenuItem(id: $id, input: $input) {
      id
      name
      category
      categorySlug
      price
      rating
      reviewCount
      description
      longDescription
      image
      badge
      isSpicy
      isVegan
      isPopular
      calories
      prepTime
      ingredients
      sauces {
        id
        name
        color
        description
        spiceLevel
      }
    }
  }
`;

export const DELETE_MENU_ITEM_MUTATION = `
  mutation DeleteMenuItem($id: ID!) {
    deleteMenuItem(id: $id)
  }
`;

export const UPDATE_RESTAURANT_INFO_MUTATION = `
  mutation UpdateRestaurantInfo($input: RestaurantInfoInput!) {
    updateRestaurantInfo(input: $input) {
      name
      tagline
      heroHeadline
      heroDescription
      address
      phone
      email
      openingHours
      deliveryNotice
      fssaiNumber
      gstNumber
      socials {
        facebook
        instagram
        youtube
        pinterest
        twitter
      }
    }
  }
`;

export const DELETE_REVIEW_MUTATION = `
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id)
  }
`;

