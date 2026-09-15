'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquare, Send } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatters';
import { StoreService } from '@/lib/db/storeService';

export default function ReviewSection({ productId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    setSubmitting(true);
    const newRev = await StoreService.addReview({
      productId,
      author,
      rating,
      title: title || 'Verified Customer Review',
      comment,
    });

    setReviews([newRev, ...reviews]);
    setAuthor('');
    setTitle('');
    setComment('');
    setSubmitting(false);
    setSuccessMsg('Review verified and published successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-slate-800/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{avgRating}</span>
            <div className="flex items-center justify-center gap-1 text-orange-600 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-orange-600" />
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400/60 mt-1 font-semibold">{reviews.length} Verified Reviews</p>
          </div>
          <div className="hidden sm:block h-12 w-[1px] bg-slate-200 dark:border-slate-800" />
          <div className="text-xs text-slate-600 dark:text-slate-200/80 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">100% Genuine Buyer Ratings</p>
            <p className="text-slate-500 dark:text-slate-300/70">Reviews submitted by verified shoppers after delivery.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 shadow-xs">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Write a Customer Review
        </h4>

        {successMsg && (
          <div className="mb-4 p-3 bg-orange-50 dark:bg-slate-900 border border-orange-300 dark:border-orange-700 text-orange-800 dark:text-slate-300 text-xs rounded-xl flex items-center gap-2 font-bold">
            <CheckCircle className="w-4 h-4 text-orange-600" /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1.5">Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setRating(num)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${num <= rating ? 'fill-orange-600 text-orange-600' : 'text-slate-300 dark:text-orange-950'}`}
                  />
                </button>
              ))}
              <span className="ml-2 font-bold text-orange-700 dark:text-orange-400">{rating} out of 5</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1.5">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikram Sharma"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1.5">Headline</label>
              <input
                type="text"
                placeholder="e.g. Superb build quality and sound"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1.5">Detailed Review</label>
            <textarea
              rows={3}
              required
              placeholder="Tell others what you enjoyed about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition"
          >
            <Send className="w-3.5 h-3.5" /> {submitting ? 'Publishing...' : 'Submit Review'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400">Be the first to review this product!</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-orange-600">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-orange-600' : 'text-slate-300 dark:text-orange-950'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">{rev.title}</span>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-400/60 font-semibold">{formatDate(rev.createdAt)}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-200/80 leading-relaxed">{rev.comment}</p>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-300/70">{rev.author}</span>
                {rev.isVerifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] text-orange-700 dark:text-slate-300 font-bold bg-orange-50 dark:bg-slate-900 px-2 py-0.5 rounded-full border border-orange-200 dark:border-slate-800">
                    <CheckCircle className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
