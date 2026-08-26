import React, { useState, useEffect } from 'react';
import {
  RestaurantInfo,
  Category,
  MenuItem,
  Chef,
  WhyChooseItem,
  Testimonial,
  CartItem,
  Order,
  SauceOption,
} from './types';
import {
  executeGraphQL,
  GET_INITIAL_DATA_QUERY,
} from './lib/graphqlClient';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { ExpertsSection } from './components/ExpertsSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Footer } from './components/Footer';
import { MenuModal } from './components/MenuModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TableReservationModal } from './components/TableReservationModal';
import { SupportDrawer } from './components/SupportDrawer';
import { GraphQLExplorerModal } from './components/GraphQLExplorerModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sauceOptions, setSauceOptions] = useState<SauceOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & UI Modals State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuFilterCat, setMenuFilterCat] = useState<string>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isGraphQLOpen, setIsGraphQLOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Fetch initial data via GraphQL API
  const loadData = async () => {
    try {
      const data = await executeGraphQL<{
        restaurantInfo: RestaurantInfo;
        categories: Category[];
        menuItems: MenuItem[];
        chefs: Chef[];
        whyChooseUs: WhyChooseItem[];
        testimonials: Testimonial[];
        sauceOptions: SauceOption[];
      }>(GET_INITIAL_DATA_QUERY);

      if (data) {
        setRestaurantInfo(data.restaurantInfo);
        setCategories(data.categories || []);
        setMenuItems(data.menuItems || []);
        setChefs(data.chefs || []);
        setWhyChooseUs(data.whyChooseUs || []);
        setTestimonials(data.testimonials || []);
        setSauceOptions(data.sauceOptions || []);
      }
    } catch (err) {
      console.error('GraphQL initial load failed, retrying in 1s...', err);
      // Fallback retry
      setTimeout(loadData, 1200);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: MenuItem, sauceName?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (c) => c.menuItem.id === item.id && c.selectedSauce === sauceName
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }
      return [
        ...prev,
        {
          menuItem: item,
          quantity: 1,
          selectedSauce: sauceName,
        },
      ];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(index);
    } else {
      setCart((prev) => {
        const next = [...prev];
        next[index].quantity = newQty;
        return next;
      });
    }
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCategorySelect = (slug: string) => {
    setMenuFilterCat(slug);
    setIsMenuOpen(true);
  };

  const handleReviewAdded = (newReview: Testimonial) => {
    setTestimonials((prev) => [newReview, ...prev]);
  };

  const heroItem = menuItems.find((m) => m.id === 'item-spicy-wings') || menuItems[0];
  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1E1E1E]">
      {/* Navigation Header */}
      <Navbar
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenMenu={() => {
          setMenuFilterCat('all');
          setIsMenuOpen(true);
        }}
        onOpenGraphQL={() => setIsGraphQLOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        hasActiveOrder={!!confirmedOrder}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section (SPICY WINGS) */}
        <HeroSection
          heroItem={heroItem}
          sauces={sauceOptions}
          onOpenMenu={() => {
            setMenuFilterCat('all');
            setIsMenuOpen(true);
          }}
          onAddToCart={handleAddToCart}
        />

        {/* 2. Categories Section (Catagories) */}
        <CategoriesSection
          categories={categories}
          onSelectCategory={handleCategorySelect}
          onOpenMenu={() => {
            setMenuFilterCat('all');
            setIsMenuOpen(true);
          }}
        />

        {/* 3. Meet Our Experts Section */}
        <ExpertsSection
          chefs={chefs}
          onOpenReservation={() => setIsReservationOpen(true)}
        />

        {/* 4. Why People Choose us? Section */}
        <WhyChooseUsSection
          items={whyChooseUs}
          onOpenMenu={() => {
            setMenuFilterCat('all');
            setIsMenuOpen(true);
          }}
        />

        {/* 5. Customer Feedback Section */}
        <FeedbackSection
          testimonials={testimonials}
          onReviewAdded={handleReviewAdded}
        />
      </main>

      {/* Footer Section */}
      <Footer
        onOpenMenu={() => {
          setMenuFilterCat('all');
          setIsMenuOpen(true);
        }}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenOrderTracking={() => setIsOrderTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Full Menu Modal */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        menuItems={menuItems}
        categories={categories}
        initialCategory={menuFilterCat}
        onAddToCart={handleAddToCart}
      />

      {/* Cart & Checkout Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />

      {/* Order Success & Receipt Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={(order) => {
          setConfirmedOrder(null);
          setTrackingOrderId(order.id);
          setIsOrderTrackingOpen(true);
        }}
      />

      {/* Dedicated Live Order Tracking Modal */}
      {isOrderTrackingOpen && (
        <OrderTrackingModal
          orderId={trackingOrderId}
          initialOrder={confirmedOrder}
          onClose={() => setIsOrderTrackingOpen(false)}
          onOpenSupport={() => setIsSupportOpen(true)}
        />
      )}

      {/* Foodtuck Kitchen & Manager Admin Portal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItems}
        categories={categories}
        restaurantInfo={restaurantInfo}
        testimonials={testimonials}
        onRefreshData={loadData}
        onOpenOrderTracking={(orderId) => {
          setTrackingOrderId(orderId);
          setIsOrderTrackingOpen(true);
        }}
      />

      {/* Table Reservation Modal */}
      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Customer Support Drawer */}
      <SupportDrawer
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Live GraphQL API Explorer */}
      <GraphQLExplorerModal
        isOpen={isGraphQLOpen}
        onClose={() => setIsGraphQLOpen(false)}
      />
    </div>
  );
}
