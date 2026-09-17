'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    StoreService.getBanners().then(setBanners);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <AdminHeader
        title="Homepage CMS & Promotional Banners"
        subtitle="Manage hero sliders, marketing headlines, and call-to-actions"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200"
            >
              <div className="aspect-video w-full relative">
                <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded uppercase">
                    {b.badgeText || 'PROMO'}
                  </span>
                  <h3 className="text-base font-bold mt-1">{b.title}</h3>
                </div>
              </div>
              <div className="p-5 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <p>{b.subtitle}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-orange-600 dark:text-orange-400 font-mono">Link: {b.ctaLink}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
