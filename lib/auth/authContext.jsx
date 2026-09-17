'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreService } from '@/lib/db/storeService';

const AuthContext = createContext();

const ADMIN_ACCOUNT = {
  id: 'admin-althaf-1717',
  email: 'althafshaik1717@gmail.com',
  fullName: 'Shaik Althaf',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  phone: '9398870585',
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

  const login = async (email, password, role = 'customer', redirectUrl = null) => {
    setLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();

    // Check if user has been permanently terminated by admin
    if (StoreService.isUserTerminated(cleanEmail)) {
      setLoading(false);
      const errorMsg = 'You are terminated. Please contact admin.';
      alert(errorMsg);
      throw new Error(errorMsg);
    }

    let loggedUser;

    if (role === 'admin' || cleanEmail === 'althafshaik1717@gmail.com') {
      if (cleanEmail === 'althafshaik1717@gmail.com') {
        if (password !== 'Althaf@7727') {
          setLoading(false);
          throw new Error('Incorrect admin access key. Please enter the valid admin password.');
        }
        loggedUser = { ...ADMIN_ACCOUNT };
      } else {
        setLoading(false);
        throw new Error('Access denied. Only authorized administrator can sign in.');
      }
    } else {
      // Customer authentication
      if (!cleanEmail) {
        setLoading(false);
        throw new Error('Please enter a valid customer email address.');
      }

      const customers = await StoreService.getCustomers();
      const existing = customers.find((c) => c.email?.toLowerCase() === cleanEmail);

      loggedUser = {
        id: existing?.id || `cust-${Date.now()}`,
        email: cleanEmail,
        fullName: existing?.name || cleanEmail.split('@')[0],
        role: 'customer',
        avatar: existing?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
        phone: existing?.phone || '',
        address: existing?.address || null,
      };
    }

    setUser(loggedUser);
    localStorage.setItem('cartly_auth_user', JSON.stringify(loggedUser));
    setLoading(false);

    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (loggedUser.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/catalog');
    }
    return loggedUser;
  };

  const signup = async (userData, role = 'customer', redirectUrl = null) => {
    setLoading(true);

    const cleanEmail = (userData.email || '').trim().toLowerCase();

    if (StoreService.isUserTerminated(cleanEmail)) {
      setLoading(false);
      const errorMsg = 'You are terminated. Please contact admin.';
      alert(errorMsg);
      throw new Error(errorMsg);
    }

    const newUser = {
      id: role === 'admin' ? ADMIN_ACCOUNT.id : `user-${Date.now()}`,
      email: cleanEmail,
      fullName: userData.fullName || (role === 'admin' ? ADMIN_ACCOUNT.fullName : 'Customer'),
      role: role,
      avatar: role === 'admin' 
        ? ADMIN_ACCOUNT.avatar
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
      phone: userData.phone || '',
      address: userData.address || null,
    };

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

    if (redirectUrl) {
      router.push(redirectUrl);
    } else if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/catalog');
    }
    return newUser;
  };

  const switchRole = (targetRole) => {
    if (targetRole === 'admin') {
      setUser(ADMIN_ACCOUNT);
      localStorage.setItem('cartly_auth_user', JSON.stringify(ADMIN_ACCOUNT));
      router.push('/admin');
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
