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
  priceRange = 250000,
  onPriceChange,
  inStockOnly = false,
  onToggleInStock,
  onResetFilters,
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 text-xs shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-sm text-text">
          <SlidersHorizontal className="w-4 h-4 text-accent" />
          <span>Filters</span>
        </div>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="text-muted hover:text-accent flex items-center gap-1 text-[11px] font-semibold transition"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="font-bold text-text uppercase tracking-wider text-[11px] mb-3">
            Categories
          </h4>
          <div className="space-y-1">
            <button
              onClick={() => onSelectCategory && onSelectCategory('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition font-medium ${
                selectedCategory === 'all' || !selectedCategory
                  ? 'bg-accent text-white font-bold shadow-xs'
                  : 'text-muted hover:bg-subtle hover:text-text'
              }`}
            >
              <span>All Categories</span>
              {(selectedCategory === 'all' || !selectedCategory) && (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.slug}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition font-medium ${
                  selectedCategory === cat.slug
                    ? 'bg-accent text-white font-bold shadow-xs'
                    : 'text-muted hover:bg-subtle hover:text-text'
                }`}
              >
                <span>{cat.name}</span>
                {selectedCategory === cat.slug && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Slider */}
      {onPriceChange && (
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-text uppercase tracking-wider text-[11px]">
              Max Price
            </h4>
            <span className="font-bold text-accent">
              {formatCurrency(priceRange)}
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="250000"
            step="1000"
            value={priceRange}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full h-1.5 bg-subtle rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-[10px] text-muted mt-1 font-medium">
            <span>₹1,000</span>
            <span>₹2,50,000+</span>
          </div>
        </div>
      )}

      {/* Brands */}
      {brands.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h4 className="font-bold text-text uppercase tracking-wider text-[11px] mb-3">
            Brands
          </h4>
          <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
            {brands.map((b) => (
              <button
                key={b.id || b.name}
                onClick={() => onSelectBrand && onSelectBrand(selectedBrand === b.name ? '' : b.name)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-left transition font-medium ${
                  selectedBrand === b.name
                    ? 'bg-accent text-white font-bold'
                    : 'text-muted hover:bg-subtle hover:text-text'
                }`}
              >
                <span>{b.name}</span>
                {selectedBrand === b.name && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In Stock Only */}
      {onToggleInStock && (
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="font-bold text-text">In Stock Only</span>
          <button
            onClick={onToggleInStock}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              inStockOnly ? 'bg-accent' : 'bg-subtle border border-border'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform ${
                inStockOnly ? 'bg-white translate-x-5' : 'bg-muted translate-x-0'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
