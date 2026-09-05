'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function SplashIntro() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('cartly_splash_seen');
    if (!hasSeen) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('cartly_splash_seen', 'true');
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative flex items-center justify-center mb-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl shadow-emerald-600/30 text-white font-bold">
              <ShoppingBag className="w-8 h-8" />
            </div>
          </motion.div>

          {/* Brand Name */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-center space-y-1"
          >
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              CARTLY
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
              The Premier Commerce Platform
            </p>
          </motion.div>

          {/* Progress Line */}
          <motion.div className="w-28 h-1 bg-slate-200 dark:bg-emerald-950 rounded-full mt-4 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="h-full bg-emerald-600 rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
