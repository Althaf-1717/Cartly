import {
  initialProducts,
  initialCategories,
  initialBrands,
  initialCoupons,
  initialBanners,
  initialOrders,
  initialReviews,
  initialAuditLogs,
} from './seedData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'cartly_products_v2',
  CATEGORIES: 'cartly_categories_v2',
  BRANDS: 'cartly_brands_v2',
  COUPONS: 'cartly_coupons_v2',
  BANNERS: 'cartly_banners_v2',
  ORDERS: 'cartly_orders_v2',
  REVIEWS: 'cartly_reviews_v2',
  AUDIT_LOGS: 'cartly_audit_logs_v2',
};

// In-memory fallback for SSR / Node runtime
let memoryStore = {
  products: [...initialProducts],
  categories: [...initialCategories],
  brands: [...initialBrands],
  coupons: [...initialCoupons],
  banners: [...initialBanners],
  orders: [...initialOrders],
  reviews: [...initialReviews],
  auditLogs: [...initialAuditLogs],
};

function getLocalData(key, fallback) {
  if (typeof window === 'undefined') {
    const memoryKey = key.replace('cartly_', '').replace('_v2', '');
    const camelKey = memoryKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    return memoryStore[camelKey] || fallback;
  }
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveLocalData(key, data) {
  if (typeof window === 'undefined') {
    const memoryKey = key.replace('cartly_', '').replace('_v2', '');
    const camelKey = memoryKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    memoryStore[camelKey] = data;
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const StoreService = {
  // PRODUCTS
  async getProducts({ category, subcategory, search, sort, featured, minPrice, maxPrice, inStock } = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('products').select('*, product_images(*), product_variants(*)');
        if (category && category !== 'all') query = query.eq('category', category);
        if (subcategory && subcategory !== 'all') query = query.eq('subcategory', subcategory);
        if (featured) query = query.eq('is_featured', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, using local store:', e);
      }
    }

    let list = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);

    if (category && category !== 'all') {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (subcategory && subcategory !== 'all') {
      list = list.filter((p) => p.subcategory?.toLowerCase() === subcategory.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice !== undefined && minPrice !== null) {
      list = list.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }

    if (inStock) {
      list = list.filter((p) => p.stock > 0);
    }

    if (sort) {
      switch (sort) {
        case 'price-asc':
          list = [...list].sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          list = [...list].sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
        default:
          break;
      }
    }

    return list;
  },

  async getProductBySlug(slug) {
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);
    return products.find((p) => p.slug === slug || p.id === slug) || null;
  },

  async createProduct(productData) {
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);
    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    saveLocalData(STORAGE_KEYS.PRODUCTS, updated);
    this.logAction('CREATE_PRODUCT', `Created product "${newProduct.name}" (SKU: ${newProduct.sku})`);
    return newProduct;
  },

  async updateProduct(id, updates) {
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updatedProduct = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    products[index] = updatedProduct;
    saveLocalData(STORAGE_KEYS.PRODUCTS, products);
    this.logAction('UPDATE_PRODUCT', `Updated product "${updatedProduct.name}" (ID: ${id})`);
    return updatedProduct;
  },

  async deleteProduct(id) {
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);
    const filtered = products.filter((p) => p.id !== id);
    saveLocalData(STORAGE_KEYS.PRODUCTS, filtered);
    this.logAction('DELETE_PRODUCT', `Deleted product ID: ${id}`);
    return true;
  },

  // CATEGORIES & BRANDS
  async getCategories() {
    return getLocalData(STORAGE_KEYS.CATEGORIES, initialCategories);
  },

  async getCategoryBySlug(slug) {
    const categories = getLocalData(STORAGE_KEYS.CATEGORIES, initialCategories);
    return categories.find((c) => c.slug === slug) || null;
  },

  async createCategory(categoryData) {
    const categories = getLocalData(STORAGE_KEYS.CATEGORIES, initialCategories);
    const newCategory = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      itemCount: 0,
    };
    const updated = [...categories, newCategory];
    saveLocalData(STORAGE_KEYS.CATEGORIES, updated);
    this.logAction('CREATE_CATEGORY', `Created category "${newCategory.name}"`);
    return newCategory;
  },

  async getBrands() {
    return getLocalData(STORAGE_KEYS.BRANDS, initialBrands);
  },

  // ORDERS
  async getOrders() {
    return getLocalData(STORAGE_KEYS.ORDERS, initialOrders);
  },

  async getOrderById(id) {
    const orders = getLocalData(STORAGE_KEYS.ORDERS, initialOrders);
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(orderPayload) {
    const orders = getLocalData(STORAGE_KEYS.ORDERS, initialOrders);
    const newOrder = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: orderPayload.status || 'processing',
      paymentStatus: orderPayload.paymentStatus || 'paid',
    };
    const updated = [newOrder, ...orders];
    saveLocalData(STORAGE_KEYS.ORDERS, updated);

    // Adjust product inventory
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);
    for (const item of newOrder.items || []) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    }
    saveLocalData(STORAGE_KEYS.PRODUCTS, products);

    this.logAction('ORDER_PLACED', `New order ${newOrder.orderNumber} placed for ${newOrder.totalAmount} by ${newOrder.customerName}`);
    return newOrder;
  },

  async updateOrderStatus(orderId, status, trackingNumber) {
    const orders = getLocalData(STORAGE_KEYS.ORDERS, initialOrders);
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();
    saveLocalData(STORAGE_KEYS.ORDERS, orders);
    this.logAction('UPDATE_ORDER_STATUS', `Order ${order.orderNumber} status changed to ${status}`);
    return order;
  },

  // COUPONS
  async getCoupons() {
    return getLocalData(STORAGE_KEYS.COUPONS, initialCoupons);
  },

  async validateCoupon(code, cartSubtotal) {
    const coupons = getLocalData(STORAGE_KEYS.COUPONS, initialCoupons);
    const coupon = coupons.find((c) => c.code?.toUpperCase() === code?.toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, message: 'Invalid or inactive coupon code' };
    }
    if (coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Coupon requires a minimum order value of ₹${coupon.minOrderAmount}`,
      };
    }
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }
    return {
      valid: true,
      code: coupon.code,
      discountAmount: Math.round(discount),
      description: coupon.description,
    };
  },

  async createCoupon(couponData) {
    const coupons = getLocalData(STORAGE_KEYS.COUPONS, initialCoupons);
    const newCoupon = {
      ...couponData,
      id: `coup-${Date.now()}`,
      isActive: true,
    };
    const updated = [...coupons, newCoupon];
    saveLocalData(STORAGE_KEYS.COUPONS, updated);
    this.logAction('CREATE_COUPON', `Created promo code ${newCoupon.code}`);
    return newCoupon;
  },

  async toggleCoupon(id) {
    const coupons = getLocalData(STORAGE_KEYS.COUPONS, initialCoupons);
    const coupon = coupons.find((c) => c.id === id);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      saveLocalData(STORAGE_KEYS.COUPONS, coupons);
      this.logAction('TOGGLE_COUPON', `Coupon ${coupon.code} active state set to ${coupon.isActive}`);
    }
    return coupons;
  },

  // BANNERS & CMS
  async getBanners() {
    return getLocalData(STORAGE_KEYS.BANNERS, initialBanners);
  },

  // REVIEWS
  async getReviews(productId) {
    const reviews = getLocalData(STORAGE_KEYS.REVIEWS, initialReviews);
    if (productId) {
      return reviews.filter((r) => r.productId === productId && r.isApproved);
    }
    return reviews;
  },

  async addReview(reviewData) {
    const reviews = getLocalData(STORAGE_KEYS.REVIEWS, initialReviews);
    const newReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: true,
      isVerifiedPurchase: true,
    };
    const updated = [newReview, ...reviews];
    saveLocalData(STORAGE_KEYS.REVIEWS, updated);

    // Update product rating and reviewsCount
    const products = getLocalData(STORAGE_KEYS.PRODUCTS, initialProducts);
    const prod = products.find((p) => p.id === reviewData.productId);
    if (prod) {
      const prodReviews = updated.filter((r) => r.productId === prod.id && r.isApproved);
      const totalStars = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      prod.rating = Number((totalStars / prodReviews.length).toFixed(1));
      prod.reviewsCount = prodReviews.length;
      saveLocalData(STORAGE_KEYS.PRODUCTS, products);
    }

    return newReview;
  },

  // AUDIT LOGS
  async getAuditLogs() {
    return getLocalData(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  },

  logAction(action, details, user = 'admin@cartly.com') {
    const logs = getLocalData(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      entity: details,
      user,
      details,
    };
    const updated = [newLog, ...logs].slice(0, 50);
    saveLocalData(STORAGE_KEYS.AUDIT_LOGS, updated);
  },
};
