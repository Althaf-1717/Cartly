'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreService } from '@/lib/db/storeService';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  admin: {
    id: 'user-admin-01',
    email: 'admin@cartly.com',
    fullName: 'Store Administrator',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    phone: '+91 99000 11223'
  },
  customer: {
    id: 'user-cust-01',
    email: 'aarav.sharma@example.com',
    fullName: 'Aarav Sharma',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
    phone: '+91 98765 43210',
    address: {
      fullName: 'Aarav Sharma',
      street: 'Flat 402, Skyline Residency, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      phone: '+91 98765 43210',
      country: 'India'
    }
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartly_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (StoreService.isUserTerminated(parsed.email)) {
          // If stored user was terminated by admin, revoke session immediately
          localStorage.removeItem('cartly_auth_user');
          setUser(null);
        } else {
          setUser(parsed);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role = 'customer') => {
    setLoading(true);

    // Check if user has been permanently terminated by admin
    if (StoreService.isUserTerminated(email)) {
      setLoading(false);
      const errorMsg = 'You are terminated. Please contact admin.';
      alert(errorMsg);
      throw new Error(errorMsg);
    }

    let loggedUser;

    if (role === 'admin' || email?.includes('admin')) {
      loggedUser = {
        ...DEMO_ACCOUNTS.admin,
        email: email || DEMO_ACCOUNTS.admin.email,
        role: 'admin',
      };
    } else {
      // Find matching customer details if available
      const customers = await StoreService.getCustomers();
      const existing = customers.find((c) => c.email?.toLowerCase() === email?.toLowerCase());

      loggedUser = {
        id: existing?.id || `cust-${Date.now()}`,
        email: email || DEMO_ACCOUNTS.customer.email,
        fullName: existing?.name || (email ? email.split('@')[0] : DEMO_ACCOUNTS.customer.fullName),
        role: 'customer',
        avatar: existing?.avatar || DEMO_ACCOUNTS.customer.avatar,
        phone: existing?.phone || DEMO_ACCOUNTS.customer.phone,
        address: existing?.address || DEMO_ACCOUNTS.customer.address,
      };
    }

    setUser(loggedUser);
    localStorage.setItem('cartly_auth_user', JSON.stringify(loggedUser));
    setLoading(false);

    if (loggedUser.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/catalog');
    }
    return loggedUser;
  };

  const signup = async (userData, role = 'customer') => {
    setLoading(true);

    if (StoreService.isUserTerminated(userData.email)) {
      setLoading(false);
      const errorMsg = 'You are terminated. Please contact admin.';
      alert(errorMsg);
      throw new Error(errorMsg);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      fullName: userData.fullName || (role === 'admin' ? 'Store Administrator' : 'Customer Shopper'),
      role: role,
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      phone: userData.phone || '',
      address: userData.address || null,
    };

    // Also register in customer directory
    if (role === 'customer') {
      await StoreService.addCustomer({
        name: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
      });
    }

    setUser(newUser);
    localStorage.setItem('cartly_auth_user', JSON.stringify(newUser));
    setLoading(false);

    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/catalog');
    }
    return newUser;
  };

  const switchRole = (targetRole) => {
    const target = targetRole === 'admin' ? DEMO_ACCOUNTS.admin : DEMO_ACCOUNTS.customer;
    setUser(target);
    localStorage.setItem('cartly_auth_user', JSON.stringify(target));
    if (targetRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/catalog');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cartly_auth_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        register: signup,
        logout,
        switchRole,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
