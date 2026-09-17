'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/authContext';

export default function AdminHeader({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-slate-800/80 bg-[#0a0a0a]/95 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[11px] font-bold text-orange-400">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>PostgreSQL Live Sync</span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
            alt="Admin"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-500/40"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user?.fullName || 'Administrator'}</p>
            <span className="text-[10px] text-orange-400 font-bold">Store Operator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
