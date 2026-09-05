'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency } from '@/lib/utils/formatters';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'audio',
    brand: 'Aether Sound',
    price: 9999,
    originalPrice: 12999,
    stock: 50,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    isFeatured: true,
    isTrending: false,
  });

  const loadData = async () => {
    const prods = await StoreService.getProducts();
    setProducts(prods);
    const cats = await StoreService.getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      slug: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.slug || 'audio',
      brand: 'Aether Sound',
      price: 4999,
      originalPrice: 6999,
      stock: 30,
      description: 'Engineered high-performance precision device.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      isFeatured: true,
      isTrending: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.images?.[0] || '',
      isFeatured: Boolean(product.isFeatured),
      isTrending: Boolean(product.isTrending),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await StoreService.deleteProduct(id);
      loadData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productPayload = {
      ...form,
      images: [form.imageUrl],
      categoryName: categories.find((c) => c.slug === form.category)?.name || form.category,
    };

    if (editingProduct) {
      await StoreService.updateProduct(editingProduct.id, productPayload);
    } else {
      await StoreService.createProduct(productPayload);
    }

    setIsModalOpen(false);
    loadData();
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Products & Catalog Operations"
        subtitle="Manage complete store catalog, SKU pricing, and stock levels"
      />

      <main className="p-8 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 shadow-md"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20 transition"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-[#18181b] border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-yellow-400 font-black uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80'}
                          alt=""
                          className="w-12 h-12 object-cover rounded-xl bg-zinc-900 border border-zinc-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{p.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-zinc-300 capitalize">{p.category}</td>
                    <td className="py-4 px-4 font-black text-yellow-400">{formatCurrency(p.price)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.stock <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {p.isFeatured && (
                        <span className="px-2 py-0.5 bg-yellow-400 text-black rounded text-[10px] font-black">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

            <div className="relative w-full max-w-2xl bg-[#18181b] border border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-xs text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-black">
                  {editingProduct ? 'Edit Product' : 'Add New Product to Catalog'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">SKU Code</label>
                    <input
                      type="text"
                      required
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug} className="bg-zinc-900">{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="accent-yellow-400 w-4 h-4"
                    />
                    <span className="font-bold text-zinc-300">Featured in Catalog Grid</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isTrending}
                      onChange={(e) => setForm({ ...form, isTrending: e.target.checked })}
                      className="accent-yellow-400 w-4 h-4"
                    />
                    <span className="font-bold text-zinc-300">Trending Flag</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-xl shadow-lg shadow-yellow-400/20"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
