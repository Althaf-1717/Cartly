'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Home, ShieldCheck, Key, Copy, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { StoreService } from '@/lib/db/storeService';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'CRT-DEMO';
  const [order, setOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    StoreService.getOrderById(orderId).then(setOrder);
  }, [orderId]);

  const copyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-600/30">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Payment Confirmed!</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300/70 mt-1.5">
          Thank you for ordering with Cartly. Your package is now booked and scheduled for dispatch.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Order Reference
            </span>
            <p className="text-lg font-mono font-bold text-orange-600 dark:text-orange-400">{orderId}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Payment Status
            </span>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 sm:justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Razorpay Verified & Paid
            </p>
          </div>
        </div>

        {/* Verification Code Box for the Customer */}
        {order?.verificationCode && (
          <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <Key className="w-4 h-4" />
                <span>Your Secure Verification Code</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Share or verify this code with the delivery partner / admin upon fulfillment confirmation.
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

        <div className="p-4 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800/80 rounded-xl flex items-center gap-4 text-xs">
          <Package className="w-6 h-6 text-orange-600 dark:text-orange-400 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Estimated Delivery: In 2-3 Business Days</p>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">Tracking AWB will update in your member portal.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <Link
            href={`/account/orders/${orderId}`}
            className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-orange-600/20"
          >
            <Package className="w-4 h-4" /> Track Fulfillment Status
          </Link>
          <Link
            href="/catalog"
            className="py-3 px-6 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <Navbar />
      <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Loading order receipt...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
