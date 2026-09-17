'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ChevronRight, ArrowRight } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80');

  const load = async () => {
    const cats = await StoreService.getCategories();
    const prods = await StoreService.getProducts();
    setCategories(cats);
    setProducts(prods);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await StoreService.createCategory({ name, slug, description, imageUrl });
    setName('');
    setDescription('');
    load();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <AdminHeader
        title="Category & Department Architecture"
        subtitle="Manage Men's Wear, Women's Wear, Footwear, and Electronics departments & containers"
      />

      <main className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Quick Navigation into Container Products */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors duration-200">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Direct Container Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click into any container to edit, add, or upload product photos directly from your files.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md shadow-orange-600/20 shrink-0"
          >
            Open Container Workspace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Add New Category */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs space-y-4 transition-colors duration-200">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" /> Create Custom Category / Department
          </h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Category Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Winter Overcoats"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Cover Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description</label>
              <input
                type="text"
                placeholder="Brief department description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition shadow-md shadow-orange-600/20"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>

        {/* Existing Categories & Subcontainers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.toLowerCase() === cat.slug?.toLowerCase()).length;
            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-800"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{cat.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{cat.description}</p>
                    <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono mt-1 block">
                      Slug: {cat.slug} • {count} active products
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Department Live</span>
                  <Link
                    href="/admin/products"
                    className="text-orange-600 dark:text-orange-400 hover:underline font-bold flex items-center gap-1"
                  >
                    Manage Products <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
