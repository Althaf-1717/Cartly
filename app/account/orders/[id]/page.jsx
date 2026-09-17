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
  Maximize2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import OrderProductModal from '@/components/orders/OrderProductModal';
import { subscribeToOrderById } from '@/lib/db/supabaseRealtime';

// 4 Exact Stages: 1. Processing (default) -> 2. Order Confirmed -> 3. Shipping -> 4. Order Arrived
const STATUS_STEPS = [
  {
    id: 'processing',
    stepNumber: '1',
    label: 'Processing',
    fullLabel: '1. Processing',
    description: 'Order placed & packing in warehouse',
  },
  {
    id: 'confirmed',
    stepNumber: '2',
    label: 'Order Confirmed',
    fullLabel: '2. Order Confirmed',
    description: 'Payment verified & order confirmed',
  },
  {
    id: 'shipping',
    stepNumber: '3',
    label: 'Shipping',
    fullLabel: '3. Shipping',
    description: 'In transit with courier partner',
  },
  {
    id: 'arrived',
    stepNumber: '4',
    label: 'Order Arrived',
    fullLabel: '4. Order Arrived',
    description: 'Package arrived; provide code to receive',
  },
];

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const fetchOrderData = async (targetId) => {
    const ordersList = await StoreService.getOrders();
    setAllOrders(ordersList);

    let currentOrder = null;
    if (!targetId || targetId === 'recent') {
      currentOrder = ordersList[0] || null;
    } else {
      currentOrder =
        ordersList.find((o) => o.id === targetId || o.orderNumber === targetId) ||
        ordersList[0] ||
        null;
    }
    setOrder(currentOrder);
    return currentOrder;
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      await fetchOrderData(params.id);
      if (isMounted) setLoading(false);
    }
    load();

    // Auto-polling every 2.5s for instant synchronization when admin updates status
    const pollInterval = setInterval(() => {
      if (isMounted && params.id) {
        fetchOrderData(params.id);
      }
    }, 2500);

    // Live Supabase Realtime WebSocket subscription
    const unsubscribeRealtime = subscribeToOrderById(params.id, () => {
      if (isMounted && params.id) {
        fetchOrderData(params.id);
      }
    });

    // Also listen to storage events across different browser tabs
    const handleStorageChange = () => {
      if (isMounted && params.id) {
        fetchOrderData(params.id);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      if (typeof unsubscribeRealtime === 'function') unsubscribeRealtime();
      window.removeEventListener('storage', handleStorageChange);
    };
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

  // Calculate current stage progression (0 to 3)
  const getActiveStepIndex = (status) => {
    if (status === 'delivered') return 3; // Completed
    const idx = STATUS_STEPS.findIndex((s) => s.id === status);
    return idx >= 0 ? idx : 0; // Default to 0 (Processing)
  };

  const currentStepIndex = getActiveStepIndex(order.status);
  const isDeliveredOrVerified = order.status === 'delivered' || order.isVerified;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Navigation & Print */}
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-orange-600 flex items-center gap-1.5 transition font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-white dark:bg-[#111111] hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-orange-600" /> Print Receipt
            </button>
          </div>
        </div>

        {/* Order Switcher (If user has multiple orders) */}
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
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                      o.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-black/20 text-white'
                    }`}
                  >
                    {o.status}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Order Card */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-7 shadow-xs">
          {/* Order Reference Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-bold">Order Reference</span>
              <h1 className="text-2xl font-mono font-black text-orange-600 dark:text-orange-400">
                {order.orderNumber}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase font-bold">Total Paid</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {formatCurrency(order.totalAmount)}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 sm:justify-end mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified & Paid
              </span>
            </div>
          </div>

          {/* 1. SECURE CLIENT DELIVERY VERIFICATION CODE */}
          {order.verificationCode && (
            <div className="p-5 bg-gradient-to-r from-orange-500/10 via-orange-600/5 to-transparent border border-orange-500/30 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-black text-sm">
                    <Key className="w-4 h-4" />
                    <span>Your Order Delivery Verification Code</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                    Keep this secret code safe. When your package reaches you or the delivery partner contacts you, tell them this code to verify authenticity and successfully receive your order.
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

              {isDeliveredOrVerified ? (
                <div className="pt-2.5 border-t border-orange-500/20 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Verification Code Confirmed & Verified by Store Admin! Order Completed & Permanently Delivered.
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t border-orange-500/20 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>
                    Status:{' '}
                    <strong className="text-orange-600 dark:text-orange-400">
                      Awaiting Verification Code upon Arrival
                    </strong>
                  </span>
                  <span className="font-medium">Deliverer will request this code</span>
                </div>
              )}
            </div>
          )}

          {/* 2. FOUR-STAGE LIVE ORDER FULFILLMENT STATUS PIPELINE */}
          <div className="py-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Live Order Fulfillment Status Pipeline
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time updates dynamically synced with store administration
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                {isDeliveredOrVerified
                  ? 'Completed & Delivered'
                  : STATUS_STEPS[currentStepIndex]?.label || 'Processing'}
              </span>
            </div>

            {/* 4-Stage Visual Progress Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs pt-2">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex || isDeliveredOrVerified;
                const isCurrent = idx === currentStepIndex && !isDeliveredOrVerified;

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-[#0a0a0a] border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    {/* Progress Indicator Bar */}
                    <div
                      className={`h-1.5 w-full rounded-full mb-2.5 transition-all ${
                        isPassed
                          ? 'bg-emerald-500'
                          : isCurrent
                          ? 'bg-orange-600'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        {isPassed ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
                        ) : (
                          <span className="text-[10px] font-mono opacity-50">#{idx + 1}</span>
                        )}
                        <span
                          className={`text-xs font-black block ${
                            isCurrent
                              ? 'text-orange-600 dark:text-orange-400'
                              : isPassed
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="p-3.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">
                  Courier Tracking AWB:{' '}
                  <strong className="text-orange-600 dark:text-orange-400 font-mono">
                    {order.trackingNumber}
                  </strong>
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Package On The Way
                </span>
              </div>
            )}
          </div>

          {/* 3. ORDERED PRODUCTS & 5-IMAGE INSPECTION */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Ordered Product Details ({order.items?.length || 1} items)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Click on any product photo to inspect all 5 angles and complete specifications
                </p>
              </div>

              <span className="text-xs text-slate-500">Click image to expand</span>
            </div>

            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const allImgs =
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images
                    : [item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80'];

                return (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Clickable Product Image */}
                        <button
                          onClick={() => setModalItem(item)}
                          className="relative group shrink-0 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer"
                          title="Click to view all 5 photos and product details"
                        >
                          <img
                            src={item.image || allImgs[0]}
                            alt={item.productName}
                            className="w-18 h-18 rounded-xl object-cover bg-white dark:bg-slate-900 group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                        </button>

                        <div>
                          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider block">
                            {item.brand || 'LinenCraft Studio'}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {item.productName}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            <span>
                              Size:{' '}
                              <strong className="text-orange-600 dark:text-orange-400 font-bold">
                                {item.size || 'M'}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Quantity:{' '}
                              <strong className="text-slate-900 dark:text-white font-bold">
                                {item.quantity}
                              </strong>
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">SKU: {item.sku}</span>
                          </div>

                          <button
                            onClick={() => setModalItem(item)}
                            className="mt-2 text-[11px] text-orange-600 dark:text-orange-400 hover:underline font-bold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View 5 Photos & Details
                          </button>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs text-slate-400">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                        <p className="text-base font-black text-slate-900 dark:text-white">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    {/* All 5 Image Preview Thumbnails with Click Handler */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                        Product Gallery Images (Click to open full view):
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {allImgs.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setModalItem(item)}
                            className="relative group shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-orange-500 transition cursor-pointer"
                            title={`Click photo #${i + 1} to inspect`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="w-12 h-12 object-cover bg-white dark:bg-slate-900 group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] font-bold px-1 rounded-tl">
                              #{i + 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Shipping Destination Address */}
          {order.shippingAddress && (
            <div className="p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Shipping Destination & Delivery Contact
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                {order.shippingAddress.fullName || order.customerName}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {order.shippingAddress.phone || order.customerPhone} • {order.customerEmail}
              </p>
              <p className="text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/70 dark:border-slate-800/70">
                {order.shippingAddress.street || order.shippingAddress.flatBuilding},{' '}
                {order.shippingAddress.city || order.shippingAddress.townCity},{' '}
                {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode || order.shippingAddress.pincode},{' '}
                {order.shippingAddress.country || 'India'}
              </p>
            </div>
          )}
        </div>

        {/* 5-IMAGE & PRODUCT DETAILS MODAL */}
        <OrderProductModal
          isOpen={!!modalItem}
          onClose={() => setModalItem(null)}
          item={modalItem}
          order={order}
        />
      </main>
    </div>
  );
}
