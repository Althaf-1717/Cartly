'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ShoppingBag,
  LogIn,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency, generateOrderNumber } from '@/lib/utils/formatters';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingCost, finalTotal, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Aarav Sharma',
    email: user?.email || 'aarav.sharma@example.com',
    phone: user?.phone || '+91 98765 43210',
    street: user?.address?.street || 'Flat 402, Skyline Residency, Indiranagar',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '560038',
    country: 'India',
  });

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('cartly_saved_addresses_v1');
      if (stored) {
        const list = JSON.parse(stored);
        setSavedAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) {
          setFormData({
            fullName: def.fullName || user?.fullName || 'Aarav Sharma',
            email: user?.email || 'aarav.sharma@example.com',
            phone: def.phone || user?.phone || '+91 98765 43210',
            street: `${def.flatBuilding || ''}, ${def.areaStreet || ''}`,
            city: def.townCity || 'Bengaluru',
            state: def.state || 'Karnataka',
            postalCode: def.pincode || '560038',
            country: def.country || 'India',
          });
        }
      }
    } catch (e) {}
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Sign In Required to Buy</h2>
          <p className="text-xs text-slate-500 dark:text-emerald-200/70 leading-relaxed">
            Cartly operates a member-verified marketplace. Please sign in or register to complete your delivery address and checkout securely.
          </p>
          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <Link
              href="/auth/login?redirect=/checkout"
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link
              href="/auth/signup?role=customer"
              className="py-3 bg-slate-100 dark:bg-emerald-950 hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-900 dark:text-white font-bold text-xs rounded-xl border border-slate-200 dark:border-emerald-800 flex items-center justify-center gap-2"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    setProcessing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal }),
      });
      const paymentData = await res.json();

      if (!paymentData.success) {
        throw new Error(paymentData.error || 'Failed to initiate payment');
      }

      const generatedOrderNum = generateOrderNumber();

      const orderPayload = {
        orderNumber: generatedOrderNum,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: { ...formData },
        subtotal,
        discountAmount,
        couponCode: coupon?.code || '',
        shippingCost,
        totalAmount: finalTotal,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          sku: i.sku || 'SKU-STD',
          image: i.image,
          unitPrice: i.price,
          quantity: i.quantity,
          variantName: i.variantName || 'Standard',
        })),
      };

      const verifyRes = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentData.order.id,
          razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 14)}`,
          razorpay_signature: 'simulated_valid_signature',
          orderDetails: orderPayload,
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      clearCart();
      router.push(`/order-success?orderId=${generatedOrderNum}`);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during payment processing');
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-400 dark:text-emerald-400/60" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70">Add products before proceeding to checkout.</p>
          <Link href="/catalog" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Secure Checkout</h1>
            <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">Complete your delivery address and payment verification</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 256-Bit SSL Encrypted
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-xs rounded-2xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Address */}
              <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-emerald-900/60">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Delivery Address</h3>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/70">Where should we deliver your order?</p>
                  </div>
                </div>

                {savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-emerald-200">
                      Choose From Saved Addresses:
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              fullName: addr.fullName,
                              email: formData.email,
                              phone: addr.phone,
                              street: `${addr.flatBuilding || ''}, ${addr.areaStreet || ''}`,
                              city: addr.townCity,
                              state: addr.state,
                              postalCode: addr.pincode,
                              country: addr.country,
                            });
                          }}
                          className={`p-3 rounded-xl border text-left text-xs shrink-0 max-w-[240px] transition ${
                            formData.postalCode === addr.pincode && formData.phone === addr.phone
                              ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 font-bold'
                              : 'bg-slate-50 dark:bg-emerald-950/40 border-slate-200 dark:border-emerald-850'
                          }`}
                        >
                          <p className="font-bold text-slate-900 dark:text-white truncate">{addr.fullName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-emerald-300/70 truncate">{addr.flatBuilding}, {addr.townCity}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">PIN / Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1.5">Country</label>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-500 font-bold cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-emerald-900/60">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Payment Method</h3>
                    <p className="text-xs text-slate-500 dark:text-emerald-300/70">Select payment channel</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-emerald-600 w-4 h-4"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Razorpay Payments (UPI, Cards, NetBanking)</span>
                          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                            Active
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-emerald-300/70 mt-0.5">
                          Instant checkout with Google Pay, PhonePe, Cards, and NetBanking.
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-xs">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Order Summary ({items.length})</h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-slate-500 dark:text-emerald-400/60 text-[11px]">Qty: {item.quantity} • {item.variantName}</p>
                      </div>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-emerald-200/70 pt-4 border-t border-slate-100 dark:border-emerald-900/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                      <span>Promo Savings ({coupon?.code})</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</strong> : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-emerald-900/60">
                    <span>Payable Total</span>
                    <span className="text-emerald-700 dark:text-emerald-400 text-lg">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98"
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Payment...</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay {formatCurrency(finalTotal)} Securely</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-emerald-400/60 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Razorpay Payment Gateway Signature Verified</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
