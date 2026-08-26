import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Flame, Leaf, Star, Plus, Check } from 'lucide-react';
import { MenuItem, Category } from '../types';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  categories: Category[];
  initialCategory?: string;
  onAddToCart: (item: MenuItem, sauceName?: string) => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  categories,
  initialCategory = 'all',
  onAddToCart,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySpicy, setOnlySpicy] = useState(false);
  const [onlyVegan, setOnlyVegan] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [selectedDishDetail, setSelectedDishDetail] = useState<MenuItem | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string | undefined>(undefined);

  // Sync initialCategory when modal opens
  React.useEffect(() => {
    if (isOpen && initialCategory) {
      setSelectedCat(initialCategory);
    }
  }, [isOpen, initialCategory]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCat !== 'all' && item.categorySlug !== selectedCat) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (onlySpicy && !item.isSpicy) return false;
      if (onlyVegan && !item.isVegan) return false;
      return true;
    });
  }, [menuItems, selectedCat, searchQuery, onlySpicy, onlyVegan]);

  const handleQuickAdd = (item: MenuItem, sauce?: string) => {
    onAddToCart(item, sauce);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-[#FAFAFA]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-script text-2xl font-bold text-neutral-900">Sw</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-neutral-900">
                Foodtuck Artisanal Menu
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live GraphQL Powered Catalog &bull; Handcrafted Daily by Master Chefs
            </p>
          </div>
          <button
            id="close-menu-modal-btn"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer border border-neutral-200 shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-5 sm:px-6 py-4 bg-white border-b border-neutral-100 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button
              id="menu-cat-all"
              onClick={() => setSelectedCat('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-[#C93B13] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`menu-cat-${cat.slug}`}
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  selectedCat === cat.slug
                    ? 'bg-[#C93B13] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Box & Dietary Toggles */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
              <input
                id="menu-search-input"
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#C93B13]"
              />
            </div>
            <button
              onClick={() => setOnlySpicy(!onlySpicy)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
                onlySpicy
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600'
              }`}
              title="Filter spicy items"
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setOnlyVegan(!onlyVegan)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
                onlyVegan
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600'
              }`}
              title="Filter vegan items"
            >
              <Leaf className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-neutral-50">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-sm">No dishes found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCat('all');
                  setSearchQuery('');
                  setOnlySpicy(false);
                  setOnlyVegan(false);
                }}
                className="mt-3 text-xs font-bold text-[#C93B13] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((dish) => (
                <div
                  key={dish.id}
                  id={`menu-card-${dish.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
                >
                  {/* Dish Image */}
                  <div
                    className="w-full h-44 overflow-hidden relative cursor-pointer"
                    onClick={() => {
                      setSelectedDishDetail(dish);
                      setSelectedSauce(dish.sauces?.[0]?.name);
                    }}
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {dish.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-neutral-900 shadow-sm">
                        {dish.badge}
                      </span>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {dish.isVegan ? (
                        <span className="w-5 h-5 rounded-md bg-white/90 border border-emerald-600 flex items-center justify-center shadow-xs" title="100% Pure Vegetarian">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-md bg-white/90 border border-red-700 flex items-center justify-center shadow-xs" title="Non-Vegetarian">
                          <span className="w-2 h-2 rounded-xs bg-red-700 rotate-45" />
                        </span>
                      )}
                    </div>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-xs font-bold backdrop-blur-xs">
                      ₹{dish.price}
                    </span>
                  </div>

                  {/* Dish Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          onClick={() => {
                            setSelectedDishDetail(dish);
                            setSelectedSauce(dish.sauces?.[0]?.name);
                          }}
                          className="font-display font-bold text-base text-neutral-900 hover:text-[#C93B13] cursor-pointer transition-colors"
                        >
                          {dish.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
                        {dish.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {dish.prepTime} &bull; {dish.calories} kcal
                      </span>

                      <button
                        id={`add-to-cart-btn-${dish.id}`}
                        onClick={() => handleQuickAdd(dish, dish.sauces?.[0]?.name)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          addedItemIds[dish.id]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-900 hover:bg-[#C93B13] text-white shadow-xs'
                        }`}
                      >
                        {addedItemIds[dish.id] ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Dish Detail Dialog */}
      <AnimatePresence>
        {selectedDishDetail && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-neutral-100"
            >
              <button
                id="close-dish-detail-btn"
                onClick={() => setSelectedDishDetail(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="h-56 w-full relative">
                <img
                  src={selectedDishDetail.image}
                  alt={selectedDishDetail.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-black text-neutral-900">
                      {selectedDishDetail.name}
                    </h3>
                    <span className="text-xs text-[#C93B13] font-semibold uppercase tracking-wider">
                      {selectedDishDetail.category}
                    </span>
                  </div>
                  <span className="text-xl font-extrabold text-neutral-900">
                    ₹{selectedDishDetail.price}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {selectedDishDetail.longDescription}
                </p>

                {/* Ingredients chips */}
                <div>
                  <strong className="text-xs font-bold text-neutral-800 block mb-2">
                    Key Ingredients:
                  </strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDishDetail.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 text-[11px] font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sauce selection if available */}
                {selectedDishDetail.sauces && selectedDishDetail.sauces.length > 0 && (
                  <div>
                    <strong className="text-xs font-bold text-neutral-800 block mb-2">
                      Choose Complimentary Dip / Chutney:
                    </strong>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDishDetail.sauces.map((sauce) => (
                        <button
                          key={sauce.id}
                          type="button"
                          onClick={() => setSelectedSauce(sauce.name)}
                          className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            selectedSauce === sauce.name
                              ? 'border-[#C93B13] bg-orange-50/50 font-bold'
                              : 'border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full mb-1"
                            style={{ backgroundColor: sauce.color }}
                          />
                          <span className="line-clamp-1">{sauce.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  id="detail-add-to-cart-btn"
                  onClick={() => {
                    handleQuickAdd(selectedDishDetail, selectedSauce);
                    setSelectedDishDetail(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#C93B13] hover:bg-[#b0300d] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Add to Cart &bull; ₹{selectedDishDetail.price}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
