'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  UserCheck,
  ShieldAlert,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Package,
  CreditCard,
  MapPin,
  Sun,
  Moon,
  Heart,
  Search,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/catalog' },
];

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
    setScrolled(window.scrollY > 20);
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

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? 'bg-surface/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md' : 'bg-surface dark:bg-[#0a0a0a]'} border-b border-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="Cartly" className="h-8 sm:h-9 w-auto object-contain dark:brightness-0 dark:invert" />
          </Link>

          {/* Centered Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-subtle border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 p-0.5 text-muted hover:text-text">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted hover:text-text hover:bg-subtle transition"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg text-muted hover:text-text hover:bg-subtle transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-lg text-muted hover:text-text hover:bg-subtle transition"
              title="Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Account */}
            {isAuthenticated ? (
              <div ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-subtle transition-all focus:outline-none"
                  title={user?.fullName || 'Profile'}
                  aria-label="User menu"
                >
                  <User className="w-[18px] h-[18px] text-muted" />
                  <span className="hidden sm:inline text-sm font-medium text-text max-w-[100px] truncate">
                    {user?.fullName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-surface border border-border rounded-xl shadow-xl z-50 py-2 text-sm">
                    <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
                      <p className="font-semibold text-text text-sm">
                        {user?.fullName?.split(' ')[0]}
                        {isAdmin && <span className="ml-2 px-1.5 py-0.5 bg-accent-active text-white text-[9px] font-bold rounded">Admin</span>}
                      </p>
                      <X className="w-3.5 h-3.5 text-muted hover:opacity-70" onClick={() => setUserDropdownOpen(false)} />
                    </div>
                    <div className="py-1">
                      <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:bg-subtle transition">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link href="/account/orders/recent" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:bg-subtle transition">
                        <Package className="w-4 h-4" /> Orders
                      </Link>
                      <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:bg-subtle transition">
                        <CreditCard className="w-4 h-4" /> Saved Cards
                      </Link>
                      <Link href="/account/addresses" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:bg-subtle transition">
                        <MapPin className="w-4 h-4" /> Addresses
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:bg-subtle transition">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:bg-subtle transition">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-subtle transition text-left">
                        <LogOut className="w-4 h-4" /> Logout
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div ref={authDropdownRef}>
                <button
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-dark hover:bg-surface text-white font-medium text-sm transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {authDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-surface border border-border rounded-xl shadow-xl z-50 py-2 text-sm space-y-1">
                    <div className="px-2 py-2 border-b border-border flex items-center justify-between">
                      <p className="font-semibold text-text text-sm">Welcome to Cartly</p>
                    </div>
                    <Link href="/auth/login?role=customer" onClick={() => setAuthDropdownOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-subtle text-text-secondary transition">
                      <UserCheck className="w-4 h-4" /> Sign In as Customer
                    </Link>
                    <Link href="/auth/login?role=admin" onClick={() => setAuthDropdownOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-subtle text-text-secondary transition">
                      <ShieldAlert className="w-4 h-4" /> Sign In as Admin
                    </Link>
                    <Link href="/auth/signup" onClick={() => setAuthDropdownOpen(false)} className="flex items-center justify-center gap-2 w-full py-2 bg-accent hover:bg-accent-active text-white font-medium text-sm rounded-lg transition">
                      <UserPlus className="w-3.5 h-3.5" /> Create Account
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hidden lg:flex p-2 rounded-lg text-dark hover:bg-surface transition"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-subtle border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none"
            />
          </form>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border space-y-1 text-dark">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-subtle transition">
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 bg-subtle text-text text-sm font-medium rounded-lg">Sign In</Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)} className="text-center py-2.5 bg-dark text-white text-sm font-medium rounded-lg">Sign Up</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}