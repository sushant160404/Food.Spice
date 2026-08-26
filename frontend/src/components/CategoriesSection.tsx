import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { ArrowRight } from 'lucide-react';

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (categorySlug: string) => void;
  onOpenMenu: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onSelectCategory,
  onOpenMenu,
}) => {
  return (
    <section id="categories-section" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-center sm:text-left">
            <h2
              id="categories-heading"
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-neutral-900 tracking-tight"
            >
              Catagories
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Curated artisanal selections crafted with the freshest seasonal ingredients
            </p>
          </div>
          <button
            id="categories-view-more-btn"
            onClick={onOpenMenu}
            className="text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#C93B13] flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            <span>View more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 4 Cards Grid (matching the design exactly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {categories.slice(0, 4).map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              id={`category-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative cursor-pointer rounded-3xl overflow-hidden bg-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center"
            >
              {/* Image Container with generous rounded corners */}
              <div className="w-full aspect-[4/5] overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Floating Bottom Pill Button (matching screenshot pill) */}
                <div className="absolute bottom-5 inset-x-0 flex justify-center">
                  <span
                    id={`category-pill-${cat.slug}`}
                    className="px-6 py-2.5 rounded-full text-white text-sm font-bold shadow-lg transition-transform group-hover:scale-105"
                    style={{ backgroundColor: '#C93B13' }}
                  >
                    {cat.name}
                  </span>
                </div>
              </div>

              {/* Hover overlay hint */}
              <div className="p-3 w-full text-center bg-white border-t border-neutral-100 text-xs text-neutral-500 font-medium">
                <span>{cat.itemCount} Delicious Items</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
