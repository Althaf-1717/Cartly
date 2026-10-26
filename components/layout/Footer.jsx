'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface text-muted text-sm border-t border-border py-12">
      {/* Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: <Truck className="w-5 h-5" />, title: 'Express Dispatch', desc: 'Free delivery on orders over ₹999', parent: null },
          { icon: <ShieldCheck className="w-5 h-5" />, title: 'Certified Originals', desc: 'Official manufacturer warranty', parent: null },
          { icon: <RotateCcw className="w-5 h-5" />, title: '7-Day Returns', desc: 'Easy replacement & refund process', parent: null },
          { icon: <Headphones className="w-5 h-5" />, title: '24/7 Support', desc: 'Phone and chat specialists', parent: null },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h4 className="font-semibold text-text text-xs">{item.title}</h4>
              <p className="text-[11px] text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="inline-block mb-3">
            <img src="/logo.png" alt="Cartly" className="h-8 w-auto object-contain dark:brightness-0 dark:invert" />
          </Link>
          <p className="text-xs leading-relaxed max-w-sm text-muted">
            Cartly delivers verified products across fashion, footwear, and electronics with certified warranty and secure payments.
          </p>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-xs text-text mb-4">Categories</h4>
          <ul className="space-y-2.5">
            <li><Link href="/catalog?category=clothes" className="hover:text-accent transition">Clothes</Link></li>
            <li><Link href="/catalog?category=shoes" className="hover:text-accent transition">Shoes</Link></li>
            <li><Link href="/catalog?category=electronics" className="hover:text-accent transition">Electronics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-xs text-text mb-4">Account</h4>
          <ul className="space-y-2.5">
            <li><Link href="/account" className="hover:text-accent transition">My Account</Link></li>
            <li><Link href="/account/orders/recent" className="hover:text-accent transition">Track Order</Link></li>
            <li><Link href="/wishlist" className="hover:text-accent transition">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold uppercase tracking-wider text-xs text-text mb-4">Policies</h4>
          <ul className="space-y-2.5">
            <li><Link href="#" className="hover:text-accent transition">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-accent transition">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-accent transition">Shipping</Link></li>
            <li><Link href="#" className="hover:text-accent transition">Refunds</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted">
        <p>© {new Date().getFullYear()} Cartly. All rights reserved.</p>
      </div>
    </footer>
  );
}