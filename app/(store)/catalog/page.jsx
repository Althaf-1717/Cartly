'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  Heart,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import { StoreService } from '@/lib/db/storeService';
import { useAuth } from '@/lib/auth/authContext';

// Icon helper
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
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    default:
      return <Package className={className} />;
  }
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get('category') || '';
  const urlGender = searchParams.get('gender') || '';
  const urlSubcategory = searchParams.get('subcategory') || '';
  const urlSearch = searchParams.get('search') || '';

  const { isAuthenticated, user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drilldown states:
  // selectedCategory: null | 'clothes' | 'shoes' | 'electronics'
  // selectedGender: null | 'male' | 'female'
  // selectedSubcategory: null | 'shirts' | 'pants' | 't-shirts' | 'shorts' | 'bunnies' | 'underwears' | 'dresses' | 'bras' | ...
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedGender, setSelectedGender] = useState(urlGender);
  const [selectedSubcategory, setSelectedSubcategory] = useState(urlSubcategory);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('newest');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    StoreService.getCategories().then(setCategories);
    StoreService.getBrands().then(setBrands);
  }, []);

  // Sync URL query params with state
  useEffect(() => {
    const cat = searchParams.get('category');
    const gen = searchParams.get('gender');
    const sub = searchParams.get('subcategory');
    const q = searchParams.get('search');

    if (cat !== null) setSelectedCategory(cat);
    if (gen !== null) setSelectedGender(gen);
    if (sub !== null) setSelectedSubcategory(sub);
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);

  // Fetch filtered products with strict subcategory & gender filtering
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      const data = await StoreService.getProducts({
        category: selectedCategory || null,
        gender: selectedGender || null,
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
      setCurrentPage(1); // reset pagination when filters change
      setLoading(false);
    };

    fetchFiltered();
  }, [selectedCategory, selectedGender, selectedSubcategory, selectedBrand, inStockOnly, searchQuery, sortBy]);

  // Category selection handler (Drills down to Level 2)
  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    setSelectedGender('');
    setSelectedSubcategory('');
  };

  // Gender selection handler (Drills down to Male/Female subcategories)
  const handleSelectGender = (genderSlug) => {
    setSelectedGender(genderSlug);
    setSelectedSubcategory('');
  };

  // Subcategory selection handler (Drills down to Level 3: ONLY products of this subcategory)
  const handleSelectSubcategory = (subSlug) => {
    setSelectedSubcategory(subSlug);
  };

  // Reset to Top Level
  const handleResetToMain = () => {
    setSelectedCategory('');
    setSelectedGender('');
    setSelectedSubcategory('');
    setSelectedBrand('');
    setSearchQuery('');
  };

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const currentGenderObj = currentCategoryObj?.genders?.find((g) => g.slug === selectedGender);

  // Subcategories to display based on gender or category
  const availableSubcategories = currentGenderObj?.subcategories || currentCategoryObj?.subcategories || [];
  const currentSubcategoryObj = availableSubcategories.find((s) => s.slug === selectedSubcategory);

  // Determine current view level:
  // 1. 'products' if user clicked a specific subcategory OR is searching
  // 2. 'gender_select' if clothes is clicked and no gender is chosen yet
  // 3. 'subcategories' if category is selected & (gender is chosen OR category has no genders)
  // 4. 'main' if at top level
  const isSearching = Boolean(searchQuery.trim());
  let viewLevel = 'main';

  if (isSearching || selectedSubcategory) {
    viewLevel = 'products';
  } else if (selectedCategory === 'clothes' && !selectedGender) {
    viewLevel = 'gender_select';
  } else if (selectedCategory) {
    viewLevel = 'subcategories';
  }

  // Pagination calculation
  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Member-Only Notice Banner */}
      {!isAuthenticated && (
        <div className="p-4 bg-orange-50 dark:bg-slate-900/60 border border-orange-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5 text-orange-900 dark:text-slate-100">
            <Lock className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
            <span>
              <strong>Member Privileges:</strong> Browse categories and items freely. Please{' '}
              <Link href="/auth/login" className="text-orange-700 dark:text-slate-300 underline font-bold">
                sign in
              </Link>{' '}
              to add items to cart and complete checkout.
            </span>
          </div>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shrink-0 shadow-xs transition"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {/* =========================================================================
          FEATURED CAROUSEL EFFECT (DISPLAYED BEFORE CATEGORIES)
          ========================================================================= */}
      {viewLevel === 'main' && (
        <section className="space-y-4 animate-in fade-in duration-300">
          <CategoryCarousel />
        </section>
      )}

      {/* BREADCRUMB NAVIGATION & DRILL-DOWN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-300/70">
          <button
            onClick={handleResetToMain}
            className="hover:text-orange-600 dark:hover:text-white transition flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-orange-600" />
            <span>All Categories</span>
          </button>

          {selectedCategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => {
                  setSelectedGender('');
                  setSelectedSubcategory('');
                }}
                className={`transition ${!selectedGender && !selectedSubcategory ? 'text-orange-700 dark:text-orange-400 font-bold' : 'hover:text-orange-600'}`}
              >
                {currentCategoryObj?.name || selectedCategory}
              </button>
            </>
          )}

          {selectedGender && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setSelectedSubcategory('')}
                className={`transition ${!selectedSubcategory ? 'text-orange-700 dark:text-orange-400 font-bold' : 'hover:text-orange-600'}`}
              >
                {currentGenderObj?.name || (selectedGender === 'male' ? 'Men' : 'Women')}
              </button>
            </>
          )}

          {selectedSubcategory && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-orange-700 dark:text-orange-400 font-bold">
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
        {viewLevel !== 'main' && (
          <div className="flex items-center gap-2">
            {viewLevel === 'products' && selectedSubcategory && (
              <button
                onClick={() => setSelectedSubcategory('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-orange-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Types
              </button>
            )}

            {viewLevel === 'subcategories' && selectedCategory === 'clothes' && selectedGender && (
              <button
                onClick={() => setSelectedGender('')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-orange-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Men/Women
              </button>
            )}

            <button
              onClick={handleResetToMain}
              className="text-xs text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 font-bold transition"
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-left">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Select a Department
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-300/70">
                Choose Clothes (with Men & Women collections), Shoes, or Electronics to explore
              </p>
            </div>

            {/* Custom Tooltip on Category info */}
            <div className="custom-tooltip-wrapper">
              <button
                type="button"
                className="btn btn-secondary text-xs font-bold text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="Click a container to drill down into specific clothing, footwear, or gadget items."
              >
                <span>Category Drilldown Active</span>
              </button>
              <div className="custom-tooltip">
                Select a box below to explore specific products!
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="group relative bg-white dark:bg-[#111111] border-2 border-slate-200 dark:border-slate-800/60 hover:border-orange-500 dark:hover:border-orange-500 rounded-3xl p-6 text-left shadow-xs hover:shadow-2xl transition-all flex flex-col justify-between overflow-hidden cursor-pointer min-h-[320px]"
              >
                {/* Background Subtle Glow */}
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none bg-orange-500" />

                {/* Top Section: Icon & Count */}
                <div className="flex items-center justify-between z-10">
                  <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-600/30 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon, 'w-7 h-7')}
                  </div>
                  <span className="px-3 py-1 bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-slate-800 text-orange-800 dark:text-slate-300 font-bold text-xs rounded-full">
                    {cat.itemCount || 10}+ Products
                  </span>
                </div>

                {/* Center Section: High Quality Category Image Box */}
                <div className="my-5 w-full h-40 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 relative z-10">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15 inline-block">
                      {cat.slug === 'clothes' ? 'Men (Shirts, Pants, Tees) • Women (Dresses, Tops, Bras)' : cat.subcategories?.map((s) => s.name).join(' • ')}
                    </span>
                  </div>
                </div>

                {/* Bottom Section: Title & Action CTA */}
                <div className="z-10 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {cat.name}
                    </h2>
                    <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 group-hover:bg-orange-600 text-slate-700 dark:text-slate-200 group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300/70 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          LEVEL 2A: GENDER SELECTOR FOR CLOTHES (MEN vs WOMEN)
          ========================================================================= */}
      {viewLevel === 'gender_select' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-slate-900 text-orange-800 dark:text-slate-300 text-xs font-bold rounded-full border border-orange-200 dark:border-slate-800">
              <Shirt className="w-3.5 h-3.5 text-orange-600" />
              <span>Clothes Department</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Select Men or Women Collection
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300/70">
              Choose your category to see specialized items (Shirts, Pants, T-Shirts, Shorts, Banyans & Innerwear for Men; Dresses, Tops, Bras for Women)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Men / Male Card */}
            <motion.button
              onClick={() => handleSelectGender('male')}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white dark:bg-[#111111] border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500 rounded-3xl p-8 text-left shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between min-h-[320px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/30">
                  <User className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 bg-orange-50 dark:bg-slate-900 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full border border-orange-200 dark:border-slate-800">
                  Men’s Collection
                </span>
              </div>

              <div className="my-5 w-full h-44 rounded-2xl overflow-hidden bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
                  alt="Men Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-bold text-orange-300">Suggested For Men:</p>
                  <p className="text-[11px] text-slate-200">
                    Shirts • Pants • T-Shirts • Shorts • Banyans / Vests • Underwears
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                    Men’s Wear
                  </h3>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    Explore Men →
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Oxford linen shirts, tailored chinos, 240 GSM tees, breathable inner banyans & boxer briefs.
                </p>
              </div>
            </motion.button>

            {/* Women / Female Card */}
            <motion.button
              onClick={() => handleSelectGender('female')}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white dark:bg-[#111111] border-2 border-slate-200 dark:border-slate-800 hover:border-orange-500 rounded-3xl p-8 text-left shadow-md hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between min-h-[320px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/30">
                  <Sparkles className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 bg-orange-50 dark:bg-slate-900 text-orange-700 dark:text-orange-400 text-xs font-bold rounded-full border border-orange-200 dark:border-slate-800">
                  Women’s Collection
                </span>
              </div>

              <div className="my-5 w-full h-44 rounded-2xl overflow-hidden bg-slate-900 relative">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                  alt="Women Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-bold text-orange-300">Suggested For Women:</p>
                  <p className="text-[11px] text-slate-200">
                    Dresses • Shirts & Tops • Pants • Shorts • Bras • Underwears
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                    Women’s Wear
                  </h3>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    Explore Women →
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Floral midi dresses, mulberry silk blouses, high-waisted wide-leg trousers, wireless bralettes & intimates.
                </p>
              </div>
            </motion.button>
          </div>

          {/* Quick Option to browse all clothes together */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Or view all clothes without gender filter:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl shadow-xs transition hover:opacity-90"
            >
              Browse All Clothes
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          LEVEL 2B: SUBCATEGORIES GRID (Shirts, Pants, T-Shirts, Shorts, Banyans, Bras, etc.)
          ========================================================================= */}
      {viewLevel === 'subcategories' && currentCategoryObj && (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-slate-900 text-orange-800 dark:text-slate-300 text-xs font-bold rounded-full border border-orange-200 dark:border-slate-800">
              {getCategoryIcon(currentCategoryObj.icon, 'w-3.5 h-3.5')}
              <span>
                {currentCategoryObj.name} {selectedGender ? `• ${selectedGender === 'male' ? 'Men' : 'Women'}` : ''}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Choose {selectedGender ? (selectedGender === 'male' ? 'Men’s' : 'Women’s') : currentCategoryObj.name} Type
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300/70">
              Click on any item box below — only products of that specific type will be displayed!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSubcategories.map((sub) => (
              <motion.button
                key={sub.id}
                onClick={() => handleSelectSubcategory(sub.slug)}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="group relative bg-white dark:bg-[#111111] border-2 border-slate-200 dark:border-slate-800/60 hover:border-orange-500 dark:hover:border-orange-500 rounded-3xl p-6 text-left shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden cursor-pointer min-h-[290px]"
              >
                {/* Top Info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/20 group-hover:scale-110 transition-transform">
                    {getCategoryIcon(sub.icon, 'w-6 h-6')}
                  </div>
                  <span className="px-3 py-1 bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-slate-800 text-orange-800 dark:text-slate-300 font-bold text-xs rounded-full">
                    {sub.itemCount || 3}+ Items
                  </span>
                </div>

                {/* Subcategory Image */}
                <div className="my-3 w-full h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 relative">
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-white">
                    <p className="text-xs font-black tracking-wide uppercase bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {sub.name}
                    </p>
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {sub.name}
                    </h3>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      View Items →
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300/70 line-clamp-2">
                    {sub.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Quick View All in Category */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Or view all {selectedGender ? (selectedGender === 'male' ? 'Men’s' : 'Women’s') : currentCategoryObj.name} products:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              Show All ({products.length})
            </button>
          </div>
        </section>
      )}

      {/* =========================================================================
          LEVEL 3: SPECIFIC PRODUCTS GRID (ONLY PRODUCTS OF THE SELECTED TYPE DISPLAY)
          ========================================================================= */}
      {viewLevel === 'products' && (
        <section className="space-y-6 animate-in fade-in duration-300">
          {/* Subcategory switcher pills */}
          {currentCategoryObj && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  {selectedGender ? (selectedGender === 'male' ? 'Men’s' : 'Women’s') : currentCategoryObj.name} Types:
                </span>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedSubcategory === 'all' || !selectedSubcategory
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All Items
                </button>

                {availableSubcategories.map((sub) => {
                  const isActive = selectedSubcategory === sub.slug;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleSelectSubcategory(sub.slug)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                        isActive
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-orange-500'
                      }`}
                    >
                      {getCategoryIcon(sub.icon, 'w-3.5 h-3.5')}
                      <span>{sub.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter & Sort Toolbar with Custom Tooltip */}
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            {/* Left Active Filters info */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {products.length} {products.length === 1 ? 'Item' : 'Items'} Found
              </span>

              {selectedSubcategory && selectedSubcategory !== 'all' && (
                <span className="px-2.5 py-1 bg-orange-50 dark:bg-slate-900 text-orange-800 dark:text-slate-300 border border-orange-200 dark:border-slate-800 font-bold rounded-lg flex items-center gap-1">
                  Type: {currentSubcategoryObj?.name || selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory('')} className="hover:text-black dark:hover:text-white">
                    ×
                  </button>
                </span>
              )}

              {selectedGender && (
                <span className="px-2.5 py-1 bg-orange-50 dark:bg-slate-900 text-orange-800 dark:text-slate-300 border border-orange-200 dark:border-slate-800 font-bold rounded-lg flex items-center gap-1">
                  Gender: {selectedGender === 'male' ? 'Men' : 'Women'}
                  <button onClick={() => setSelectedGender('')} className="hover:text-black dark:hover:text-white">
                    ×
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-lg flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              )}

              {selectedBrand && (
                <span className="px-2.5 py-1 bg-orange-50 dark:bg-slate-900 text-orange-800 dark:text-slate-300 border border-orange-200 dark:border-slate-800 font-bold rounded-lg flex items-center gap-1">
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
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:outline-none focus:border-orange-600 cursor-pointer"
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
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                {inStockOnly && <Check className="w-3.5 h-3.5" />}
                <span>In Stock</span>
              </button>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-xl px-3 py-1.5">
                <span className="text-slate-400 font-semibold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-white font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-white dark:bg-[#111111] text-slate-900 dark:text-white">
                    Newest First
                  </option>
                  <option value="price-asc" className="bg-white dark:bg-[#111111] text-slate-900 dark:text-white">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-white dark:bg-[#111111] text-slate-900 dark:text-white">
                    Price: High to Low
                  </option>
                  <option value="rating" className="bg-white dark:bg-[#111111] text-slate-900 dark:text-white">
                    Top Rated
                  </option>
                </select>
              </div>

              {/* Reset filter tooltip button */}
              <div className="custom-tooltip-wrapper">
                <button
                  type="button"
                  onClick={handleResetToMain}
                  className="p-2 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-800 rounded-xl transition"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-custom-class="custom-tooltip"
                  data-bs-title="Reset all filters and return to all categories"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <div className="custom-tooltip">
                  Reset all filters
                </div>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-slate-100 dark:bg-slate-900/40 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl p-12 text-center space-y-4 shadow-xs">
                <Search className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-200/70 max-w-sm mx-auto">
                  We couldn't find items in this specific section. Try exploring other types or clearing search filters.
                </p>
                <button
                  onClick={handleResetToMain}
                  className="px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition"
                >
                  Explore All Categories
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedProducts.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </div>

                {/* =========================================================================
                    PAGINATION COMPONENT (EXACT BOOTSTRAP STRUCTURE REQUESTED BY USER)
                    ========================================================================= */}
                {totalPages > 1 && (
                  <div className="pt-6 pb-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Showing items <strong className="text-slate-900 dark:text-white">{startIndex + 1}</strong> to{' '}
                      <strong className="text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, products.length)}</strong> of{' '}
                      <strong className="text-slate-900 dark:text-white">{products.length}</strong> total
                    </div>

                    <nav aria-label="Product Catalog Pagination">
                      <ul className="pagination">
                        {/* Previous */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                          >
                            Previous
                          </button>
                        </li>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          const isActive = currentPage === pageNum;
                          return (
                            <li
                              key={pageNum}
                              className={`page-item ${isActive ? 'active' : ''}`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                onClick={() => setCurrentPage(pageNum)}
                                aria-current={isActive ? 'page' : undefined}
                              >
                                {pageNum}
                              </button>
                            </li>
                          );
                        })}

                        {/* Next */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            type="button"
                            className="page-link"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Loading catalog...</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
