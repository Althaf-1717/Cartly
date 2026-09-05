'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  priceRange,
  onPriceChange,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
}) {
  return (
    <div className="bg-white dark:bg-[#18181b] border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 space-y-6 text-slate-700 dark:text-zinc-300 text-xs shadow-xs dark:shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-yellow-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-slate-400 hover:text-amber-600 dark:hover:text-yellow-400 flex items-center gap-1 text-[11px] font-bold transition"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-black text-amber-700 dark:text-yellow-400 uppercase tracking-wider text-[11px] mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition font-bold ${selectedCategory === 'all' || !selectedCategory ? 'bg-yellow-400 text-black font-black shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <span>All Categories</span>
            {(selectedCategory === 'all' || !selectedCategory) && <Check className="w-3.5 h-3.5 text-black" />}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition font-bold ${selectedCategory === cat.slug ? 'bg-yellow-400 text-black font-black shadow-xs' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'}`}
            >
              <span>{cat.name}</span>
              {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5 text-black" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-black text-amber-700 dark:text-yellow-400 uppercase tracking-wider text-[11px]">
            Max Price
          </h4>
          <span className="font-black text-slate-900 dark:text-yellow-400">{formatCurrency(priceRange)}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="250000"
          step="1000"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 mt-1 font-bold">
          <span>₹1,000</span>
          <span>₹2,50,000+</span>
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
          <h4 className="font-black text-amber-700 dark:text-yellow-400 uppercase tracking-wider text-[11px] mb-3">
            Brands
          </h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {brands.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBrand(selectedBrand === b.name ? '' : b.name)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition font-semibold ${selectedBrand === b.name ? 'bg-yellow-400 text-black font-black' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'}`}
              >
                <span>{b.name}</span>
                {selectedBrand === b.name && <Check className="w-3.5 h-3.5 text-black" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-white">In Stock Only</span>
        <button
          onClick={onToggleInStock}
          className={`w-11 h-6 rounded-full p-1 transition-colors ${inStockOnly ? 'bg-yellow-400' : 'bg-slate-200 dark:bg-zinc-800'}`}
        >
          <div className={`w-4 h-4 rounded-full transition-transform ${inStockOnly ? 'bg-black translate-x-5' : 'bg-white translate-x-0'}`} />
        </button>
      </div>
    </div>
  );
}
