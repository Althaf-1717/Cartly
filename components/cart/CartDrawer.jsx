'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency } from '@/lib/utils/formatters';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    shippingCost,
    discountAmount,
    finalTotal,
    freeShippingRemaining,
    FREE_SHIPPING_THRESHOLD,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    coupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setApplying(true);
    const success = await applyCoupon(couponInput);
    if (success) setCouponInput('');
    setApplying(false);
  };

  const handleCheckoutClick = () => {
    setIsDrawerOpen(false);
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  const progressPercent = Math.min(
    100,
    Math.round(((FREE_SHIPPING_THRESHOLD - freeShippingRemaining) / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white dark:bg-[#0a0a0a] border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white">Cart</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping */}
              <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    {freeShippingRemaining === 0 ? (
                      <span className="text-orange-600 dark:text-orange-400 font-medium">
                        Free shipping unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="font-semibold">{formatCurrency(freeShippingRemaining)}</strong> for free shipping
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-base">Your cart is empty</h4>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Discover products in the catalog to get started.
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="mt-2 px-5 py-2 bg-slate-900 dark:bg-white hover:opacity-90 text-white dark:text-slate-900 text-xs font-medium rounded-lg transition"
                    >
                      <Link href="/catalog">Browse Products</Link>
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl flex gap-3 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg bg-slate-50 dark:bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {item.variantName || 'Standard'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 dark:text-slate-600 hover:text-red-500 p-1 transition self-start"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  {/* Coupon */}
                  <div>
                    {coupon ? (
                      <div className="flex items-center justify-between bg-orange-50 dark:bg-slate-900/30 border border-orange-200 dark:border-slate-800/50 p-2.5 rounded-lg text-xs">
                        <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium">
                          <Tag className="w-3.5 h-3.5" />
                          <span>
                            <strong>{coupon.code}</strong> applied (-{formatCurrency(coupon.discountAmount)})
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-slate-500 hover:text-red-500 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
                          <input
                            type="text"
                            placeholder="Promo code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={applying || !couponInput.trim()}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-900 dark:text-white rounded-lg transition"
                        >
                          {applying ? '...' : 'Apply'}
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                  </div>

                  {/* Pricing */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-orange-600 dark:text-orange-400 font-medium">
                        <span>Discount</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <strong className="text-orange-600 dark:text-orange-400">FREE</strong>
                        ) : (
                          formatCurrency(shippingCost)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Total</span>
                      <span className="text-base font-bold">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition active:scale-[0.98]"
                    >
                      {isAuthenticated ? (
                        <>
                          <span>Checkout</span> <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> <span>Sign In to Checkout</span>
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Secure checkout · SSL encrypted</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
