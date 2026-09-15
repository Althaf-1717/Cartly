'use client';

import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';

export default function ProductGallery({ images = [], name = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[activeIndex] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80';

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 cursor-crosshair group shadow-xs"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-200 ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
        />

        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5 border border-orange-700/50 opacity-90 group-hover:opacity-0 transition-opacity">
          <ZoomIn className="w-3.5 h-3.5" /> Hover to Zoom
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 dark:bg-slate-900 ${activeIndex === idx ? 'border-orange-600 ring-2 ring-orange-500/30' : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
