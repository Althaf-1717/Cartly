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
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Audit & Security Logs"
        subtitle="Chronological record of store changes, inventory modifications, and payment events"
      />

      <main className="p-8 space-y-6 max-w-7xl">
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-yellow-400 font-black uppercase tracking-wider text-[10px] border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-4">Action</th>
                <th className="py-4 px-6">Details</th>
                <th className="py-4 px-6 text-right">User / Identity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/50 transition">
                  <td className="py-4 px-6 text-zinc-500">{formatDateTime(log.timestamp)}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded font-bold text-[10px] border border-yellow-400/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-zinc-200 font-sans text-xs">{log.details}</td>
                  <td className="py-4 px-6 text-right text-white font-sans text-xs font-bold">
                    {log.user}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
