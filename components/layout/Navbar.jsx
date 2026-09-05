'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  UserCheck,
  ShieldAlert,
  UserPlus,
  Sun,
  Moon,
  Heart,
  Search,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { itemCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const authDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (authDropdownRef.current && !authDropdownRef.current.contains(e.target)) {
        setAuthDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/catalog');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/catalog' },
    { name: 'Features', href: '/#features' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#061e14]/95 backdrop-blur-md shadow-sm border-b border-emerald-100 dark:border-emerald-900/40'
          : 'bg-white dark:bg-[#061e14] border-b border-slate-100 dark:border-emerald-950'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-mono leading-none">
                CARTLY
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 tracking-widest font-bold uppercase mt-0.5">
                STOREFRONT
              </span>
            </div>
          </Link>

          {/* Centered Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-lg mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 dark:text-emerald-300/60 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products, categories, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-emerald-950/40 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-emerald-200/40 focus:outline-none focus:border-emerald-600 focus:bg-white dark:focus:bg-emerald-950/80 transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-emerald-100/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition hover:text-emerald-600 dark:hover:text-emerald-400 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-emerald-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition flex items-center justify-center"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-emerald-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Wishlist Button with Badge */}
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-emerald-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition flex items-center justify-center"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-[#061e14] shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Badge */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-emerald-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition flex items-center justify-center"
              title="Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-emerald-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-[#061e14] shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Account Button */}
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-emerald-500 transition-all focus:outline-none"
                  title={user?.fullName || 'User Profile'}
                  aria-label="User menu"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                    alt={user?.fullName || 'User'}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/60 shadow-xs"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-800 rounded-2xl shadow-2xl p-3 z-50 text-xs text-slate-900 dark:text-white animate-in fade-in duration-150">
                    <div className="pb-3 mb-2 border-b border-slate-100 dark:border-emerald-900/40 flex items-center gap-3">
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt={user?.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user?.fullName}</p>
                        <p className="text-slate-500 dark:text-emerald-300/70 text-[11px] truncate">{user?.email}</p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isAdmin
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-white" /> Admin Command Hub
                        </Link>
                      ) : (
                        <Link
                          href="/catalog"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition font-semibold"
                        >
                          <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Products Catalog
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition font-semibold"
                      >
                        <User className="w-4 h-4 text-slate-500 dark:text-emerald-400" /> My Orders & Profile
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition font-semibold"
                      >
                        <Heart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Saved Wishlist ({wishlistCount})
                      </Link>

                      <Link
                        href="/account/orders/recent"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-700 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition font-semibold"
                      >
                        <Package className="w-4 h-4 text-slate-500 dark:text-emerald-400" /> Live Tracking
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition font-semibold text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Account Button */
              <div className="relative" ref={authDropdownRef}>
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {authDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#09261a] border border-slate-200 dark:border-emerald-800 rounded-2xl shadow-2xl p-3 z-50 text-xs text-slate-900 dark:text-white space-y-1.5 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-emerald-900/40">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">Welcome to Cartly</p>
                      <p className="text-[11px] text-slate-500 dark:text-emerald-300/70">Choose your account action:</p>
                    </div>

                    <Link
                      href="/auth/login?role=customer"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-slate-800 dark:text-emerald-100 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="leading-tight">Sign In as Customer</p>
                        <p className="text-[10px] text-slate-400 dark:text-emerald-300/60 font-normal">Shopping & orders</p>
                      </div>
                    </Link>

                    <Link
                      href="/auth/login?role=admin"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-slate-800 dark:text-emerald-100 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition"
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="leading-tight">Sign In as Admin</p>
                        <p className="text-[10px] text-slate-400 dark:text-emerald-300/60 font-normal">Manage store & catalog</p>
                      </div>
                    </Link>

                    <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/40">
                      <Link
                        href="/auth/signup"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create New Account</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/30 transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-emerald-400/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-emerald-950/50 border border-slate-200 dark:border-emerald-800/40 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
          </form>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-emerald-900/40 space-y-3 text-slate-800 dark:text-emerald-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-emerald-950/40 transition"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-emerald-900/40 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-slate-100 dark:bg-emerald-950 text-slate-900 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-emerald-800"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
