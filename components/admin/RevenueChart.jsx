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
    <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-3xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white text-base">Commerce Sales Velocity</h3>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time payment order completions</p>
        </div>

        <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${timeframe === 'week' ? 'bg-yellow-400 text-black font-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${timeframe === 'month' ? 'bg-yellow-400 text-black font-black shadow-sm' : 'text-zinc-400 hover:text-white'}`}
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
                <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black border border-zinc-700 p-3 rounded-2xl shadow-2xl text-xs text-white">
                      <p className="font-bold text-white mb-1">{label}</p>
                      <p className="text-yellow-400 font-bold">
                        Revenue: {formatCurrency(payload[0].value)}
                      </p>
                      <p className="text-zinc-400 mt-0.5">
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
              stroke="#facc15"
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
