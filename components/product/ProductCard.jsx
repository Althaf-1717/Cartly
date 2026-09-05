'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Eye, Zap, Lock, Check } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency, calculateDiscount } from '@/lib/utils/formatters';

export default function ProductCard({ product, onQuickView }) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const inWishlist = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.originalPrice, product.price);
  
  const cartItem = items.find((i) => i.productId === product.id);
  const inCart = Boolean(cartItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/auth/login?role=customer');
      return;
    }
    addToCart(product, product.variants?.[0] || null, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Image & Badges Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-emerald-950/40">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded-md uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="px-2.5 py-0.5 bg-emerald-900/90 text-emerald-100 border border-emerald-700 text-[10px] font-bold rounded-md uppercase shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3 fill-emerald-300 text-emerald-300" /> Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 p-2.5 rounded-xl transition-all shadow-xs z-10 active:scale-90 ${
            inWishlist
              ? 'bg-rose-600 text-white'
              : 'bg-white/90 dark:bg-emerald-950/80 text-slate-500 dark:text-emerald-200 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onQuickView(product)}
              className="w-full py-2 bg-emerald-900/90 hover:bg-emerald-900 text-white border border-emerald-700/60 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg backdrop-blur-xs"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-emerald-300/70 mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:text-emerald-400 truncate max-w-[140px]">
              {product.brand || product.categoryName || 'Cartly Verified'}
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] shrink-0">
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>{product.rating || 5.0}</span>
              <span className="text-slate-400 dark:text-emerald-400/60 font-normal">({product.reviewsCount || 0})</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 transition">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-emerald-200/70 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add to Cart Button */}
        <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 dark:text-emerald-400/60 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Free Delivery
            </span>
          </div>

          {/* Green Add to Cart Button */}
          {isAuthenticated ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98 ${
                inCart
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400/40'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart ({cartItem.quantity})
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          ) : (
            <Link
              href="/auth/login?role=customer"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-emerald-950 hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-emerald-200 text-xs font-bold border border-slate-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In to Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
