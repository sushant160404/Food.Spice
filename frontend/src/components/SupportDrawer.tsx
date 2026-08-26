import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { executeGraphQL, SEND_SUPPORT_MESSAGE_MUTATION } from '../lib/graphqlClient';

interface SupportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportDrawer: React.FC<SupportDrawerProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Order & Delivery');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [supportResult, setSupportResult] = useState<{ ticketId: string; reply: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    try {
      setSubmitting(true);
      const res = await executeGraphQL<{
        sendSupportMessage: {
          success: boolean;
          ticketId: string;
          replyMessage: string;
        };
      }>(SEND_SUPPORT_MESSAGE_MUTATION, {
        name,
        email,
        message,
        topic,
      });

      if (res?.sendSupportMessage?.success) {
        setSupportResult({
          ticketId: res.sendSupportMessage.ticketId,
          reply: res.sendSupportMessage.replyMessage,
        });
      }
    } catch (err) {
      console.error('Support error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSupportResult(null);
    setMessage('');
    onClose();
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
              {/* Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#FAFAFA]">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#C93B13]" />
                  <div>
                    <h3 className="font-display font-bold text-lg text-neutral-900">
                      Customer Support
                    </h3>
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Agents Online
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Contact Quick Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <Phone className="w-4 h-4 text-[#C93B13] mb-1" />
                    <span className="text-[10px] text-neutral-400 font-bold block uppercase">
                      Helpline
                    </span>
                    <strong className="text-xs text-neutral-900">+91 80 4123 4567</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
                    <Mail className="w-4 h-4 text-[#C93B13] mb-1" />
                    <span className="text-[10px] text-neutral-400 font-bold block uppercase">
                      Direct Email
                    </span>
                    <strong className="text-xs text-neutral-900 truncate block">
                      support@foodtuck.in
                    </strong>
                  </div>
                </div>

                {supportResult ? (
                  <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-display font-bold text-lg text-neutral-900">
                      Ticket Generated #{supportResult.ticketId}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {supportResult.reply}
                    </p>
                    <button
                      onClick={handleReset}
                      className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Back to Restaurant
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rohan Varma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rohan@example.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                      >
                        <option value="Order & Delivery">Order & Delivery Inquiries</option>
                        <option value="Table Reservation">Table Reservation Request</option>
                        <option value="Catering & Private Events">Catering & Private Events</option>
                        <option value="Chef Recipes & Allergens">Chef Recipes & Allergen Details</option>
                        <option value="General Feedback">General Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe how we can assist you today..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Submitting to Dispatch...' : 'Send Message'}</span>
                    </button>
                  </form>
                )}

                {/* FAQ Quick Accordion */}
                <div className="pt-3 border-t border-neutral-200 space-y-2">
                  <strong className="text-xs font-bold text-neutral-800 block uppercase tracking-wider">
                    Frequently Asked Questions
                  </strong>
                  <div className="p-2.5 rounded-xl bg-neutral-50 text-xs text-neutral-600 space-y-1">
                    <strong className="text-neutral-900 block font-semibold">
                      What are the complimentary chutney/dip options?
                    </strong>
                    <p className="text-[11px] text-neutral-500">
                      We offer Pudina Mint Chutney, Guntur Chili Fire Glaze, and Makhani Garlic Dip.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-neutral-50 text-xs text-neutral-600 space-y-1">
                    <strong className="text-neutral-900 block font-semibold">
                      What is the minimum order for free delivery?
                    </strong>
                    <p className="text-[11px] text-neutral-500">
                      All orders above ₹499 qualify for free express delivery across Bengaluru & Kolkata!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
