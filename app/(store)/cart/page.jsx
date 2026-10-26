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

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="w-16 h-16 text-muted mb-4" />
            <h2 className="text-xl font-bold text-text mb-2">Your cart is empty</h2>
            <p className="text-sm text-muted max-w-md mb-6">
              Add some items to your cart to see them here. Browse our catalog to find the products you love.
            </p>
            <Link href="/catalog" className="px-5 py-3 bg-accent hover:bg-accent-active text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2">
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items + Summary Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* Items */}
              <div className="space-y-4">
                <h2 className="text-base font-bold uppercase tracking-wider text-muted px-1 mb-1">
                  Your Order ({items.length})
                </h2>
                {items.map((item) => (
                  <div key={item.id} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                    {/* Item Image */}
                    <div className="flex gap-4">
                      {/* Quantity stepper - left side */}
                      <div className="flex items-center bg-subtle dark:bg-dark rounded-lg px-3 py-2 min-w-[120px]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-7 h-7 rounded-full text-muted hover:bg-accent transition flex items-center justify-center text-sm font-bold"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          −
                        </button>
                        <span className="text-sm text-text font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 rounded-full text-muted hover:bg-accent transition flex items-center justify-center text-sm font-bold"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Product details - right side */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.slug}`} className="block truncate">
                          <h4 className="font-semibold text-text text-sm mb-1 line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted font-mono line-clamp-1">{item.sku}</p>
                        </Link>
                        <span className="inline-block mt-1 text-xs text-accent font-medium px-2 py-0.5 rounded bg-accent-active">
                          {formatCurrency(item.variant?.price || item.unitPrice)}
                        </span>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition shrink-0"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Coupon input row */}
                    <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-1.5 bg-subtle border border-border rounded-lg text-text text-xs focus:outline-none focus:border-accent"
                      />
                      <button type="submit" disabled={applying} className="px-3 py-1.5 bg-accent hover:bg-accent-active text-white rounded-lg text-xs font-bold disabled:opacity-50 transition shrink-0">
                        {applying ? 'Applying...' : 'Apply'}
                      </button>
                    </form>
                  </div>
                ))}
              </div>

              {/* Summary Panel */}
              <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-text mb-1 px-1">Order Summary</h3>

                {/* Subtotal, Shipping, Discount, Total */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-muted">
                    <span>Subtotal</span>
                    <span className="text-text font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Shipping ({shippingCost > 0 ? 'incl.' : 'free'})</span>
                    <span className="text-text font-medium">{shippingCost > 0 ? formatCurrency(shippingCost) : '-'}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Discount</span>
                      <span className="text-text font-medium">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-2 border-t border-border font-black text-lg text-text">
                  <span>Total Due</span>
                  <span>{formatCurrency(finalTotal)}</span>
                </div>

                {/* CTA */}
                {isAuthenticated ? (
                  <Link href="/checkout" className="block w-full py-3 bg-accent hover:bg-accent-active text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link href="/auth/login?role=customer" className="block w-full py-3 bg-subtle hover:bg-accent hover:text-white text-accent text-white rounded-xl text-xs font-bold transition border border-border flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5" /> Sign In to Checkout
                  </Link>
                )}

                {/* Clear Cart button */}
                {items.length > 1 && (
                  <button onClick={() => clearCart()} className="w-full py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition font-medium">
                    Clear All Items
                  </button>
                )}
              </div>
            </div>

            {/* Empty state above items - actually shown when no items */}
          </>
        )}

        {/* Coupon error */}
        {couponError && (
          <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium">{couponError}</span>
          </div>
        )}
      </div>
    </div>
  );
}