import React from 'react';
import { motion } from 'motion/react';
import { Bike, BookOpen, UtensilsCrossed, ShieldCheck, Clock, Heart } from 'lucide-react';
import { WhyChooseItem } from '../types';

interface WhyChooseUsSectionProps {
  items: WhyChooseItem[];
  onOpenMenu: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({
  items,
  onOpenMenu,
}) => {
  const getIcon = (iconName: string, idx: number) => {
    if (idx === 0 || iconName === 'Bike') {
      return (
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF2EC] flex items-center justify-center text-[#E65100] shrink-0 shadow-xs">
          <Bike className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
        </div>
      );
    }
    if (idx === 1 || iconName === 'BookOpen') {
      return (
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF8EA] flex items-center justify-center text-[#F59E0B] shrink-0 shadow-xs">
          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF3EB] flex items-center justify-center text-[#EA580C] shrink-0 shadow-xs">
        <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
      </div>
    );
  };

  return (
    <section id="why-choose-us-section" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-14 sm:mb-16">
          <h2
            id="why-choose-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight"
          >
            Why People Choose us?
          </h2>
          <p className="text-sm text-neutral-500 mt-2 max-w-xl mx-auto">
            From farm-to-table freshness to speedy doorstep delivery, our culinary standards never compromise.
          </p>
        </div>

        {/* 2-Column Grid (matching exact Figma layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Tall Vertical Curved Salad & Chicken Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md h-[440px] sm:h-[500px] rounded-[36px] overflow-hidden shadow-2xl border-4 border-neutral-100/80 group">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85"
                alt="Fresh Mediterranean Grilled Chicken and Herb Salad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

              {/* Floating Quality Assurance Pill */}
              <div className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-neutral-900 block">100% Farm Fresh</strong>
                    <span className="text-[11px] text-neutral-500">Certified Organic Produce</span>
                  </div>
                </div>
                <button
                  id="why-choose-order-now-btn"
                  onClick={onOpenMenu}
                  className="text-xs font-bold text-[#C93B13] hover:underline cursor-pointer"
                >
                  Explore Menu &rarr;
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3 Feature Benefit Cards */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                whileHover={{ scale: 1.01, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)' }}
                id={`why-choose-card-${idx}`}
                className="p-6 sm:p-7 rounded-3xl bg-[#FAFAFA] hover:bg-white border border-neutral-200/70 transition-all duration-300 flex items-start gap-5 sm:gap-6"
              >
                {/* Circular Icon (Matching exact screenshot color schemes) */}
                {getIcon(item.iconName, idx)}

                {/* Text Content */}
                <div className="space-y-1.5 flex-1">
                  <h3
                    id={`why-choose-title-${idx}`}
                    className="font-display font-extrabold text-xl sm:text-2xl text-neutral-900"
                  >
                    {item.title}
                  </h3>
                  <p
                    id={`why-choose-desc-${idx}`}
                    className="text-sm sm:text-[15px] text-neutral-600 leading-relaxed"
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Additional highlight perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <strong className="text-xs font-bold text-neutral-900 block">30 Min Delivery</strong>
                  <span className="text-[11px] text-neutral-600">Hot & crispy guaranteed</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <strong className="text-xs font-bold text-neutral-900 block">Chef Crafted</strong>
                  <span className="text-[11px] text-neutral-600">Made with real passion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
