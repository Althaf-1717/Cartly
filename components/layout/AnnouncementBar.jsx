'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-emerald-800 text-white text-xs font-semibold py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Free Express Shipping on Orders Over ₹999</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>1-Year Official Manufacturer Warranty</span>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <span className="text-emerald-100">
            Festival Sale: Use code <strong className="text-white font-black underline">CARTLY20</strong> for 20% OFF
          </span>
          <Link
            href="/catalog"
            className="text-white hover:text-emerald-200 font-bold flex items-center gap-1 transition shrink-0"
          >
            Shop Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
