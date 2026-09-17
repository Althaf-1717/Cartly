'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ArrowLeft,
  Package,
  Layers,
  Tag,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import { StoreService } from '@/lib/db/storeService';
import { formatCurrency } from '@/lib/utils/formatters';

const DEPARTMENTS = [
  { id: 'all', name: 'All Products' },
  { id: 'men', name: "Men's Wear", category: 'clothes', gender: 'male' },
  { id: 'women', name: "Women's Wear", category: 'clothes', gender: 'female' },
  { id: 'shoes', name: 'Shoes & Footwear', category: 'shoes' },
  { id: 'electronics', name: 'Electronics & Audio', category: 'electronics' },
];

const SUBCATEGORIES_MAP = {
  men: [
    { slug: 'shirts', name: 'Shirts' },
    { slug: 'pants', name: 'Pants' },
    { slug: 't-shirts', name: 'T-Shirts' },
    { slug: 'shorts', name: 'Shorts' },
    { slug: 'bunnies', name: 'Banyans / Vests' },
    { slug: 'underwears', name: 'Underwears' },
  ],
  women: [
    { slug: 'dresses', name: 'Dresses' },
    { slug: 'shirts', name: 'Shirts & Tops' },
    { slug: 'pants', name: 'Pants' },
    { slug: 'shorts', name: 'Shorts' },
    { slug: 'underwears', name: 'Underwears' },
    { slug: 'bras', name: 'Bras' },
  ],
  shoes: [
    { slug: 'sneakers', name: 'Sneakers & Sports' },
    { slug: 'formal-shoes', name: 'Formal & Loafers' },
    { slug: 'casual-shoes', name: 'Casual Footwear' },
  ],
  electronics: [
    { slug: 'laptop', name: 'Laptop & Computing' },
    { slug: 'phone', name: 'Phone & Mobile' },
    { slug: 'earbuds', name: 'Earbuds & Audio' },
  ],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all'); // 'all' | 'men' | 'women' | 'shoes' | 'electronics'
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // e.g. 'shirts'
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form supporting up to 5 images
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'clothes',
    gender: 'male',
    subcategory: 'shirts',
    brand: 'Urban Linen',
    price: 2499,
    originalPrice: 3499,
    stock: 45,
    description: '',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
      '',
      '',
      '',
      '',
    ],
    isFeatured: false,
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

  const handleOpenAdd = (presetSubcategory = null) => {
    setEditingProduct(null);

    let defaultCategory = 'clothes';
    let defaultGender = 'male';
    let defaultSub = presetSubcategory || (selectedSubcategory || 'shirts');
    let defaultBrand = 'Urban Linen';

    if (selectedDept === 'men') {
      defaultCategory = 'clothes';
      defaultGender = 'male';
      defaultBrand = 'Urban Linen';
    } else if (selectedDept === 'women') {
      defaultCategory = 'clothes';
      defaultGender = 'female';
      defaultBrand = 'Serene Studio';
    } else if (selectedDept === 'shoes') {
      defaultCategory = 'shoes';
      defaultGender = 'unisex';
      defaultSub = presetSubcategory || 'sneakers';
      defaultBrand = 'Kinetics Footwear';
    } else if (selectedDept === 'electronics') {
      defaultCategory = 'electronics';
      defaultGender = 'unisex';
      defaultSub = presetSubcategory || 'laptop';
      defaultBrand = 'Aether Sound';
    }

    setForm({
      name: '',
      slug: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: defaultCategory,
      gender: defaultGender,
      subcategory: defaultSub,
      brand: defaultBrand,
      price: 1999,
      originalPrice: 2999,
      stock: 50,
      description: 'Ultra-refined craftsmanship with premium materials and ergonomic fit.',
      images: ['', '', '', '', ''],
      isFeatured: false,
      isTrending: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const existingImgs = Array.isArray(product.images) ? [...product.images] : [];
    // Ensure array has 5 slots
    while (existingImgs.length < 5) {
      existingImgs.push('');
    }
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      sku: product.sku || '',
      category: product.category || 'clothes',
      gender: product.gender || 'male',
      subcategory: product.subcategory || 'shirts',
      brand: product.brand || 'Cartly Collection',
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      stock: product.stock !== undefined ? product.stock : 10,
      description: product.description || '',
      images: existingImgs.slice(0, 5),
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

  const handleImageChange = (index, value) => {
    setForm((prev) => {
      const nextImages = [...prev.images];
      nextImages[index] = value;
      return { ...prev, images: nextImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanImages = form.images.filter((img) => img && img.trim() !== '');
    if (cleanImages.length === 0) {
      alert('Please provide at least 1 image URL for the product.');
      return;
    }

    const payload = {
      ...form,
      images: cleanImages,
      categoryName:
        form.category === 'clothes'
          ? 'Clothes'
          : form.category === 'shoes'
          ? 'Shoes'
          : 'Electronics',
      subcategoryName: form.subcategory,
    };

    if (editingProduct) {
      await StoreService.updateProduct(editingProduct.id, payload);
    } else {
      await StoreService.createProduct(payload);
    }

    setIsModalOpen(false);
    loadData();
  };

  // Helper to count products per subcategory
  const getSubcategoryCount = (deptId, subSlug) => {
    return products.filter((p) => {
      if (deptId === 'men') {
        return p.category === 'clothes' && p.gender === 'male' && p.subcategory === subSlug;
      }
      if (deptId === 'women') {
        return p.category === 'clothes' && p.gender === 'female' && p.subcategory === subSlug;
      }
      if (deptId === 'shoes') {
        return p.category === 'shoes' && p.subcategory === subSlug;
      }
      if (deptId === 'electronics') {
        return p.category === 'electronics' && p.subcategory === subSlug;
      }
      return false;
    }).length;
  };

  // Filter products based on selected department, subcategory & search
  const displayedProducts = products.filter((p) => {
    if (selectedDept === 'men') {
      if (p.category !== 'clothes' || p.gender !== 'male') return false;
    } else if (selectedDept === 'women') {
      if (p.category !== 'clothes' || p.gender !== 'female') return false;
    } else if (selectedDept === 'shoes') {
      if (p.category !== 'shoes') return false;
    } else if (selectedDept === 'electronics') {
      if (p.category !== 'electronics') return false;
    }

    if (selectedSubcategory && p.subcategory !== selectedSubcategory) {
      return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const activeSubcategories = SUBCATEGORIES_MAP[selectedDept] || [];

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      <AdminHeader
        title="Products & Inventory Management"
        subtitle="Organized category containers for Men's Wear, Women's Wear, Shoes & Electronics"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Department Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800/80">
          {DEPARTMENTS.map((dept) => {
            const isActive = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept.id);
                  setSelectedSubcategory(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'bg-[#111111] text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800/80'
                }`}
              >
                <span>{dept.name}</span>
                {dept.id !== 'all' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-slate-300">
                    {
                      products.filter((p) => {
                        if (dept.id === 'men') return p.category === 'clothes' && p.gender === 'male';
                        if (dept.id === 'women') return p.category === 'clothes' && p.gender === 'female';
                        if (dept.id === 'shoes') return p.category === 'shoes';
                        if (dept.id === 'electronics') return p.category === 'electronics';
                        return true;
                      }).length
                    }
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subcategory Containers (When a department is selected) */}
        {selectedDept !== 'all' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Subcategory Containers ({activeSubcategories.length})
              </span>
              {selectedSubcategory && (
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="text-xs text-orange-400 hover:underline font-bold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> View all in {DEPARTMENTS.find((d) => d.id === selectedDept)?.name}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {activeSubcategories.map((sub) => {
                const count = getSubcategoryCount(selectedDept, sub.slug);
                const isSelected = selectedSubcategory === sub.slug;
                return (
                  <button
                    key={sub.slug}
                    onClick={() => setSelectedSubcategory(isSelected ? null : sub.slug)}
                    className={`p-3.5 rounded-2xl border text-left transition relative group overflow-hidden ${
                      isSelected
                        ? 'bg-orange-600/10 border-orange-500 shadow-md shadow-orange-600/10'
                        : 'bg-[#111111] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-orange-400' : 'text-white'}`}>
                        {sub.name}
                      </h4>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-400' : 'text-slate-600'}`} />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {count} {count === 1 ? 'product' : 'products'}
                    </p>
                    {isSelected && (
                      <span className="inline-block mt-2 text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
                        Viewing container
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search products by name, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 shadow-xs"
              />
            </div>
            {selectedSubcategory && (
              <span className="hidden sm:inline-block text-xs font-bold text-orange-400 bg-orange-600/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
                Container: {selectedSubcategory} ({displayedProducts.length})
              </span>
            )}
          </div>

          <button
            onClick={() => handleOpenAdd(selectedSubcategory)}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            {selectedSubcategory
              ? `Add New Product to ${selectedSubcategory}`
              : 'Add New Product'}
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-[#111111] border border-slate-800/80 rounded-2xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0a0a0a] text-orange-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-800/80">
                <tr>
                  <th className="py-4 px-6">Product & Images</th>
                  <th className="py-4 px-4">Department / Subcategory</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No products found in this container. Click "Add New Product" to populate it.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => {
                    const imgCount = p.images?.length || 1;
                    return (
                      <tr key={p.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80'}
                                alt=""
                                className="w-12 h-12 object-cover rounded-xl bg-slate-900 border border-slate-800 shrink-0"
                              />
                              {imgCount > 1 && (
                                <span className="absolute -bottom-1 -right-1 bg-black/80 border border-slate-700 text-orange-400 text-[9px] font-bold px-1 rounded-md">
                                  +{imgCount - 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm line-clamp-1">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-mono">
                                <span>SKU: {p.sku}</span>
                                <span>•</span>
                                <span>{p.brand}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-white capitalize block">
                              {p.gender ? `${p.gender}'s ` : ''}{p.category}
                            </span>
                            <span className="text-[10px] text-orange-400 font-medium capitalize block">
                              Container: {p.subcategory || 'General'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-black text-white">{formatCurrency(p.price)}</p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-[10px] text-slate-500 line-through">
                              {formatCurrency(p.originalPrice)}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.stock <= 10
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {p.isFeatured && (
                            <span className="px-2 py-0.5 bg-orange-600/20 border border-orange-500/30 text-orange-400 rounded text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white transition border border-slate-800"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-orange-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition border border-slate-800"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Product Modal with 5 Images */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative w-full max-w-3xl bg-[#111111] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-xs text-white space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-black text-white">
                    {editingProduct ? 'Edit Product Details & Images' : 'Add New Product to Container'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Manage title, pricing, description, and up to 5 product photos
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Classic Oxford Linen Shirt"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        })
                      }
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">SKU Identifier</label>
                    <input
                      type="text"
                      required
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Department Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="clothes">Clothes</option>
                      <option value="shoes">Shoes</option>
                      <option value="electronics">Electronics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Gender / Target</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="male">Men's Wear</option>
                      <option value="female">Women's Wear</option>
                      <option value="unisex">Unisex / Neutral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Subcategory Container</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. shirts, pants, t-shirts, dresses, sneakers"
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value.toLowerCase().trim() })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Original / MRP Price (₹)</label>
                    <input
                      type="number"
                      min={1}
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description & Material Details</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500 text-xs"
                    placeholder="Describe cut, fabric, specifications, warranty..."
                  />
                </div>

                {/* Up to 5 Images Section */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">Product Images (Up to 5 Photos)</h4>
                      <p className="text-[11px] text-slate-400">
                        Image 1 will be the primary cover image. You can add up to 5 high-res image URLs.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-[11px] font-bold text-slate-500 w-16 shrink-0">
                          {idx === 0 ? 'Cover Image' : `Image #${idx + 1}`}
                        </span>
                        <input
                          type="url"
                          required={idx === 0}
                          placeholder={idx === 0 ? 'Primary image URL (required)' : `Optional alternate photo #${idx + 1} URL`}
                          value={form.images[idx] || ''}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                        {form.images[idx] ? (
                          <img
                            src={form.images[idx]}
                            alt="preview"
                            className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-dashed border-slate-800 flex items-center justify-center text-slate-600 text-[10px] shrink-0">
                            Empty
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="accent-orange-600 w-4 h-4 rounded"
                    />
                    <span className="font-bold text-slate-300">Featured in Catalog Grid</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isTrending}
                      onChange={(e) => setForm({ ...form, isTrending: e.target.checked })}
                      className="accent-orange-600 w-4 h-4 rounded"
                    />
                    <span className="font-bold text-slate-300">Trending Flag</span>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-600/20 transition"
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
