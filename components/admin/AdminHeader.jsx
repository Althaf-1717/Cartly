'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/authContext';

export default function AdminHeader({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-zinc-800 bg-[#09090b]/95 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-black text-white">{title}</h1>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-[11px] font-bold text-yellow-400">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span>PostgreSQL Live Sync</span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
            alt="Admin"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-yellow-400/50"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white leading-tight">{user?.fullName || 'Administrator'}</p>
            <span className="text-[10px] text-yellow-400 font-bold">Store Operator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
