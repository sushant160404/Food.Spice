import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Chef } from '../types';
import { Award, Utensils, X, Calendar } from 'lucide-react';

interface ExpertsSectionProps {
  chefs: Chef[];
  onOpenReservation: () => void;
}

export const ExpertsSection: React.FC<ExpertsSectionProps> = ({
  chefs,
  onOpenReservation,
}) => {
  const [activeChef, setActiveChef] = useState<Chef | null>(null);

  return (
    <section id="experts-section" className="py-16 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header with Terracotta Underline */}
        <div className="text-center mb-14 sm:mb-18 flex flex-col items-center">
          <h2
            id="meet-experts-heading"
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight uppercase"
          >
            MEET OUR EXPERTS
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-[#C93B13] rounded-full mt-4" />
        </div>

        {/* 3 Chef Profiles Grid (matching exact Figma layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto">
          {chefs.map((chef, idx) => (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              id={`chef-card-${chef.id}`}
              onClick={() => setActiveChef(chef)}
              className="flex flex-col items-center text-center cursor-pointer group p-4 rounded-3xl transition-all"
            >
              {/* Circular / Arch Cutout Chef Image */}
              <div className="relative w-48 h-56 sm:w-56 sm:h-64 mb-5 flex items-end justify-center">
                {/* Background Arch Shape */}
                <div className="absolute inset-x-0 bottom-0 top-6 rounded-t-full bg-white shadow-md border border-neutral-200/70 group-hover:border-[#C93B13]/40 group-hover:shadow-xl transition-all duration-300" />
                
                {/* Chef Photo */}
                <div className="relative z-10 w-44 h-52 sm:w-52 sm:h-60 rounded-t-full overflow-hidden flex items-end justify-center">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Role Title in Red (matching screenshot) */}
              <span
                id={`chef-role-${chef.id}`}
                className="text-xs sm:text-sm font-bold text-[#C93B13] tracking-wide"
              >
                {chef.role}
              </span>

              {/* Chef Name in Bold Black (matching screenshot) */}
              <h3
                id={`chef-name-${chef.id}`}
                className="font-display font-extrabold text-xl sm:text-2xl text-neutral-900 mt-1 mb-2 group-hover:text-[#C93B13] transition-colors"
              >
                {chef.name}
              </h3>

              {/* Stylized Handwritten Signature (matching screenshot) */}
              <div className="h-10 flex items-center justify-center">
                <span className="font-signature text-2xl sm:text-3xl text-neutral-800 tracking-wider transform -rotate-3 select-none">
                  {chef.signatureText}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chef Details Modal */}
      <AnimatePresence>
        {activeChef && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-neutral-100 overflow-hidden"
            >
              <button
                id="close-chef-modal-btn"
                onClick={() => setActiveChef(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <img
                  src={activeChef.image}
                  alt={activeChef.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold text-[#C93B13] uppercase tracking-wider">
                    {activeChef.role}
                  </span>
                  <h3 className="font-display text-2xl font-black text-neutral-900">
                    {activeChef.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500 justify-center sm:justify-start">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{activeChef.experience}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-sm text-neutral-600">
                <p className="leading-relaxed">{activeChef.bio}</p>
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                  <Utensils className="w-4 h-4 text-[#C93B13] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-xs font-bold text-neutral-800 uppercase block">
                      Signature Specialties
                    </strong>
                    <span className="text-xs text-neutral-600">{activeChef.favoriteDish}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  id="chef-reserve-table-btn"
                  onClick={() => {
                    setActiveChef(null);
                    onOpenReservation();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Chef&apos;s Table</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
