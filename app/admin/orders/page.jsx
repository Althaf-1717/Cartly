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
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [verificationInput, setVerificationInput] = useState('');
  const [verifyMessage, setVerifyMessage] = useState(null);
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    const data = await StoreService.getOrders();
    setOrders(data);
    if (data.length > 0) {
      if (!selectedOrder) {
        setSelectedOrder(data[0]);
        setTrackingInput(data[0].trackingNumber || '');
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

  const handleStatusChange = async (orderId, newStatus) => {
    await StoreService.updateOrderStatus(orderId, newStatus, trackingInput);
    loadOrders();
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !verificationInput.trim()) return;

    const result = await StoreService.verifyOrderCode(selectedOrder.id, verificationInput);
    setVerifyMessage(result);
    if (result.success) {
      setVerificationInput('');
      loadOrders();
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      o.verificationCode?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      <AdminHeader
        title="Order Management & Verification Hub"
        subtitle="Manage user orders, update fulfillment lifecycle, and verify customer delivery codes"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders Table Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search orders, names, or verification codes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <span className="text-xs text-slate-400 font-bold shrink-0">
                {orders.length} total orders
              </span>
            </div>

            <div className="bg-[#111111] border border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
              <div className="p-4 border-b border-slate-800/80 flex justify-between items-center bg-[#0d0d0d]">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                  Store Orders Pipeline
                </h3>
              </div>

              <div className="divide-y divide-slate-850 text-xs max-h-[680px] overflow-y-auto">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    No orders match your search.
                  </div>
                ) : (
                  filteredOrders.map((o) => {
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
                            ? 'bg-orange-600/10 border-l-4 border-orange-500'
                            : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-orange-400">{o.orderNumber}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : o.status === 'booked'
                                  ? 'bg-orange-600 text-white'
                                  : o.status === 'shipped'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {o.status}
                            </span>
                            {o.isVerified && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Code Verified
                              </span>
                            )}
                          </div>
                          <p className="text-white font-bold">{o.customerName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span>{formatDate(o.createdAt)}</span>
                            <span>•</span>
                            <span className="font-mono text-orange-300">Code: {o.verificationCode || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-white text-sm">{formatCurrency(o.totalAmount)}</p>
                          <span className="text-[10px] text-slate-500">{o.items?.length || 1} items</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Action & Verification Panel */}
          <div className="lg:col-span-5">
            {selectedOrder ? (
              <div className="bg-[#111111] border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-md sticky top-28 text-xs text-white">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Order</span>
                    <h3 className="font-mono font-black text-orange-400 text-base">{selectedOrder.orderNumber}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-orange-600/20 border border-orange-500/30 text-orange-400 font-bold rounded-lg text-[11px]">
                    Paid via Razorpay
                  </span>
                </div>

                {/* Verification Code Box (Required for Admin Booking/Confirmation) */}
                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-orange-500" /> Customer Verification Code
                    </span>
                    <span className="font-mono font-bold text-orange-400 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {selectedOrder.verificationCode}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    User presents this verification code from their order tracking page. Enter it below to verify delivery/booking.
                  </p>

                  <form onSubmit={handleVerifyCode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter user code e.g. VFY-..."
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#111111] border border-slate-800 rounded-xl text-white font-mono uppercase text-xs focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-600/20 shrink-0"
                    >
                      Verify Code
                    </button>
                  </form>

                  {verifyMessage && (
                    <div
                      className={`p-2.5 rounded-xl text-[11px] font-medium flex items-center gap-2 ${
                        verifyMessage.success
                          ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/30 text-red-400'
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

                {/* Fulfillment Status Workflow */}
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold">Fulfillment Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full p-2.5 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="booked" className="bg-[#111111]">Booked</option>
                    <option value="processing" className="bg-[#111111]">Processing</option>
                    <option value="shipped" className="bg-[#111111]">Shipped</option>
                    <option value="delivered" className="bg-[#111111]">Delivered</option>
                    <option value="cancelled" className="bg-[#111111]">Cancelled</option>
                  </select>
                </div>

                {/* Tracking AWB */}
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold">Courier Tracking AWB</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BLUEDART-8891024"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status)}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold rounded-xl transition"
                    >
                      Save AWB
                    </button>
                  </div>
                </div>

                {/* Customer & Shipping Details */}
                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-slate-800 space-y-1.5 text-slate-300">
                  <p className="font-bold text-white">{selectedOrder.customerName}</p>
                  <p className="text-slate-400">{selectedOrder.customerEmail}</p>
                  <p className="text-slate-400">{selectedOrder.customerPhone}</p>
                  {selectedOrder.shippingAddress && (
                    <p className="text-slate-400 pt-1 border-t border-slate-900 leading-relaxed">
                      {selectedOrder.shippingAddress.street || selectedOrder.shippingAddress.flatBuilding},{' '}
                      {selectedOrder.shippingAddress.city || selectedOrder.shippingAddress.townCity},{' '}
                      {selectedOrder.shippingAddress.state} -{' '}
                      {selectedOrder.shippingAddress.postalCode || selectedOrder.shippingAddress.pincode}
                    </p>
                  )}
                </div>

                {/* Manifest Ordered Items */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">
                    Ordered Items ({selectedOrder.items?.length || 1})
                  </span>
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-slate-800/80 text-[11px]"
                    >
                      <div className="flex items-center gap-2 max-w-[220px]">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=60&q=80'}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                        />
                        <span className="text-slate-300 truncate">
                          {item.productName} ({item.quantity}x)
                        </span>
                      </div>
                      <span className="font-black text-white">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-black text-white pt-2">
                    <span>Total Amount</span>
                    <span className="text-orange-400">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs">Select an order from the list to view fulfillment details.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
