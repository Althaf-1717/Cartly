'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartly_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      } else {
        // 1 initial wishlist item for demo
        const initial = ['prod-2'];
        setWishlist(initial);
        localStorage.setItem('cartly_wishlist', JSON.stringify(initial));
      }
    } catch (e) {}
  }, []);

  const saveWishlist = (list) => {
    setWishlist(list);
    try {
      localStorage.setItem('cartly_wishlist', JSON.stringify(list));
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleWishlist = (product) => {
    const id = typeof product === 'string' ? product : product.id;
    const name = typeof product === 'object' ? product.name : 'Item';
    const exists = wishlist.includes(id);

    if (exists) {
      const next = wishlist.filter((item) => item !== id);
      saveWishlist(next);
      showToast(`Removed "${name}" from wishlist`);
    } else {
      const next = [...wishlist, id];
      saveWishlist(next);
      showToast(`Saved "${name}" to wishlist`);
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        toastMsg,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
