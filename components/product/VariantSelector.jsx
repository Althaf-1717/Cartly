'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function VariantSelector({ variants = [], selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
          Select Option:
        </span>
        <span className="text-slate-500 dark:text-emerald-300/70 font-semibold">{selectedVariant?.name || variants[0]?.name}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelect(v)}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 dark:border-emerald-500 text-slate-900 dark:text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-emerald-950/60 border-slate-200 dark:border-emerald-900 text-slate-700 dark:text-emerald-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {v.color && (
                  <span
                    className="w-4 h-4 rounded-full border border-slate-300 dark:border-emerald-700 shrink-0"
                    style={{ backgroundColor: v.color }}
                  />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{v.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-emerald-400/60">SKU: {v.sku}</p>
                </div>
              </div>

              {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
