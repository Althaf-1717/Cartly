'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

const weeklyData = [
  { name: 'Mon', revenue: 45000, orders: 8 },
  { name: 'Tue', revenue: 78000, orders: 14 },
  { name: 'Wed', revenue: 92000, orders: 18 },
  { name: 'Thu', revenue: 64000, orders: 12 },
  { name: 'Fri', revenue: 135000, orders: 24 },
  { name: 'Sat', revenue: 198000, orders: 35 },
  { name: 'Sun', revenue: 172000, orders: 29 },
];

const monthlyData = [
  { name: 'Jan', revenue: 540000, orders: 110 },
  { name: 'Feb', revenue: 620000, orders: 130 },
  { name: 'Mar', revenue: 780000, orders: 165 },
  { name: 'Apr', revenue: 950000, orders: 210 },
  { name: 'May', revenue: 1120000, orders: 245 },
  { name: 'Jun', revenue: 1480000, orders: 310 },
];

export default function RevenueChart() {
  const [timeframe, setTimeframe] = useState('week');
  const data = timeframe === 'week' ? weeklyData : monthlyData;

  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xs space-y-6 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Commerce Sales Velocity</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time payment order completions</p>
        </div>

        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              timeframe === 'week'
                ? 'bg-orange-600 text-white font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              timeframe === 'month'
                ? 'bg-orange-600 text-white font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 6 Months
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs text-slate-900 dark:text-white">
                      <p className="font-bold mb-1">{label}</p>
                      <p className="text-orange-600 dark:text-orange-400 font-bold">
                        Revenue: {formatCurrency(payload[0].value)}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Orders: {payload[0].payload.orders}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ea580c"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
