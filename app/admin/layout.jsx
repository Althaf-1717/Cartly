'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#0a0a0a]">
        {children}
      </div>
    </div>
  );
}
