'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency } from '@/lib/utils/formatters';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    shippingCost,
    discountAmount,
    finalTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
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

  const handleProceedCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Your Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in order manifest
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-16 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-emerald-950 text-slate-400 dark:text-emerald-400/60 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is currently empty</h3>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70 max-w-sm mx-auto">
              Explore certified hardware, acoustics, smart wearables, and creator workstations.
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-0.5">{item.variantName || 'Standard'}</p>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">{formatCurrency(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="flex items-center bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Order Summary</h3>

                {/* Coupon Box */}
                <div>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl text-xs">
                      <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                        Promo <strong>{coupon.code}</strong> applied (-{formatCurrency(coupon.discountAmount)})
                      </span>
                      <button
                        onClick={removeCoupon}
                        className="text-slate-500 hover:text-red-500 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon code (e.g. CARTLY20)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="submit"
                        disabled={applying || !couponInput.trim()}
                        className="px-4 py-2 bg-slate-100 dark:bg-emerald-900 hover:bg-slate-200 dark:hover:bg-emerald-800 text-xs font-bold text-slate-900 dark:text-white rounded-xl transition"
                      >
                        {applying ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
                </div>

                {/* Calculations */}
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-emerald-200/70 pt-2 border-t border-slate-100 dark:border-emerald-900/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                      <span>Promo Discount</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span>
                      {shippingCost === 0 ? (
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</strong>
                      ) : (
                        formatCurrency(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-emerald-900/60">
                    <span>Final Total</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-lg">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedCheckout}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                >
                  {isAuthenticated ? (
                    <>
                      <span>Proceed to Checkout</span> <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> <span>Sign In to Buy</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-emerald-400/60 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Razorpay Verified & 256-Bit SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
