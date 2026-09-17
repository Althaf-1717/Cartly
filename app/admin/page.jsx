'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Package,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import StatCard from '@/components/admin/StatCard';
import RevenueChart from '@/components/admin/RevenueChart';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    StoreService.getOrders().then(setOrders);
    StoreService.getProducts().then((prods) => {
      setProducts(prods);
      setLowStockItems(prods.filter((p) => p.stock <= 25));
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Executive Overview"
        subtitle="Real-time commerce metrics and operational inventory health"
      />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            change="+24.8%"
            isPositive={true}
            icon={DollarSign}
          />
          <StatCard
            title="Total Orders"
            value={orders.length.toString()}
            change="+18.2%"
            isPositive={true}
            icon={ShoppingBag}
          />
          <StatCard
            title="Active Products"
            value={products.length.toString()}
            change="100% In Catalog"
            isPositive={true}
            icon={Package}
          />
          <StatCard
            title="Average Order Value"
            value={formatCurrency(avgOrderValue)}
            change="+12.4%"
            isPositive={true}
            icon={TrendingUp}
          />
        </div>

        {/* Sales Chart */}
        <RevenueChart />

        {/* Widgets: Low Stock Alerts & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock */}
          <div className="bg-[#111111] border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Low Stock Inventory Alerts</h3>
                  <p className="text-[11px] text-slate-400">Items below minimum stock threshold</p>
                </div>
              </div>
              <Link href="/admin/products" className="text-xs text-orange-400 hover:underline font-bold">
                Manage Stock →
              </Link>
            </div>

            <div className="space-y-3">
              {lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#0a0a0a] rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80'}
                      alt=""
                      className="w-10 h-10 object-cover rounded-xl bg-slate-900 border border-slate-800"
                    />
                    <div>
                      <p className="font-bold text-white truncate max-w-[180px]">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.stock <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {item.stock} Units Left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#111111] border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Recent Orders Stream</h3>
                  <p className="text-[11px] text-slate-400">Live order fulfillment updates</p>
                </div>
              </div>
              <Link href="/admin/orders" className="text-xs text-orange-400 hover:underline font-bold">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3 bg-[#0a0a0a] rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-orange-400">{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : order.status === 'booked'
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{order.customerName}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-white">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-[10px] text-slate-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
