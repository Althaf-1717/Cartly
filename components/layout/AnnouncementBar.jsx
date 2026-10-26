'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-dark text-surface text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-8">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Truck className="w-3.5 h-3.5" />
            <span>Free Shipping on Orders Over ₹999</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1-Year Official Warranty</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <span className="text-muted">
            Use code <strong className="text-white">CARTLY20</strong> for 20% OFF
          </span>
          <Link
            href="/catalog"
            className="text-accent hover:bg-accent-active hover:text-white font-medium flex items-center gap-1 transition shrink-0 rounded px-2 py-0.5"
          >
            Shop Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}