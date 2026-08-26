import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  MapPin,
  Phone,
  RefreshCw,
  FastForward,
  Utensils,
  Search,
  Printer,
  HelpCircle,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';
import {
  executeGraphQL,
  GET_ORDER_QUERY,
  GET_ORDERS_QUERY,
  UPDATE_ORDER_STATUS_MUTATION,
  ADVANCE_ORDER_STATUS_MUTATION,
} from '../lib/graphqlClient';

interface OrderTrackingModalProps {
  orderId?: string | null;
  initialOrder?: Order | null;
  onClose: () => void;
  onOpenSupport?: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  orderId,
  initialOrder,
  onClose,
  onOpenSupport,
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder || null);
  const [activeOrderId, setActiveOrderId] = useState<string>(orderId || initialOrder?.id || 'ORD-9481');
  const [searchInput, setSearchInput] = useState<string>('');
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Fetch available orders and active order on mount or ID change
  useEffect(() => {
    fetchOrdersList();
  }, []);

  useEffect(() => {
    if (activeOrderId) {
      fetchOrderById(activeOrderId);
    }
  }, [activeOrderId]);

  const fetchOrdersList = async () => {
    try {
      const res = await executeGraphQL<{ orders: Order[] }>(GET_ORDERS_QUERY);
      if (res?.orders && res.orders.length > 0) {
        setAvailableOrders(res.orders);
        if (!currentOrder && !orderId) {
          setActiveOrderId(res.orders[0].id);
          setCurrentOrder(res.orders[0]);
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch orders list:', err);
    }
  };

  const fetchOrderById = async (id: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await executeGraphQL<{ order: Order }>(GET_ORDER_QUERY, { id });
      if (res?.order) {
        setCurrentOrder(res.order);
      } else {
        setErrorMessage(`No order found matching ID #${id}`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to fetch order #${id}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = searchInput.trim().toUpperCase();
    if (!cleanId) return;
    setActiveOrderId(cleanId.startsWith('ORD-') ? cleanId : `ORD-${cleanId}`);
  };

  const handleAdvanceStatus = async () => {
    if (!currentOrder) return;
    try {
      setIsAdvancing(true);
      setStatusMessage(null);
      const res = await executeGraphQL<{ advanceOrderStatus: { success: boolean; message: string; order: Order } }>(
        ADVANCE_ORDER_STATUS_MUTATION,
        { id: currentOrder.id }
      );
      if (res?.advanceOrderStatus?.success && res.advanceOrderStatus.order) {
        setCurrentOrder(res.advanceOrderStatus.order);
        setStatusMessage(res.advanceOrderStatus.message);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update order status.');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleSetSpecificStatus = async (status: string) => {
    if (!currentOrder) return;
    try {
      setIsAdvancing(true);
      const res = await executeGraphQL<{ updateOrderStatus: { success: boolean; message: string; order: Order } }>(
        UPDATE_ORDER_STATUS_MUTATION,
        { id: currentOrder.id, status }
      );
      if (res?.updateOrderStatus?.success && res.updateOrderStatus.order) {
        setCurrentOrder(res.updateOrderStatus.order);
        setStatusMessage(`Status set to ${status}`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to set status.');
    } finally {
      setIsAdvancing(false);
    }
  };

  // Timeline Steps Calculation
  const isDelivery = currentOrder?.orderType === 'DELIVERY';
  const isDineIn = currentOrder?.orderType === 'DINE_IN';

  const steps = [
    {
      key: 'RECEIVED',
      label: 'Order Confirmed',
      sublabel: 'Kitchen ticket queued in GraphQL',
      icon: CheckCircle2,
      time: 'Just now',
    },
    {
      key: 'PREPARING',
      label: 'Master Chef Cooking',
      sublabel: 'Artisan grilling & signature seasoning',
      icon: ChefHat,
      time: currentOrder?.status === 'RECEIVED' ? 'Pending' : 'In Progress',
    },
    {
      key: isDelivery ? 'OUT_FOR_DELIVERY' : 'READY',
      label: isDelivery ? 'Out for Delivery' : isDineIn ? 'Plating & Table Service' : 'Ready at Pickup Counter',
      sublabel: isDelivery ? 'Courier en route to your location' : 'Hot & fresh ready to serve',
      icon: isDelivery ? Bike : Utensils,
      time: ['OUT_FOR_DELIVERY', 'READY', 'DELIVERED'].includes(currentOrder?.status || '') ? 'Active' : 'Estimated 15m',
    },
    {
      key: 'DELIVERED',
      label: isDelivery ? 'Delivered' : 'Served & Enjoyed',
      sublabel: 'Bon Appétit! Thank you for choosing Foodtuck',
      icon: PackageCheck,
      time: currentOrder?.status === 'DELIVERED' ? 'Completed' : 'Final Step',
    },
  ];

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'RECEIVED':
        return 0;
      case 'PREPARING':
        return 1;
      case 'OUT_FOR_DELIVERY':
      case 'READY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentOrder?.status);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-neutral-100 relative my-6 max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#C93B13] flex items-center justify-center shadow-xs">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-lg sm:text-xl text-neutral-900 leading-none">
                  Live Order Tracking
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Real-time kitchen preparation & delivery dispatcher
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-order-tracking-btn"
              type="button"
              onClick={() => fetchOrderById(activeOrderId)}
              disabled={isLoading}
              title="Refresh GraphQL Status"
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#C93B13]' : ''}`} />
            </button>
            <button
              id="close-order-tracking-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-5 pt-4">
          {/* Order Search / Quick Switch Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-order-id-input"
                type="text"
                placeholder="Search Order ID (e.g. ORD-9481)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-20 py-2 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#C93B13]"
              />
              <button
                id="search-order-btn"
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-[11px] font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg cursor-pointer"
              >
                Track
              </button>
            </form>

            {availableOrders.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0">
                <span className="text-[11px] font-medium hidden sm:inline">Recent:</span>
                <select
                  id="select-recent-order"
                  value={activeOrderId}
                  onChange={(e) => setActiveOrderId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-[#C93B13] cursor-pointer"
                >
                  {availableOrders.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      #{ord.id} ({ord.customerName})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {currentOrder ? (
            <>
              {/* Order Info & Estimated Time Hero Card */}
              <div className="bg-linear-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-[#C93B13]/20 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/80 border border-orange-500/30 px-2 py-0.5 rounded-md">
                        #{currentOrder.id}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-300">
                        {currentOrder.orderType}
                      </span>
                    </div>
                    <h4 className="font-display font-extrabold text-xl text-white mt-1">
                      {currentOrder.customerName}
                    </h4>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate max-w-[280px]">
                        {currentOrder.deliveryAddress || (currentOrder.tableNumber ? `Table: ${currentOrder.tableNumber}` : 'Takeout Counter')}
                      </span>
                    </p>
                  </div>

                  <div className="sm:text-right bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 shrink-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300 block flex items-center gap-1 sm:justify-end">
                      <Clock className="w-3 h-3 text-orange-400" />
                      Estimated Ready Time
                    </span>
                    <span className="font-display font-black text-xl text-orange-400 block">
                      {currentOrder.estimatedTime}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Status: <strong className="text-white capitalize">{currentOrder.status.replace(/_/g, ' ').toLowerCase()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Multi-Step Timeline */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-700">
                    Preparation & Delivery Milestones
                  </h4>
                  <span className="text-[11px] font-bold text-[#C93B13]">
                    Step {currentStepIdx + 1} of {steps.length}
                  </span>
                </div>

                {/* Progress Bar Line */}
                <div className="relative w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="h-full bg-[#C93B13] rounded-full"
                  />
                </div>

                {/* Stepper Node List */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const StepIcon = step.icon;

                    return (
                      <div
                        key={step.key}
                        className={`p-3 rounded-xl transition-all border ${
                          isCurrent
                            ? 'bg-orange-50/70 border-[#C93B13] shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-white border-neutral-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? 'bg-[#C93B13] text-white animate-pulse shadow-xs'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent
                                ? 'text-[#C93B13]'
                                : isCompleted
                                ? 'text-emerald-700'
                                : 'text-neutral-500'
                            }`}
                          >
                            {isCurrent ? 'Current' : isCompleted ? 'Completed' : 'Upcoming'}
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <StepIcon
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              isCurrent
                                ? 'text-[#C93B13]'
                                : isCompleted
                                ? 'text-emerald-600'
                                : 'text-neutral-400'
                            }`}
                          />
                          <div>
                            <span className="font-bold text-xs text-neutral-900 block leading-tight">
                              {step.label}
                            </span>
                            <span className="text-[10px] text-neutral-500 block leading-tight mt-0.5">
                              {step.sublabel}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Courier / Kitchen Station Details */}
              {isDelivery ? (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Assigned Foodtuck Courier
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Active On Route
                    </span>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                          alt="Courier Marcus"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-neutral-900">Ramesh Kumar</span>
                          <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            ★ 4.95 (3,400+ trips)
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Vehicle: <strong className="text-neutral-700">Foodtuck Express EV #24</strong> &bull; Thermal insulated tiffin bag
                        </p>
                      </div>
                    </div>

                    <a
                      href="tel:+919845012345"
                      className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C93B13]" />
                      <span>Call Courier (+91)</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      {isDineIn ? 'Table Dining Service' : 'Express Pickup Counter'}
                    </span>
                    <span className="text-[11px] text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded-md">
                      Chef Station #1
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    {isDineIn
                      ? `Your food will be served directly to ${currentOrder.tableNumber || 'your reserved table'} by our floor staff.`
                      : 'Please show your Order ID ticket at the Foodtuck Pickup counter once the status turns ready!'}
                  </p>
                </div>
              )}

              {/* Order Items Breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-xs font-bold text-neutral-800">
                    Order Items ({currentOrder.items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    Total: <strong className="text-[#C93B13] font-black">₹{currentOrder.total.toFixed(2)}</strong>
                  </span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 bg-neutral-200 px-1.5 py-0.5 rounded text-[11px]">
                          {item.quantity}x
                        </span>
                        <div>
                          <span className="font-semibold text-neutral-900">{item.name}</span>
                          {item.selectedSauce && (
                            <span className="block text-[10px] text-[#C93B13] font-medium">
                              Chutney: {item.selectedSauce}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-neutral-900">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Status Simulation Controls */}
              <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-orange-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C93B13]" />
                    Interactive Status Simulator (Test in Real-Time):
                  </span>
                  <button
                    id="advance-status-step-btn"
                    type="button"
                    disabled={isAdvancing}
                    onClick={handleAdvanceStatus}
                    className="px-3 py-1.5 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-[11px] font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <FastForward className={`w-3.5 h-3.5 ${isAdvancing ? 'animate-spin' : ''}`} />
                    <span>Advance Next Stage</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] text-neutral-500 font-semibold">Jump to status:</span>
                  {(['RECEIVED', 'PREPARING', isDelivery ? 'OUT_FOR_DELIVERY' : 'READY', 'DELIVERED'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleSetSpecificStatus(st)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          currentOrder.status === st
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center space-y-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
              <h4 className="font-display font-bold text-sm text-neutral-800">
                No Order Selected
              </h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Please enter a valid Order ID (e.g., ORD-9481) or place a new order to begin tracking in real-time.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenSupport && (
              <button
                id="tracking-contact-support-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSupport();
                }}
                className="px-3.5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#C93B13]" />
                <span>Need Help?</span>
              </button>
            )}
            <button
              id="tracking-print-receipt-btn"
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer hidden sm:flex"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-600" />
              <span>Print Ticket</span>
            </button>
          </div>

          <button
            id="close-order-tracking-bottom-btn"
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </motion.div>
    </div>
  );
};
