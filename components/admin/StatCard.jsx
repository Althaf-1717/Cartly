'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, isPositive, icon: Icon, color = 'yellow' }) {
  return (
    <div className="bg-[#18181b] border border-zinc-800 p-6 rounded-3xl shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-yellow-400/10 border border-yellow-400/20 text-yellow-400">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-black text-white">{value}</h3>
        {change && (
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/30'
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
