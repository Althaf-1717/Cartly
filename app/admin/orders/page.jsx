'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Key,
  Search,
  Check,
  Package,
  Layers,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/formatters';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [verifyMessage, setVerifyMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [showDeliveredSuccessModal, setShowDeliveredSuccessModal] = useState(false);
  const [verifiedCompletedOrder, setVerifiedCompletedOrder] = useState(null);

  const loadOrders = async () => {
    const data = await StoreService.getOrders();
    setOrders(data);
    if (data.length > 0) {
      if (!selectedOrder) {
        // Select first active order or first order
        const firstActive = data.find((o) => o.status !== 'delivered') || data[0];
        setSelectedOrder(firstActive);
        setTrackingInput(firstActive.trackingNumber || '');
      } else {
        const refreshed = data.find((o) => o.id === selectedOrder.id);
        if (refreshed) {
          setSelectedOrder(refreshed);
          setTrackingInput(refreshed.trackingNumber || '');
        }
      }
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders by active vs completed
  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  const displayedList = (activeTab === 'active' ? activeOrders : completedOrders).filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  // Status progression: pending -> processing -> shipped -> delivered (requires verification code)
  const handleSetProcessing = async (orderId) => {
    await StoreService.updateOrderStatus(orderId, 'processing', trackingInput);
    loadOrders();
  };

  const handleSetShipped = async (orderId) => {
    await StoreService.updateOrderStatus(orderId, 'shipped', trackingInput);
    loadOrders();
  };

  // Deliver & Verify Code
  const handleVerifyAndDeliver = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !verificationInput.trim()) return;

    const result = await StoreService.verifyOrderCode(selectedOrder.id, verificationInput);
    setVerifyMessage(result);

    if (result.success) {
      // Permanently mark order as DELIVERED
      await StoreService.updateOrderStatus(selectedOrder.id, 'delivered', trackingInput);
      setVerificationInput('');
      setVerifiedCompletedOrder({
        ...selectedOrder,
        status: 'delivered',
        isVerified: true,
      });
      setShowDeliveredSuccessModal(true);
      await loadOrders();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <AdminHeader
        title="Order Management & Verification Hub"
        subtitle="Process live orders, review products & 5-image galleries, and verify customer delivery code"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Navigation Tabs: Active Orders vs Completed Orders Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('active');
                if (activeOrders.length > 0) setSelectedOrder(activeOrders[0]);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white dark:bg-[#111111] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Active Orders In-Progress</span>
              <span className="px-2 py-0.5 rounded-full bg-black/15 dark:bg-white/10 text-[10px]">
                {activeOrders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('completed');
                if (completedOrders.length > 0) setSelectedOrder(completedOrders[0]);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-[#111111] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed Orders Section</span>
              <span className="px-2 py-0.5 rounded-full bg-black/15 dark:bg-white/10 text-[10px]">
                {completedOrders.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {completedOrders.length} delivered & verified • {activeOrders.length} requiring fulfillment
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order reference, client name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Orders List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex justify-between items-center bg-slate-100/60 dark:bg-[#0d0d0d]">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  {activeTab === 'active' ? 'Active Orders Feed' : 'Completed Verified Orders'} ({displayedList.length})
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-850 text-xs max-h-[720px] overflow-y-auto">
                {displayedList.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    {activeTab === 'active'
                      ? 'No active orders in progress. All orders are completed!'
                      : 'No completed orders yet. Orders appear here once verified.'}
                  </div>
                ) : (
                  displayedList.map((o) => {
                    const isSelected = selectedOrder?.id === o.id;
                    return (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrder(o);
                          setTrackingInput(o.trackingNumber || '');
                          setVerifyMessage(null);
                          setVerificationInput('');
                        }}
                        className={`p-4 cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-orange-500/10 border-l-4 border-orange-500'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                              {o.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : o.status === 'processing'
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                  : o.status === 'shipped'
                                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {o.status}
                            </span>
                            {o.isVerified && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[9px] font-bold flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-slate-900 dark:text-white font-bold">{o.customerName}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {o.items?.[0]?.productName || 'Product'} • Size: {o.items?.[0]?.size || 'M'} • {formatDate(o.createdAt)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-slate-900 dark:text-white text-sm">
                            {formatCurrency(o.totalAmount)}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {o.items?.length || 1} {o.items?.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Complete Order Details & Fulfillment & Code Verification */}
          <div className="lg:col-span-6">
            {selectedOrder ? (
              <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xs text-xs text-slate-900 dark:text-white">
                {/* Header Reference */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">
                      Order Reference
                    </span>
                    <h3 className="font-mono font-black text-orange-600 dark:text-orange-400 text-lg">
                      {selectedOrder.orderNumber}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Placed on {formatDateTime(selectedOrder.createdAt)}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-[11px] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Paid
                  </span>
                </div>

                {/* 1. ORDER DETAILS FIRST (Product Name, Shirt Size, Brand, All 5 Images) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Ordered Products & All Gallery Photos ({selectedOrder.items?.length || 1})
                    </h4>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Total: {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, idx) => {
                      const allImgs = Array.isArray(item.images) && item.images.length > 0
                        ? item.images
                        : [item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80'];

                      return (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                {item.brand || 'Urban Linen'}
                              </span>
                              <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                                {item.productName}
                              </h5>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 dark:text-slate-300">
                                <span>Size: <strong className="text-orange-600 dark:text-orange-400 font-black">{item.size || 'M'}</strong></span>
                                <span>•</span>
                                <span>Quantity: <strong>{item.quantity}</strong></span>
                                <span>•</span>
                                <span className="font-mono text-[11px]">SKU: {item.sku}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="font-black text-slate-900 dark:text-white text-sm">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {item.quantity} × {formatCurrency(item.unitPrice)}
                              </span>
                            </div>
                          </div>

                          {/* All 5 Images of this product */}
                          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1.5">
                              Product Images ({allImgs.length} photos):
                            </span>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                              {allImgs.map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="relative group shrink-0">
                                  <img
                                    src={imgUrl}
                                    alt=""
                                    className="w-14 h-14 rounded-xl object-cover bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                                  />
                                  <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] font-bold px-1 rounded-tl">
                                    #{imgIdx + 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. ORDER STATUS WORKFLOW: PROCESSING -> SHIPPED -> DELIVERED */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Order Fulfillment Progression
                  </h4>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSetProcessing(selectedOrder.id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                        selectedOrder.status === 'processing'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>1. Processing</span>
                    </button>

                    <button
                      onClick={() => handleSetShipped(selectedOrder.id)}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                        selectedOrder.status === 'shipped'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>2. Shipped</span>
                    </button>

                    <div
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs text-center border ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-900/60 text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>3. Delivered {selectedOrder.status === 'delivered' ? '✓' : '(Code Req)'}</span>
                    </div>
                  </div>

                  {/* Courier Tracking AWB Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Courier Tracking AWB (e.g. BLUEDART-88219034)"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={() => StoreService.updateOrderStatus(selectedOrder.id, selectedOrder.status, trackingInput).then(loadOrders)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-bold"
                    >
                      Save AWB
                    </button>
                  </div>
                </div>

                {/* 3. VERIFY CODE FOR DELIVERY (When order reached client, client tells code -> Admin enters) */}
                <div className="p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      Client Verification Code Check
                    </span>
                    {selectedOrder.status === 'delivered' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Delivered & Verified
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                        Awaiting Client Code
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    When order reaches the client, the client reads out their secure verification code. Enter that code here. Once verified, the order will be <strong>permanently moved to Delivered</strong> and recorded in the Completed Orders section.
                  </p>

                  {selectedOrder.status !== 'delivered' ? (
                    <form onSubmit={handleVerifyAndDeliver} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Enter Client's Verification Code e.g. VFY-..."
                        value={verificationInput}
                        onChange={(e) => setVerificationInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono uppercase text-xs focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-600/20 shrink-0"
                      >
                        Verify & Complete Delivery
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <span>Order Verified with Code: <strong className="font-mono">{selectedOrder.verificationCode}</strong></span>
                      <span className="text-[10px] uppercase bg-emerald-600 text-white px-2 py-0.5 rounded">Completed</span>
                    </div>
                  )}

                  {verifyMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        verifyMessage.success
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-500'
                      }`}
                    >
                      {verifyMessage.success ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{verifyMessage.message}</span>
                    </div>
                  )}
                </div>

                {/* 4. Customer Contact & Shipping Destination */}
                {selectedOrder.shippingAddress && (
                  <div className="p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Client Contact & Shipping Address
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.customerName}</p>
                    <p className="text-slate-500 dark:text-slate-400">{selectedOrder.customerEmail} • {selectedOrder.customerPhone}</p>
                    <p className="text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-850">
                      {selectedOrder.shippingAddress.street || selectedOrder.shippingAddress.flatBuilding},{' '}
                      {selectedOrder.shippingAddress.city || selectedOrder.shippingAddress.townCity},{' '}
                      {selectedOrder.shippingAddress.state} -{' '}
                      {selectedOrder.shippingAddress.postalCode || selectedOrder.shippingAddress.pincode}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-slate-800">
                Select an order from the feed to view full product details, photos, and fulfillment controls.
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            SUCCESS POP-UP MODAL UPON VERIFYING DELIVERY CODE
            ========================================================================= */}
        {showDeliveredSuccessModal && verifiedCompletedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
              onClick={() => setShowDeliveredSuccessModal(false)}
            />

            <div className="relative w-full max-w-md bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center space-y-5 text-slate-900 dark:text-white">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Order Successfully Completed!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  The client verification code matched accurately. This order is now permanently marked as <strong>Delivered</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Order Reference</span>
                  <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                    {verifiedCompletedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Client</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {verifiedCompletedOrder.customerName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Verification Code</span>
                  <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                    {verifiedCompletedOrder.verificationCode}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Product</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {verifiedCompletedOrder.items?.[0]?.productName} (Size {verifiedCompletedOrder.items?.[0]?.size || 'M'})
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 font-bold">
                  <span>Total Amount</span>
                  <span className="text-slate-900 dark:text-white font-black">
                    {formatCurrency(verifiedCompletedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDeliveredSuccessModal(false);
                  setActiveTab('completed');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition"
              >
                View in Completed Orders Section
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
