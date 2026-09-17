'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatDate } from '@/lib/utils/formatters';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    StoreService.getReviews().then(setReviews);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <AdminHeader
        title="Customer Review Moderation"
        subtitle="Approve verified purchaser feedback, monitor product satisfaction ratings"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-orange-500">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Star
                          key={num}
                          className={`w-3.5 h-3.5 ${
                            num <= r.rating ? 'fill-orange-500 text-orange-500' : 'text-slate-300 dark:text-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{r.title}</span>
                  </div>
                  <span className="text-slate-400">{formatDate(r.createdAt)}</span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{r.comment}</p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-400">
                    By <strong className="text-slate-700 dark:text-slate-300">{r.author}</strong> •{' '}
                    <span className="text-orange-600 dark:text-orange-400 font-medium">Verified Purchase</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                    Approved & Visible
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
