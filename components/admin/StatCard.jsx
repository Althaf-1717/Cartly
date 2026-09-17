'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, change, isPositive, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl shadow-xs transition-colors duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
        {change && (
          <span
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30'
                : 'bg-red-500/10 text-red-500 border border-red-500/30'
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
