import React, { useState } from 'react';
import { ArrowUpRight, Facebook, Instagram, Youtube, Flame, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { SauceOption, MenuItem } from '../types';

interface HeroSectionProps {
  heroItem?: MenuItem;
  sauces: SauceOption[];
  onOpenMenu: () => void;
  onAddToCart: (item: MenuItem, sauceName?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroItem,
  sauces,
  onOpenMenu,
  onAddToCart,
}) => {
  const [selectedSauceIndex, setSelectedSauceIndex] = useState<number>(1); // Default to Fiery Sriracha Glaze
  const [addedToast, setAddedToast] = useState(false);

  const activeSauce = sauces[selectedSauceIndex] || sauces[0];

  const handleQuickAdd = () => {
    if (heroItem) {
      onAddToCart(heroItem, activeSauce?.name);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  return (
    <section
      id="hero-section"
      className="relative pt-6 pb-16 lg:py-20 overflow-hidden bg-[#FAFAFA]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Giant Headline Background Text */}
        <div className="text-center w-full select-none pointer-events-none mb-2 sm:mb-4">
          <h1
            id="hero-main-title"
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-neutral-900 leading-none uppercase"
          >
            SPICY TANDOORI WINGS
          </h1>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center mt-2 lg:-mt-6">
          {/* Left Column: Description & Socials */}
          <div className="lg:col-span-4 space-y-8 text-left z-10">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-md"
            >
              Discover the perfect blend of crispy, juicy, and smoky Indian tandoori chicken wings. Marinated in 14 hand-ground spices and roasted in traditional clay tandoors to golden perfection.
            </motion.p>

            {/* Follow Us On */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-bold text-neutral-900 tracking-wide">
                Follow us on
              </h2>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-social-fb"
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-[#C93B13] hover:border-[#C93B13] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-social-ig"
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-[#C93B13] hover:border-[#C93B13] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="hero-social-yt"
                  className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-[#C93B13] hover:border-[#C93B13] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="#categories-section"
                  id="hero-social-arrow"
                  className="w-8 h-8 rounded-full bg-[#C93B13] text-white flex items-center justify-center hover:bg-[#b0300d] transition-colors shadow-sm"
                  aria-label="Explore Menu"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Quick Order Badge */}
            {heroItem && (
              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2 max-w-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C93B13] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      Chef Special
                    </span>
                    <span className="text-base font-bold text-neutral-900">
                      ₹{heroItem.price}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Includes dip: <strong className="text-neutral-800">{activeSauce?.name}</strong>
                  </p>
                  <button
                    id="hero-quick-order-btn"
                    onClick={handleQuickAdd}
                    className="w-full py-2 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {addedToast ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <span>Add Tandoori Wings to Cart</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Center Column: Wings Plate Visual with Floating Leaves */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-88 md:w-96 lg:w-[420px] aspect-square flex items-center justify-center">
              {/* Outer decorative terracotta arc */}
              <div className="absolute inset-0 rounded-full border-[10px] sm:border-[14px] border-[#C93B13]/30 scale-95 animate-pulse" />
              <div className="absolute inset-2 rounded-full border-[2px] border-dashed border-[#C93B13]/50" />

              {/* Main Plate Image */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white"
              >
                <img
                  src="https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1000&q=85"
                  alt="Delicious Indian Tandoori Spicy Wings"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Floating Green Leaves (matching screenshot) */}
              <motion.div
                animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 z-20 w-28 sm:w-36 pointer-events-none"
              >
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
                  alt="Fresh Leaves Garnish"
                  className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-full shadow-lg border-2 border-white/80"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Sauce Dips & Menu Button */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start lg:pl-4 space-y-8 z-10">
            {/* Sauce Dip Pickers */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Choose Dip / Chutney:
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                {/* 1. Pudina Mint Chutney */}
                <button
                  id="sauce-dip-pudina-chutney"
                  onClick={() => setSelectedSauceIndex(0)}
                  aria-label="Select Pudina Mint Chutney"
                  title="Pudina Coriander Chutney"
                  className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm flex items-center justify-center ${
                    selectedSauceIndex === 0
                      ? 'border-[#C93B13] scale-110 ring-4 ring-[#C93B13]/20 shadow-md'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: '#488B49' }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#326933] to-[#68ab69] shadow-inner flex items-center justify-center">
                    {selectedSauceIndex === 0 && <Check className="w-4 h-4 text-white font-bold" />}
                  </div>
                </button>

                {/* 2. Fiery Guntur Chili Glaze */}
                <button
                  id="sauce-dip-spicy-chili"
                  onClick={() => setSelectedSauceIndex(1)}
                  aria-label="Select Fiery Guntur Chili Glaze"
                  title="Fiery Guntur Chilli Glaze"
                  className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm flex items-center justify-center ${
                    selectedSauceIndex === 1
                      ? 'border-[#C93B13] scale-110 ring-4 ring-[#C93B13]/20 shadow-md'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: '#C93B13' }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9b2a0c] to-[#e64a1f] shadow-inner flex items-center justify-center">
                    {selectedSauceIndex === 1 && <Check className="w-4 h-4 text-white font-bold" />}
                  </div>
                </button>

                {/* 3. Creamy Makhani Garlic Dip */}
                <button
                  id="sauce-dip-makhani-ranch"
                  onClick={() => setSelectedSauceIndex(2)}
                  aria-label="Select Creamy Makhani Garlic Dip"
                  title="Velvety Makhani Garlic Dip"
                  className={`relative w-12 sm:w-14 h-12 sm:h-14 rounded-full border-2 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm flex items-center justify-center ${
                    selectedSauceIndex === 2
                      ? 'border-[#C93B13] scale-110 ring-4 ring-[#C93B13]/20 shadow-md'
                      : 'border-neutral-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: '#F4EBD9' }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ded0b6] to-[#fffdf7] shadow-inner border border-neutral-300/50 flex items-center justify-center">
                    {selectedSauceIndex === 2 && <Check className="w-4 h-4 text-neutral-800 font-bold" />}
                  </div>
                </button>
              </div>

              {/* Active Sauce description card */}
              <div className="text-center lg:text-left text-xs text-neutral-600 bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-neutral-200 max-w-[220px]">
                <strong className="text-neutral-900 block font-semibold">{activeSauce?.name}</strong>
                <span className="text-[11px] leading-tight text-neutral-500 line-clamp-2">
                  {activeSauce?.description}
                </span>
              </div>
            </div>

            {/* Menu ↗ Button (matching design screenshot) */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              id="hero-menu-cta-btn"
              onClick={onOpenMenu}
              className="bg-[#C93B13] hover:bg-[#b0300d] text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>Menu</span>
              <ArrowUpRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};
