'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency } from '@/lib/utils/formatters';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(15);
  const [discountType, setDiscountType] = useState('percentage');
  const [minOrder, setMinOrder] = useState(2000);
  const [description, setDescription] = useState('');

  const load = async () => {
    const list = await StoreService.getCoupons();
    setCoupons(list);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    await StoreService.createCoupon({
      code: code.toUpperCase().trim(),
      discountValue: Number(discountValue),
      discountType,
      minOrderAmount: Number(minOrder),
      description: description || `${discountValue}% discount code`,
    });

    setCode('');
    setDescription('');
    load();
  };

  const handleToggle = async (id) => {
    await StoreService.toggleCoupon(id);
    load();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <AdminHeader
        title="Coupons & Promotional Rules"
        subtitle="Manage discount codes, minimum order requirements, and campaign activations"
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 transition-colors duration-200">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Create Promotion Code
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CARTLY20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white uppercase font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Campaign Description</label>
              <input
                type="text"
                placeholder="e.g. Get 20% off on your first order"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-600/20"
              >
                Publish Coupon
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-orange-600 dark:text-orange-400 text-base">{c.code}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {c.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{c.description}</p>
                <div className="mt-3 space-y-1 text-[11px] text-slate-400 font-mono">
                  <p>
                    Value: {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </p>
                  <p>Min Order: {formatCurrency(c.minOrderAmount || 0)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleToggle(c.id)}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
