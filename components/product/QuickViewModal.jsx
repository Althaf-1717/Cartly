'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ArrowRight, Lock } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency, calculateDiscount } from '@/lib/utils/formatters';

export default function QuickViewModal({ product, isOpen, onClose }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || '');

  if (!isOpen || !product) return null;

  const currentImage = selectedImage || product.images?.[0];
  const inWishlist = isInWishlist(product.id);
  const price = selectedVariant?.price || product.price;
  const discountPercent = calculateDiscount(product.originalPrice, price);

  const handleAction = () => {
    if (!isAuthenticated) {
      onClose();
      router.push('/auth/login?role=customer');
      return;
    }
    addToCart(product, selectedVariant, 1);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-800 rounded-2xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 text-slate-900 dark:text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-emerald-950 hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-500 dark:text-emerald-200 hover:text-slate-900 dark:hover:text-white transition z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Gallery */}
          <div className="p-6 bg-slate-50 dark:bg-emerald-950/60 flex flex-col justify-between border-r border-slate-100 dark:border-emerald-900/60">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900 relative">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-md">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${selectedImage === img ? 'border-emerald-600' : 'border-slate-200 dark:border-emerald-900 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {product.brand || product.categoryName}
                </span>
                <span>•</span>
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{product.rating || 5.0}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h2>
              <p className="text-xs text-slate-600 dark:text-emerald-200/70 leading-relaxed line-clamp-3 mb-4">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(price)}</span>
                {product.originalPrice && product.originalPrice > price && (
                  <span className="text-sm text-slate-400 dark:text-emerald-400/60 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>

              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-emerald-200 mb-2">
                    Options:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${selectedVariant?.id === v.id ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-emerald-200'}`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-emerald-900/60">
              <div className="flex gap-2">
                <button
                  onClick={handleAction}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                >
                  {isAuthenticated ? (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Sign In to Purchase
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition ${inWishlist ? 'bg-rose-600 text-white border-rose-600' : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-500 dark:text-emerald-200'}`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full py-2 text-center text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center justify-center gap-1"
              >
                View Full Product Specs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
