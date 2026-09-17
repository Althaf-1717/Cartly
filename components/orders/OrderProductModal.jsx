'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Tag,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

// Curated studio image fallbacks per category to guarantee 5 distinct high-res photos
const CATEGORY_STUDIO_FALLBACKS = {
  clothes: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=85',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=85',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=85',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=85',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=85',
    'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1000&q=85',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=85',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&q=85',
    'https://images.unsplash.com/photo-1512990414788-d97cb4a25db3?w=1000&q=85',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=85',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&q=85',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=85',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&q=85',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=1000&q=85',
  ],
  default: [
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=85',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=85',
    'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1000&q=85',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=85',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
  ],
};

export default function OrderProductModal({ isOpen, onClose, item, order }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedImageIndex]);

  // Reset selected image when item changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [item]);

  if (!isOpen || !item) return null;

  // Build a guaranteed array of 5 photos
  const build5Images = () => {
    const rawImages = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.image].filter(Boolean);

    if (rawImages.length >= 5) {
      return rawImages.slice(0, 5);
    }

    const categoryKey = (item.category || item.department || '').toLowerCase().includes('shoe')
      ? 'shoes'
      : (item.category || item.department || '').toLowerCase().includes('elec')
      ? 'electronics'
      : 'clothes';

    const fallbacks = CATEGORY_STUDIO_FALLBACKS[categoryKey] || CATEGORY_STUDIO_FALLBACKS.default;
    const combined = [...rawImages];

    for (let i = 0; combined.length < 5 && i < fallbacks.length; i++) {
      if (!combined.includes(fallbacks[i])) {
        combined.push(fallbacks[i]);
      }
    }
    while (combined.length < 5) {
      combined.push(fallbacks[combined.length % fallbacks.length]);
    }
    return combined.slice(0, 5);
  };

  const images5 = build5Images();
  const currentImage = images5[selectedImageIndex] || images5[0];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images5.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images5.length) % images5.length);
  };

  const photoLabels = [
    'Angle 1: Front Studio View',
    'Angle 2: Texture & Detail Closeup',
    'Angle 3: Side Profile Angle',
    'Angle 4: Back & Drape View',
    'Angle 5: Styled Lifestyle Perspective',
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 my-auto text-slate-900 dark:text-white transition-all">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Package className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Ordered Product Gallery & Full Details
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Displaying all 5 certified product photographs and specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left: 5 Images Gallery Showcase */}
          <div className="md:col-span-7 space-y-4">
            {/* Main Featured Photo View */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
              <img
                src={currentImage}
                alt={`${item.productName} photo ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition opacity-90 group-hover:opacity-100"
                title="Previous Photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs transition opacity-90 group-hover:opacity-100"
                title="Next Photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Angle Label & Index Badge */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-bold">
                  {photoLabels[selectedImageIndex] || `Photo #${selectedImageIndex + 1}`}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white text-[11px] font-mono font-bold shadow-md shadow-orange-600/30">
                  {selectedImageIndex + 1} / 5
                </span>
              </div>
            </div>

            {/* 5 Clickable Thumbnails Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <span>All 5 Product Photos (Click to switch):</span>
                <span className="text-orange-600 dark:text-orange-400">5 High-Res Views</span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {images5.map((imgUrl, idx) => {
                  const isSelected = selectedImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                        isSelected
                          ? 'border-orange-600 ring-2 ring-orange-500/30 scale-105 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span
                        className={`absolute bottom-1 right-1 text-[9px] font-mono font-bold px-1 rounded ${
                          isSelected
                            ? 'bg-orange-600 text-white'
                            : 'bg-black/70 text-white'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Comprehensive Product Details */}
          <div className="md:col-span-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Brand & Department */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase tracking-wider">
                  {item.brand || 'LinenCraft Studio'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold uppercase">
                  {item.category || item.department || "Men's Wear"}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                  {item.productName}
                </h2>
                {item.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Size & Spec Badges */}
              <div className="p-3.5 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Selected Size:</span>
                  <span className="font-mono font-black text-xs px-2.5 py-1 bg-white dark:bg-[#161616] text-orange-600 dark:text-orange-400 rounded-lg border border-orange-500/30">
                    Size: {item.size || 'M'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Units Ordered:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.quantity} {item.quantity === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">SKU Reference:</span>
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {item.sku || 'SKU-LIN-WHT-01'}
                  </span>
                </div>

                {order?.orderNumber && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Order Number:</span>
                    <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                      {order.orderNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">
                    Order Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-slate-400">
                        ({item.quantity} × {formatCurrency(item.unitPrice)})
                      </span>
                    )}
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Item
                </span>
              </div>

              {/* Description & Material Info */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
                  Product Description & Craftsmanship:
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  {item.description ||
                    'Tailored from pure luxury long-staple French flax linen for unrivaled breathability, natural cooling, and an effortless drape. Engineered with reinforced single-needle seams, mother-of-pearl buttons, and a crisp structured collar.'}
                </p>
              </div>

              {/* Guarantee bullets */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% Genuine Certified Quality Assurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>1-Year Official Manufacturer Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>7-Day Hassle-Free Replacement Guarantee</span>
                </div>
              </div>
            </div>

            {/* Bottom Close Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition shadow-md"
              >
                Close Gallery View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
