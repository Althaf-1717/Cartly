'use client';

import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatCurrency } from '@/lib/utils/formatters';

const demoCustomers = [
  {
    id: 'c-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    totalOrders: 3,
    totalSpent: 67497,
    status: 'active',
    joinedDate: '2026-08-10',
  },
  {
    id: 'c-2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 98112 34567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    totalOrders: 2,
    totalSpent: 44998,
    status: 'active',
    joinedDate: '2026-08-15',
  },
  {
    id: 'c-3',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+91 99887 76655',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    totalOrders: 1,
    totalSpent: 4999,
    status: 'active',
    joinedDate: '2026-08-28',
  }
];

export default function AdminCustomersPage() {
  const [customers] = useState(demoCustomers);

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Directory"
        subtitle="View registered customer accounts, purchase history, and lifetime value"
      />

      <main className="p-8 space-y-6 max-w-7xl">
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-yellow-400 font-black uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Total Orders</th>
                <th className="py-4 px-4">Lifetime Spend</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-900/50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-white text-sm">{c.name}</p>
                        <p className="text-[10px] text-zinc-500 font-mono">ID: {c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-zinc-200">{c.email}</p>
                    <p className="text-[10px] text-zinc-500">{c.phone}</p>
                  </td>
                  <td className="py-4 px-4 font-bold text-white">{c.totalOrders} orders</td>
                  <td className="py-4 px-4 font-black text-yellow-400">{formatCurrency(c.totalSpent)}</td>
                  <td className="py-4 px-4 text-zinc-400">{c.joinedDate}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="px-2.5 py-1 bg-yellow-400/20 text-yellow-400 font-black rounded-full text-[10px] uppercase">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
