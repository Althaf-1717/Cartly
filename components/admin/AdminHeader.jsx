'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { useTheme } from '@/lib/context/ThemeContext';

export default function AdminHeader({ title, subtitle }) {
  const { user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle (Default Light mode with switch to Dark/Night) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 text-xs font-bold transition shadow-xs"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Night Theme'}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-orange-400" />
              <span className="hidden md:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline">Night Mode</span>
            </>
          )}
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[11px] font-bold text-orange-600 dark:text-orange-400">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span>Live Sync Active</span>
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
            alt="Admin"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-500/40"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {user?.fullName || 'Administrator'}
            </p>
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">Store Operator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
