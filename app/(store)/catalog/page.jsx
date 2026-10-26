'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import { StoreService } from '@/lib/db/storeService';
import { cn } from '@/lib/utils/cn';

export default function CatalogPage({ searchParams }) {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterGender, setFilterGender] = useState('all');
  const [filterBrand, setFilterBrand] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [itemsPerPage] = useState(8);

  // Main category drilldown state
  const [drillDownLevel, setDrillDownLevel] = useState('all'); // all | gender | subcategory | products
  const [drillDownValue, setDrillDownValue] = useState(null);

  useEffect(() => {
    StoreService.getCategories().then((cats) => {
      setMainCategories(cats.filter((c) => c.slug !== 'clothes' && c.slug !== 'shoes'));
    });
    StoreService.getBrands().then((b) => setBrands(b));
    loadProducts();
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(itemsPerPage),
      sortBy,
      order: 'asc',
    });

    if (search) params.set('search', search);
    if (filterCategory) params.set('category', filterCategory);
    if (filterBrand) params.set('brand', filterBrand);
    if (inStockOnly) params.append('inStock', 'true');
    if (filterGender && filterGender !== 'all') params.set('gender', filterGender);
    params.set('itemPerPage', String(itemsPerPage));

    const response = await StoreService.getFilteredProducts(params.toString());
    setProducts(response.data);
    setTotalPages(Math.ceil(response.total / itemsPerPage));
    setLoading(false);
  };

  // Drill-down handlers
  const handleDrillDown = (value) => {
    setDrillDownValue(value);
    setDrillDownLevel(drillDownLevel === value ? 'products' : value);
  };

  const resetDrillDown = () => {
    setDrillDownLevel('all');
    setDrillDownValue(null);
  };

  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-200">
      <AnnouncementBar />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Category Toolbar */}
        <div className="space-y-3">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-text tracking-tight">All Products</h1>
            <form action="/catalog" method="get" className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-1">
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                className="w-full sm:max-w-xs px-4 py-2 bg-subtle border border-border rounded-lg text-sm text-text placeholder-muted focus:outline-none focus:border-accent"
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                name="sortBy"
                onChange={(e) => setSortBy(e.target.value)}
                defaultValue="newest"
                className="px-3 py-2 bg-subtle border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </form>
          </div>

          {/* Active Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {Array.isArray(searchParams.category) ? searchParams.category.slice(0, 5).map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setFilterCategory(cat)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition',
                    filterCategory === cat ? 'bg-accent text-white' : 'bg-subtle text-muted border border-border hover:border-accent'
                  )}
                  title={`Category: ${cat}`}
                >
                  {cat}
                  <X className="w-3 h-3 ml-1" />
                </button>
              )) : mainCategories.length > 0 ? mainCategories.slice(0, 5).map((cat, idx) => (
                <button
                  key={`${cat}-${idx}`}
                  onClick={() => {
                    setFilterCategory(cat);
                    window.history.pushState({}, '', `/catalog?category=${encodeURIComponent(cat)}`);
                  }}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition',
                    filterCategory === cat ? 'bg-accent text-white' : 'bg-subtle text-muted border border-border hover:border-accent'
                  )}
                  title={`Category: ${cat}`}
                >
                  {cat}
                  <X className="w-3 h-3 ml-1" />
                </button>
              )) : null}
              {/* Gender */}
              <button
                onClick={() => handleDrillDown('all')}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-medium transition',
                  drillDownLevel === 'gender' ? 'bg-accent text-white' : 'bg-subtle text-muted border border-border hover:border-accent'
                )}
              >
                {drillDownLevel === 'gender' ? 'All Genders' : 'Gender'}
              </button>
              {/* Brand Filter Chips */}
              <div className="relative">
                <Select
                  value={filterBrand || ''}
                  onChange={(v) => setFilterBrand(v || null)}
                  className="absolute right-0 z-10 top-9 h-5 w-5 px-0 text-[11px]"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
                <button
                  onClick={() => setFilterBrand(null)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium transition',
                    filterBrand ? 'bg-accent text-white' : 'bg-subtle text-muted border border-border hover:border-accent'
                  )}
                >
                  {filterBrand?.slice(0, 12) || 'All Brands'} <X className="w-3 h-3 ml-1" />
                </button>
              </div>
            </div>

            {/* Reset */}
            <button onClick={() => { setSearch(''); setFilterCategory(null); setFilterBrand(null); setInStockOnly(false); }} className="px-3 py-1 rounded-lg text-xs font-medium text-muted border border-border hover:border-accent transition flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Reset All
            </button>
          </div>

          {/* In Stock Toggle + Sort */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
              <Switch checked={inStockOnly} onChange={setInStockOnly} /> In Stock Only
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-subtle border border-border rounded-lg text-xs text-text focus:outline-none focus:border-accent"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Drill-down Bar */}
        {drillDownLevel !== 'all' && (
          <div className="flex items-center gap-2 p-3 bg-subtle dark:bg-surface rounded-xl border border-border">
            <span className="text-xs font-medium text-muted">Filters:</span>
            <button
              onClick={resetDrillDown}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted border border-border hover:border-accent transition"
            >
              Reset Drill Down
            </button>
            <span className="ml-auto text-xs text-muted max-w-[200px] truncate">
              Current: {drillDownLevel} → {drillDownValue}
            </span>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-subtle rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-muted mb-4">No products match your current filters.</p>
            <Link href="/catalog?reset=true" className="px-5 py-2 bg-accent hover:bg-accent-active text-white rounded-xl text-xs font-bold">Reset Filters</Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}