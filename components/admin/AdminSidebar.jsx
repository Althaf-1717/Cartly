'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert,
  ArrowLeft,
  SlidersHorizontal,
} from 'lucide-react';

const navItems = [
  { name: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products & Inventory', href: '/admin/products', icon: Package },
  { name: 'Categories & Brands', href: '/admin/categories', icon: Layers },
  { name: 'Order Fulfillment', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customer Directory', href: '/admin/customers', icon: Users },
  { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
  { name: 'Hero Banners & CMS', href: '/admin/banners', icon: ImageIcon },
  { name: 'Review Moderation', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Audit & Security Logs', href: '/admin/audit-logs', icon: ShieldAlert },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-black border-r border-zinc-800 flex flex-col justify-between shrink-0 min-h-screen text-zinc-300">
      <div>
        {/* Header */}
        <div className="p-6 border-b border-zinc-850 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-yellow-400 flex items-center justify-center text-black font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono font-black text-white text-base tracking-tight">CARTLY</h2>
              <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider block -mt-1">
                Admin Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition ${
                  isActive
                    ? 'bg-yellow-400 text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to storefront */}
      <div className="p-4 border-t border-zinc-850 bg-zinc-950">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-200 transition"
        >
          <ArrowLeft className="w-4 h-4 text-yellow-400" /> Back to Storefront
        </Link>
      </div>
    </aside>
  );
}
