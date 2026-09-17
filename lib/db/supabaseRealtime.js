'use client';

import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Reusable Supabase Realtime Subscription Manager
 * Provides zero-latency WebSocket synchronization between Admin & Client
 */

/**
 * Subscribe to all order updates (Used by Admin Orders Hub)
 * @param {Function} onUpdate - callback invoked on INSERT, UPDATE, or DELETE
 * @returns {Function} unsubscribe function
 */
export function subscribeToOrders(onUpdate) {
  if (!isSupabaseConfigured() || !supabase) {
    // If Supabase not yet configured, listen to local storage events across tabs
    const handleStorage = (e) => {
      if (e.key === 'cartly_orders_v4') {
        onUpdate({ eventType: 'LOCAL_SYNC', payload: null });
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
    return () => {};
  }

  try {
    const channelId = `orders-live-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          onUpdate({
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
          });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Supabase Realtime] Connected to live orders channel');
        }
      });

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('Error closing supabase channel:', e);
      }
    };
  } catch (err) {
    console.warn('Failed to initialize Supabase Realtime for orders:', err);
    return () => {};
  }
}

/**
 * Subscribe to a specific order by ID or orderNumber (Used by Customer Tracking Page)
 * @param {string} orderId - order ID or orderNumber to watch
 * @param {Function} onUpdate - callback invoked when the order changes
 * @returns {Function} unsubscribe function
 */
export function subscribeToOrderById(orderId, onUpdate) {
  if (!orderId) return () => {};

  // Local storage listener fallback
  const handleStorage = (e) => {
    if (e.key === 'cartly_orders_v4') {
      onUpdate({ eventType: 'LOCAL_SYNC', payload: null });
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  if (!isSupabaseConfigured() || !supabase) {
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    };
  }

  try {
    const channelId = `order-${orderId}-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          if (
            payload.new?.id === orderId ||
            payload.new?.order_number === orderId ||
            payload.new?.orderNumber === orderId
          ) {
            onUpdate({
              eventType: 'UPDATE',
              new: payload.new,
              old: payload.old,
            });
          }
        }
      )
      .subscribe();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        console.warn('Error removing order channel:', e);
      }
    };
  } catch (err) {
    console.warn('Failed to subscribe to order realtime:', err);
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    };
  }
}
