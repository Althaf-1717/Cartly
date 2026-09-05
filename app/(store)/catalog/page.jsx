'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Lock,
  Sparkles,
  Check,
  RotateCcw,
  ArrowLeft,
  ChevronRight,
  Shirt,
  Footprints,
  Laptop,
  Smartphone,
  Headphones,
  Zap,
  Award,
  Smile,
  Scissors,
  Layers,
  Package,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import { StoreService } from '@/lib/db/storeService';
import { useAuth } from '@/lib/auth/authContext';

// Icon mapper helper
const getCategoryIcon = (iconName, className = 'w-6 h-6') => {
  switch (iconName) {
    case 'Shirt':
      return <Shirt className={className} />;
    case 'Footprints':
      return <Footprints className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Headphones':
      return <Headphones className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Scissors':
      return <Scissors className={className} />;
    case 'Smile':
      return <Smile className={className} />;
    default:
      return <Package className={className} />;
  }
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get('category') || '';
  const urlSubcategory = searchParams.get('subcategory') || '';
  const urlSearch = searchParams.get('search') || '';

  const { isAuthenticated } = useAuth();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drilldown states:
  // selectedCategory: null | 'clothes' | 'shoes' | 'electronics'
  // selectedSubcategory: null | 'shirts' | 'pants' | 'laptop' | ...
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('newest');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    StoreService.getCategories().then(setCategories);
    StoreService.getBrands().then(setBrands);
  }, []);

  // Sync URL query params with state
  useEffect(() => {
    const cat = searchParams.get('category');
    const sub = searchParams.get('subcategory');
    const q = searchParams.get('search');

    if (cat !== null) setSelectedCategory(cat);
    if (sub !== null) setSelectedSubcategory(sub);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Fetch filtered products
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      const data = await StoreService.getProducts({
        category: selectedCategory || null,
        subcategory: selectedSubcategory || null,
        search: searchQuery,
        sort: sortBy,
        inStock: inStockOnly,
      });

      let final = data;
      if (selectedBrand) {
        final = final.filter((p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase());
      }
      setProducts(final);
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedCategory, selectedSubcategory, selectedBrand, inStockOnly, searchQuery, sortBy]);

  // Category selection handler (Drills down to Level 2)
  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setSelectedSubcategory('');
  };

  // Subcategory selection handler (Drills down to Level 3)
  const handleSelectSubcategory = (subSlug) => {
    setSelectedSubcategory(subSlug);
  };

  // Reset to Top Level
  const handleResetToMain = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedBrand('');
    setSearchQuery('');
  };

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const currentSubcategoryObj = currentCategoryObj?.subcategories?.find((s) => s.slug === selectedSubcategory);

  // Determine current view level:
  // 1. 'main' if no category selected and no search
  // 2. 'subcategories' if category is selected but no subcategory is selected
  // 3. 'products' if subcategory is selected OR user is actively searching
  const isSearching = Boolean(searchQuery.trim());
  const viewLevel = isSearching || selectedSubcategory
    ? 'products'
    : selectedCategory
    ? 'subcategories'
    : 'main';

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Member-Only Notice Banner */}
      {!isAuthenticated && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-emerald-900 dark:text-emerald-100">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Member Privileges:</strong> Browse categories and items freely. Please{' '}
              <Link href="/auth/login" className="text-emerald-700 dark:text-emerald-300 underline font-bold">
                sign in
              </Link>{' '}
              to add items to cart and complete checkout.
            </span>
          </div>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shrink-0 shadow-xs transition"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* BREADCRUMB NAVIGATION & DRILL-DOWN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-emerald-900/60">
        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-emerald-300/70">
          <button
            onClick={handleResetToMain}
            className="hover:text-emerald-600 dark:hover:text-white transition flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Categories</span>
          </button>

          {selectedCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setSelectedSubcategory('')}
                className={`transition ${!selectedSubcategory ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'hover:text-emerald-600'}`}
              >
                {currentCategoryObj?.name || selectedCategory}
              </button>
            </>
          )}

          {selectedSubcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                {currentSubcategoryObj?.name || selectedSubcategory}
              </span>
            </>
          )}

          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">
                Search: "{searchQuery}"
              </span>
            </>
          )}
        </div>

        {/* Back Buttons for quick navigation */}
        {viewLevel === 'subcategories' && (
          <button
            onClick={handleResetToMain}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-emerald-950/80 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-emerald-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Categories
          </button>
        )}

        {viewLevel === 'products' && (
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => setSelectedSubcategory('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-emerald-950/80 hover:bg-emerald-50 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-emerald-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to {currentCategoryObj?.name || 'Subcategories'}
              </button>
            )}
            <button
              onClick={handleResetToMain}
              className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition"
            >
              All Categories
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          LEVEL 1: MAIN CATEGORIES (Clothes, Shoes, Electronics)
          ========================================================================= */}
      {viewLevel === 'main' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Select a Category
            </h1>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              Click on any category container below to view its specific types and products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="group relative bg-white dark:bg-[#09261a] border-2 border-slate-200 dark:border-emerald-900/60 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 text-left shadow-xs hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden cursor-pointer min-h-[320px]"
              >
                {/* Background Subtle Tint */}
                <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none ${cat.slug === 'clothes' ? 'bg-emerald-500' : cat.slug === 'shoes' ? 'bg-teal-500' : 'bg-green-500'}`} />

                {/* Top Section: Icon & Item Count */}
                <div className="flex items-center justify-between z-10">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon, 'w-7 h-7')}
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-full">
                    {cat.itemCount} Products
                  </span>
                </div>

                {/* Center Section: High Quality Category Image Box */}
                <div className="my-5 w-full h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-emerald-950 border border-slate-200/80 dark:border-emerald-900/80 relative z-10">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md">
                      {cat.subcategories?.map((s) => s.name).join(' • ')}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Title & Action CTA */}
                <div className="z-10 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {cat.name}
                    </h2>
                    <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-emerald-950 group-hover:bg-emerald-600 text-slate-700 dark:text-emerald-200 group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          LEVEL 2: SUB-CATEGORIES (e.g. Shirts & Pants for Clothes, etc.)
          ========================================================================= */}
      {viewLevel === 'subcategories' && currentCategoryObj && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
              {getCategoryIcon(currentCategoryObj.icon, 'w-3.5 h-3.5')}
              <span>{currentCategoryObj.name} Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Choose {currentCategoryObj.name} Type
            </h1>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70">
              Click on any subcategory box to open its products:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategoryObj.subcategories?.map((sub) => (
              <motion.button
                key={sub.id}
                onClick={() => handleSelectSubcategory(sub.slug)}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="group relative bg-white dark:bg-[#09261a] border-2 border-slate-200 dark:border-emerald-900/60 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-6 text-left shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden cursor-pointer min-h-[280px]"
              >
                {/* Top Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(sub.icon, 'w-6 h-6')}
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-full">
                    {sub.itemCount} Items
                  </span>
                </div>

                {/* Subcategory Image */}
                <div className="my-3 w-full h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-emerald-950 border border-slate-200/80 dark:border-emerald-900/80 relative">
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-white">
                    <p className="text-xs font-bold">{sub.name}</p>
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {sub.name}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Open Items →
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                    {sub.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Quick View All in Category */}
          <div className="p-4 bg-slate-50 dark:bg-emerald-950/40 rounded-2xl border border-slate-200 dark:border-emerald-900 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-emerald-200">
              Or view all {currentCategoryObj.name} products together:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Show All {currentCategoryObj.name} ({products.length})
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          LEVEL 3: SPECIFIC PRODUCTS GRID (e.g. ONLY Shirts when Shirts is clicked)
          ========================================================================= */}
      {viewLevel === 'products' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          {/* Subcategory switcher pills if inside a category */}
          {currentCategoryObj && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 dark:text-emerald-400/60 uppercase tracking-wider shrink-0 mr-1">
                {currentCategoryObj.name} Types:
              </span>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  selectedSubcategory === 'all' || !selectedSubcategory
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 border border-slate-200 dark:border-emerald-900'
                }`}
              >
                All {currentCategoryObj.name}
              </button>

              {currentCategoryObj.subcategories?.map((sub) => {
                const isActive = selectedSubcategory === sub.slug;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.slug)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 border border-slate-200 dark:border-emerald-900 hover:border-emerald-500'
                    }`}
                  >
                    {getCategoryIcon(sub.icon, 'w-3.5 h-3.5')}
                    <span>{sub.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter & Sort Toolbar */}
          <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            {/* Left Active Filters info */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
              </span>

              {selectedSubcategory && (
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold rounded-lg flex items-center gap-1">
                  Type: {currentSubcategoryObj?.name || selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('')} className="hover:text-black dark:hover:text-white">
                    ×
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-emerald-950 text-slate-800 dark:text-emerald-200 border border-slate-200 dark:border-emerald-800 font-bold rounded-lg flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              )}

              {selectedBrand && (
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold rounded-lg flex items-center gap-1">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('')} className="hover:text-black dark:hover:text-white">
                    ×
                  </button>
                </span>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800/60 rounded-xl text-slate-800 dark:text-emerald-100 font-semibold focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition flex items-center gap-1.5 ${
                  inStockOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-emerald-200'
                }`}
              >
                {inStockOnly && <Check className="w-3.5 h-3.5" />}
                <span>In Stock</span>
              </button>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800/60 rounded-xl px-3 py-1.5">
                <span className="text-slate-400 dark:text-emerald-400/60 font-semibold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-white dark:bg-[#09261a] text-slate-900 dark:text-white">
                    Newest First
                  </option>
                  <option value="price-asc" className="bg-white dark:bg-[#09261a] text-slate-900 dark:text-white">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-white dark:bg-[#09261a] text-slate-900 dark:text-white">
                    Price: High to Low
                  </option>
                  <option value="rating" className="bg-white dark:bg-[#09261a] text-slate-900 dark:text-white">
                    Top Rated
                  </option>
                </select>
              </div>

              {(selectedCategory || selectedSubcategory || selectedBrand || inStockOnly || searchQuery) && (
                <button
                  onClick={handleResetToMain}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-slate-100 dark:bg-emerald-950/40 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-12 text-center space-y-4 shadow-xs">
                <Search className="w-12 h-12 text-slate-400 dark:text-emerald-400/60 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70 max-w-sm mx-auto">
                  We couldn't find items in this specific section. Try exploring other types or clearing search filters.
                </p>
                <button
                  onClick={handleResetToMain}
                  className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition"
                >
                  Explore All Categories
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </main>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Loading catalog...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
