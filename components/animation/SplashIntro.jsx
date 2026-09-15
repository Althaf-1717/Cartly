'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashIntro() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('cartly_splash_seen');
    if (!hasSeen) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('cartly_splash_seen', 'true');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0a]"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <img
              src="/logo.png"
              alt="Cartly"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </motion.div>

          {/* Minimal Progress Line */}
          <motion.div className="w-24 h-0.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-8 overflow-hidden">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="h-full bg-slate-900 dark:bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
