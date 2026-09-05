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
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Coupons & Promotional Rules"
        subtitle="Manage discount codes, minimum order requirements, and campaign activations"
      />

      <main className="p-8 space-y-8 max-w-7xl">
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-yellow-400" /> Create Promotion Code
          </h3>

          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. FLASH30"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-yellow-400 font-mono uppercase font-bold focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-bold mb-1">Min Order (₹)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-zinc-300 font-bold mb-1">Promo Description</label>
              <input
                type="text"
                placeholder="e.g. 15% off for weekend flash sale"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl transition shadow-md"
              >
                Save Promo Code
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className={`p-6 rounded-3xl border transition space-y-4 shadow-xl ${
                c.isActive ? 'bg-[#18181b] border-zinc-800' : 'bg-zinc-950 border-zinc-850 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-lg text-yellow-400 bg-zinc-900 px-3 py-1 rounded-xl border border-zinc-800">
                  {c.code}
                </span>
                <button
                  onClick={() => handleToggle(c.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition ${
                    c.isActive ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <p className="text-xs text-zinc-300">{c.description}</p>

              <div className="pt-3 border-t border-zinc-850 text-[11px] text-zinc-400 space-y-1">
                <p>
                  Discount: <strong className="text-white">{c.discountType === 'percentage' ? `${c.discountValue}%` : formatCurrency(c.discountValue)}</strong>
                </p>
                {c.minOrderAmount > 0 && (
                  <p>Min Spend: <strong className="text-white">{formatCurrency(c.minOrderAmount)}</strong></p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
