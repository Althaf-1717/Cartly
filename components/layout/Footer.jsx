'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-100/80 text-sm border-t border-emerald-900">
      {/* Value Props Strip */}
      <div className="border-b border-emerald-900/60 py-10 bg-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Express Dispatch</h4>
              <p className="text-xs text-emerald-200/70 mt-1">Free nationwide delivery on orders over ₹999.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Certified Originals</h4>
              <p className="text-xs text-emerald-200/70 mt-1">Direct from official manufacturers with certified warranty.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">7-Day Free Returns</h4>
              <p className="text-xs text-emerald-200/70 mt-1">Simple replacement and refund process for any order.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">24/7 Specialist Help</h4>
              <p className="text-xs text-emerald-200/70 mt-1">Direct access to hardware specialists via phone and chat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-600/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xl font-black text-white font-mono">CARTLY</span>
          </Link>
          <p className="text-xs text-emerald-200/70 leading-relaxed max-w-sm">
            Cartly delivers verified audio acoustics, titanium smart wearables, creator workstations, and workspace hardware.
          </p>
          <div className="pt-2 flex items-center gap-2 text-xs text-emerald-300/80">
            <span>Secured with</span>
            <span className="font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
              Razorpay SSL Gateway
            </span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs mb-4 tracking-wider uppercase text-emerald-400">Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/catalog?category=audio" className="hover:text-emerald-300 transition">Audio & Acoustics</Link></li>
            <li><Link href="/catalog?category=wearables" className="hover:text-emerald-300 transition">Smart Wearables</Link></li>
            <li><Link href="/catalog?category=computing" className="hover:text-emerald-300 transition">Laptops & Workstations</Link></li>
            <li><Link href="/catalog?category=workspace" className="hover:text-emerald-300 transition">Desk & Workspace</Link></li>
            <li><Link href="/catalog?category=footwear" className="hover:text-emerald-300 transition">Minimalist Footwear</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs mb-4 tracking-wider uppercase text-emerald-400">Customer Hub</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/account" className="hover:text-emerald-300 transition">My Account</Link></li>
            <li><Link href="/account/orders/recent" className="hover:text-emerald-300 transition">Track Your Order</Link></li>
            <li><Link href="/wishlist" className="hover:text-emerald-300 transition">Saved Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-emerald-300 transition">Shopping Cart</Link></li>
            <li><Link href="/admin" className="text-emerald-400 hover:underline font-bold transition">Admin Command Center</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs mb-4 tracking-wider uppercase text-emerald-400">Policies & Security</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="hover:text-emerald-300 cursor-pointer transition">Privacy Policy</span></li>
            <li><span className="hover:text-emerald-300 cursor-pointer transition">Terms of Service</span></li>
            <li><span className="hover:text-emerald-300 cursor-pointer transition">Shipping Guidelines</span></li>
            <li><span className="hover:text-emerald-300 cursor-pointer transition">Refund & Guarantee</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-900/60 py-6 text-center text-xs text-emerald-400/60">
        <p>© {new Date().getFullYear()} Cartly Commerce Inc. All rights reserved. The Premier Hardware Marketplace.</p>
      </div>
    </footer>
  );
}
