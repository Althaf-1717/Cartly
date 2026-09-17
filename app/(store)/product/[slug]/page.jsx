'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Plus,
  Minus,
  Lock,
  Share2,
  Check,
  Copy,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import ReviewSection from '@/components/product/ReviewSection';
import ProductCard from '@/components/product/ProductCard';
import ShareProductModal from '@/components/product/ShareProductModal';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/auth/authContext';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, calculateDiscount } from '@/lib/utils/formatters';

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const prod = await StoreService.getProductBySlug(params.slug);
      if (prod) {
        setProduct(prod);
        setSelectedVariant(prod.variants?.[0] || null);
        const revs = await StoreService.getReviews(prod.id);
        setReviews(revs);
        const related = await StoreService.getProducts({ category: prod.category });
        setRelatedProducts(related.filter((p) => p.id !== prod.id).slice(0, 3));
      }
      setLoading(false);
    }
    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-slate-900 dark:text-white">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center text-slate-900 dark:text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400/60 text-sm mb-4">
          The requested item does not exist or has been archived.
        </p>
        <Link href="/catalog" className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const inWishlist = isInWishlist(product.id);
  const discountPercent = calculateDiscount(product.originalPrice, currentPrice);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}`);
      return;
    }
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const handleQuickCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/product/${product.slug}?shared=true`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* Top Breadcrumb & Share Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400/60 font-semibold border-b border-slate-100 dark:border-slate-850 pb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/catalog?category=${product.category}`}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition"
            >
              {product.categoryName || product.category}
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleQuickCopyLink}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-800"
              title="Copy shareable link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 shadow-sm shadow-orange-600/20"
              title="Generate share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Product</span>
            </button>
          </div>
        </div>

        {/* LOGGED IN CONFIRMATION BANNER (If user is authenticated) */}
        {isAuthenticated && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>
                You are logged in as <strong>{user?.fullName || user?.email}</strong>. You can buy or add this item to cart directly!
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20">
              Verified Member
            </span>
          </div>
        )}

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-slate-800 text-orange-800 dark:text-slate-300 font-bold text-[11px] rounded-lg uppercase tracking-wider">
                    {product.brand || 'Certified Brand'}
                  </span>
                  {product.isTrending && (
                    <span className="px-2.5 py-1 bg-slate-800/90 text-slate-100 border border-orange-700 text-[11px] font-bold rounded-lg uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-orange-300 text-slate-300" /> Trending
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 flex items-center gap-1 font-bold transition"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & SKU */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 text-orange-700 dark:text-orange-400 font-bold bg-white dark:bg-[#111111] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800/60 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
                  <span>{product.rating || 5.0}</span>
                  <span className="text-slate-400 dark:text-slate-400/60 font-normal">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <span className="text-slate-400 dark:text-slate-400/60 font-mono font-semibold">
                  SKU: {selectedVariant?.sku || product.sku}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/60 rounded-2xl flex items-baseline gap-4 shadow-xs">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(currentPrice)}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-base text-slate-400 dark:text-slate-400/60 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 bg-orange-600 text-white font-bold text-xs rounded-lg uppercase">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-100/80 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}

            {/* Purchase Action Buttons / Member Login Prompt */}
            <div className="space-y-4 pt-2">
              {isAuthenticated ? (
                /* 1. AUTHENTICATED USER: DIRECT PURCHASE THROUGH WEBSITE */
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-bold text-sm text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 px-6 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-3.5 rounded-xl border transition ${
                        inWishlist
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-orange-300 text-slate-300" /> Instant Buy Now
                  </button>
                </>
              ) : (
                /* 2. GUEST USER (OPENED VIA SHARED LINK): DISPLAY PRODUCT + CREATE ACCOUNT OR LOGIN CTA */
                <div className="p-6 bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/30 rounded-3xl space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" /> Shared Product Showcase
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      Member-Exclusive Checkout
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Want to order {product.name}?
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      You are viewing this product through a shared link. To add this item to your cart, unlock verified member pricing, and complete your purchase, please log in or create a free account.
                    </p>
                  </div>

                  {/* Two Primary Action Buttons: Create Account OR Login */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <Link
                      href={`/auth/signup?redirect=${encodeURIComponent(`/product/${product.slug}`)}`}
                      className="py-3.5 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 text-center transition flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Create Free Account</span>
                    </Link>

                    <Link
                      href={`/auth/login?redirect=${encodeURIComponent(`/product/${product.slug}`)}`}
                      className="py-3.5 px-4 bg-white dark:bg-[#111111] hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 text-center transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Lock className="w-4 h-4 text-orange-600" />
                      <span>Login to Your Account</span>
                    </Link>
                  </div>

                  <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
                    Takes less than 30 seconds • Returning directly back to this product upon sign in
                  </p>
                </div>
              )}
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300/80 font-semibold">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>48h Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>1-Yr Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        {product.specifications && (
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-3 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-orange-850"
                >
                  <span className="text-slate-500 dark:text-slate-300/70 font-semibold">{key}</span>
                  <span className="text-slate-900 dark:text-slate-300 font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <ReviewSection productId={product.id} initialReviews={reviews} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Recommended Upgrades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* SHARE PRODUCT MODAL */}
        <ShareProductModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          product={product}
        />
      </main>
    </div>
  );
}
