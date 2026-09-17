'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatDateTime } from '@/lib/utils/formatters';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    StoreService.getAuditLogs().then(setLogs);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      <AdminHeader
        title="Audit & Security Logs"
        subtitle="Chronological record of store changes, inventory modifications, and payment events"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="bg-[#111111] border border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0a0a0a] text-orange-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800/80">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-6">Details</th>
                <th className="py-4 px-6 text-right">User / Identity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-4 px-6 text-slate-500">{formatDateTime(log.timestamp)}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-orange-600/10 text-orange-400 border border-orange-500/20 rounded font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-200">{log.details}</td>
                  <td className="py-4 px-6 text-right text-slate-400">{log.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
