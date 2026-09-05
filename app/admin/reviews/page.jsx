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
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Review Moderation"
        subtitle="Approve verified purchaser feedback, monitor product satisfaction ratings"
      />

      <main className="p-8 space-y-6 max-w-7xl">
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="divide-y divide-zinc-850">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Star key={num} className={`w-3.5 h-3.5 ${num <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-800'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-white text-sm">{r.title}</span>
                  </div>
                  <span className="text-zinc-500">{formatDate(r.createdAt)}</span>
                </div>

                <p className="text-zinc-300 leading-relaxed">{r.comment}</p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-zinc-400 font-semibold">Author: {r.author}</span>
                  <span className="px-2.5 py-0.5 bg-yellow-400/20 text-yellow-400 rounded-full font-bold text-[10px]">
                    Verified & Published
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
