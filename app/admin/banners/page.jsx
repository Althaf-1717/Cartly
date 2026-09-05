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
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Homepage CMS & Promotional Banners"
        subtitle="Manage hero sliders, marketing headlines, and call-to-actions"
      />

      <main className="p-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl"
            >
              <div className="aspect-video w-full relative">
                <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded uppercase">
                    {b.badgeText || 'PROMO'}
                  </span>
                  <h3 className="text-base font-bold mt-1">{b.title}</h3>
                </div>
              </div>
              <div className="p-5 text-xs text-zinc-300 space-y-2">
                <p>{b.subtitle}</p>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                  <span className="text-[11px] text-yellow-400 font-mono">Link: {b.ctaLink}</span>
                  <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded text-[10px] font-bold">
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
