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
          ? 'bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md shadow-sm'
          : 'bg-white dark:bg-[#0a0a0a]'
      } border-b border-slate-100 dark:border-slate-800/60`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Cartly"
              className="h-8 sm:h-9 w-auto object-contain dark:brightness-0 dark:invert"
            />
          </Link>

          {/* Centered Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition"
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
          <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition hover:text-slate-900 dark:hover:text-white ${
                    isActive ? 'text-slate-900 dark:text-white font-semibold' : 'font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-0.5 rounded-full hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600 transition-all focus:outline-none"
                  title={user?.fullName || 'Profile'}
                  aria-label="User menu"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                    alt={user?.fullName || 'User'}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 text-sm text-slate-900 dark:text-white">
                    <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 px-2">
                      <img
                        src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt={user?.fullName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">{user?.fullName}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      ) : (
                        <Link
                          href="/catalog"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                        >
                          <ShoppingBag className="w-4 h-4 text-slate-400" /> Products
                        </Link>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                      >
                        <User className="w-4 h-4 text-slate-400" /> My Account
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                      >
                        <Heart className="w-4 h-4 text-slate-400" /> Wishlist ({wishlistCount})
                      </Link>

                      <Link
                        href="/account/orders/recent"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium"
                      >
                        <Package className="w-4 h-4 text-slate-400" /> Track Orders
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest */
              <div className="relative" ref={authDropdownRef}>
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-sm transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {authDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#161616] border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 text-sm space-y-1">
                    <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white">Welcome to Cartly</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Choose an action:</p>
                    </div>

                    <Link
                      href="/auth/login?role=customer"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                    >
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-sm">Sign In as Customer</p>
                        <p className="text-xs text-slate-400">Shopping & orders</p>
                      </div>
                    </Link>

                    <Link
                      href="/auth/login?role=admin"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                    >
                      <ShieldAlert className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="font-medium text-sm">Sign In as Admin</p>
                        <p className="text-xs text-slate-400">Manage store</p>
                      </div>
                    </Link>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <Link
                        href="/auth/signup"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-2 bg-slate-900 dark:bg-white hover:opacity-90 text-white dark:text-slate-900 font-medium text-sm rounded-lg transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Account</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </form>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 dark:border-slate-800 space-y-1 text-slate-700 dark:text-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg"
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
