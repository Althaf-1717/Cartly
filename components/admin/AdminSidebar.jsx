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
} from 'lucide-react';

const navItems = [
  { name: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products & Inventory', href: '/admin/products', icon: Package },
  { name: 'Categories & Departments', href: '/admin/categories', icon: Layers },
  { name: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Customer Directory', href: '/admin/customers', icon: Users },
  { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag },
  { name: 'Hero Banners & CMS', href: '/admin/banners', icon: ImageIcon },
  { name: 'Review Moderation', href: '/admin/reviews', icon: MessageSquare },
  { name: 'Audit & Security Logs', href: '/admin/audit-logs', icon: ShieldAlert },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen text-slate-300">
      <div>
        {/* Header with Cartly Logo */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Cartly"
              className="h-7 w-auto object-contain dark:brightness-0 dark:invert"
            />
            <span className="text-[10px] bg-orange-600/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Admin
            </span>
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
                    ? 'bg-orange-600 text-white font-black shadow-md shadow-orange-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to storefront */}
      <div className="p-4 border-t border-slate-800/80 bg-[#070707]">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4 text-orange-500" /> Back to Storefront
        </Link>
      </div>
    </aside>
  );
}
