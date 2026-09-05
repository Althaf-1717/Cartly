'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, UserCheck, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('customer');

  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(custEmail, custPassword, 'customer');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(adminEmail, adminPassword, 'admin');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#061e14] flex flex-col items-center justify-center p-4 text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-mono font-bold tracking-tight text-slate-900 dark:text-white">CARTLY</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to Cartly</h2>
          <p className="text-xs text-slate-500 dark:text-emerald-300/70">Choose your account type to proceed</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-emerald-950/80 rounded-xl border border-slate-200 dark:border-emerald-800">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-emerald-200 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Client / Customer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-emerald-200 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Store Admin
          </button>
        </div>

        {/* CUSTOMER LOGIN */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Customer Account Access
              </p>
              <p className="text-[11px] text-slate-500 dark:text-emerald-400/70">
                Unlock member buying privileges, add items to cart, and track orders.
              </p>
            </div>

            <form onSubmit={handleCustomerLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In as Customer'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ADMIN LOGIN */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Command Hub
              </p>
              <p className="text-[11px] text-slate-500 dark:text-emerald-400/70">
                Full store control: Products, catalog, inventory stock, orders, coupons & analytics.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@cartly.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying Admin Key...' : 'Sign In to Admin Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-500 dark:text-emerald-400/60 pt-3 border-t border-slate-200 dark:border-emerald-900/60">
          Need an account?{' '}
          <Link
            href={`/auth/signup?role=${activeTab}`}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Create {activeTab === 'admin' ? 'Admin' : 'Customer'} Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
