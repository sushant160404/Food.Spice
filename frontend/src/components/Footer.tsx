import React, { useState } from 'react';
import { Send, MapPin, Phone, Check, Copy } from 'lucide-react';
import { executeGraphQL, SUBSCRIBE_NEWSLETTER_MUTATION } from '../lib/graphqlClient';
import confetti from 'canvas-confetti';

interface FooterProps {
  onOpenMenu: () => void;
  onOpenReservation: () => void;
  onOpenSupport: () => void;
  onOpenOrderTracking?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenMenu,
  onOpenReservation,
  onOpenSupport,
  onOpenOrderTracking,
  onOpenAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      setLoading(true);
      const res = await executeGraphQL<{
        subscribeNewsletter: {
          success: boolean;
          message: string;
          discountCode?: string;
          discountPercent?: number;
        };
      }>(SUBSCRIBE_NEWSLETTER_MUTATION, { email });

      if (res?.subscribeNewsletter?.success) {
        setCouponCode(res.subscribeNewsletter.discountCode || 'FOODSPICE25');
        setMessage(res.subscribeNewsletter.message);
        setEmail('');
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.8 },
        });
      } else {
        setMessage(res?.subscribeNewsletter?.message || 'Subscription failed.');
      }
    } catch (err: any) {
      setMessage(err?.message || 'Error subscribing to newsletter.');
    } finally {
      setLoading(false);
    }
  };

  const copyCoupon = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer id="footer-section" className="bg-[#FAFAFA] pt-14 pb-12 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12">
          {/* Column 1: Foodtuck Brand & Newsletter Promo */}
          <div className="md:col-span-4 space-y-4">
            <h3
              id="footer-brand-title"
              className="font-display font-black text-3xl text-neutral-900 tracking-tight"
            >
              Foodtuck
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xs">
              Subscribe our newsletter and get discount 25%off
            </p>

            {couponCode && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between max-w-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                    Your 25% Promo Code:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-900 tracking-wider">
                    {couponCode}
                  </span>
                </div>
                <button
                  id="copy-footer-coupon-btn"
                  onClick={copyCoupon}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Contact Us */}
          <div className="md:col-span-4 space-y-4">
            <h4
              id="footer-contact-title"
              className="font-display font-bold text-base text-neutral-900 tracking-wide"
            >
              Contact us
            </h4>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                <span>Indiranagar, 100ft Road, Bengaluru, India &bull; Kolkata Office 45</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>+91 80 4123 4567 / +91 98450 12345</span>
              </div>
              <div className="pt-2 flex items-center gap-4">
                <button
                  id="footer-book-table-btn"
                  onClick={onOpenReservation}
                  className="text-xs font-bold text-[#C93B13] hover:underline cursor-pointer"
                >
                  Reserve Table &rarr;
                </button>
                {onOpenAdmin && (
                  <button
                    id="footer-admin-link-btn"
                    onClick={onOpenAdmin}
                    className="text-xs font-bold text-neutral-900 hover:text-[#C93B13] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Kitchen / Admin Portal &rarr;</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Links & Email Newsletter Input */}
          <div className="md:col-span-4 space-y-4">
            <h4
              id="footer-links-title"
              className="font-display font-bold text-base text-neutral-900 tracking-wide"
            >
              Links
            </h4>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-neutral-600">
              <button
                id="footer-about-link"
                onClick={() => {
                  const el = document.getElementById('why-choose-us-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#C93B13] transition-colors cursor-pointer"
              >
                About us
              </button>
              <button
                id="footer-contact-link"
                onClick={onOpenSupport}
                className="hover:text-[#C93B13] transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <button
                id="footer-menu-link"
                onClick={onOpenMenu}
                className="hover:text-[#C93B13] transition-colors cursor-pointer"
              >
                Menu
              </button>
              {onOpenOrderTracking && (
                <button
                  id="footer-track-order-link"
                  onClick={onOpenOrderTracking}
                  className="text-[#C93B13] font-semibold hover:underline transition-colors cursor-pointer"
                >
                  Track Order
                </button>
              )}
              {onOpenAdmin && (
                <button
                  id="footer-admin-sublink"
                  onClick={onOpenAdmin}
                  className="text-neutral-900 font-bold hover:text-[#C93B13] transition-colors cursor-pointer"
                >
                  Admin
                </button>
              )}
            </div>

            {/* Newsletter Input Box with Terracotta Send Button (matching screenshot) */}
            <form onSubmit={handleSubscribe} className="relative flex items-center mt-3 max-w-sm">
              <input
                id="footer-newsletter-input"
                type="email"
                required
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#C93B13]"
              />
              <button
                id="footer-newsletter-submit-btn"
                type="submit"
                disabled={loading}
                aria-label="Subscribe Newsletter"
                className="absolute right-1.5 p-2 rounded-lg bg-[#C93B13] hover:bg-[#b0300d] text-white transition-colors cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {message && <p className="text-xs text-[#C93B13]">{message}</p>}

            {/* Social Icons Row (matching Pinterest, Twitter, Facebook, Instagram, YouTube) */}
            <div className="flex items-center gap-4 pt-2 text-neutral-600">
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="hover:text-[#C93B13] transition-colors text-xs font-bold"
              >
                Pinterest
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-[#C93B13] transition-colors text-xs font-bold"
              >
                Twitter
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#C93B13] transition-colors text-xs font-bold"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#C93B13] transition-colors text-xs font-bold"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-[#C93B13] transition-colors text-xs font-bold"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-200 text-center flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-2">
          <span>&copy; {new Date().getFullYear()} Food.Spice. All rights reserved.</span>
          <span className="font-mono text-[11px] text-neutral-400">
            Powered by GraphQL &bull; MongoDB Atlas &bull; Express.js
          </span>
        </div>
      </div>
    </footer>
  );
};
