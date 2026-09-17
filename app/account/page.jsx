'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Heart,
  Gift,
  Headphones,
  Sparkles,
  Smartphone,
  User,
  CreditCard,
  MapPin,
  Globe,
  Bell,
  Lock,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Check,
  X,
  Plus,
  Trash2,
  ShieldCheck,
  Copy,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import { useAuth } from '@/lib/auth/authContext';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir'
];

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, isAdmin } = useAuth();

  // Active Modals: null | 'edit-profile' | 'coupons' | 'plus' | 'devices' | 'cards' | 'addresses' | 'language' | 'notifications' | 'privacy' | 'policies' | 'faqs'
  const [activeModal, setActiveModal] = useState(null);

  // Profile data
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Selected language
  const [selectedLang, setSelectedLang] = useState('en');

  // Notification toggles
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    whatsappAlerts: true,
    promotions: false,
    smsAlerts: true,
  });

  // Saved Addresses (Image 1 form)
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    country: 'India',
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    flatBuilding: '',
    areaStreet: '',
    landmark: '',
    pincode: '',
    townCity: '',
    state: 'Andhra Pradesh',
    isDefault: true,
  });
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Saved Cards / Payment methods
  const [savedCards, setSavedCards] = useState([]);
  const [savedUPI, setSavedUPI] = useState([]);

  // Coupons data
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Orders count
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    StoreService.getOrders().then(setOrders);
    StoreService.getCoupons().then(setCoupons);

    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }

    // Load saved addresses from localStorage
    try {
      const storedAddrs = localStorage.getItem('cartly_saved_addresses_v1');
      if (storedAddrs) {
        setAddresses(JSON.parse(storedAddrs));
      } else {
        setAddresses([]);
      }
    } catch (e) {}
  }, [user]);

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile credentials updated successfully!');
    setActiveModal(null);
  };

  // Address Save (Image 1)
  const handleSaveAddress = (e) => {
    e.preventDefault();
    let updated;
    const newAddr = {
      ...addressForm,
      id: `addr-${Date.now()}`,
    };

    if (addressForm.isDefault) {
      updated = [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))];
    } else {
      updated = [...addresses, newAddr];
    }

    setAddresses(updated);
    localStorage.setItem('cartly_saved_addresses_v1', JSON.stringify(updated));
    setIsAddingNewAddress(false);
    showToast('New address saved successfully!');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('cartly_saved_addresses_v1', JSON.stringify(updated));
    showToast('Address removed.');
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem('cartly_saved_addresses_v1', JSON.stringify(updated));
    showToast('Default delivery address updated.');
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-50 transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        {/* Toast Alert */}
        {successToast && (
          <div className="p-3.5 bg-orange-600 text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="p-1 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            1. TOP PROFILE BANNER (Image 1 & Image 2)
            ========================================================================= */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'}
                alt={fullName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-2 ring-orange-500/60"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-orange-500 border-2 border-white dark:border-[#111111] rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {fullName}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-md uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300/70 truncate">{email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300/70 font-mono mt-0.5">{phone}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('edit-profile')}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-900/80 hover:bg-orange-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* =========================================================================
            2. TOP 4 QUICK ACTION TILES (Image 2)
            ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Orders */}
          <Link
            href="/account/orders/recent"
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 hover:border-orange-500 rounded-2xl p-4 flex items-center gap-3 transition shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-900 text-orange-700 dark:text-slate-300 border border-orange-200 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-orange-600 transition">
                Orders
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400/60">
                {orders.length} Placed
              </span>
            </div>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 hover:border-orange-500 rounded-2xl p-4 flex items-center gap-3 transition shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-rose-600 transition">
                Wishlist
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400/60">
                Saved Items
              </span>
            </div>
          </Link>

          {/* Coupons */}
          <button
            onClick={() => setActiveModal('coupons')}
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 hover:border-orange-500 rounded-2xl p-4 flex items-center gap-3 transition shadow-xs group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-amber-600 transition">
                Coupons
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400/60">
                {coupons.length} Active
              </span>
            </div>
          </button>

          {/* Help Center */}
          <button
            onClick={() => setActiveModal('faqs')}
            className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 hover:border-orange-500 rounded-2xl p-4 flex items-center gap-3 transition shadow-xs group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-blue-600 transition">
                Help Center
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400/60">
                24/7 Support
              </span>
            </div>
          </button>
        </div>

        {/* =========================================================================
            3. ACCOUNT SETTINGS MENU LIST (Image 3)
            ========================================================================= */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white px-1">
            Account Settings
          </h2>

          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl divide-y divide-slate-100 dark:divide-orange-900/40 shadow-xs overflow-hidden">
            {/* 1. Cartly Plus */}
            <button
              onClick={() => setActiveModal('plus')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Cartly Plus VIP Member
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Free fast delivery & exclusive member savings</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 2. Manage Devices */}
            <button
              onClick={() => setActiveModal('devices')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Manage Devices
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">View active login sessions & sign out devices</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 3. Edit Profile */}
            <button
              onClick={() => setActiveModal('edit-profile')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Edit Profile
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Update name, email, phone, and password</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 4. Saved Credit / Debit & Gift Cards */}
            <button
              onClick={() => setActiveModal('cards')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Saved Credit / Debit & Gift Cards
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Manage Razorpay cards, UPI IDs, and wallet</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 5. Saved Addresses (Image 1 form integration) */}
            <button
              onClick={() => setActiveModal('addresses')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Saved Addresses
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">{addresses.length} saved delivery locations</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 6. Select Language */}
            <button
              onClick={() => setActiveModal('language')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Select Language
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">
                    Currently: {LANGUAGES.find((l) => l.code === selectedLang)?.name}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 7. Notification Settings */}
            <button
              onClick={() => setActiveModal('notifications')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Notification Settings
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Order updates, SMS, and WhatsApp alerts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* 8. Privacy Center */}
            <button
              onClick={() => setActiveModal('privacy')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Privacy Center
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Manage account data and privacy rights</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. FEEDBACK & INFORMATION SECTION (Image 4)
            ========================================================================= */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white px-1">
            Feedback & Information
          </h2>

          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/50 rounded-2xl divide-y divide-slate-100 dark:divide-orange-900/40 shadow-xs overflow-hidden">
            {/* Terms, Policies and Licenses */}
            <button
              onClick={() => setActiveModal('policies')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Terms, Policies and Licenses
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Return policies, 1-yr warranty, and legal terms</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>

            {/* Browse FAQs */}
            <button
              onClick={() => setActiveModal('faqs')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50 transition text-left group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-slate-900 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition">
                    Browse FAQs
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400/60">Instant answers regarding orders, returns, and payments</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            5. LOG OUT BUTTON (Image 4)
            ========================================================================= */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3.5 bg-white dark:bg-[#111111] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-800/50 hover:border-red-300 dark:hover:border-red-800 text-xs font-bold rounded-2xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </main>

      {/* =========================================================================
          INTERACTIVE MODALS & DRAWERS FOR ALL SETTINGS
          ========================================================================= */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-slate-900 dark:text-white max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                  {activeModal === 'edit-profile' && 'Edit Profile Credentials'}
                  {activeModal === 'coupons' && 'Available Coupon Offers'}
                  {activeModal === 'plus' && 'Cartly Plus Membership'}
                  {activeModal === 'devices' && 'Active Login Devices'}
                  {activeModal === 'cards' && 'Saved Payment Methods'}
                  {activeModal === 'addresses' && 'Manage Delivery Addresses'}
                  {activeModal === 'language' && 'Select Preferred Language'}
                  {activeModal === 'notifications' && 'Notification Preferences'}
                  {activeModal === 'privacy' && 'Privacy & Account Security'}
                  {activeModal === 'policies' && 'Terms, Policies and Licenses'}
                  {activeModal === 'faqs' && 'Frequently Asked Questions'}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* 1. EDIT PROFILE */}
                {activeModal === 'edit-profile' && (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">New Password (Optional)</label>
                      <input
                        type="password"
                        placeholder="Leave blank to keep existing password"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-600"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
                      >
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                )}

                {/* 2. COUPONS (Image 2) */}
                {activeModal === 'coupons' && (
                  <div className="space-y-3">
                    <p className="text-slate-500 dark:text-slate-300/70">
                      Apply any coupon code below during checkout to redeem instant discounts:
                    </p>
                    {coupons.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-orange-50/70 dark:bg-slate-900/60 border border-orange-200 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-orange-800 dark:text-slate-300 text-sm">
                              {c.code}
                            </span>
                            <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded">
                              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-200/80 text-xs mt-1">{c.description}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-400/60 mt-0.5">
                            Min Order: ₹{c.minOrderAmount}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyCoupon(c.code)}
                          className="px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shrink-0 shadow-xs"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedCode === c.code ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. CARTLY PLUS */}
                {activeModal === 'plus' && (
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-r from-orange-600 to-teal-700 text-white rounded-2xl space-y-2 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-bold tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
                          VIP ACTIVE
                        </span>
                        <Sparkles className="w-5 h-5 text-slate-200" />
                      </div>
                      <h4 className="text-lg font-black">Cartly Plus Member</h4>
                      <p className="text-xs text-slate-100">
                        You have unlocked zero delivery fees, 24-hour priority dispatch, and member pricing across all categories.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block">Free Shipping</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-300/70">On all orders over ₹0</span>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white block">Priority Dispatch</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-300/70">Within 24 Hours</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. MANAGE DEVICES */}
                {activeModal === 'devices' && (
                  <div className="space-y-3">
                    <p className="text-slate-500 dark:text-slate-300/70">
                      Devices currently signed in to your Cartly account:
                    </p>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Laptop className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">MacBook Pro (Current Session)</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-400/60">Chrome • Bengaluru, India • Active Now</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-slate-800 text-orange-800 dark:text-slate-300 text-[10px] font-bold rounded">
                        This Device
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">iPhone 15 Pro</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-400/60">Cartly Web App • Active 2 days ago</p>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast('Signed out of iPhone 15 Pro.')}
                        className="text-red-600 text-xs font-bold hover:underline"
                      >
                        Revoke
                      </button>
                    </div>

                    <button
                      onClick={() => showToast('Signed out of all other devices.')}
                      className="w-full py-2.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition"
                    >
                      Sign Out of All Other Devices
                    </button>
                  </div>
                )}

                {/* 5. SAVED CARDS */}
                {activeModal === 'cards' && (
                  <div className="space-y-3">
                    <p className="text-slate-500 dark:text-slate-300/70">
                      Razorpay 256-bit SSL encrypted payment handles:
                    </p>

                    {savedCards.map((c) => (
                      <div
                        key={c.id}
                        className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{c.type}</p>
                            <p className="text-[10px] text-slate-400 font-mono">•••• •••• •••• {c.last4} (Exp: {c.expiry})</p>
                          </div>
                        </div>
                        {c.isDefault ? (
                          <span className="px-2 py-0.5 bg-orange-100 dark:bg-slate-800 text-orange-800 dark:text-slate-300 text-[10px] font-bold rounded">
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSavedCards(savedCards.filter((x) => x.id !== c.id));
                              showToast('Card removed.');
                            }}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="pt-2">
                      <p className="font-bold text-slate-900 dark:text-white mb-1.5">Saved UPI Handles</p>
                      {savedUPI.map((upi, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between mb-1.5">
                          <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{upi}</span>
                          <span className="text-[10px] text-orange-600 font-bold">Verified</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. SAVED ADDRESSES (EXACT FORM FROM IMAGE 1) */}
                {activeModal === 'addresses' && (
                  <div className="space-y-4">
                    {!isAddingNewAddress ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-slate-500 dark:text-slate-300/70">
                            {addresses.length} saved delivery destinations:
                          </p>
                          <button
                            onClick={() => setIsAddingNewAddress(true)}
                            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Address
                          </button>
                        </div>

                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`p-4 rounded-2xl border transition relative space-y-1.5 ${
                              addr.isDefault
                                ? 'bg-orange-50/50 dark:bg-slate-900/60 border-orange-500'
                                : 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-orange-850'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {addr.fullName}
                              </span>
                              {addr.isDefault ? (
                                <span className="px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded">
                                  Default Destination
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-xs text-orange-600 font-bold hover:underline"
                                >
                                  Make Default
                                </button>
                              )}
                            </div>

                            <p className="text-slate-600 dark:text-slate-200/80 leading-relaxed text-xs">
                              {addr.flatBuilding}, {addr.areaStreet}<br />
                              {addr.landmark ? `Landmark: ${addr.landmark}, ` : ''}{addr.townCity}, {addr.state} - {addr.pincode}<br />
                              {addr.country}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-xs">
                              <span className="font-mono text-slate-500 dark:text-slate-400/60">Phone: {addr.phone}</span>
                              {addresses.length > 1 && (
                                <button
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* EXACT HANDWRITTEN ADDRESS FORM (Image 1) */
                      <form onSubmit={handleSaveAddress} className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                          <span className="font-bold text-slate-900 dark:text-white">Add Delivery Address</span>
                          <button
                            type="button"
                            onClick={() => setIsAddingNewAddress(false)}
                            className="text-xs text-slate-400 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Country</label>
                          <select
                            value={addressForm.country}
                            onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          >
                            <option value="India">India</option>
                          </select>
                        </div>

                        {/* Full name */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Full name</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter recipient full name"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Phone no */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Phone no</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Flat, House no., Building, Company, Apartment */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">
                            Flat, House no., Building, Company, Apartment
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Flat / Door no., Apartment / Building name"
                            value={addressForm.flatBuilding}
                            onChange={(e) => setAddressForm({ ...addressForm, flatBuilding: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Area, Street, Sector, Village */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">
                            Area, Street, Sector, Village
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Area / Street name / Sector"
                            value={addressForm.areaStreet}
                            onChange={(e) => setAddressForm({ ...addressForm, areaStreet: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Landmark */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Landmark</label>
                          <input
                            type="text"
                            placeholder="E.g. Near Metro Station / Apollo Hospital"
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          />
                        </div>

                        {/* Pincode & Town/City */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Pincode</label>
                            <input
                              type="text"
                              required
                              placeholder="6 digits PIN"
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">Town / City</label>
                            <input
                              type="text"
                              required
                              placeholder="City"
                              value={addressForm.townCity}
                              onChange={(e) => setAddressForm({ ...addressForm, townCity: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* State */}
                        <div>
                          <label className="block text-slate-700 dark:text-slate-100 font-bold mb-1">State</label>
                          <select
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                          >
                            {INDIAN_STATES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                        {/* Default Checkbox */}
                        <label className="flex items-center gap-2 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            className="w-4 h-4 accent-orange-600 rounded"
                          />
                          <span className="text-slate-700 dark:text-slate-200 font-semibold text-xs">
                            Make this my default address
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
                        >
                          Save Address
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 7. SELECT LANGUAGE */}
                {activeModal === 'language' && (
                  <div className="space-y-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code);
                          showToast(`Language switched to ${lang.name}.`);
                          setActiveModal(null);
                        }}
                        className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition ${
                          selectedLang === lang.code
                            ? 'bg-orange-50 dark:bg-slate-900 border-orange-500 text-orange-800 dark:text-slate-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="text-left">
                          <p className="text-xs font-bold">{lang.name}</p>
                          <p className="text-[11px] opacity-70">{lang.native}</p>
                        </div>
                        {selectedLang === lang.code && <Check className="w-4 h-4 text-orange-600" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* 8. NOTIFICATION SETTINGS */}
                {activeModal === 'notifications' && (
                  <div className="space-y-3">
                    <label className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Order Status Updates</p>
                        <p className="text-[11px] text-slate-400">Receive dispatch & tracking notifications</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                        className="w-4 h-4 accent-orange-600"
                      />
                    </label>

                    <label className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">WhatsApp Order Alerts</p>
                        <p className="text-[11px] text-slate-400">Live courier tracking on WhatsApp</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.whatsappAlerts}
                        onChange={(e) => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
                        className="w-4 h-4 accent-orange-600"
                      />
                    </label>

                    <label className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Promotions & Flash Discounts</p>
                        <p className="text-[11px] text-slate-400">Seasonal coupon codes and price drops</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.promotions}
                        onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                        className="w-4 h-4 accent-orange-600"
                      />
                    </label>

                    <button
                      onClick={() => {
                        showToast('Notification preferences saved.');
                        setActiveModal(null);
                      }}
                      className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition"
                    >
                      Save Preferences
                    </button>
                  </div>
                )}

                {/* 9. PRIVACY CENTER */}
                {activeModal === 'privacy' && (
                  <div className="space-y-3">
                    <p className="text-slate-500 dark:text-slate-300/70">
                      Your privacy is protected under 256-bit encryption. Control your data footprint:
                    </p>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Download Account Data</p>
                        <p className="text-[11px] text-slate-400">Export orders, addresses, and account manifest (JSON)</p>
                      </div>
                      <button
                        onClick={() => showToast('Data export initiated. Download link ready.')}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-lg"
                      >
                        Export
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-[11px] text-orange-600 font-semibold">Active via SMS OTP</p>
                      </div>
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-slate-800 text-orange-800 dark:text-slate-300 text-[10px] font-bold rounded">
                        Secured
                      </span>
                    </div>
                  </div>
                )}

                {/* 10. POLICIES */}
                {activeModal === 'policies' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">7-Day Free Replacement Guarantee</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300/70">
                        Any transit damage or manufacturing defect is eligible for an instant free door-step replacement within 7 days of verified delivery.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">1-Year Official Manufacturer Warranty</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300/70">
                        Every device and apparel item carries direct brand certification and manufacturer warranty.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Razorpay Secure SSL Gateway</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300/70">
                        All payments are processed with bank-grade 256-bit encryption. Cartly never stores your full card CVV.
                      </p>
                    </div>
                  </div>
                )}

                {/* 11. FAQS */}
                {activeModal === 'faqs' && (
                  <div className="space-y-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">How do I track my order?</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300/70">
                        Navigate to "Orders" from the settings hub to view real-time courier AWB tracking.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">How do I apply coupon discounts?</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300/70">
                        Click "Coupons" to copy codes like <strong className="text-orange-600">CARTLY20</strong>, and paste them in the Cart Drawer or Checkout page.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">How do I update delivery addresses?</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300/70">
                        Click "Saved Addresses" to add multiple addresses or set a primary default.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
