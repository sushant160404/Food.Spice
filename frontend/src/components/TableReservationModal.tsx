import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, X, Check, Utensils } from 'lucide-react';
import { executeGraphQL, BOOK_TABLE_MUTATION } from '../lib/graphqlClient';
import confetti from 'canvas-confetti';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState('2026-08-28');
  const [time, setTime] = useState('19:00');
  const [seatingArea, setSeatingArea] = useState('MAIN_HALL');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await executeGraphQL<{
        bookTable: {
          success: boolean;
          message: string;
          booking: any;
        };
      }>(BOOK_TABLE_MUTATION, {
        input: {
          name,
          email,
          phone,
          guests: Number(guests),
          date,
          time,
          seatingArea,
          specialRequests,
        },
      });

      if (res?.bookTable?.success && res.bookTable.booking) {
        setSuccessBooking(res.bookTable.booking);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(res?.bookTable?.message || 'Reservation could not be completed.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing reservation.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSuccessBooking(null);
    setName('');
    setEmail('');
    setPhone('');
    setSpecialRequests('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-100 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successBooking ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-black text-neutral-900">
              Table Reserved #{successBooking.id}
            </h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              We look forward to welcoming you, <strong>{successBooking.name}</strong>! Your table for{' '}
              <strong>{successBooking.guests} guests</strong> is reserved on{' '}
              <strong>{successBooking.date}</strong> at <strong>{successBooking.time}</strong> in the{' '}
              <strong>{successBooking.seatingArea.replace('_', ' ')}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 text-left space-y-1">
              <div className="flex justify-between">
                <span>Confirmation ID:</span>
                <strong className="font-mono text-neutral-900">{successBooking.id}</strong>
              </div>
              <div className="flex justify-between">
                <span>Contact Phone:</span>
                <span>{successBooking.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Special Notes:</span>
                <span>{successBooking.specialRequests || 'Standard dining'}</span>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Great, See You Soon!
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold text-[#C93B13] uppercase tracking-wider block">
                Foodtuck Dining Experience
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black text-neutral-900">
                Reserve a Table
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Book in advance for chef&apos;s special tasting and priority seating.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Phone Number (+91)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="aarav.sharma@example.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Guests</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Time</span>
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                  >
                    <option value="12:00">12:00 PM (Lunch)</option>
                    <option value="13:30">1:30 PM (Lunch)</option>
                    <option value="18:00">6:00 PM (Dinner)</option>
                    <option value="19:00">7:00 PM (Dinner)</option>
                    <option value="20:00">8:00 PM (Dinner)</option>
                    <option value="21:30">9:30 PM (Late Night)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Seating Preference</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'MAIN_HALL', label: 'Main Dining Hall' },
                    { id: 'PATIO', label: 'Garden Patio' },
                    { id: 'CHEF_TABLE', label: 'Chef Counter (VIP)' },
                    { id: 'ROMANTIC_BOOTH', label: 'Cozy Booth' },
                  ].map((area) => (
                    <button
                      type="button"
                      key={area.id}
                      onClick={() => setSeatingArea(area.id)}
                      className={`p-2 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                        seatingArea === area.id
                          ? 'border-[#C93B13] bg-orange-50/50 text-[#C93B13] font-bold'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Special Requests / Dietary Allergies
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Birthday anniversary, high chair needed, peanut allergy..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#C93B13]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                {submitting ? 'Confirming Reservation with Server...' : 'Confirm Table Reservation'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};
