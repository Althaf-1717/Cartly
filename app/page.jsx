'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
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
    title: 'Discover Quality Products',
    subtitle: 'Explore curated collections across fashion, footwear, and electronics with certified quality and fast delivery.',
    badgeText: 'NEW COLLECTION',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=85',
  };

  const marqueeCategories = [...categories, ...categories, ...categories];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 space-y-20 pb-24 overflow-hidden">
        {/* 1. HERO */}
        <section className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden min-h-[420px] lg:min-h-[480px] flex items-center bg-slate-900 dark:bg-[#111]">
            <div className="absolute inset-0 z-0">
              <img
                src={currentBanner.imageUrl}
                alt=""
                className="w-full h-full object-cover object-right opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-xs font-medium tracking-wide">
                {currentBanner.badgeText}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                {currentBanner.title}
              </h1>

              <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl">
                {currentBanner.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/catalog"
                    className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-lg flex items-center gap-2 transition"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-medium text-sm rounded-lg flex items-center gap-2 transition"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Shop</span>
                    </Link>
                    <Link
                      href="/catalog"
                      className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium text-sm rounded-lg transition"
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
            <div className="bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <Lock className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Member-Only Shopping</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sign in or register to add items to your cart and complete checkout.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-slate-900 dark:bg-white hover:opacity-90 text-white dark:text-slate-900 font-medium text-xs rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium text-xs rounded-lg border border-slate-200 dark:border-slate-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 3. CATEGORIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Explore Products
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <motion.div
              className="flex gap-4 w-max"
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
                  className="group w-48 sm:w-52 shrink-0 bg-white dark:bg-[#111] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-4 flex flex-col items-center text-center transition-all hover:-translate-y-0.5"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#1a1a1a] mb-3 group-hover:scale-105 transition-transform">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {cat.itemCount || 6}+ Products
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. ABOUT */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                About Cartly
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Quality Products. Trusted Service. Fast Delivery.
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Cartly brings certified brands and curated collections together with secure payments and automated dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="p-5 bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Certified Originals</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every product is sourced directly with official manufacturer warranty.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Secure Payments</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Encrypted payments via UPI, Cards, and NetBanking with instant verification.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-[#0a0a0a] rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                <Truck className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Fast Delivery</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automated dispatch with courier tracking and 7-day easy replacements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-[#111] text-white rounded-2xl p-8 sm:p-12 space-y-8 border border-slate-800">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                Features
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Built For Modern Shopping
              </h2>
              <p className="text-sm text-slate-400">
                Key advantages that make Cartly the trusted choice:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6 border-t border-slate-800">
              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2">
                <Award className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white text-sm">Official Warranty</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  1-year warranty on all certified products with easy claim support.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2">
                <Zap className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white text-sm">Instant Checkout</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seamless payment flow with UPI, Google Pay, PhonePe, and instant confirmation.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2">
                <RotateCcw className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white text-sm">7-Day Returns</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast replacement for any transit damage or manufacturer defects.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2">
                <Headphones className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white text-sm">24/7 Support</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Specialists available via chat and phone for order and setup help.
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
