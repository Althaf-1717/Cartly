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
  Tag,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';

const STATUS_STEPS = ['processing', 'shipped', 'delivered'];

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ordersList = await StoreService.getOrders();
      setAllOrders(ordersList);

      if (params.id === 'recent') {
        setOrder(ordersList[0] || null);
      } else {
        const found = await StoreService.getOrderById(params.id);
        setOrder(found || ordersList[0] || null);
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
        <Package className="w-12 h-12 text-slate-400" />
        <h2 className="text-xl font-bold">No Orders Found</h2>
        <p className="text-xs text-slate-500">You have not placed any orders yet.</p>
        <Link href="/catalog" className="text-xs text-orange-600 font-bold underline">
          Shop Now
        </Link>
      </div>
    );
  }

  const currentStepIndex = Math.max(0, STATUS_STEPS.indexOf(order.status));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 flex items-center gap-1.5 transition font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white dark:bg-[#111111] hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-orange-600" /> Print Receipt
          </button>
        </div>

        {/* Order Selector (If multiple orders exist) */}
        {allOrders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Select Your Order:
            </span>
            {allOrders.map((o) => {
              const isSelected = order.id === o.id || order.orderNumber === o.orderNumber;
              return (
                <button
                  key={o.id}
                  onClick={() => setOrder(o)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-white dark:bg-[#111111] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-mono">{o.orderNumber}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                    o.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-black/20 text-white'
                  }`}>
                    {o.status}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Order Card */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold">Order Reference</span>
              <h1 className="text-xl font-mono font-black text-orange-600 dark:text-orange-400">{order.orderNumber}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase font-bold">Total Paid</span>
              <p className="text-xl font-black text-slate-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 sm:justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified & Paid
              </span>
            </div>
          </div>

          {/* 1. Client Verification Code - Prominently Displayed to Customer */}
          {order.verificationCode && (
            <div className="p-5 bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-transparent border border-orange-500/30 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-black text-sm">
                    <Key className="w-4 h-4" />
                    <span>Your Order Delivery Verification Code</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                    Keep this secret code handy. When your package reaches you or the delivery partner contacts you, tell them this code to confirm and successfully complete your delivery.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="font-mono font-black text-lg px-4 py-2 bg-white dark:bg-[#0a0a0a] text-orange-600 dark:text-orange-400 rounded-xl border border-orange-500/30 shadow-xs">
                    {order.verificationCode}
                  </span>
                  <button
                    onClick={() => copyCode(order.verificationCode)}
                    className="p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition"
                    title="Copy Verification Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {order.isVerified ? (
                <div className="pt-2 border-t border-orange-500/20 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Code Verified & Confirmed by Store Admin! Order Completed & Delivered.</span>
                </div>
              ) : (
                <div className="pt-2 border-t border-orange-500/20 text-[11px] text-slate-500 dark:text-slate-400">
                  Status: <strong>Awaiting Code Verification at Delivery</strong>
                </div>
              )}
            </div>
          )}

          {/* 2. Order Fulfillment Status Pipeline */}
          <div className="py-2 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Order Fulfillment Status
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="space-y-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isPassed ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                    <span
                      className={`text-xs font-bold capitalize block ${
                        isCurrent
                          ? 'text-orange-600 dark:text-orange-400 font-black'
                          : isPassed
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {step === 'processing' ? '1. Processing' : step === 'shipped' ? '2. In Transit / Shipped' : '3. Delivered'}
                    </span>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="p-3.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">
                  Courier Tracking AWB: <strong className="text-orange-600 dark:text-orange-400 font-mono">{order.trackingNumber}</strong>
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Package On The Way
                </span>
              </div>
            )}
          </div>

          {/* 3. Ordered Products (Product Name, Brand, Size, Quantities, Photos) */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Ordered Product Details ({order.items?.length || 1} items)
            </h3>

            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80'}
                        alt={item.productName}
                        className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider block">
                          {item.brand || 'Cartly Brand'}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>Size: <strong className="text-slate-900 dark:text-white font-bold">{item.size || 'M'}</strong></span>
                          <span>•</span>
                          <span>Quantity: <strong className="text-slate-900 dark:text-white font-bold">{item.quantity}</strong></span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">SKU: {item.sku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-slate-400">{item.quantity} × {formatCurrency(item.unitPrice)}</p>
                      <p className="text-base font-black text-slate-900 dark:text-white">{formatCurrency(item.quantity * item.unitPrice)}</p>
                    </div>
                  </div>

                  {/* All 5 Image Previews if available */}
                  {Array.isArray(item.images) && item.images.length > 1 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                        Product Gallery Images:
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {item.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Shipping Destination Address */}
          {order.shippingAddress && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Shipping Destination & Contact
              </h3>
              <p className="text-slate-900 dark:text-white font-bold">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600 dark:text-slate-300">
                {order.shippingAddress.street || order.shippingAddress.flatBuilding}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                {order.shippingAddress.city || order.shippingAddress.townCity}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode || order.shippingAddress.pincode}
              </p>
              <p className="text-slate-500 dark:text-slate-400 pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
