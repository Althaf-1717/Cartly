'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Key,
  Copy,
  Check,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

const STATUS_STEPS = ['booked', 'processing', 'shipped', 'delivered'];

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (params.id === 'recent') {
        const all = await StoreService.getOrders();
        setOrder(all[0] || null);
      } else {
        const found = await StoreService.getOrderById(params.id);
        setOrder(found);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-slate-900 dark:text-white">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center text-slate-900 dark:text-white p-6 space-y-3">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/account" className="text-xs text-orange-600 font-bold underline">
          Return to Settings Hub
        </Link>
      </div>
    );
  }

  const currentStepIndex = Math.max(0, STATUS_STEPS.indexOf(order.status));

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 flex items-center gap-1.5 transition font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#111111] hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-orange-600" /> Print Receipt
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold">Order Reference</span>
              <h1 className="text-xl font-mono font-black text-orange-600 dark:text-orange-400">{order.orderNumber}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase font-bold">Total Amount</span>
              <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
              <span className="text-[11px] text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1 sm:justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> Razorpay Verified & Paid
              </span>
            </div>
          </div>

          {/* Verification Code Box */}
          {order.verificationCode && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                  <Key className="w-4 h-4" />
                  <span>Order Verification Code</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Provide this verification code upon delivery or to customer support to verify the order.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base px-3 py-1.5 bg-[#0a0a0a] text-orange-400 rounded-xl border border-orange-500/30">
                  {order.verificationCode}
                </span>
                <button
                  onClick={() => copyCode(order.verificationCode)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
                  title="Copy Code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Fulfillment Pipeline */}
          <div className="py-4 space-y-4">
            <h3 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Live Fulfillment Tracking
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="space-y-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isPassed ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-900'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold capitalize block ${
                        isCurrent
                          ? 'text-orange-600 dark:text-orange-400 font-black'
                          : isPassed
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="p-3.5 bg-orange-50 dark:bg-[#0a0a0a] border border-orange-200 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-200">
                  Courier AWB: <strong className="text-orange-600 dark:text-orange-400 font-mono">{order.trackingNumber}</strong>
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> In Transit
                </span>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              Ordered Manifest Items
            </h3>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-[#0a0a0a] rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80'}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{item.variantName} • SKU: {item.sku}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-slate-500 dark:text-slate-400">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.quantity * item.unitPrice)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Destination */}
          {order.shippingAddress && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <h3 className="font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">
                Shipping Destination
              </h3>
              <p className="text-slate-900 dark:text-white font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600 dark:text-slate-300">
                {order.shippingAddress.street || order.shippingAddress.flatBuilding}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {order.shippingAddress.city || order.shippingAddress.townCity}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode || order.shippingAddress.pincode}
              </p>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
