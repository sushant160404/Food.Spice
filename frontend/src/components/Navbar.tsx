import React, { useState } from 'react';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSupport: () => void;
  onOpenReservation: () => void;
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSupport,
  onOpenReservation,
  onOpenMenu,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/95 backdrop-blur-md transition-all border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            id="brand-logo-btn"
            className="flex items-baseline gap-1 group focus:outline-none"
          >
            <span className="font-script text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight transition-transform group-hover:scale-105">
              Fs
            </span>
            <span className="font-display font-extrabold text-sm tracking-widest text-[#C93B13] uppercase">
              Food.Spice
            </span>
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-neutral-700">
          <button
            id="nav-home-btn"
            onClick={() => scrollTo('hero-section')}
            className="hover:text-[#C93B13] transition-colors py-1 cursor-pointer"
          >
            Home
          </button>
          <button
            id="nav-about-btn"
            onClick={() => scrollTo('why-choose-us-section')}
            className="hover:text-[#C93B13] transition-colors py-1 cursor-pointer"
          >
            About us
          </button>
          <button
            id="nav-contact-btn"
            onClick={() => scrollTo('footer-section')}
            className="hover:text-[#C93B13] transition-colors py-1 cursor-pointer"
          >
            Contact us
          </button>
          <button
            id="nav-testimonial-btn"
            onClick={() => scrollTo('feedback-section')}
            className="hover:text-[#C93B13] transition-colors py-1 cursor-pointer"
          >
            Testimonial
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          {/* Book Table Button */}
          <button
            id="nav-book-table-btn"
            onClick={onOpenReservation}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-full border border-neutral-300 hover:border-neutral-400 text-neutral-800 transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-neutral-600" />
            <span>Reserve Table</span>
          </button>

          {/* Cart Trigger */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            aria-label="Shopping Cart"
            className="relative p-2 sm:p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-neutral-800" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-[#C93B13] text-white text-[10px] sm:text-[11px] font-bold w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          {/* Customer Support Pill Button (matching Figma design) */}
          <button
            id="nav-customer-support-btn"
            onClick={onOpenSupport}
            className="bg-[#C93B13] hover:bg-[#b0300d] text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 shadow-xs hover:shadow active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5 hidden sm:inline" />
            <span><span className="hidden md:inline">Customer </span>Support</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 bg-[#FAFAFA] px-4 pt-3 pb-6 space-y-3"
          >
            <button
              id="mobile-nav-home"
              onClick={() => scrollTo('hero-section')}
              className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Home
            </button>
            <button
              id="mobile-nav-about"
              onClick={() => scrollTo('why-choose-us-section')}
              className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              About us
            </button>
            <button
              id="mobile-nav-contact"
              onClick={() => scrollTo('footer-section')}
              className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Contact us
            </button>
            <button
              id="mobile-nav-testimonial"
              onClick={() => scrollTo('feedback-section')}
              className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Testimonial
            </button>
            <div className="pt-2 border-t border-neutral-200 flex flex-col gap-2">
              <button
                id="mobile-nav-menu"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenMenu();
                }}
                className="w-full text-center py-2.5 rounded-full bg-neutral-900 text-white font-medium text-sm"
              >
                Browse Full Menu
              </button>
              <button
                id="mobile-nav-reserve"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full text-center py-2.5 rounded-full border border-neutral-300 text-neutral-800 font-medium text-sm"
              >
                Reserve a Table
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
