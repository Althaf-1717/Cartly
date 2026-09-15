'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#111] text-slate-600 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-800">
      {/* Value Props */}
      <div className="border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Express Dispatch</h4>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Free delivery on orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Certified Originals</h4>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Official manufacturer warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">7-Day Returns</h4>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Easy replacement & refund process</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">Phone and chat specialists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Cartly"
              className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed max-w-sm">
            Cartly delivers verified products across fashion, footwear, and electronics with certified warranty and secure payments.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-4 uppercase tracking-wider">Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/catalog?category=clothes" className="hover:text-slate-900 dark:hover:text-white transition">Clothes</Link></li>
            <li><Link href="/catalog?category=shoes" className="hover:text-slate-900 dark:hover:text-white transition">Shoes</Link></li>
            <li><Link href="/catalog?category=electronics" className="hover:text-slate-900 dark:hover:text-white transition">Electronics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-4 uppercase tracking-wider">Account</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/account" className="hover:text-slate-900 dark:hover:text-white transition">My Account</Link></li>
            <li><Link href="/account/orders/recent" className="hover:text-slate-900 dark:hover:text-white transition">Track Order</Link></li>
            <li><Link href="/wishlist" className="hover:text-slate-900 dark:hover:text-white transition">Wishlist</Link></li>
            <li><Link href="/admin" className="hover:text-slate-900 dark:hover:text-white transition">Admin Panel</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-4 uppercase tracking-wider">Policies</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition">Privacy Policy</span></li>
            <li><span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition">Terms of Service</span></li>
            <li><span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition">Shipping</span></li>
            <li><span className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition">Refunds</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-600">
        <p>© {new Date().getFullYear()} Cartly. All rights reserved.</p>
      </div>
    </footer>
  );
}
