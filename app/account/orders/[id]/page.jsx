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
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#061e14] flex items-center justify-center text-slate-900 dark:text-white">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#061e14] flex flex-col items-center justify-center text-slate-900 dark:text-white p-6 space-y-3">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <Link href="/account" className="text-xs text-emerald-600 font-bold underline">
          Return to Settings Hub
        </Link>
      </div>
    );
  }

  const currentStepIndex = Math.max(0, STATUS_STEPS.indexOf(order.status));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="text-xs text-slate-500 dark:text-emerald-300/70 hover:text-emerald-600 flex items-center gap-1.5 transition font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Settings
          </Link>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white dark:bg-[#09261a] hover:bg-slate-100 dark:hover:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-emerald-200 font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-600" /> Print Receipt
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-emerald-900/60">
            <div>
              <span className="text-[11px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Order Reference</span>
              <h1 className="text-xl font-mono font-black text-emerald-700 dark:text-emerald-400">{order.orderNumber}</h1>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 dark:text-emerald-400/60 uppercase font-bold">Total Amount</span>
              <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 sm:justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Razorpay SSL Verified
              </span>
            </div>
          </div>

          {/* Fulfillment Pipeline */}
          <div className="py-4 space-y-4">
            <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
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
                        isPassed ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-emerald-950'
                      }`}
                    />
                    <span
                      className={`text-[11px] font-bold capitalize block ${
                        isCurrent
                          ? 'text-emerald-700 dark:text-emerald-400 font-black'
                          : isPassed
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-emerald-400/60'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-700 dark:text-emerald-200">
                  Courier AWB: <strong className="text-emerald-800 dark:text-emerald-300 font-mono">{order.trackingNumber}</strong>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> In Transit
                </span>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-emerald-900/60">
            <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Manifest Items
            </h3>
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-emerald-950/60 rounded-xl border border-slate-200 dark:border-emerald-900 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80'}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                    <p className="text-slate-500 dark:text-emerald-300/70 text-[11px]">{item.variantName} • SKU: {item.sku}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-slate-500 dark:text-emerald-300/70">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                  <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(item.quantity * item.unitPrice)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Destination */}
          {order.shippingAddress && (
            <div className="pt-4 border-t border-slate-100 dark:border-emerald-900/60 text-xs">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">
                Shipping Destination
              </h3>
              <p className="text-slate-900 dark:text-white font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600 dark:text-emerald-200/80">{order.shippingAddress.street || order.shippingAddress.flatBuilding}</p>
              <p className="text-slate-600 dark:text-emerald-200/80">
                {order.shippingAddress.city || order.shippingAddress.townCity}, {order.shippingAddress.state} - {order.shippingAddress.postalCode || order.shippingAddress.pincode}
              </p>
              <p className="text-slate-500 dark:text-emerald-400/60 mt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
