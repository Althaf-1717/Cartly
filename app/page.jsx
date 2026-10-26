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
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import { StoreService } from '@/lib/db/storeService';
import { useAuth } from '@/lib/auth/authContext';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const { isAuthenticated, user } = useAuth();

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
    <div className="min-h-screen bg-bg text-text transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 space-y-24 pb-20 overflow-hidden">
        {/* 1. EDITORIAL HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden min-h-[480px] lg:min-h-[520px] flex items-center bg-surface">
            <div className="absolute inset-0 z-0">
              <img
                src={currentBanner.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-accent/60 via-surface/70 to-transparent" />
            </div>

            <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-white text-xs font-medium tracking-wide">
                {currentBanner.badgeText}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                {currentBanner.title}
              </h1>

              <p className="text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                {currentBanner.subtitle}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/catalog"
                    className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium text-sm rounded-lg flex items-center gap-2 transition shadow-sm"
                  >
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium text-sm rounded-lg flex items-center gap-2 transition shadow-sm"
                    >
                      <LogIn className="w-4 h-4" /> Sign In to Shop
                    </Link>
                    <Link
                      href="/catalog"
                      className="px-6 py-3 bg-subtle hover:bg-border text-text font-medium text-sm rounded-lg border border-border transition"
                    >
                      Preview Catalog
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. MEMBER NOTICE OR GREETING */}
        {!isAuthenticated && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                <Lock className="w-5 h-5 text-muted shrink-0" />
                <div>
                  <h3 className="font-semibold text-text text-sm">Member-Only Shopping</h3>
                  <p className="text-xs text-muted mt-0.5">
                    Sign in or register to add items to your cart and complete checkout.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-accent hover:bg-accent-active text-white font-bold text-xs rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-subtle hover:bg-surface text-text font-bold text-xs rounded-lg border border-border transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </section>
        )}

        {isAuthenticated && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-text text-sm">
                    Welcome back, {user?.fullName || 'Valued Member'}!
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Your session is active. Explore newly restocked Men's & Women's apparel, shoes, and gadgets below.
                  </p>
                </div>
              </div>
              <Link
                href="/catalog"
                className="px-4 py-2 bg-accent hover:bg-accent-active text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>
        )}

        {/* 3. CATEGORY CAROUSEL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryCarousel />
        </section>

        {/* 4. EXPLORE CATEGORIES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-muted">Categories</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight mt-1">Explore Products</h2>
            </div>
            <Link
              href="/catalog"
              className="text-sm font-medium text-muted hover:text-text flex items-center gap-1 transition"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <motion.div
              className="flex gap-4 w-max"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ ease: 'linear', duration: 25, repeat: Infinity }}
              whileHover={{ animationPlayState: 'paused' }}
            >
              {marqueeCategories.map((cat, idx) => (
                <Link
                  key={`${cat.id}-${idx}`}
                  href={`/catalog?category=${cat.slug}`}
                  className="group w-36 sm:w-40 shrink-0 bg-surface border border-border hover:border-accent rounded-2xl p-2.5 flex flex-col items-center text-center transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-subtle dark:bg-surface mb-2">
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-text group-hover:text-accent transition truncate w-full">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-muted mt-0.5">
                    {cat.itemCount || 10}+ Items
                  </span>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 5. ABOUT */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-subtle dark:bg-surface border border-border rounded-2xl p-8 sm:p-12 space-y-8">
            <div className="max-w-3xl space-y-3">
              <span className="text-xs font-medium uppercase tracking-widest text-muted">About Cartly</span>
              <h2 className="text-2xl sm:text-4xl font-bold text-text tracking-tight">
                Quality Products. Trusted Service. Fast Delivery.
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Cartly brings certified brands and curated collections together with secure payments and automated dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-border">
              <div className="p-5 bg-white dark:bg-surface rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">Certified Originals</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Every product is sourced directly with official manufacturer warranty.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-surface rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                <CreditCard className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">Secure Payments</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Encrypted payments via UPI, Cards, and NetBanking with instant verification.
                </p>
              </div>

              <div className="p-5 bg-white dark:bg-surface rounded-xl border border-slate-100 dark:border-slate-800 space-y-3 shadow-sm">
                <Truck className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">Fast Delivery</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Automated dispatch with courier tracking and 7-day easy replacements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FEATURES */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-subtle text-surface rounded-2xl p-8 sm:p-12 space-y-8 border border-border">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-medium uppercase tracking-widest text-muted">Features</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
                Built For Modern Shopping
              </h2>
              <p className="text-sm text-muted">
                Key advantages that make Cartly the trusted choice:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-6 border-t border-border">
              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2 shadow-sm">
                <Award className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">Official Warranty</h3>
                <p className="text-xs text-muted leading-relaxed">
                  1-year warranty on all certified products with easy claim support.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2 shadow-sm">
                <Zap className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">Instant Checkout</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Seamless payment flow with UPI, Google Pay, PhonePe, and instant confirmation.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2 shadow-sm">
                <RotateCcw className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">7-Day Returns</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Fast replacement for any transit damage or manufacturer defects.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-slate-800 space-y-2 shadow-sm">
                <Headphones className="w-5 h-5 text-muted" />
                <h3 className="font-semibold text-text text-sm">24/7 Support</h3>
                <p className="text-xs text-muted leading-relaxed">
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