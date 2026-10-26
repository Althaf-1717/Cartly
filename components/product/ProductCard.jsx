'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Eye, Zap, Lock, Check, Share2 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency, calculateDiscount } from '@/lib/utils/formatters';

export default function ProductCard({ product, onQuickView }) {
  const router = useRouter();
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.originalPrice, product.price);
  const cartItem = items.find((i) => i.productId === product.id);
  const inCart = Boolean(cartItem);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}`);
      return;
    }
    addToCart(product, product.variants?.[0] || null, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/product/${product.slug}?shared=true`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative bg-surface border border-border hover:border-accent rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-subtle">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-dark text-surface text-[10px] font-semibold rounded-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="px-2 py-0.5 bg-emerald-500/80 text-surface text-[10px] font-medium rounded-md flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" /> Trending
            </span>
          )}
        </div>

        {/* Top Right Action Icons: Wishlist & Share */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`p-2 rounded-lg transition-all active:scale-90 shadow-sm ${
              inWishlist ? 'bg-rose-600 text-white' : 'bg-white/90 dark:bg-surface/90 text-muted hover:text-accent'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleQuickShare}
            aria-label="Share Link"
            className="p-2 rounded-lg bg-white/90 dark:bg-surface/90 text-muted hover:text-accent transition-all active:scale-90 shadow-sm"
            title="Copy share link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick View */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onQuickView(product)}
              className="w-full py-2 bg-surface/95 dark:bg-dark/95 text-text text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm backdrop-blur-sm"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-muted uppercase tracking-wider text-[10px] truncate max-w-[140px]">
              {product.brand || product.categoryName || 'Cartly'}
            </span>
            <div className="flex items-center gap-1 text-muted text-[11px] shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.rating || 5.0}</span>
              <span className="text-muted/60 dark:text-muted">({product.reviewsCount || 0})</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-semibold text-text hover:text-accent line-clamp-1 transition">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-border space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-text">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-muted/70 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted font-medium">Free Delivery</span>
          </div>

          {isAuthenticated ? (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition ${
                inCart ? 'bg-accent text-white shadow-sm' : 'bg-subtle hover:bg-accent text-text hover:shadow-sm'
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" /> In Cart ({cartItem.quantity})
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
              className="w-full py-2.5 px-4 rounded-lg bg-subtle hover:bg-accent hover:text-white text-muted text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5" /> Sign In to Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}