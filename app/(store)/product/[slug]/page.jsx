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
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import ReviewSection from '@/components/product/ReviewSection';
import ProductCard from '@/components/product/ProductCard';
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
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-white dark:bg-[#061e14] flex items-center justify-center text-slate-900 dark:text-white">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#061e14] flex flex-col items-center justify-center text-slate-900 dark:text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-slate-500 dark:text-emerald-400/60 text-sm mb-4">The requested item does not exist or has been archived.</p>
        <Link href="/catalog" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
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
      router.push(`/auth/login?redirect=/product/${product.slug}`);
      return;
    }
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-16">
        {/* Breadcrumb */}
        <div className="text-xs text-slate-500 dark:text-emerald-400/60 flex items-center gap-1.5 font-semibold">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Home</Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            {product.categoryName || product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Gallery (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] rounded-lg uppercase tracking-wider">
                  {product.brand || 'Certified Brand'}
                </span>
                {product.isTrending && (
                  <span className="px-2.5 py-1 bg-emerald-900/90 text-emerald-100 border border-emerald-700 text-[11px] font-bold rounded-lg uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-emerald-300 text-emerald-300" /> Trending
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & SKU */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold bg-white dark:bg-[#09261a] px-2.5 py-1 rounded-xl border border-slate-200 dark:border-emerald-900/60 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>{product.rating || 5.0}</span>
                  <span className="text-slate-400 dark:text-emerald-400/60 font-normal">({reviews.length} reviews)</span>
                </div>
                <span className="text-slate-400 dark:text-emerald-400/60 font-mono font-semibold">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/60 rounded-2xl flex items-baseline gap-4 shadow-xs">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(currentPrice)}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-base text-slate-400 dark:text-emerald-400/60 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg uppercase">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed">
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

            {/* Purchase Action Buttons */}
            <div className="space-y-4 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl px-3 py-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-bold text-sm text-slate-900 dark:text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`p-3.5 rounded-xl border transition ${inWishlist ? 'bg-rose-600 text-white border-rose-600' : 'bg-white dark:bg-emerald-950 border-slate-200 dark:border-emerald-800 text-slate-600 dark:text-emerald-300 hover:text-slate-900 dark:hover:text-white'}`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-emerald-300 text-emerald-300" /> Instant Buy Now
                  </button>
                </>
              ) : (
                /* GUEST USER CTA */
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Member Purchasing Required
                  </div>
                  <p className="text-xs text-slate-600 dark:text-emerald-200/70">
                    Sign in to your customer account to add this item to your cart and complete checkout.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Link
                      href={`/auth/login?redirect=/product/${product.slug}`}
                      className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      Sign In Now
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="py-3 bg-white dark:bg-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-800 text-slate-900 dark:text-white font-bold text-xs rounded-xl border border-slate-200 dark:border-emerald-700 transition"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-emerald-900/60 text-[11px] text-slate-600 dark:text-emerald-300/80 font-semibold">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>48h Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>1-Yr Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/60 rounded-2xl p-8 space-y-6 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 px-4 bg-slate-50 dark:bg-emerald-950 rounded-xl border border-slate-200 dark:border-emerald-850">
                  <span className="text-slate-500 dark:text-emerald-300/70 font-semibold">{key}</span>
                  <span className="text-slate-900 dark:text-emerald-300 font-bold">{value}</span>
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
      </main>
    </div>
  );
}
