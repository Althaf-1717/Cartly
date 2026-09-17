'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50 dark:bg-[#0a0a0a]">
        {children}
      </div>
    </div>
  );
}
