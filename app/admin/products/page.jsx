'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ArrowLeft,
  Package,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle,
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
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Exact fields requested by user:
  // product title, subtitle, brand name, department, gender and target, subcategory container, stock units, selling price, original mrp, and images from files
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    brand: 'Urban Linen',
    department: 'clothes',
    gender: 'male',
    subcategory: 'shirts',
    stock: 50,
    price: 1999,
    originalPrice: 2999,
    images: ['', '', '', '', ''],
  });

  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

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

    let defaultDept = 'clothes';
    let defaultGender = 'male';
    let defaultSub = presetSubcategory || (selectedSubcategory || 'shirts');
    let defaultBrand = 'Urban Linen';

    if (selectedDept === 'men') {
      defaultDept = 'clothes';
      defaultGender = 'male';
      defaultBrand = 'Urban Linen';
    } else if (selectedDept === 'women') {
      defaultDept = 'clothes';
      defaultGender = 'female';
      defaultBrand = 'Serene Studio';
    } else if (selectedDept === 'shoes') {
      defaultDept = 'shoes';
      defaultGender = 'unisex';
      defaultSub = presetSubcategory || 'sneakers';
      defaultBrand = 'Kinetics Footwear';
    } else if (selectedDept === 'electronics') {
      defaultDept = 'electronics';
      defaultGender = 'unisex';
      defaultSub = presetSubcategory || 'laptop';
      defaultBrand = 'Aether Sound';
    }

    setForm({
      title: '',
      subtitle: '',
      brand: defaultBrand,
      department: defaultDept,
      gender: defaultGender,
      subcategory: defaultSub,
      stock: 50,
      price: 1999,
      originalPrice: 2999,
      images: ['', '', '', '', ''],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const existingImgs = Array.isArray(product.images) ? [...product.images] : [];
    while (existingImgs.length < 5) {
      existingImgs.push('');
    }
    setForm({
      title: product.name || '',
      subtitle: product.description || '',
      brand: product.brand || 'Cartly Collection',
      department: product.category || 'clothes',
      gender: product.gender || 'male',
      subcategory: product.subcategory || 'shirts',
      stock: product.stock !== undefined ? product.stock : 10,
      price: product.price || 0,
      originalPrice: product.originalPrice || product.price || 0,
      images: existingImgs.slice(0, 5),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await StoreService.deleteProduct(id);
      loadData();
    }
  };

  // Handle local file selection and convert to Base64 image
  const handleFileUpload = (index, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setForm((prev) => {
        const next = [...prev.images];
        next[index] = base64Url;
        return { ...prev, images: next };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => {
      const next = [...prev.images];
      next[index] = '';
      return { ...prev, images: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanImages = form.images.filter((img) => img && img.trim() !== '');
    if (cleanImages.length === 0) {
      alert('Please upload or provide at least the 1st primary cover image.');
      return;
    }

    const payload = {
      name: form.title,
      slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: editingProduct?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: form.brand,
      category: form.department,
      gender: form.gender,
      subcategory: form.subcategory,
      stock: Number(form.stock),
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      description: form.subtitle,
      images: cleanImages,
      categoryName:
        form.department === 'clothes'
          ? 'Clothes'
          : form.department === 'shoes'
          ? 'Shoes'
          : 'Electronics',
      subcategoryName: form.subcategory,
      isFeatured: editingProduct?.isFeatured || false,
      isTrending: editingProduct?.isTrending || false,
    };

    if (editingProduct) {
      await StoreService.updateProduct(editingProduct.id, payload);
    } else {
      await StoreService.createProduct(payload);
    }

    setIsModalOpen(false);
    loadData();
  };

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
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-200">
      <AdminHeader
        title="Products & Inventory Management"
        subtitle="Organized category containers for Men's Wear, Women's Wear, Shoes & Electronics"
      />

      <main className="p-6 sm:p-8 space-y-6 max-w-7xl">
        {/* Department Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200 dark:border-slate-800/80">
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
                    : 'bg-white dark:bg-[#111111] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80'
                }`}
              >
                <span>{dept.name}</span>
                {dept.id !== 'all' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-black/40 text-slate-700 dark:text-slate-300">
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

        {/* Subcategory Containers (When a department is active) */}
        {selectedDept !== 'all' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Subcategory Containers ({activeSubcategories.length})
              </span>
              {selectedSubcategory && (
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-bold flex items-center gap-1"
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
                        ? 'bg-orange-500/10 border-orange-500 shadow-sm'
                        : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                        {sub.name}
                      </h4>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-600'}`} />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {count} {count === 1 ? 'product' : 'products'}
                    </p>
                    {isSelected && (
                      <span className="inline-block mt-2 text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">
                        Active container
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Add Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by title, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 shadow-xs"
              />
            </div>
            {selectedSubcategory && (
              <span className="hidden sm:inline-block text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
                Container: {selectedSubcategory} ({displayedProducts.length})
              </span>
            )}
          </div>

          <button
            onClick={() => handleOpenAdd(selectedSubcategory)}
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            {selectedSubcategory ? `Add New Product to ${selectedSubcategory}` : 'Add New Product'}
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100/70 dark:bg-[#0a0a0a] text-orange-600 dark:text-orange-400 font-black uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800/80">
                <tr>
                  <th className="py-4 px-6">Product & Images</th>
                  <th className="py-4 px-4">Department / Subcategory</th>
                  <th className="py-4 px-4">Selling Price</th>
                  <th className="py-4 px-4">Stock Units</th>
                  <th className="py-4 px-4">Brand</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      No products found in this section. Click "Add New Product" to create one.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => {
                    const imgCount = p.images?.length || 1;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80'}
                                alt=""
                                className="w-12 h-12 object-cover rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
                              />
                              {imgCount > 1 && (
                                <span className="absolute -bottom-1 -right-1 bg-slate-900 dark:bg-black/80 border border-slate-700 text-orange-400 text-[9px] font-bold px-1 rounded-md">
                                  +{imgCount - 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{p.name}</p>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{p.description}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-slate-900 dark:text-white capitalize block">
                            {p.gender ? `${p.gender}'s ` : ''}{p.category}
                          </span>
                          <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium capitalize block">
                            Container: {p.subcategory || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-black text-slate-900 dark:text-white">{formatCurrency(p.price)}</p>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <p className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(p.originalPrice)}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.stock <= 10
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {p.stock} Units
                          </span>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-700 dark:text-slate-300">
                          {p.brand}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-orange-600 transition border border-slate-200 dark:border-slate-800"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition border border-slate-200 dark:border-slate-800"
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

        {/* Modal: Exact Requested Fields & File Upload for Images */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative w-full max-w-3xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto text-xs text-slate-900 dark:text-white space-y-6 transition-colors duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {editingProduct ? 'Edit Product Details & Images' : 'Add New Product'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Configure title, subtitle, pricing, category, and upload up to 5 photos from your files
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Fields: Exact requested layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Product Title */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Product Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Classic Oxford Linen Shirt"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Subtitle / Description */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Subtitle / Brief Info
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. French linen tailored comfort fit"
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Brand Name */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Urban Linen"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Department
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="clothes">Clothes</option>
                      <option value="shoes">Shoes</option>
                      <option value="electronics">Electronics</option>
                    </select>
                  </div>

                  {/* Gender and Target */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Gender and Target
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="male">Men's Wear</option>
                      <option value="female">Women's Wear</option>
                      <option value="unisex">Unisex / Neutral</option>
                    </select>
                  </div>

                  {/* Subcategory Container */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Subcategory Container
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. shirts, pants, t-shirts, dresses, sneakers"
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value.toLowerCase().trim() })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  {/* Stock Units */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Stock Units
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold font-mono"
                    />
                  </div>

                  {/* Original MRP */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Original MRP (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                {/* Adding Images Through Their Files (Up to 5 slots) */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
                        <Upload className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        Product Images from Your Files (Up to 5 Photos)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Slot 1 will be used as the primary cover photo across the store. You can upload or replace image files directly from your computer.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
                    {[0, 1, 2, 3, 4].map((idx) => {
                      const hasImage = Boolean(form.images[idx]);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-between gap-2.5 text-center transition ${
                            hasImage
                              ? 'bg-slate-50 dark:bg-[#0a0a0a] border-slate-200 dark:border-slate-800'
                              : 'bg-slate-50/50 dark:bg-[#0a0a0a]/50 border-dashed border-slate-300 dark:border-slate-800'
                          }`}
                        >
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {idx === 0 ? '1st Cover *' : `Photo #${idx + 1}`}
                          </span>

                          {hasImage ? (
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group">
                              <img
                                src={form.images[idx]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="absolute top-1 right-1 p-1 rounded-lg bg-red-600 text-white shadow-xs opacity-90 hover:opacity-100 transition"
                                title="Remove photo"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRefs[idx].current?.click()}
                              className="w-full aspect-square rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center p-2 cursor-pointer hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition"
                            >
                              <Upload className="w-5 h-5 text-slate-400 group-hover:text-orange-500 mb-1" />
                              <span className="text-[10px] text-slate-500 font-medium">Browse file</span>
                            </div>
                          )}

                          {/* Hidden file input */}
                          <input
                            ref={fileInputRefs[idx]}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(idx, e.target.files?.[0])}
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => fileInputRefs[idx].current?.click()}
                            className="w-full py-1.5 px-2 bg-slate-200/70 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-[10px] transition"
                          >
                            {hasImage ? 'Replace File' : 'Upload File'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition"
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
