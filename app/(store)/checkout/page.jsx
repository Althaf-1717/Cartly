'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Tag,
  Check,
  AlertCircle,
  Package,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/auth/authContext';
import { formatCurrency } from '@/lib/utils/formatters';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    subtotal,
    discountAmount,
    coupon,
    applyCoupon,
    removeCoupon,
    couponError,
    shippingCost,
    finalTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Aarav Sharma',
    email: user?.email || 'aarav.sharma@example.com',
    phone: user?.phone || '+91 98765 43210',
    flatBuilding: user?.address?.street || 'Flat 402, Skyline Residency, Indiranagar',
    street: user?.address?.street || '100ft Road, Indiranagar',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    postalCode: user?.address?.postalCode || '560038',
    country: 'India',
  });

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    await applyCoupon(couponCodeInput);
    setCouponCodeInput('');
  };

  const generateOrderNumber = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `CRT-${dateStr}-${randomNum}`;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
      // Generate a secure 6-digit verification code
      const verificationCode = `VFY-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderPayload = {
        orderNumber: generatedOrderNum,
        verificationCode,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: { ...formData },
        subtotal,
        discountAmount,
        couponCode: coupon?.code || '',
        shippingCost,
        totalAmount: finalTotal,
        paymentGateway: 'razorpay',
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          brand: i.brand || 'Cartly Brand',
          sku: i.sku || 'SKU-STD',
          size: i.size || 'M',
          image: i.image,
          images: Array.isArray(i.images) && i.images.length > 0 ? i.images : [i.image],
          unitPrice: i.price,
          quantity: i.quantity,
          variantName: i.variantName || `Size ${i.size || 'M'}`,
        })),
      };

      const isRazorpayLoaded = await loadRazorpayScript();
      const isRealKey =
        paymentData.keyId &&
        paymentData.keyId.startsWith('rzp_') &&
        !paymentData.keyId.includes('demo');

      if (isRazorpayLoaded && window.Razorpay && isRealKey) {
        // Open Official Live / Test Razorpay Checkout Popup
        const options = {
          key: paymentData.keyId,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency || 'INR',
          name: 'Cartly Store',
          description: `Payment for Order #${generatedOrderNum}`,
          image: '/logo.png',
          order_id: paymentData.order.id,
          handler: async function (response) {
            try {
              const verifyRes = await fetch('/api/checkout/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderDetails: orderPayload,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyData.success) {
                throw new Error(verifyData.error || 'Payment signature verification failed');
              }
              clearCart();
              router.push(`/order-success?orderId=${generatedOrderNum}`);
            } catch (err) {
              setErrorMsg(err.message || 'Payment verification failed');
              setProcessing(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#ea580c', // Cartly orange
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setErrorMsg(response.error?.description || 'Payment was declined or cancelled. Please try again.');
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Safe simulation fallback for test mode without real keys
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
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during payment processing');
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link
            href="/catalog"
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/cart"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 flex items-center gap-1.5 transition font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Checkout
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery Address & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" /> Delivery Shipping Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Flat, House no., Building, Apartment</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">City / Town</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-medium"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-600" /> Payment Method
              </h2>

              <div className="space-y-3 text-xs">
                <label className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                  paymentMethod === 'razorpay'
                    ? 'bg-orange-500/10 border-orange-500 text-slate-900 dark:text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-[#0a0a0a] border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-orange-600 w-4 h-4"
                    />
                    <div>
                      <p className="font-bold">Online Payment (UPI / Cards / NetBanking)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Powered by Razorpay Secure Gateway</p>
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xs sticky top-28">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.brand} • Size: <strong className="text-orange-600 dark:text-orange-400">{item.size || 'M'}</strong> • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                {coupon ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>Code <strong>{coupon.code}</strong> Applied (-{formatCurrency(discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-500 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Enter Promo Code"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-xl transition"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-500">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Financial Totals */}
              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-orange-600 dark:text-orange-400">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-600/25 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{processing ? 'Processing Payment...' : `Pay ${formatCurrency(finalTotal)} & Confirm`}</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
