import React, { useState, useEffect } from 'react';
import {
  X,
  RefreshCw,
  ShoppingBag,
  Calendar,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Star,
  CheckCircle2,
  Clock,
  Bike,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  Search,
  Filter,
  Check,
  Building2,
  Percent,
  ChefHat,
  Eye,
  FileSpreadsheet,
  IndianRupee,
  Users,
  Database,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Order,
  TableBooking,
  MenuItem,
  Category,
  RestaurantInfo,
  Testimonial,
} from '../types';
import {
  executeGraphQL,
  GET_ORDERS_QUERY,
  GET_ALL_TABLE_BOOKINGS_QUERY,
  UPDATE_ORDER_STATUS_MUTATION,
  ADVANCE_ORDER_STATUS_MUTATION,
  UPDATE_TABLE_BOOKING_STATUS_MUTATION,
  DELETE_TABLE_BOOKING_MUTATION,
  ADD_MENU_ITEM_MUTATION,
  UPDATE_MENU_ITEM_MUTATION,
  DELETE_MENU_ITEM_MUTATION,
  UPDATE_RESTAURANT_INFO_MUTATION,
  DELETE_REVIEW_MUTATION,
} from '../lib/graphqlClient';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  categories: Category[];
  restaurantInfo: RestaurantInfo | null;
  testimonials: Testimonial[];
  onRefreshData: () => Promise<void>;
  onOpenOrderTracking?: (orderId: string) => void;
}

type AdminTab = 'orders' | 'reservations' | 'menu' | 'analytics' | 'settings' | 'reviews';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  categories,
  restaurantInfo,
  testimonials,
  onRefreshData,
  onOpenOrderTracking,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Orders Filter & Search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  // Bookings Filter & Search
  const [bookingFilter, setBookingFilter] = useState<string>('ALL');
  const [bookingSearch, setBookingSearch] = useState('');
  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    guests: 2,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    seatingArea: 'ROOFTOP_CABANA',
    specialRequests: '',
  });

  // Menu Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('ALL');
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Form State for Add/Edit Dish
  const [dishForm, setDishForm] = useState({
    name: '',
    category: 'Grill & BBQ',
    categorySlug: 'fast-food',
    price: 349,
    calories: 380,
    prepTime: '15-20 mins',
    badge: 'Chef Special',
    description: '',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
    isSpicy: true,
    isVegan: false,
    isPopular: true,
    ingredientsStr: 'Fresh Indian Spices, Tandoor Marinade, Herbs',
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: restaurantInfo?.name || 'Foodtuck India',
    tagline: restaurantInfo?.tagline || 'Authentic Artisanal Kitchen & Dining',
    phone: restaurantInfo?.phone || '+91 80 4123 4567',
    email: restaurantInfo?.email || 'namaste@foodtuck.in',
    address: restaurantInfo?.address || '42 Gourmet Boulevard, 100ft Road, Indiranagar, Bengaluru - 560038',
    openingHours: restaurantInfo?.openingHours || 'Mon - Sun: 11:00 AM - 11:30 PM',
    deliveryNotice: restaurantInfo?.deliveryNotice || 'Express 30-min doorstep delivery across Bengaluru & Kolkata (Free on orders above ₹499)',
    fssaiNumber: restaurantInfo?.fssaiNumber || '11224333000582',
    gstNumber: restaurantInfo?.gstNumber || '29AABCF9812G1Z8',
  });

  // Load Admin Data (Orders & Bookings)
  const fetchOrdersAndBookings = async () => {
    setLoadingOrders(true);
    setLoadingBookings(true);
    try {
      const ordersData = await executeGraphQL<{ orders: Order[] }>(GET_ORDERS_QUERY);
      if (ordersData?.orders) {
        setOrders(ordersData.orders);
      }
      const bookingsData = await executeGraphQL<{ tableBookings: TableBooking[] }>(
        GET_ALL_TABLE_BOOKINGS_QUERY
      );
      if (bookingsData?.tableBookings) {
        setTableBookings(bookingsData.tableBookings);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingOrders(false);
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrdersAndBookings();
    }
  }, [isOpen]);

  useEffect(() => {
    if (restaurantInfo) {
      setSettingsForm({
        name: restaurantInfo.name,
        tagline: restaurantInfo.tagline,
        phone: restaurantInfo.phone,
        email: restaurantInfo.email,
        address: restaurantInfo.address,
        openingHours: restaurantInfo.openingHours,
        deliveryNotice: restaurantInfo.deliveryNotice,
        fssaiNumber: restaurantInfo.fssaiNumber || '11224333000582',
        gstNumber: restaurantInfo.gstNumber || '29AABCF9812G1Z8',
      });
    }
  }, [restaurantInfo]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Order Actions
  const handleAdvanceOrderStatus = async (orderId: string) => {
    setActionLoading(`order-${orderId}`);
    try {
      const res = await executeGraphQL<{ advanceOrderStatus: { success: boolean; message: string; order: Order } }>(
        ADVANCE_ORDER_STATUS_MUTATION,
        { id: orderId }
      );
      if (res?.advanceOrderStatus?.success) {
        showToast(res.advanceOrderStatus.message);
        await fetchOrdersAndBookings();
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to update order'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSetOrderStatus = async (orderId: string, newStatus: string) => {
    setActionLoading(`order-${orderId}`);
    try {
      const res = await executeGraphQL<{ updateOrderStatus: { success: boolean; message: string; order: Order } }>(
        UPDATE_ORDER_STATUS_MUTATION,
        { id: orderId, status: newStatus }
      );
      if (res?.updateOrderStatus?.success) {
        showToast(`Order #${orderId} status set to ${newStatus}`);
        await fetchOrdersAndBookings();
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to update order'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Table Booking Actions
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    setActionLoading(`booking-${bookingId}`);
    try {
      const res = await executeGraphQL<{ updateTableBookingStatus: { success: boolean; message: string; booking: TableBooking } }>(
        UPDATE_TABLE_BOOKING_STATUS_MUTATION,
        { id: bookingId, status: newStatus }
      );
      if (res?.updateTableBookingStatus?.success) {
        showToast(`Reservation #${bookingId} marked as ${newStatus}`);
        await fetchOrdersAndBookings();
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to update reservation'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm(`Are you sure you want to remove reservation #${bookingId}?`)) return;
    setActionLoading(`booking-del-${bookingId}`);
    try {
      await executeGraphQL(DELETE_TABLE_BOOKING_MUTATION, { id: bookingId });
      showToast(`Reservation #${bookingId} deleted.`);
      await fetchOrdersAndBookings();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to delete reservation'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateWalkInBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('new-booking');
    try {
      const query = `
        mutation BookTable($input: TableBookingInput!) {
          bookTable(input: $input) {
            success
            message
            booking {
              id
            }
          }
        }
      `;
      const res = await executeGraphQL(query, { input: newBookingData });
      if (res?.bookTable?.success) {
        showToast(`Reservation created successfully!`);
        setIsAddBookingOpen(false);
        setNewBookingData({
          name: '',
          phone: '',
          email: '',
          guests: 2,
          date: new Date().toISOString().split('T')[0],
          time: '19:30',
          seatingArea: 'ROOFTOP_CABANA',
          specialRequests: '',
        });
        await fetchOrdersAndBookings();
      }
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to create reservation'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Menu Dish Actions
  const handleOpenEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      category: dish.category,
      categorySlug: dish.categorySlug,
      price: dish.price,
      calories: dish.calories,
      prepTime: dish.prepTime,
      badge: dish.badge || '',
      description: dish.description,
      image: dish.image,
      isSpicy: !!dish.isSpicy,
      isVegan: !!dish.isVegan,
      isPopular: !!dish.isPopular,
      ingredientsStr: dish.ingredients.join(', '),
    });
    setIsAddDishModalOpen(true);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-dish');
    const ingredients = dishForm.ingredientsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: dishForm.name,
      category: dishForm.category,
      categorySlug: dishForm.categorySlug,
      price: Number(dishForm.price),
      calories: Number(dishForm.calories),
      prepTime: dishForm.prepTime,
      badge: dishForm.badge || null,
      description: dishForm.description,
      image: dishForm.image,
      isSpicy: dishForm.isSpicy,
      isVegan: dishForm.isVegan,
      isPopular: dishForm.isPopular,
      ingredients,
    };

    try {
      if (editingDish) {
        await executeGraphQL(UPDATE_MENU_ITEM_MUTATION, {
          id: editingDish.id,
          input: payload,
        });
        showToast(`Dish "${payload.name}" updated successfully!`);
      } else {
        await executeGraphQL(ADD_MENU_ITEM_MUTATION, {
          input: payload,
        });
        showToast(`New dish "${payload.name}" added to menu!`);
      }
      setIsAddDishModalOpen(false);
      setEditingDish(null);
      await onRefreshData();
    } catch (err: any) {
      showToast(`Failed: ${err?.message || 'Error saving dish'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteDish = async (dishId: string, dishName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${dishName}" from the menu?`)) return;
    setActionLoading(`del-dish-${dishId}`);
    try {
      await executeGraphQL(DELETE_MENU_ITEM_MUTATION, { id: dishId });
      showToast(`Dish "${dishName}" removed from menu.`);
      await onRefreshData();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to delete dish'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Restaurant Settings Actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('save-settings');
    try {
      await executeGraphQL(UPDATE_RESTAURANT_INFO_MUTATION, {
        input: settingsForm,
      });
      showToast('Restaurant details & GSTIN/FSSAI compliance saved successfully!');
      await onRefreshData();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to update settings'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Review Actions
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Delete this customer review?')) return;
    setActionLoading(`del-rev-${reviewId}`);
    try {
      await executeGraphQL(DELETE_REVIEW_MUTATION, { id: reviewId });
      showToast('Review removed.');
      await onRefreshData();
    } catch (err: any) {
      showToast(`Error: ${err?.message || 'Failed to remove review'}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Calculations for KPI and Analytics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'CANCELLED' ? ord.total : 0), 0);
  const activeOrdersCount = orders.filter((ord) => ord.status === 'RECEIVED' || ord.status === 'PREPARING' || ord.status === 'OUT_FOR_DELIVERY').length;
  const completedOrdersCount = orders.filter((ord) => ord.status === 'DELIVERED' || ord.status === 'READY').length;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const confirmedReservationsCount = tableBookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'SEATED').length;

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'ALL' || ord.status === orderStatusFilter;
    const matchesSearch =
      ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered Bookings
  const filteredBookings = tableBookings.filter((b) => {
    const matchesStatus = bookingFilter === 'ALL' || b.status === bookingFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.phone.includes(bookingSearch);
    return matchesStatus && matchesSearch;
  });

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((dish) => {
    const matchesCategory = menuCategoryFilter === 'ALL' || dish.categorySlug === menuCategoryFilter;
    const matchesSearch =
      dish.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-1 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-7xl h-[96vh] sm:h-[92vh] max-h-[920px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200"
        >
          {/* Admin Header */}
          <div className="bg-neutral-900 text-white px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 border-b border-neutral-800">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#C93B13] flex items-center justify-center text-white shadow-md shrink-0">
                <ChefHat className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                  <h2 className="font-display font-black text-sm sm:text-lg md:text-xl tracking-tight text-white uppercase truncate">
                    Kitchen & Admin Portal
                  </h2>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] sm:text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE GRAPHQL
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-mono text-[9px] sm:text-[10px] font-bold border border-emerald-600/40 flex items-center gap-1 shrink-0">
                    <Database className="w-2.5 h-2.5 text-emerald-400" />
                    ATLAS CLUSTER0
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-400 truncate hidden xs:block">
                  {restaurantInfo?.name || 'Food.Spice'} &bull; Indiranagar, Bengaluru &bull; GST: {restaurantInfo?.gstNumber || '29AABCF9812G1Z8'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={fetchOrdersAndBookings}
                disabled={loadingOrders || loadingBookings}
                title="Sync from GraphQL Database"
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700 disabled:opacity-50 min-h-[34px]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Data</span>
              </button>

              <button
                onClick={onClose}
                aria-label="Close Admin Panel"
                className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer min-h-[34px] min-w-[34px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="bg-neutral-50 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-neutral-200 flex items-center justify-between overflow-x-auto gap-3 sm:gap-4 shrink-0 text-xs scrollbar-none">
            <div className="flex items-center gap-4 sm:gap-6 divide-x divide-neutral-200 shrink-0">
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-orange-100 text-[#C93B13] flex items-center justify-center font-bold">
                  <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold block uppercase">Total Revenue</span>
                  <strong className="text-neutral-900 text-xs sm:text-sm font-black">₹{totalRevenue.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="pl-4 sm:pl-6 flex items-center gap-2 sm:gap-2.5 shrink-0">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold block uppercase">Active Orders</span>
                  <strong className="text-blue-700 text-xs sm:text-sm font-black">{activeOrdersCount} in Prep/Transit</strong>
                </div>
              </div>

              <div className="pl-4 sm:pl-6 flex items-center gap-2 sm:gap-2.5 shrink-0">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold block uppercase">Bookings</span>
                  <strong className="text-emerald-700 text-xs sm:text-sm font-black">{confirmedReservationsCount} Active</strong>
                </div>
              </div>

              <div className="pl-4 sm:pl-6 flex items-center gap-2 sm:gap-2.5 shrink-0">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold block uppercase">Menu Dishes</span>
                  <strong className="text-neutral-900 text-xs sm:text-sm font-black">{menuItems.length} Dishes</strong>
                </div>
              </div>
            </div>

            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-emerald-600 text-white text-[11px] sm:text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{notification}</span>
              </motion.div>
            )}
          </div>

          {/* Navigation Tabs Bar */}
          <div className="px-3 sm:px-6 border-b border-neutral-200 bg-white flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[42px] ${
                activeTab === 'orders'
                  ? 'border-[#C93B13] text-[#C93B13]'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Live Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[42px] ${
                activeTab === 'reservations'
                  ? 'border-[#C93B13] text-[#C93B13]'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Table Bookings ({tableBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[42px] ${
                activeTab === 'menu'
                  ? 'border-[#C93B13] text-[#C93B13]'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Menu Catalog ({menuItems.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[42px] ${
                activeTab === 'analytics'
                  ? 'border-[#C93B13] text-[#C93B13]'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sales & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[42px] ${
                activeTab === 'settings'
                  ? 'border-[#C93B13] text-[#C93B13]'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Restaurant & Compliance</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-xs border-b-2 flex items-center gap-1.5 sm:gap-2 transition-colors cursor-pointer whitespace-nowrap min-h-[42px] ${
                activeTab === 'reviews'
                  ? 'border-[#C93B13] text-[#C93B13]'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Diner Feedback ({testimonials.length})</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-neutral-50/50">
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md bg-white px-3 py-2 rounded-xl border border-neutral-200 shadow-xs">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer Name, Phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                    {orderSearch && (
                      <button onClick={() => setOrderSearch('')} className="text-neutral-400 hover:text-neutral-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {['ALL', 'RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'READY', 'DELIVERED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                          orderStatusFilter === st
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {st === 'ALL' ? 'All Orders' : st.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List / Grid */}
                {filteredOrders.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8">
                    <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-800 text-sm">No orders matching criteria</h3>
                    <p className="text-xs text-neutral-500 mt-1">Orders placed from the website will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredOrders.map((ord) => {
                      const isAction = actionLoading === `order-${ord.id}`;
                      const isDelivered = ord.status === 'DELIVERED';

                      return (
                        <div
                          key={ord.id}
                          className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
                        >
                          <div>
                            {/* Order Header */}
                            <div className="flex items-start justify-between gap-2 pb-3 border-b border-neutral-100">
                              <div>
                                <div className="flex items-center gap-2">
                                  <strong className="font-mono text-sm text-neutral-900">{ord.id}</strong>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                      ord.orderType === 'DELIVERY'
                                        ? 'bg-orange-100 text-orange-800'
                                        : ord.orderType === 'DINE_IN'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {ord.orderType === 'DINE_IN' ? `DINE-IN (${ord.tableNumber || 'TBL'})` : ord.orderType}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-600 mt-0.5">
                                  <strong className="text-neutral-900">{ord.customerName}</strong> &bull; {ord.customerPhone}
                                </p>
                              </div>

                              <div className="text-right">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                                    ord.status === 'RECEIVED'
                                      ? 'bg-amber-100 text-amber-900 animate-pulse'
                                      : ord.status === 'PREPARING'
                                      ? 'bg-purple-100 text-purple-900'
                                      : ord.status === 'OUT_FOR_DELIVERY' || ord.status === 'READY'
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'bg-emerald-100 text-emerald-900'
                                  }`}
                                >
                                  {ord.status.replace(/_/g, ' ')}
                                </span>
                                <span className="block text-[10px] text-neutral-400 mt-1">
                                  {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>

                            {/* Order Items Summary */}
                            <div className="py-3 space-y-1.5 text-xs text-neutral-700">
                              {ord.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                  <span>
                                    <strong className="text-neutral-900 font-bold">{it.quantity}x</strong> {it.name}
                                    {it.selectedSauce && (
                                      <span className="text-[10px] text-[#C93B13] ml-1.5 font-medium">
                                        ({it.selectedSauce})
                                      </span>
                                    )}
                                  </span>
                                  <span className="font-semibold text-neutral-900">₹{(it.price * it.quantity).toFixed(0)}</span>
                                </div>
                              ))}
                            </div>

                            {/* Address if Delivery */}
                            {ord.deliveryAddress && (
                              <div className="p-2 rounded-xl bg-neutral-50 text-[11px] text-neutral-600 mb-3 border border-neutral-100 flex items-start gap-1.5">
                                <Bike className="w-3.5 h-3.5 text-[#C93B13] shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{ord.deliveryAddress}</span>
                              </div>
                            )}
                          </div>

                          {/* Order Footer & Actions */}
                          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Bill Total</span>
                              <strong className="text-sm font-black text-[#C93B13]">₹{ord.total.toFixed(2)}</strong>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Open Tracking View */}
                              {onOpenOrderTracking && (
                                <button
                                  onClick={() => onOpenOrderTracking(ord.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Live View</span>
                                </button>
                              )}

                              {/* Manual Status Dropdown */}
                              <select
                                value={ord.status}
                                onChange={(e) => handleSetOrderStatus(ord.id, e.target.value)}
                                disabled={isAction}
                                className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer"
                              >
                                <option value="RECEIVED">Received</option>
                                <option value="PREPARING">In Kitchen</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="READY">Ready at Counter</option>
                                <option value="DELIVERED">Delivered / Done</option>
                              </select>

                              {/* Quick Advance Button */}
                              {!isDelivered && (
                                <button
                                  onClick={() => handleAdvanceOrderStatus(ord.id)}
                                  disabled={isAction}
                                  className="px-3 py-1.5 rounded-lg bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 shadow-xs"
                                >
                                  {isAction ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5" />
                                  )}
                                  <span>Next Step</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. RESERVATIONS TAB */}
            {activeTab === 'reservations' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md bg-white px-3 py-2 rounded-xl border border-neutral-200 shadow-xs">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search Guest Name, Phone, ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-neutral-200">
                      {['ALL', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingFilter(st)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            bookingFilter === st ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsAddBookingOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Walk-In Table</span>
                    </button>
                  </div>
                </div>

                {/* Table Reservations Grid */}
                {filteredBookings.length === 0 ? (
                  <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 p-8">
                    <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <h3 className="font-bold text-neutral-800 text-sm">No reservations found</h3>
                    <p className="text-xs text-neutral-500 mt-1">Direct bookings will show here with real-time status management.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBookings.map((b) => {
                      const isAction = actionLoading?.includes(b.id);

                      return (
                        <div
                          key={b.id}
                          className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-100">
                              <div>
                                <span className="font-mono text-xs font-bold text-neutral-900 block">{b.id}</span>
                                <strong className="text-sm font-extrabold text-neutral-900 block">{b.name}</strong>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  b.status === 'CONFIRMED'
                                    ? 'bg-blue-100 text-blue-900'
                                    : b.status === 'SEATED'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : b.status === 'COMPLETED'
                                    ? 'bg-neutral-100 text-neutral-800'
                                    : 'bg-red-100 text-red-900'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>

                            <div className="py-2.5 space-y-1.5 text-xs text-neutral-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[#C93B13]" />
                                <span>
                                  <strong>Date:</strong> {b.date} &bull; <strong>Time:</strong> {b.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-[#C93B13]" />
                                <span>
                                  <strong>Party:</strong> {b.guests} Guests &bull; {b.seatingArea.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                <strong>Phone:</strong> {b.phone} | {b.email}
                              </div>
                              {b.specialRequests && (
                                <p className="p-2 rounded-lg bg-orange-50/70 border border-orange-100 text-[11px] text-orange-900 mt-1">
                                  <strong>Note:</strong> {b.specialRequests}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5">
                              {b.status !== 'SEATED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'SEATED')}
                                  disabled={isAction}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Seat Guests
                                </button>
                              )}
                              {b.status === 'SEATED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'COMPLETED')}
                                  disabled={isAction}
                                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  Mark Completed
                                </button>
                              )}
                              {b.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                                  disabled={isAction}
                                  className="px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>

                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              disabled={isAction}
                              className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 3. MENU & DISHES CATALOG TAB */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md bg-white px-3 py-2 rounded-xl border border-neutral-200 shadow-xs">
                    <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search dish name, description, ingredients..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full text-xs bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={menuCategoryFilter}
                      onChange={(e) => setMenuCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL">All Categories ({categories.length})</option>
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        setEditingDish(null);
                        setDishForm({
                          name: '',
                          category: 'Grill & BBQ',
                          categorySlug: 'fast-food',
                          price: 349,
                          calories: 380,
                          prepTime: '15-20 mins',
                          badge: 'Chef Special',
                          description: '',
                          image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80',
                          isSpicy: true,
                          isVegan: false,
                          isPopular: true,
                          ingredientsStr: 'Fresh Indian Spices, Tandoori Yogurt, Kasuri Methi',
                        });
                        setIsAddDishModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Dish</span>
                    </button>
                  </div>
                </div>

                {/* Dishes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMenuItems.map((dish) => {
                    const isAction = actionLoading?.includes(dish.id);

                    return (
                      <div
                        key={dish.id}
                        className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="relative h-36 bg-neutral-100">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {dish.badge && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#C93B13] text-white text-[10px] font-bold shadow-xs">
                              {dish.badge}
                            </span>
                          )}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            {dish.isVegan ? (
                              <span className="w-4 h-4 rounded bg-white border border-emerald-600 flex items-center justify-center" title="Pure Veg">
                                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded bg-white border border-red-700 flex items-center justify-center" title="Non Veg">
                                <span className="w-1.5 h-1.5 rounded-xs bg-red-700 rotate-45" />
                              </span>
                            )}
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/75 text-white text-xs font-black backdrop-blur-xs">
                            ₹{dish.price}
                          </span>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                              {dish.category}
                            </span>
                            <h4 className="font-bold text-xs text-neutral-900 mt-0.5 line-clamp-1">{dish.name}</h4>
                            <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                              {dish.description}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                            <span className="text-[10px] text-neutral-400 font-mono">{dish.prepTime}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditDish(dish)}
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                                title="Edit Dish"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteDish(dish.id, dish.name)}
                                disabled={isAction}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                title="Delete Dish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SALES & ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Sales</span>
                    <strong className="text-2xl font-black text-neutral-900 mt-1 block">₹{totalRevenue.toLocaleString('en-IN')}</strong>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +18.4% this month
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Orders</span>
                    <strong className="text-2xl font-black text-neutral-900 mt-1 block">{orders.length}</strong>
                    <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
                      {completedOrdersCount} Delivered &bull; {activeOrdersCount} in progress
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Avg. Order Value</span>
                    <strong className="text-2xl font-black text-[#C93B13] mt-1 block">₹{avgOrderValue.toFixed(0)}</strong>
                    <span className="text-[11px] text-neutral-500 font-medium mt-1 block">Per ticket average</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Table Diners</span>
                    <strong className="text-2xl font-black text-neutral-900 mt-1 block">
                      {tableBookings.reduce((sum, b) => sum + b.guests, 0)} Guests
                    </strong>
                    <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
                      {tableBookings.length} total bookings recorded
                    </span>
                  </div>
                </div>

                {/* Orders Breakdown by Channel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-neutral-900">Order Channel Breakdown</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Express Delivery (30 mins)</span>
                          <span>{orders.filter((o) => o.orderType === 'DELIVERY').length} orders ({Math.round((orders.filter((o) => o.orderType === 'DELIVERY').length / (orders.length || 1)) * 100)}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full bg-[#C93B13] rounded-full" style={{ width: `${(orders.filter((o) => o.orderType === 'DELIVERY').length / (orders.length || 1)) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Dine-In Table Orders</span>
                          <span>{orders.filter((o) => o.orderType === 'DINE_IN').length} orders</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(orders.filter((o) => o.orderType === 'DINE_IN').length / (orders.length || 1)) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span>Takeaway / Parcel</span>
                          <span>{orders.filter((o) => o.orderType === 'TAKEOUT').length} orders</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${(orders.filter((o) => o.orderType === 'TAKEOUT').length / (orders.length || 1)) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                    <h4 className="font-bold text-sm text-neutral-900">Statutory & Operational Status</h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-neutral-600">FSSAI License Status</span>
                        <strong className="text-emerald-600 font-bold">✓ Active ({restaurantInfo?.fssaiNumber || '11224333000582'})</strong>
                      </div>
                      <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-neutral-600">GSTIN Registered</span>
                        <strong className="text-neutral-900 font-mono">{restaurantInfo?.gstNumber || '29AABCF9812G1Z8'}</strong>
                      </div>
                      <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-neutral-600">Free Delivery Threshold</span>
                        <strong className="text-[#C93B13] font-bold">Orders &gt; ₹499 (Standard fee ₹40)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. RESTAURANT SETTINGS & COMPLIANCE TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-3xl space-y-5">
                {/* MongoDB Atlas Database Info Card */}
                <div className="bg-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-800/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">MongoDB Atlas Cloud Database</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-400/30">
                          Active & Connected
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/80 mt-0.5">
                        Cluster: <code className="text-emerald-100 bg-emerald-900/80 px-1.5 py-0.5 rounded">Cluster0 (ReplicaSet)</code> &bull; DB: <code className="text-emerald-100 bg-emerald-900/80 px-1.5 py-0.5 rounded">foodtuck</code> &bull; User: <code className="text-emerald-100 bg-emerald-900/80 px-1.5 py-0.5 rounded">ugcsetup_db_user</code>
                      </p>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-300/80 font-mono bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/50 shrink-0">
                    SSL ReplicaSet Active
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
                  <div>
                    <h3 className="font-bold text-base text-neutral-900">Restaurant Details & Statutory Compliance</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Updates will sync across the customer receipts, footer, and GraphQL queries.
                    </p>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Phone Number (+91)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Support Email</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Full Restaurant Address</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">FSSAI License Number</label>
                    <input
                      type="text"
                      value={settingsForm.fssaiNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fssaiNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={settingsForm.gstNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, gstNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono uppercase focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={settingsForm.openingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Delivery Notice Banner</label>
                    <textarea
                      rows={2}
                      value={settingsForm.deliveryNotice}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryNotice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={actionLoading === 'save-settings'}
                    className="px-6 py-2.5 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-bold shadow-md transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === 'save-settings' ? 'Saving Settings...' : 'Save & Publish Changes'}
                  </button>
                </div>
              </form>
            </div>
            )}

            {/* 6. DINER REVIEWS & FEEDBACK TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">Diner Reviews & Ratings</h3>
                    <p className="text-xs text-neutral-500">Live testimonials submitted by customers on the website.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    ★ 4.9 Average Rating
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={t.avatar}
                              alt={t.name}
                              className="w-8 h-8 rounded-full border border-neutral-200"
                            />
                            <div>
                              <strong className="text-xs font-bold text-neutral-900 block">{t.name}</strong>
                              <span className="text-[10px] text-neutral-400">{t.role}</span>
                            </div>
                          </div>
                          <div className="flex text-amber-500 text-xs">
                            {'★'.repeat(t.rating)}
                          </div>
                        </div>

                        <p className="text-xs text-neutral-600 italic leading-relaxed">
                          &ldquo;{t.comment}&rdquo;
                        </p>

                        {t.favoriteItem && (
                          <span className="inline-block mt-2 text-[10px] font-semibold text-[#C93B13] bg-orange-50 px-2 py-0.5 rounded-md">
                            Favorite: {t.favoriteItem}
                          </span>
                        )}
                      </div>

                      <div className="pt-2.5 mt-2.5 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                        <span>{t.date}</span>
                        <button
                          onClick={() => handleDeleteReview(t.id)}
                          className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modal for Add / Edit Dish */}
        {isAddDishModalOpen && (
          <div className="fixed inset-0 z-60 overflow-hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <h3 className="font-bold text-base text-neutral-900">
                  {editingDish ? `Edit Dish: ${editingDish.name}` : 'Add New Dish to Menu'}
                </h3>
                <button onClick={() => setIsAddDishModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmiri Dum Aloo"
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Category</label>
                    <select
                      value={dishForm.categorySlug}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.slug === e.target.value);
                        setDishForm({
                          ...dishForm,
                          categorySlug: e.target.value,
                          category: cat ? cat.name : 'Curries & Specialties',
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={dishForm.price}
                      onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Prep Time</label>
                    <input
                      type="text"
                      placeholder="15-20 mins"
                      value={dishForm.prepTime}
                      onChange={(e) => setDishForm({ ...dishForm, prepTime: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Badge</label>
                    <input
                      type="text"
                      placeholder="Chef Special / Best Seller"
                      value={dishForm.badge}
                      onChange={(e) => setDishForm({ ...dishForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={dishForm.image}
                    onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Crispy spiced chicken wings coated in house special glaze..."
                    value={dishForm.description}
                    onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={dishForm.ingredientsStr}
                    onChange={(e) => setDishForm({ ...dishForm, ingredientsStr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishForm.isVegan}
                      onChange={(e) => setDishForm({ ...dishForm, isVegan: e.target.checked })}
                      className="rounded text-[#C93B13]"
                    />
                    <span>100% Pure Vegetarian</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dishForm.isSpicy}
                      onChange={(e) => setDishForm({ ...dishForm, isSpicy: e.target.checked })}
                      className="rounded text-[#C93B13]"
                    />
                    <span>Spicy Hot Dish</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsAddDishModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'save-dish'}
                    className="px-5 py-2 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === 'save-dish' ? 'Saving Dish...' : 'Save to Menu'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal for Walk-in Table Reservation */}
        {isAddBookingOpen && (
          <div className="fixed inset-0 z-60 overflow-hidden flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                <h3 className="font-bold text-base text-neutral-900">Direct Walk-In Table Booking</h3>
                <button onClick={() => setIsAddBookingOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWalkInBooking} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Guest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Guest Name"
                    value={newBookingData.name}
                    onChange={(e) => setNewBookingData({ ...newBookingData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Phone (+91)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98450 12345"
                      value={newBookingData.phone}
                      onChange={(e) => setNewBookingData({ ...newBookingData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Guests</label>
                    <input
                      type="number"
                      min={1}
                      max={25}
                      required
                      value={newBookingData.guests}
                      onChange={(e) => setNewBookingData({ ...newBookingData, guests: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newBookingData.date}
                      onChange={(e) => setNewBookingData({ ...newBookingData, date: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={newBookingData.time}
                      onChange={(e) => setNewBookingData({ ...newBookingData, time: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Seating Area</label>
                  <select
                    value={newBookingData.seatingArea}
                    onChange={(e) => setNewBookingData({ ...newBookingData, seatingArea: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  >
                    <option value="ROOFTOP_CABANA">Rooftop Cabana & View</option>
                    <option value="MAIN_HALL">Main Dining Hall</option>
                    <option value="GARDEN_PATIO">Garden Open-Air Patio</option>
                    <option value="PRIVATE_DINING">Private Chef&apos;s Room</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsAddBookingOpen(false)}
                    className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'new-booking'}
                    className="px-5 py-2 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === 'new-booking' ? 'Booking...' : 'Confirm Table'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
