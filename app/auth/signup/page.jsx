'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

function SignupForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'customer';

  const { register } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    await register({
      fullName,
      email,
      password,
      phone: phone || '+91 98765 43210',
      role,
    });
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-xl font-mono font-bold tracking-tight text-slate-900 dark:text-white">CARTLY</span>
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Account</h2>
        <p className="text-xs text-slate-500 dark:text-emerald-300/70">Join Cartly to explore or manage hardware</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-emerald-950/80 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`py-2 rounded-lg font-bold transition ${
            role === 'customer'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-emerald-200'
          }`}
        >
          Customer Account
        </button>
        <button
          type="button"
          onClick={() => setRole('admin')}
          className={`py-2 rounded-lg font-bold transition ${
            role === 'admin'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-emerald-200'
          }`}
        >
          Store Admin
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="Aarav Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Email Address</label>
          <input
            type="email"
            required
            placeholder="aarav.sharma@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-emerald-100 font-semibold mb-1">Password</label>
          <input
            type="password"
            required
            placeholder="Choose a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 mt-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Account...' : `Register as ${role === 'admin' ? 'Admin' : 'Customer'}`}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 dark:text-emerald-400/60 pt-3 border-t border-slate-200 dark:border-emerald-900/60">
        Already registered?{' '}
        <Link href="/auth/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
          Sign In Here →
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#061e14] flex flex-col items-center justify-center p-4 text-slate-900 dark:text-emerald-50 transition-colors duration-200">
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading registration form...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
