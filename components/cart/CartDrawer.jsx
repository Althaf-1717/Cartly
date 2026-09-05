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
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-white dark:bg-[#061e14] border-l border-slate-200 dark:border-emerald-800 text-slate-900 dark:text-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-emerald-900/60 flex items-center justify-between bg-slate-50/80 dark:bg-emerald-950/80 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Shopping Cart</h3>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/70">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Meter */}
              <div className="px-5 py-3.5 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200/60 dark:border-emerald-800/40 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-emerald-100">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {freeShippingRemaining === 0 ? (
                      <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                        You unlocked FREE Express Delivery!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-emerald-800 dark:text-emerald-300 font-bold">{formatCurrency(freeShippingRemaining)}</strong> for free shipping
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-emerald-600 rounded-full"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-emerald-950/60 text-slate-400 dark:text-emerald-400/60 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">Your cart is empty</h4>
                    <p className="text-xs text-slate-500 dark:text-emerald-200/70 max-w-xs">
                      Discover verified hardware, smart wearables, and workstations in the catalog.
                    </p>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
                    >
                      <Link href="/catalog">Discover Products</Link>
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/60 rounded-2xl flex gap-3.5 items-center shadow-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 mt-0.5 truncate">
                          {item.variantName || 'Standard Edition'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                          <div className="flex items-center gap-1.5 bg-white dark:bg-emerald-950 px-2 py-1 rounded-xl border border-slate-200 dark:border-emerald-800">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-0.5"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-900 dark:text-white px-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-0.5"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 transition self-start"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-slate-100 dark:border-emerald-900/60 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-sm space-y-4">
                  {/* Coupon Box */}
                  <div>
                    {coupon ? (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 p-2.5 rounded-xl text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                          <Tag className="w-4 h-4" />
                          <span>
                            Promo <strong>{coupon.code}</strong> applied (-{formatCurrency(coupon.discountAmount)})
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-slate-500 hover:text-red-500 text-xs font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-emerald-400/60" />
                          <input
                            type="text"
                            placeholder="Promo code (e.g. CARTLY20)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-emerald-900/40 border border-slate-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={applying || !couponInput.trim()}
                          className="px-3.5 py-2 bg-slate-100 dark:bg-emerald-900 hover:bg-slate-200 dark:hover:bg-emerald-800 disabled:opacity-50 text-xs font-bold text-slate-900 dark:text-white rounded-xl transition"
                        >
                          {applying ? '...' : 'Apply'}
                        </button>
                      </form>
                    )}
                    {couponError && <p className="text-[11px] text-red-500 mt-1 font-medium">{couponError}</p>}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-emerald-200/70 pt-2 border-t border-slate-100 dark:border-emerald-900/60">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                        <span>Discount Applied</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</strong>
                        ) : (
                          formatCurrency(shippingCost)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-emerald-900/60">
                      <span>Total</span>
                      <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Action */}
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98"
                    >
                      {isAuthenticated ? (
                        <>
                          <span>Proceed to Checkout</span> <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" /> <span>Sign In to Checkout</span>
                        </>
                      )}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-emerald-400/60 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Razorpay Verified & 256-Bit SSL Encrypted</span>
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
