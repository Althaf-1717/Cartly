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
        const initial = [
          {
            id: 'prod-1-default',
            productId: 'prod-m-shirt-1',
            name: 'Men’s Classic Oxford Pure Linen Shirt',
            brand: 'Urban Linen',
            price: 2499,
            originalPrice: 3499,
            quantity: 1,
            size: 'M',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            images: [
              'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
              'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
              'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80',
              'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
              'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&q=80',
            ],
            variantName: 'Size M / Crisp White',
            sku: 'LIN-OXF-001-WHT',
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

  const addToCart = (product, variant = null, quantity = 1, selectedSize = null) => {
    const sizeVal = selectedSize || variant?.size || product.size || (product.category === 'clothes' ? 'M' : product.category === 'shoes' ? 'UK 9' : 'Standard');
    const itemKey = `${product.id}-${variant?.sku || variant?.name || sizeVal || 'default'}`;
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
        brand: product.brand || 'Cartly Collection',
        price: variant?.price || product.price,
        originalPrice: product.originalPrice,
        quantity,
        size: sizeVal,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.images?.[0] || ''],
        variantName: variant?.name || `Size ${sizeVal}`,
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
    const currentSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const result = await StoreService.validateCoupon(code, currentSubtotal);
    if (result.valid) {
      setCoupon(result);
      showToast(`Coupon "${result.code}" applied!`);
      return true;
    } else {
      setCouponError(result.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = coupon ? coupon.discountAmount : 0;
  const shippingCost = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_FEE : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        items,
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
        setToastMessage,
        itemCount,
        subtotal,
        discountAmount,
        shippingCost,
        finalTotal,
        FREE_SHIPPING_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
