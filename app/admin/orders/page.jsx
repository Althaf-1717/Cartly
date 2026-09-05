'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');

  const loadOrders = async () => {
    const data = await StoreService.getOrders();
    setOrders(data);
    if (!selectedOrder && data.length > 0) {
      setSelectedOrder(data[0]);
      setTrackingInput(data[0].trackingNumber || '');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await StoreService.updateOrderStatus(orderId, newStatus, trackingInput);
    loadOrders();
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Order Fulfillment & Dispatch Hub"
        subtitle="Manage order manifests, update courier status, and assign live tracking AWBs"
      />

      <main className="p-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Orders Table */}
          <div className="lg:col-span-7 bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">All Orders ({orders.length})</h3>
            </div>
            <div className="divide-y divide-zinc-850 text-xs">
              {orders.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    setSelectedOrder(o);
                    setTrackingInput(o.trackingNumber || '');
                  }}
                  className={`p-4 cursor-pointer transition flex items-center justify-between ${selectedOrder?.id === o.id ? 'bg-yellow-400/10 border-l-4 border-yellow-400' : 'hover:bg-zinc-900/50'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-yellow-400">{o.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        o.status === 'delivered' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-zinc-200 font-bold mt-0.5">{o.customerName}</p>
                    <p className="text-[10px] text-zinc-500">{formatDate(o.createdAt)}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-white text-sm">{formatCurrency(o.totalAmount)}</p>
                    <span className="text-[10px] text-zinc-500">{o.items?.length || 1} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-5">
            {selectedOrder ? (
              <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl sticky top-28 text-xs text-white">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Selected Order</span>
                    <h3 className="font-mono font-black text-yellow-400 text-base">{selectedOrder.orderNumber}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-yellow-400 text-black font-black rounded-lg text-[11px]">
                    Paid via Razorpay
                  </span>
                </div>

                {/* Status Modifier */}
                <div className="space-y-2">
                  <label className="block text-zinc-300 font-bold">Change Fulfillment Status</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-bold focus:outline-none focus:border-yellow-400 cursor-pointer"
                  >
                    <option value="pending" className="bg-zinc-900">Pending</option>
                    <option value="processing" className="bg-zinc-900">Processing</option>
                    <option value="shipped" className="bg-zinc-900">Shipped</option>
                    <option value="delivered" className="bg-zinc-900">Delivered</option>
                    <option value="cancelled" className="bg-zinc-900">Cancelled</option>
                  </select>
                </div>

                {/* Tracking AWB */}
                <div className="space-y-2">
                  <label className="block text-zinc-300 font-bold">Courier Tracking AWB</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BLUEDART-8891024"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono focus:outline-none focus:border-yellow-400"
                    />
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, selectedOrder.status)}
                      className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl transition shadow-md"
                    >
                      Save AWB
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1 text-zinc-300">
                  <p className="font-bold text-white">{selectedOrder.customerName}</p>
                  <p className="text-zinc-400">{selectedOrder.customerEmail}</p>
                  <p className="text-zinc-400">{selectedOrder.customerPhone}</p>
                  {selectedOrder.shippingAddress && (
                    <p className="text-zinc-400 pt-1">
                      {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                    </p>
                  )}
                </div>

                {/* Breakdown */}
                <div className="space-y-2">
                  <span className="text-zinc-500 font-bold block uppercase text-[10px]">Manifest Breakdown</span>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1.5 border-b border-zinc-850 text-[11px]">
                      <span className="text-zinc-300 truncate max-w-[200px]">{item.productName} ({item.quantity}x)</span>
                      <span className="font-black text-yellow-400">{formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-black text-white pt-2">
                    <span>Total</span>
                    <span className="text-yellow-400">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500 text-xs">Select an order to manage fulfillment.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
