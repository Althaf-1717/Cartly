'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

export default function ToastNotification() {
  const { toastMessage: cartMsg } = useCart();
  const { toastMsg: wishMsg } = useWishlist();
  const message = cartMsg || wishMsg;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed top-20 right-4 sm:right-6 z-[9990] flex items-center gap-3 bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-800 text-slate-900 dark:text-white px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            {cartMsg ? <ShoppingBag className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-white" />}
          </div>
          <div className="pr-1">
            <p className="text-xs font-bold leading-tight">{message}</p>
            <span className="text-[10px] text-slate-400 dark:text-emerald-400/60 font-medium">Cartly Instant Sync</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
