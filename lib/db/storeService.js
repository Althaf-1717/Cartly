import {
  initialProducts,
  initialCategories,
  initialBrands,
  initialCoupons,
  initialBanners,
  initialOrders,
  initialReviews,
  initialAuditLogs,
} from './seedData.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

export const initialCustomers = [];

const STORAGE_KEYS = {
  PRODUCTS: 'cartly_products_v4',
  CATEGORIES: 'cartly_categories_v4',
  BRANDS: 'cartly_brands_v4',
  COUPONS: 'cartly_coupons_v4',
  BANNERS: 'cartly_banners_v4',
  ORDERS: 'cartly_orders_v4',
  CUSTOMERS: 'cartly_customers_v4',
  TERMINATED_USERS: 'cartly_terminated_users_v4',
  REVIEWS: 'cartly_reviews_v4',
  AUDIT_LOGS: 'cartly_audit_logs_v4',
};

// Seed initial orders with verificationCode if missing
const seededOrders = initialOrders.map((ord, idx) => ({
  ...ord,
  verificationCode: ord.verificationCode || `VFY-${842910 + idx}`,
}));

let memoryStore = {
  products: [...initialProducts],
  categories: [...initialCategories],
  brands: [...initialBrands],
  coupons: [...initialCoupons],
  banners: [...initialBanners],
  orders: [...seededOrders],
  customers: [...initialCustomers],
  terminatedUsers: [],
  reviews: [...initialReviews],
  auditLogs: [...initialAuditLogs],
};

function getLocalData(key, fallback) {
  if (typeof window === 'undefined') {
    const memoryKey = key.replace('cartly_', '').replace('_v4', '');
    const camelKey = memoryKey.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    return memoryStore[camelKey] || fallback;
  }
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(item);
    if (Array.isArray(fallback) && parsed.length < fallback.length) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function saveLocalData(key, data) {
  if (typeof window === 'undefined') {
    const memoryKey = key.replace('cartly_', '').replace('_v4', '');
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
  async getProducts({ category, subcategory, gender, search, sort, featured, minPrice, maxPrice, inStock } = {}) {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('products').select('*, product_images(*), product_variants(*)');
        if (category && category !== 'all') query = query.eq('category', category);
        if (gender && gender !== 'all') query = query.eq('gender', gender);
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

    if (gender && gender !== 'all') {
      list = list.filter((p) => p.gender?.toLowerCase() === gender.toLowerCase());
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
    // Check live Supabase PostgreSQL first if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map((row) => ({
            id: row.id,
            orderNumber: row.order_number,
            customerName: row.customer_name,
            customerEmail: row.customer_email,
            customerPhone: row.customer_phone,
            shippingAddress: row.shipping_address,
            subtotal: Number(row.subtotal),
            discountAmount: Number(row.discount_amount || 0),
            couponCode: row.coupon_code,
            shippingCost: Number(row.shipping_cost || 0),
            taxAmount: Number(row.tax_amount || 0),
            totalAmount: Number(row.total_amount),
            status: row.status,
            verificationCode: row.verification_code,
            isVerified: Boolean(row.is_verified),
            verifiedAt: row.verified_at,
            paymentStatus: row.payment_status,
            paymentGateway: row.payment_gateway,
            paymentId: row.payment_id,
            trackingNumber: row.tracking_number,
            createdAt: row.created_at,
            items: (row.order_items || []).map((item) => ({
              id: item.id,
              productId: item.product_id,
              productName: item.product_name,
              brand: item.brand,
              category: item.category,
              subcategory: item.subcategory,
              size: item.size,
              sku: item.sku,
              unitPrice: Number(item.unit_price),
              quantity: item.quantity,
              totalPrice: Number(item.total_price),
              image: item.image,
              images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image].filter(Boolean),
              variantName: item.variant_name,
            })),
          }));

          saveLocalData(STORAGE_KEYS.ORDERS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getOrders failed, using local store:', err);
      }
    }

    const orders = getLocalData(STORAGE_KEYS.ORDERS, seededOrders);
    let updated = false;
    const enriched = orders.map((o) => {
      if (!o.verificationCode) {
        updated = true;
        return {
          ...o,
          verificationCode: `VFY-${Math.floor(100000 + Math.random() * 900000)}`,
        };
      }
      return o;
    });
    if (updated) {
      saveLocalData(STORAGE_KEYS.ORDERS, enriched);
    }
    return enriched;
  },

  async getOrderById(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .or(`id.eq.${id},order_number.eq.${id}`)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            orderNumber: data.order_number,
            customerName: data.customer_name,
            customerEmail: data.customer_email,
            customerPhone: data.customer_phone,
            shippingAddress: data.shipping_address,
            subtotal: Number(data.subtotal),
            discountAmount: Number(data.discount_amount || 0),
            couponCode: data.coupon_code,
            shippingCost: Number(data.shipping_cost || 0),
            taxAmount: Number(data.tax_amount || 0),
            totalAmount: Number(data.total_amount),
            status: data.status,
            verificationCode: data.verification_code,
            isVerified: Boolean(data.is_verified),
            verifiedAt: data.verified_at,
            paymentStatus: data.payment_status,
            paymentGateway: data.payment_gateway,
            paymentId: data.payment_id,
            trackingNumber: data.tracking_number,
            createdAt: data.created_at,
            items: (data.order_items || []).map((item) => ({
              id: item.id,
              productId: item.product_id,
              productName: item.product_name,
              brand: item.brand,
              category: item.category,
              subcategory: item.subcategory,
              size: item.size,
              sku: item.sku,
              unitPrice: Number(item.unit_price),
              quantity: item.quantity,
              totalPrice: Number(item.total_price),
              image: item.image,
              images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image].filter(Boolean),
              variantName: item.variant_name,
            })),
          };
        }
      } catch (e) {
        console.warn('Supabase getOrderById failed, using local store:', e);
      }
    }

    const orders = await this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(orderPayload) {
    const orders = await this.getOrders();
    const verificationCode =
      orderPayload.verificationCode || `VFY-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      ...orderPayload,
      id: orderPayload.id || `ord-${Date.now()}`,
      verificationCode,
      createdAt: new Date().toISOString(),
      status: orderPayload.status || 'processing',
      paymentStatus: orderPayload.paymentStatus || 'paid',
    };

    // Live Supabase Insert
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: orderError } = await supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          customer_email: newOrder.customerEmail,
          customer_phone: newOrder.customerPhone || '',
          shipping_address: newOrder.shippingAddress || {},
          subtotal: newOrder.subtotal || newOrder.totalAmount,
          discount_amount: newOrder.discountAmount || 0,
          coupon_code: newOrder.couponCode || '',
          shipping_cost: newOrder.shippingCost || 0,
          tax_amount: newOrder.taxAmount || 0,
          total_amount: newOrder.totalAmount,
          status: newOrder.status,
          verification_code: newOrder.verificationCode,
          is_verified: false,
          payment_status: newOrder.paymentStatus,
          payment_gateway: newOrder.paymentGateway || 'razorpay',
          payment_id: newOrder.paymentId || '',
          tracking_number: newOrder.trackingNumber || '',
          created_at: newOrder.createdAt,
        });

        if (!orderError && Array.isArray(newOrder.items) && newOrder.items.length > 0) {
          const itemsPayload = newOrder.items.map((it, idx) => ({
            id: `oi-${Date.now()}-${idx}`,
            order_id: newOrder.id,
            product_id: it.productId || null,
            product_name: it.productName || 'Product',
            brand: it.brand || 'Cartly Brand',
            category: it.category || 'clothes',
            subcategory: it.subcategory || '',
            size: it.size || 'M',
            sku: it.sku || '',
            unit_price: it.unitPrice || 0,
            quantity: it.quantity || 1,
            total_price: (it.unitPrice || 0) * (it.quantity || 1),
            image: it.image || '',
            images: Array.isArray(it.images) ? it.images : [it.image].filter(Boolean),
            variant_name: it.variantName || '',
          }));

          await supabase.from('order_items').insert(itemsPayload);
        }
      } catch (err) {
        console.warn('Supabase createOrder insert failed, saved to local store:', err);
      }
    }

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

    // Record or update customer entry
    if (newOrder.customerEmail) {
      await this.recordCustomerOrder(newOrder);
    }

    this.logAction(
      'ORDER_PLACED',
      `New order ${newOrder.orderNumber} placed for ₹${newOrder.totalAmount} by ${newOrder.customerName}`
    );
    return newOrder;
  },

  async updateOrderStatus(orderId, status, trackingNumber) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const updateObj = {
          status,
          updated_at: new Date().toISOString(),
        };
        if (trackingNumber !== undefined) {
          updateObj.tracking_number = trackingNumber;
        }

        await supabase
          .from('orders')
          .update(updateObj)
          .or(`id.eq.${orderId},order_number.eq.${orderId}`);
      } catch (err) {
        console.warn('Supabase updateOrderStatus error:', err);
      }
    }

    const orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;
    order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();
    saveLocalData(STORAGE_KEYS.ORDERS, orders);
    this.logAction('UPDATE_ORDER_STATUS', `Order ${order.orderNumber} status changed to ${status}`);
    return order;
  },

  async verifyOrderCode(orderId, code) {
    const orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    const cleanInput = (code || '').trim().toUpperCase();
    const cleanActual = (order.verificationCode || '').trim().toUpperCase();

    if (cleanInput === cleanActual) {
      order.isVerified = true;
      order.verifiedAt = new Date().toISOString();
      order.status = 'delivered';

      if (isSupabaseConfigured() && supabase) {
        try {
          await supabase
            .from('orders')
            .update({
              status: 'delivered',
              is_verified: true,
              verified_at: order.verifiedAt,
              updated_at: order.verifiedAt,
            })
            .or(`id.eq.${orderId},order_number.eq.${orderId}`);
        } catch (err) {
          console.warn('Supabase verifyOrderCode update error:', err);
        }
      }

      saveLocalData(STORAGE_KEYS.ORDERS, orders);
      this.logAction('VERIFY_ORDER_CODE', `Order ${order.orderNumber} code verified successfully (${cleanActual}) - permanently completed`);
      return { success: true, message: 'Verification Code Confirmed! Order permanently marked as Delivered & Completed.', order };
    }
    return { success: false, message: 'Verification Code does not match this order.' };
  },

  // CUSTOMERS & PERMANENT TERMINATION
  async getCustomers() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const mapped = data.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            address: c.address,
            avatar: c.avatar,
            totalOrders: c.total_orders || 0,
            totalSpent: Number(c.total_spent || 0),
            status: c.status,
            joinedDate: c.joined_date,
          }));
          saveLocalData(STORAGE_KEYS.CUSTOMERS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getCustomers failed, using local store:', err);
      }
    }
    return getLocalData(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  },

  async addCustomer(customerData) {
    const customers = await this.getCustomers();
    const newCustomer = {
      id: `cust-${Date.now()}`,
      name: customerData.name || 'Member Customer',
      email: (customerData.email || '').toLowerCase().trim(),
      phone: customerData.phone || '',
      address: customerData.address || '',
      avatar: customerData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      totalOrders: 0,
      totalSpent: 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('customers').insert({
          id: newCustomer.id,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          avatar: newCustomer.avatar,
          total_orders: 0,
          total_spent: 0,
          status: 'active',
          joined_date: newCustomer.joinedDate,
        });
      } catch (err) {
        console.warn('Supabase addCustomer error:', err);
      }
    }

    const updated = [newCustomer, ...customers];
    saveLocalData(STORAGE_KEYS.CUSTOMERS, updated);

    // If user was previously in terminated list, un-terminate them
    await this.removeTerminatedUser(newCustomer.email);

    this.logAction('ADD_CUSTOMER', `Created member account for ${newCustomer.name} (${newCustomer.email})`);
    return newCustomer;
  },

  async deleteCustomer(id) {
    const customers = await this.getCustomers();
    const target = customers.find((c) => c.id === id || c.email === id);
    if (target) {
      // Permanently mark user as terminated so they cannot log in
      await this.addTerminatedUser(target.email);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('customers').delete().or(`id.eq.${id},email.eq.${id}`);
      } catch (err) {
        console.warn('Supabase deleteCustomer error:', err);
      }
    }

    const filtered = customers.filter((c) => c.id !== id && c.email !== id);
    saveLocalData(STORAGE_KEYS.CUSTOMERS, filtered);
    this.logAction('DELETE_CUSTOMER', `Permanently deleted & terminated customer: ${target?.email || id}`);
    return true;
  },

  getTerminatedUsers() {
    return getLocalData(STORAGE_KEYS.TERMINATED_USERS, []);
  },

  async addTerminatedUser(email) {
    if (!email) return;
    const lower = email.toLowerCase().trim();
    const list = this.getTerminatedUsers();
    if (!list.includes(lower)) {
      const updated = [...list, lower];
      saveLocalData(STORAGE_KEYS.TERMINATED_USERS, updated);
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('terminated_users').upsert({
          email: lower,
          reason: 'Permanently terminated by store administrator',
          terminated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase addTerminatedUser error:', err);
      }
    }
  },

  async removeTerminatedUser(email) {
    if (!email) return;
    const lower = email.toLowerCase().trim();
    const list = this.getTerminatedUsers();
    const updated = list.filter((e) => e !== lower);
    saveLocalData(STORAGE_KEYS.TERMINATED_USERS, updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('terminated_users').delete().eq('email', lower);
      } catch (err) {
        console.warn('Supabase removeTerminatedUser error:', err);
      }
    }
  },

  isUserTerminated(email) {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    const list = this.getTerminatedUsers();
    return list.includes(lower);
  },

  async recordCustomerOrder(order) {
    const customers = await this.getCustomers();
    const existing = customers.find(
      (c) => c.email?.toLowerCase() === order.customerEmail?.toLowerCase()
    );
    if (existing) {
      existing.totalOrders = (existing.totalOrders || 0) + 1;
      existing.totalSpent = (existing.totalSpent || 0) + (order.totalAmount || 0);
      existing.lastOrderDate = new Date().toISOString();
      saveLocalData(STORAGE_KEYS.CUSTOMERS, customers);
    } else {
      const newCust = {
        id: `cust-${Date.now()}`,
        name: order.customerName || 'Customer Shopper',
        email: order.customerEmail.toLowerCase().trim(),
        phone: order.customerPhone || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
        address: order.shippingAddress
          ? `${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} - ${order.shippingAddress.postalCode || ''}`
          : '',
        totalOrders: 1,
        totalSpent: order.totalAmount || 0,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      saveLocalData(STORAGE_KEYS.CUSTOMERS, [newCust, ...customers]);
    }
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

  logAction(action, details, user = 'althafshaik1717@gmail.com') {
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
