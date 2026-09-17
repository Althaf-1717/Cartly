'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, MapPin, Trash2, Check, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { useAuth } from '@/lib/auth/authContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [form, setForm] = useState({
    country: 'India',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    flatBuilding: '',
    areaStreet: '',
    landmark: '',
    pincode: '',
    townCity: '',
    state: 'Andhra Pradesh',
    isDefault: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cartly_saved_addresses_v1');
      if (stored) {
        setAddresses(JSON.parse(stored));
      } else {
        setAddresses([]);
      }
    } catch (e) {}
  }, [user]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newAddr = { ...form, id: `addr-${Date.now()}` };
    let updated;
    if (form.isDefault || addresses.length === 0) {
      newAddr.isDefault = true;
      updated = [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))];
    } else {
      updated = [...addresses, newAddr];
    }
    setAddresses(updated);
    localStorage.setItem('cartly_saved_addresses_v1', JSON.stringify(updated));
    setIsAdding(false);
    showToast('Delivery address saved successfully.');
  };

  const handleDelete = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('cartly_saved_addresses_v1', JSON.stringify(updated));
    showToast('Address removed.');
  };

  const handleSetDefault = (id) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(updated);
    localStorage.setItem('cartly_saved_addresses_v1', JSON.stringify(updated));
    showToast('Default destination updated.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-6">
        {toastMsg && (
          <div className="p-3 bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center justify-between">
            <span>{toastMsg}</span>
            <button onClick={() => setToastMsg('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="text-xs text-slate-500 dark:text-slate-300/70 hover:text-orange-600 flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Account Settings
          </Link>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Delivery Addresses</h1>
          <p className="text-xs text-slate-500 dark:text-slate-300/70 mt-1">Manage delivery locations for swift checkout</p>
        </div>

        {isAdding ? (
          /* Address Form matching Image 1 */
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-xl">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Add Delivery Address</h2>
            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Country</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="India">India</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Phone no</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">
                  Flat, House no., Building, Company, Apartment
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat / House no. / Apartment name"
                  value={form.flatBuilding}
                  onChange={(e) => setForm({ ...form, flatBuilding: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">
                  Area, Street, Sector, Village
                </label>
                <input
                  type="text"
                  required
                  placeholder="Area / Street name / Sector"
                  value={form.areaStreet}
                  onChange={(e) => setForm({ ...form, areaStreet: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Landmark</label>
                <input
                  type="text"
                  placeholder="E.g. Near Metro Station / Landmark"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="PIN Code"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Town / City</label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={form.townCity}
                    onChange={(e) => setForm({ ...form, townCity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">State</label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                  className="w-4 h-4 accent-orange-600 rounded"
                />
                <span className="text-slate-700 dark:text-slate-200 font-bold text-xs">
                  Make this my default address
                </span>
              </label>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 bg-white dark:bg-[#111111] border rounded-2xl relative space-y-2 shadow-xs transition ${
                  addr.isDefault
                    ? 'border-orange-500 ring-1 ring-orange-500/30'
                    : 'border-slate-200 dark:border-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {addr.fullName}
                  </span>
                  {addr.isDefault && (
                    <span className="px-2.5 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-md uppercase">
                      Default Destination
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-200/80 leading-relaxed">
                  {addr.flatBuilding}, {addr.areaStreet}<br />
                  {addr.landmark ? `Landmark: ${addr.landmark}, ` : ''}{addr.townCity}, {addr.state} - {addr.pincode}<br />
                  {addr.country}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400/60 font-mono pt-1">
                  Phone: {addr.phone}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-orange-600 dark:text-orange-400 font-bold hover:underline"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-orange-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Active Default
                    </span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
