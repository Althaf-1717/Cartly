'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, UserCheck, ShieldAlert, Check, AlertOctagon } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('customer');

  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await login(custEmail, custPassword, 'customer');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await login(adminEmail, adminPassword, 'admin');
    } catch (err) {
      setErrorMessage(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Cartly"
              className="h-8 w-auto object-contain dark:brightness-0 dark:invert mx-auto"
            />
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to Cartly</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Choose your account type to proceed</p>
        </div>

        {/* Terminated / Error Banner */}
        {errorMessage && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{errorMessage}</p>
              {errorMessage.toLowerCase().includes('terminated') && (
                <p className="text-[11px] text-red-500/80 mt-1">
                  Your account has been terminated by the administrator. Access is permanently revoked.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('customer');
              setErrorMessage('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Client / Customer
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage('');
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" /> Store Admin
          </button>
        </div>

        {/* CUSTOMER LOGIN */}
        {activeTab === 'customer' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-orange-50 dark:bg-slate-900/60 border border-orange-200 dark:border-slate-800 rounded-xl text-xs text-orange-900 dark:text-slate-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-orange-800 dark:text-slate-300">
                <Check className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Customer Account Access
              </p>
              <p className="text-[11px] text-slate-500 dark:text-orange-400/70">
                Unlock member buying privileges, add items to cart, and track orders.
              </p>
            </div>

            <form onSubmit={handleCustomerLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={custPassword}
                  onChange={(e) => setCustPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2"
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
            <div className="p-3.5 bg-orange-50 dark:bg-slate-900/60 border border-orange-200 dark:border-slate-800 rounded-xl text-xs text-orange-800 dark:text-slate-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Command Hub
              </p>
              <p className="text-[11px] text-slate-500 dark:text-orange-400/70">
                Full store control: Products, catalog, inventory stock, orders, coupons & analytics.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@cartly.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-semibold mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying Admin Key...' : 'Sign In to Admin Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400/60 pt-3 border-t border-slate-200 dark:border-slate-800/60">
          Need an account?{' '}
          <Link
            href={`/auth/signup?role=${activeTab}`}
            className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
          >
            Create {activeTab === 'admin' ? 'Admin' : 'Customer'} Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
