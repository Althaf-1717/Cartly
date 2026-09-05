'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreService } from '@/lib/db/storeService';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Free shipping over ₹999
  const FREE_SHIPPING_THRESHOLD = 999;
  const STANDARD_SHIPPING_FEE = 99;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartly_cart_items');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // Initial sample item for preview
        const initial = [
          {
            id: 'prod-1-default',
            productId: 'prod-1',
            name: 'Aether Pro ANC Wireless Headphones',
            price: 24999,
            originalPrice: 29999,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            variantName: 'Midnight Obsidian',
            sku: 'AETH-NC900-BLK',
          }
        ];
        setItems(initial);
        localStorage.setItem('cartly_cart_items', JSON.stringify(initial));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  const saveCart = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem('cartly_cart_items', JSON.stringify(newItems));
    } catch (e) {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product, variant = null, quantity = 1) => {
    const itemKey = `${product.id}-${variant?.sku || variant?.name || 'default'}`;
    const existingIndex = items.findIndex((i) => i.id === itemKey);

    let updated;
    if (existingIndex > -1) {
      updated = items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        id: itemKey,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: variant?.price || product.price,
        originalPrice: product.originalPrice,
        quantity,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        variantName: variant?.name || 'Standard Edition',
        sku: variant?.sku || product.sku,
      };
      updated = [...items, newItem];
    }

    saveCart(updated);
    showToast(`Added "${product.name}" to cart`);
    setIsDrawerOpen(true);
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = items.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const target = items.find((i) => i.id === id);
    const updated = items.filter((i) => i.id !== id);
    saveCart(updated);
    if (target) showToast(`Removed "${target.name}" from cart`);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code');
      return false;
    }
    const res = await StoreService.validateCoupon(code, subtotal);
    if (res.valid) {
      setCoupon(res);
      showToast(`Promo "${res.code}" applied: Saved ₹${res.discountAmount}`);
      return true;
    } else {
      setCouponError(res.message || 'Invalid coupon code');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
    showToast('Promo code removed');
  };

  // Calculations
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const originalSubtotal = items.reduce(
    (sum, i) => sum + (i.originalPrice || i.price) * i.quantity,
    0
  );
  const totalSavings = Math.max(0, originalSubtotal - subtotal) + (coupon?.discountAmount || 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const discountAmount = coupon ? coupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        originalSubtotal,
        totalSavings,
        shippingCost,
        discountAmount,
        finalTotal,
        freeShippingRemaining,
        FREE_SHIPPING_THRESHOLD,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
