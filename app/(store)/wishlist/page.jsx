'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ProductCard from '@/components/product/ProductCard';
import { useWishlist } from '@/lib/context/WishlistContext';
import { StoreService } from '@/lib/db/storeService';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistProducts() {
      setLoading(true);
      const all = await StoreService.getProducts();
      const filtered = all.filter((p) => wishlist.includes(p.id));
      setProducts(filtered);
      setLoading(false);
    }
    loadWishlistProducts();
  }, [wishlist]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300/70 mt-1">
              {products.length} {products.length === 1 ? 'saved item' : 'saved items'}
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
          >
            Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-900/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl p-16 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto border border-orange-200 dark:border-slate-800">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-300/70 max-w-sm mx-auto">
              Click the heart icon on any product to save items here for quick ordering and price tracking.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20 transition"
            >
              Discover Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
