'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  ChevronRight,
  Lock,
  CreditCard,
  LogIn,
  RotateCcw,
  Headphones,
  Award,
  Zap,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import { StoreService } from '@/lib/db/storeService';
import { useAuth } from '@/lib/auth/authContext';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    StoreService.getCategories().then(setCategories);
    StoreService.getBanners().then(setBanners);
  }, []);

  const currentBanner = banners[0] || {
    title: 'The Premier Hardware & Technology Marketplace',
    subtitle: 'Engineered studio acoustics, aerospace titanium smartwatches, and computing workstations with certified manufacturer warranty and instant Razorpay processing.',
    badgeText: 'VERIFIED QUALITY HARDWARE',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85',
  };

  const marqueeCategories = [...categories, ...categories, ...categories];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 space-y-16 pb-20 overflow-hidden">
        {/* 1. HERO SECTION */}
        <section className="pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden min-h-[460px] lg:min-h-[500px] flex items-center bg-emerald-950 border border-emerald-900 shadow-xl">
            <div className="absolute inset-0 z-0">
              <img
                src={currentBanner.imageUrl}
                alt=""
                className="w-full h-full object-cover object-right opacity-30 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{currentBanner.badgeText}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                {currentBanner.title}
              </h1>

              <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-xl">
                {currentBanner.subtitle}
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/catalog"
                    className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
                  >
                    <span>Browse Product Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Shop</span>
                    </Link>
                    <Link
                      href="/catalog"
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition backdrop-blur-xs"
                    >
                      Preview Catalog
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. MEMBER NOTICE */}
        {!isAuthenticated && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 dark:text-white text-base">Member-Only Shopping Notice</h3>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-200/70 mt-0.5">
                    Guests can preview all hardware specifications freely. To add items to your cart and checkout, please sign in or register.
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5 shrink-0">
                <Link
                  href="/auth/login"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2.5 bg-white dark:bg-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-emerald-900 dark:text-white font-semibold text-xs rounded-xl border border-emerald-200 dark:border-emerald-700 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 3. CATEGORIES MARQUEE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Curated Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Explore Available Gear
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition"
            >
              Open Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <motion.div
              className="flex gap-4 sm:gap-5 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                ease: 'linear',
                duration: 25,
                repeat: Infinity,
              }}
              whileHover={{ animationPlayState: 'paused' }}
            >
              {marqueeCategories.map((cat, idx) => (
                <Link
                  key={`${cat.id}-${idx}`}
                  href={`/catalog?category=${cat.slug}`}
                  className="group w-48 sm:w-56 shrink-0 bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-4 flex flex-col items-center text-center transition-all hover:-translate-y-1 shadow-xs"
                >
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-emerald-950 mb-3 group-hover:scale-105 transition-transform">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 dark:text-emerald-300/60 mt-0.5 font-medium">
                    {cat.itemCount || 6}+ Products
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. ABOUT SECTION (#about anchor) */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-3xl p-8 sm:p-12 shadow-xs space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                About Cartly
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Direct Manufacturer Access. Zero Counterfeit Risks. Complete Reliability.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-200/80 leading-relaxed">
                Cartly brings direct brand certification and curated premium tech accessories together with fast automated dispatch and secure payment processing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-emerald-900/40">
              <div className="p-6 bg-white dark:bg-emerald-950/60 rounded-2xl border border-slate-200/80 dark:border-emerald-800/40 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Certified Originals</h3>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70 leading-relaxed">
                  Every device is sourced directly with official manufacturer warranty coverage.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-emerald-950/60 rounded-2xl border border-slate-200/80 dark:border-emerald-800/40 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Razorpay Secured Gateway</h3>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70 leading-relaxed">
                  Encrypted payments supporting UPI, Cards, and NetBanking with instant verification.
                </p>
              </div>

              <div className="p-6 bg-white dark:bg-emerald-950/60 rounded-2xl border border-slate-200/80 dark:border-emerald-800/40 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Fast 48h Dispatch</h3>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70 leading-relaxed">
                  Automated warehouse order handling with courier AWB tracking and 7-day replacements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PLATFORM ADVANTAGES (#features anchor) */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl border border-emerald-900">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Platform Features
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Engineered For Modern Hardware Shoppers
              </h2>
              <p className="text-xs text-emerald-200/70">
                Key advantages that make Cartly the trusted choice for creators and tech professionals:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-emerald-900">
              <div className="space-y-2 p-4 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Official Warranty</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Official 1-year warranty on all certified hardware with easy claim support.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">Instant UPI Checkout</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Seamless payment flow with QR codes, Google Pay, PhonePe, and instant confirmation.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">7-Day Easy Returns</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Fast replacement assistance for any transit damage or manufacturer defects.
                </p>
              </div>

              <div className="space-y-2 p-4 bg-emerald-900/40 rounded-2xl border border-emerald-800/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-2">
                  <Headphones className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">24/7 Specialist Desk</h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed">
                  Hardware specialists available via chat and phone for order and setup help.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
