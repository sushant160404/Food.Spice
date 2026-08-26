import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Utensils, Bike } from 'lucide-react';
import { CartItem, Order } from '../types';
import { executeGraphQL, CREATE_ORDER_MUTATION } from '../lib/graphqlClient';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}) => {
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEOUT' | 'DINE_IN'>('DELIVERY');
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [customerEmail, setCustomerEmail] = useState('aarav.sharma@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98450 12345');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 402, Shanti Niketan, 12th Main, Indiranagar, Bengaluru - 560038');
  const [tableNumber, setTableNumber] = useState('Table 7');
  const [couponCode, setCouponCode] = useState('DESI25');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('DESI25');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD'>('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const discount = appliedCoupon ? +(subtotal * 0.25).toFixed(2) : 0;
  const deliveryFee = orderType === 'DELIVERY' && subtotal < 499 && subtotal > 0 ? 40 : 0;
  const total = +(subtotal - discount + deliveryFee).toFixed(2);

  const applyPromo = () => {
    const code = couponCode.toUpperCase().trim();
    if (code.includes('25') || code === 'DESI25' || code === 'FOODSPICE25' || code === 'FOODTUCK25') {
      setAppliedCoupon(code);
      setErrorMsg(null);
    } else if (code.includes('50') || code === 'INDIA50') {
      setAppliedCoupon(code);
      setErrorMsg(null);
    } else {
      setErrorMsg('Invalid promo code. Try "DESI25" for 25% off.');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const itemsInput = cart.map((item) => ({
        menuItemId: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        selectedSauce: item.selectedSauce,
        specialInstructions: item.specialInstructions,
      }));

      const res = await executeGraphQL<{
        createOrder: {
          success: boolean;
          message: string;
          order: Order;
        };
      }>(CREATE_ORDER_MUTATION, {
        input: {
          customerName,
          customerEmail,
          customerPhone,
          orderType,
          tableNumber: orderType === 'DINE_IN' ? tableNumber : undefined,
          deliveryAddress: orderType === 'DELIVERY' ? deliveryAddress : undefined,
          items: itemsInput,
          couponCode: appliedCoupon,
        },
      });

      if (res?.createOrder?.success && res.createOrder.order) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        onClearCart();
        onClose();
        onOrderSuccess(res.createOrder.order);
      } else {
        setErrorMsg(res?.createOrder?.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'GraphQL order submission error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10"
          >
            <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#FAFAFA]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#C93B13]" />
                  <h3 className="font-display font-extrabold text-xl text-neutral-900">
                    Your Dining Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
                  </h3>
                </div>
                <button
                  id="close-cart-drawer-btn"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Content */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-neutral-800">Your bag is empty</h4>
                  <p className="text-xs text-neutral-500 max-w-xs mt-1">
                    Explore our crispy spicy wings and artisan delicacies to start your order.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 rounded-full bg-[#C93B13] text-white text-xs font-bold shadow-sm hover:bg-[#b0300d] cursor-pointer"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* Items List */}
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.menuItem.id}-${idx}`}
                        className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex gap-3 items-center"
                      >
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-16 h-16 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-sm text-neutral-900 truncate">
                            {item.menuItem.name}
                          </h4>
                          {item.selectedSauce && (
                            <span className="text-[11px] text-[#C93B13] font-medium block">
                              Dip: {item.selectedSauce}
                            </span>
                          )}
                          <span className="text-xs font-extrabold text-neutral-800">
                            ₹{(item.menuItem.price * item.quantity).toFixed(0)}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-600 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Order Type Toggle */}
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                    <label className="text-xs font-bold text-neutral-700 block">Order Preference</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOrderType('DELIVERY')}
                        className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          orderType === 'DELIVERY'
                            ? 'bg-[#C93B13] text-white shadow-xs'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Delivery</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('DINE_IN')}
                        className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          orderType === 'DINE_IN'
                            ? 'bg-[#C93B13] text-white shadow-xs'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Dine In</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('TAKEOUT')}
                        className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                          orderType === 'TAKEOUT'
                            ? 'bg-[#C93B13] text-white shadow-xs'
                            : 'bg-white text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <span>Takeaway</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-600 block mb-0.5">Name</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-600 block mb-0.5">Phone (+91)</label>
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>
                    </div>

                    {orderType === 'DELIVERY' && (
                      <div>
                        <label className="text-[11px] font-bold text-neutral-600 block mb-0.5">
                          Delivery Address (Street, City, Pincode)
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>
                    )}

                    {orderType === 'DINE_IN' && (
                      <div>
                        <label className="text-[11px] font-bold text-neutral-600 block mb-0.5">
                          Table Number / Section
                        </label>
                        <input
                          type="text"
                          required
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                        />
                      </div>
                    )}

                    {/* Payment Mode Selector */}
                    <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-700 block">Payment Method</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('UPI')}
                          className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border ${
                            paymentMethod === 'UPI'
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          UPI / GPay
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('CARD')}
                          className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border ${
                            paymentMethod === 'CARD'
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          Debit / Credit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('COD')}
                          className={`py-1.5 px-2 text-[11px] font-bold rounded-lg transition-colors cursor-pointer border ${
                            paymentMethod === 'COD'
                              ? 'bg-neutral-900 text-white border-neutral-900'
                              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          Cash / COD
                        </button>
                      </div>
                    </div>

                    {/* Promo Code Input */}
                    <div className="pt-1">
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            placeholder="Promo Code (e.g. DESI25)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-neutral-300 text-xs uppercase font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={applyPromo}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {appliedCoupon && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                          ✓ Promo &ldquo;{appliedCoupon}&rdquo; applied (-25% discount)
                        </p>
                      )}
                      {errorMsg && <p className="text-[11px] text-red-600 mt-1">{errorMsg}</p>}
                    </div>

                    {/* Bill Breakdown */}
                    <div className="p-3.5 rounded-2xl bg-neutral-100/70 border border-neutral-200/80 space-y-1.5 text-xs">
                      <div className="flex justify-between text-neutral-600">
                        <span>Item Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Special Discount</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-600">
                        <span>Delivery Charges</span>
                        <span>{deliveryFee === 0 ? 'FREE (Orders > ₹499)' : `₹${deliveryFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-neutral-900 font-extrabold text-sm pt-2 border-t border-neutral-200">
                        <span>Total Payable</span>
                        <span className="text-[#C93B13]">₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Submit Order via GraphQL */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-[#C93B13] hover:bg-[#b0300d] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>
                        {submitting
                          ? 'Sending Order to Kitchen (GraphQL)...'
                          : `Confirm & Place Order (₹${total.toFixed(2)})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
