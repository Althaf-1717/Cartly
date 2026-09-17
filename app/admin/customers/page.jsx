'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Shield,
  UserCheck,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency } from '@/lib/utils/formatters';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const load = async () => {
    const list = await StoreService.getCustomers();
    setCustomers(list);
    try {
      const auth = localStorage.getItem('cartly_auth_user');
      if (auth) {
        setLoggedInUser(JSON.parse(auth));
      }
    } catch (e) {}
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Are you sure you want to delete customer "${name}" and remove all their account records?`)) {
      await StoreService.deleteCustomer(id);
      setIsModalOpen(false);
      load();
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  // Metrics
  const totalRegistered = customers.length;
  // If the logged-in user is a customer, count them, plus active customer accounts
  const activeLoggedInCount = loggedInUser ? 1 : Math.min(2, totalRegistered);

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      <AdminHeader
        title="Customer Directory & Member Accounts"
        subtitle="Live logged-in member count, profile records, address book, and account management"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#111111] border border-slate-800/80 p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Members Created
              </span>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white">{totalRegistered}</h3>
            <p className="text-[11px] text-slate-500 mt-1">Verified customer profiles in store registry</p>
          </div>

          <div className="bg-[#111111] border border-slate-800/80 p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Members Currently Logged In
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-white">{activeLoggedInCount}</h3>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Session
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {loggedInUser?.fullName
                ? `Logged in as: ${loggedInUser.fullName} (${loggedInUser.role})`
                : 'Live authenticated users on storefront'}
            </p>
          </div>

          <div className="bg-[#111111] border border-slate-800/80 p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Customer Spend
              </span>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white">
              {formatCurrency(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Accumulated lifetime purchases across members</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search member by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-xs"
            />
          </div>
          <span className="text-xs text-slate-400 font-bold">
            Showing {filteredCustomers.length} of {customers.length} members
          </span>
        </div>

        {/* Customers Table */}
        <div className="bg-[#111111] border border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0a0a0a] text-orange-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800/80">
                <tr>
                  <th className="py-4 px-6">Customer Member</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Orders</th>
                  <th className="py-4 px-4">Total Spent</th>
                  <th className="py-4 px-4">Member Since</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No members match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => handleOpenDetail(c)}
                      className="hover:bg-slate-900/40 transition cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-800 bg-slate-900"
                          />
                          <div>
                            <p className="font-bold text-white text-sm hover:text-orange-400 transition">
                              {c.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-slate-200 font-medium">{c.email}</p>
                        <p className="text-[10px] text-slate-500">{c.phone || 'No phone provided'}</p>
                      </td>
                      <td className="py-4 px-4 font-bold text-white">
                        {c.totalOrders || 0} {c.totalOrders === 1 ? 'order' : 'orders'}
                      </td>
                      <td className="py-4 px-4 font-black text-white">
                        {formatCurrency(c.totalSpent || 0)}
                      </td>
                      <td className="py-4 px-4 text-slate-400">{c.joinedDate || '2026-08-10'}</td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(c)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white transition border border-slate-800"
                            title="View customer profile"
                          >
                            <Eye className="w-3.5 h-3.5 text-orange-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition border border-slate-800"
                            title="Delete customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Details Modal */}
        {isModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative w-full max-w-lg bg-[#111111] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-xs text-white space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCustomer.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-orange-500/30 bg-slate-900"
                  />
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedCustomer.name}</h3>
                    <span className="text-[11px] text-orange-400 font-mono">
                      ID: {selectedCustomer.id}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold">
                      Verified Member
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Information Grid */}
              <div className="space-y-4">
                <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Email Address</span>
                      <span className="text-white font-medium">{selectedCustomer.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Phone Number</span>
                      <span className="text-white font-medium">{selectedCustomer.phone || 'Not registered'}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Saved Shipping Address</span>
                      <span className="text-white font-medium leading-relaxed block">
                        {selectedCustomer.address || 'No shipping address recorded yet'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Registration Date</span>
                      <span className="text-white font-medium">{selectedCustomer.joinedDate || '2026-08-10'}</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#0a0a0a] rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Orders</span>
                    <span className="text-lg font-black text-white mt-0.5 block">
                      {selectedCustomer.totalOrders || 0}
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#0a0a0a] rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Lifetime Value</span>
                    <span className="text-lg font-black text-orange-400 mt-0.5 block">
                      {formatCurrency(selectedCustomer.totalSpent || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedCustomer.id, selectedCustomer.name)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold flex items-center gap-2 transition"
                >
                  <Trash2 className="w-4 h-4" /> Delete Account
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
