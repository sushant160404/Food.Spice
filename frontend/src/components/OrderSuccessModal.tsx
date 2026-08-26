import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, MapPin, Utensils, X, Printer, Check, Bike, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder?: (order: Order) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose, onTrackOrder }) => {
  const [hasPrinted, setHasPrinted] = React.useState(false);

  if (!order) return null;

  const handlePrint = () => {
    setHasPrinted(true);
    // Slight timeout so UI can register click before browser print dialog opens
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const currentDateStr = new Date(order.createdAt || Date.now()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <>
      {/* 1. Screen Interactive Modal (Hidden in Print Mode) */}
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs screen-only-modal">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-100 overflow-hidden max-h-[90vh] flex flex-col"
        >
          <button
            id="close-order-success-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Header */}
          <div className="text-center space-y-2 mb-5 shrink-0">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C93B13] block">
              GraphQL Order Dispatched
            </span>
            <h3 className="font-display text-2xl font-black text-neutral-900">
              Order Confirmed #{order.id}
            </h3>
            <p className="text-xs text-neutral-500">
              Thank you, <strong className="text-neutral-800">{order.customerName}</strong>! Our kitchen maestros are preparing your meal right now.
            </p>
          </div>

          {/* Order Details Preview Card */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3 text-xs overflow-y-auto flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
                <Clock className="w-3.5 h-3.5 text-[#C93B13]" />
                Estimated Time:
              </span>
              <span className="font-bold text-neutral-900">{order.estimatedTime}</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="flex items-center gap-1.5 font-semibold text-neutral-700">
                {order.orderType === 'DELIVERY' ? (
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                ) : (
                  <Utensils className="w-3.5 h-3.5 text-neutral-500" />
                )}
                {order.orderType === 'DELIVERY' ? 'Destination:' : 'Dining Area:'}
              </span>
              <span className="font-medium text-neutral-800 text-right truncate max-w-[200px]">
                {order.deliveryAddress || order.tableNumber || 'Takeout Counter'}
              </span>
            </div>

            {/* Ordered Items Summary */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400">
                <span>Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>Subtotal</span>
              </div>
              {order.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-neutral-700 items-start">
                  <div className="pr-2">
                    <span className="font-semibold text-neutral-900">{it.quantity}x</span> {it.name}
                    {it.selectedSauce && (
                      <span className="block text-[11px] text-[#C93B13] font-medium">
                        Dip/Chutney: {it.selectedSauce}
                      </span>
                    )}
                  </div>
                  <span className="font-medium shrink-0">₹{(it.price * it.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-200 flex justify-between font-extrabold text-neutral-900 text-sm">
              <span>Total Paid (Incl. GST)</span>
              <span className="text-[#C93B13]">₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2.5 shrink-0">
            {onTrackOrder && (
              <button
                id="track-order-from-success-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onTrackOrder(order);
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Bike className="w-4 h-4" />
                <span>Track Live Order Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id="print-receipt-btn"
              type="button"
              onClick={handlePrint}
              className="px-4 py-3 rounded-2xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#C93B13]" />
              <span>{hasPrinted ? 'Print Again' : 'Print Receipt'}</span>
            </button>
            <button
              id="done-order-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Done</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* 2. Dedicated Physical Thermal / Paper Receipt Layout for Browser Printing */}
      <div id="printable-order-receipt" className="print-ticket-container hidden print:block">
        <div className="receipt-ticket">
          {/* Header */}
          <div className="receipt-header">
            <div className="receipt-brand">FOODTUCK INDIA</div>
            <div className="receipt-subbrand">Authentic Artisanal Kitchen & Dining</div>
            <div className="receipt-contact">
              42 Gourmet Boulevard, 100ft Road, Indiranagar, Bengaluru - 560038<br />
              Tel: +91 80 4123 4567 / +91 98450 12345<br />
              GSTIN: 29AABCF9812G1Z8 &bull; FSSAI Lic No: 11224333000582
            </div>
            <div className="receipt-divider-dash" />
            <div className="receipt-badge-row">
              <span className="receipt-type-pill">
                {order.orderType === 'DELIVERY' && 'DELIVERY ORDER'}
                {order.orderType === 'DINE_IN' && `DINE-IN (${order.tableNumber || 'TABLE'})`}
                {order.orderType === 'TAKEOUT' && 'TAKEAWAY / PARCEL'}
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="receipt-meta">
            <div className="receipt-meta-row">
              <span>ORDER TICKET:</span>
              <strong>#{order.id}</strong>
            </div>
            <div className="receipt-meta-row">
              <span>DATE & TIME:</span>
              <span>{currentDateStr}</span>
            </div>
            <div className="receipt-meta-row">
              <span>CUSTOMER:</span>
              <strong>{order.customerName}</strong>
            </div>
            {order.customerPhone && (
              <div className="receipt-meta-row">
                <span>PHONE:</span>
                <span>{order.customerPhone}</span>
              </div>
            )}
            {order.orderType === 'DELIVERY' && order.deliveryAddress && (
              <div className="receipt-meta-row">
                <span>ADDRESS:</span>
                <span>{order.deliveryAddress}</span>
              </div>
            )}
            {order.orderType === 'DINE_IN' && order.tableNumber && (
              <div className="receipt-meta-row">
                <span>TABLE / AREA:</span>
                <span>{order.tableNumber}</span>
              </div>
            )}
            <div className="receipt-meta-row">
              <span>STATUS:</span>
              <span>PAID &bull; UPI/Online Confirmed</span>
            </div>
            <div className="receipt-meta-row">
              <span>EST. READY:</span>
              <strong>{order.estimatedTime}</strong>
            </div>
          </div>

          <div className="receipt-divider-dash" />

          {/* Line Items */}
          <div className="receipt-items-table">
            <div className="receipt-items-header">
              <span className="col-qty">QTY</span>
              <span className="col-item">ITEM DESCRIPTION</span>
              <span className="col-price">AMOUNT</span>
            </div>
            <div className="receipt-divider-solid" />

            {order.items.map((it, idx) => (
              <div key={idx} className="receipt-item-row">
                <div className="item-main-line">
                  <span className="col-qty">{it.quantity}x</span>
                  <span className="col-item">{it.name}</span>
                  <span className="col-price">₹{(it.price * it.quantity).toFixed(0)}</span>
                </div>
                {it.selectedSauce && (
                  <div className="item-addon-line">
                    &bull; Dip/Chutney: {it.selectedSauce}
                  </div>
                )}
                {it.specialInstructions && (
                  <div className="item-addon-line">
                    &bull; Note: {it.specialInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="receipt-divider-dash" />

          {/* Totals Breakdown */}
          <div className="receipt-totals">
            <div className="receipt-total-row">
              <span>Item Subtotal:</span>
              <span>
                ₹{order.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="receipt-total-row">
                <span>Discount:</span>
                <span>-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="receipt-total-row">
                <span>Delivery Charges:</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="receipt-total-row">
              <span>Order Type:</span>
              <span>{order.orderType}</span>
            </div>
            <div className="receipt-divider-solid" />
            <div className="receipt-total-row receipt-grand-total">
              <span>TOTAL PAID (INR):</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="receipt-divider-dash" />

          {/* Barcode & Footer */}
          <div className="receipt-footer">
            <div className="barcode-box">
              <div className="simulated-barcode">
                ||||| | |||| || |||||| | |||| ||| ||||| || ||||||
              </div>
              <div className="barcode-label">TKT-{order.id.toUpperCase()}-IN</div>
            </div>
            <div className="receipt-thankyou">
              Thank you for ordering at Foodtuck India!<br />
              Freshly prepared with authentic Indian spices.<br />
              Please present this invoice/ticket for takeaway verification.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
