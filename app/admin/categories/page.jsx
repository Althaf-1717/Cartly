'use client';

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80');

  useEffect(() => {
    StoreService.getCategories().then(setCategories);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = await StoreService.createCategory({ name, slug, description, imageUrl });
    setCategories([...categories, newCat]);
    setName('');
    setDescription('');
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Category & Brand Architecture"
        subtitle="Manage product categories, subcategories, and brand portfolios"
      />

      <main className="p-8 space-y-8 max-w-7xl">
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-yellow-400" /> Add New Category
          </h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Creator Rig"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-zinc-300 font-bold mb-1">Short Description</label>
              <input
                type="text"
                placeholder="Brief summary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl transition shadow-md"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#18181b] border border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-xl"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-2xl bg-zinc-900 shrink-0 border border-zinc-800"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{cat.name}</h4>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{cat.description}</p>
                <span className="text-[10px] text-yellow-400 font-mono mt-1 block">slug: {cat.slug}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
