import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Testimonial } from '../types';
import { Star, MessageSquarePlus, X, Check } from 'lucide-react';
import { executeGraphQL, ADD_REVIEW_MUTATION } from '../lib/graphqlClient';

interface FeedbackSectionProps {
  testimonials: Testimonial[];
  onReviewAdded?: (newReview: Testimonial) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  testimonials,
  onReviewAdded,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('Diner');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewItem, setReviewItem] = useState('Signature Glazed Spicy Wings');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const current = testimonials[currentIndex] || testimonials[0];

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    try {
      setSubmitting(true);
      const data = await executeGraphQL<{ addReview: Testimonial }>(ADD_REVIEW_MUTATION, {
        input: {
          name: reviewName,
          role: reviewRole,
          rating: reviewRating,
          comment: reviewComment,
          favoriteItem: reviewItem,
        },
      });

      if (data?.addReview) {
        onReviewAdded?.(data.addReview);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowReviewModal(false);
          setReviewName('');
          setReviewComment('');
          setCurrentIndex(0);
        }, 1800);
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="feedback-section" className="py-16 sm:py-24 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Testimonial Text & Info */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            {/* Heading: Customer Feedback (matching screenshot colors) */}
            <div className="space-y-2">
              <h2
                id="feedback-heading"
                className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight"
              >
                Customer <span className="text-[#C93B13]">Feedback</span>
              </h2>
            </div>

            {/* Testimonial Quote Box with Animated Transitions */}
            <div className="min-h-[160px] sm:min-h-[140px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p
                    id={`feedback-quote-${currentIndex}`}
                    className="text-sm sm:text-[15px] lg:text-base text-neutral-600 leading-relaxed font-normal"
                  >
                    &ldquo;{current?.comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(current?.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Reviewer Profile & Navigation Dots */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-neutral-200/80">
              {/* Avatar + Red Name (matching screenshot) */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-neutral-200 shrink-0">
                  <img
                    src={current?.avatar}
                    alt={current?.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3
                    id={`feedback-name-${currentIndex}`}
                    className="font-display font-extrabold text-2xl text-[#C93B13]"
                  >
                    {current?.name}
                  </h3>
                  <span className="text-xs text-neutral-500 block">
                    {current?.role} &bull; Loved {current?.favoriteItem}
                  </span>
                </div>
              </div>

              {/* 3 Red/Outline Carousel Dots (matching screenshot) */}
              <div className="flex items-center gap-3">
                {testimonials.slice(0, 3).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    id={`feedback-dot-${dotIdx}`}
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      currentIndex === dotIdx
                        ? 'w-4 h-4 bg-[#C93B13] scale-110 shadow-xs'
                        : 'w-3.5 h-3.5 border-2 border-[#C93B13] bg-transparent hover:bg-[#C93B13]/20'
                    }`}
                  />
                ))}

                {/* Write Review Trigger */}
                <button
                  id="write-review-btn"
                  onClick={() => setShowReviewModal(true)}
                  className="ml-4 p-2 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition-colors cursor-pointer"
                  title="Share your review"
                >
                  <MessageSquarePlus className="w-4 h-4 text-[#C93B13]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Chef OK Gesture Image (matching screenshot) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="relative w-72 sm:w-88 md:w-96 lg:w-[420px] aspect-[4/5] flex items-end justify-center">
              {/* Background glowing circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C93B13]/10 to-amber-500/10 blur-2xl transform scale-90 -z-10" />

              {/* Chef giving OK hand sign */}
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85"
                alt="Chef gesturing delicious approval"
                className="w-full h-full object-cover object-top rounded-3xl shadow-xl border-4 border-white"
                referrerPolicy="no-referrer"
              />

              {/* Floating review count badge */}
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-neutral-100 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#C93B13] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                    4.9
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-900 text-xs font-bold flex items-center justify-center border-2 border-white">
                    ★
                  </div>
                </div>
                <div>
                  <strong className="text-xs font-bold text-neutral-900 block">4.9 Star Rating</strong>
                  <span className="text-[10px] text-neutral-500">Over 3,500+ Verified Diners</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-100"
            >
              <button
                id="close-review-modal-btn"
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-display text-2xl font-black text-neutral-900 mb-1">
                Share Your Dining Story
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Your feedback directly inspires our executive chefs.
              </p>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Thank you for your feedback!</h4>
                  <p className="text-xs text-neutral-500">
                    Your review has been broadcasted via GraphQL mutation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Henry"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Your Experience</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us what you loved about the food, ambiance, or service..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Favorite Dish</label>
                    <input
                      type="text"
                      placeholder="e.g. Signature Glazed Spicy Wings"
                      value={reviewItem}
                      onChange={(e) => setReviewItem(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#C93B13]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
                  >
                    {submitting ? 'Broadcasting via GraphQL...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
