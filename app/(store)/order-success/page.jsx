'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Home, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { StoreService } from '@/lib/db/storeService';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'CRT-DEMO';
  const [order, setOrder] = useState(null);

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

  return (
    <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8 text-center">
      <div className="w-20 h-20 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-orange-600/30">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Payment Confirmed!</h1>
        <p className="text-sm text-slate-500 dark:text-slate-300/70 mt-1.5">
          Thank you for ordering with Cartly. Your package is now scheduled for warehouse dispatch.
        </p>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 sm:p-8 text-left space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <span className="text-[11px] text-slate-400 dark:text-slate-400/60 font-semibold uppercase tracking-wider">
              Order Reference
            </span>
            <p className="text-lg font-mono font-bold text-orange-700 dark:text-orange-400">{orderId}</p>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] text-slate-400 dark:text-slate-400/60 font-semibold uppercase tracking-wider">
              Payment Status
            </span>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 sm:justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Razorpay Verified & Paid
            </p>
          </div>
        </div>

        <div className="p-4 bg-orange-50 dark:bg-slate-900/60 border border-orange-200 dark:border-slate-800 rounded-xl flex items-center gap-4 text-xs">
          <Package className="w-6 h-6 text-orange-700 dark:text-orange-400 shrink-0" />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Estimated Delivery: In 2-3 Business Days</p>
            <p className="text-slate-500 dark:text-slate-300/70 mt-0.5">Tracking AWB will update in your member portal.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <Link
            href={`/account/orders/${orderId}`}
            className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-orange-600/20"
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
