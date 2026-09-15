export const initialCategories = [
  {
    id: 'cat-clothes',
    name: 'Clothes',
    slug: 'clothes',
    color: '#059669',
    accentBg: 'bg-orange-50 dark:bg-slate-900/60',
    borderColor: 'border-orange-300 dark:border-orange-700',
    description: 'Designer shirts, premium cotton tees, tailored chinos & streetwear.',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    itemCount: 8,
    icon: 'Shirt',
    subcategories: [
      {
        id: 'sub-shirts',
        name: 'Shirts',
        slug: 'shirts',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        itemCount: 4,
        icon: 'Shirt',
        description: 'Oxford, casual tees, linen & slim-fit shirts'
      },
      {
        id: 'sub-pants',
        name: 'Pants',
        slug: 'pants',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
        itemCount: 4,
        icon: 'Scissors',
        description: 'Chinos, cargo trousers, denim & joggers'
      }
    ]
  },
  {
    id: 'cat-shoes',
    name: 'Shoes',
    slug: 'shoes',
    color: '#0d9488',
    accentBg: 'bg-teal-50 dark:bg-teal-950/60',
    borderColor: 'border-teal-300 dark:border-teal-700',
    description: 'Engineered running sneakers, Italian leather loafers & casual wear.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    itemCount: 7,
    icon: 'Footprints',
    subcategories: [
      {
        id: 'sub-sneakers',
        name: 'Sneakers & Sports',
        slug: 'sneakers',
        categorySlug: 'shoes',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
        itemCount: 3,
        icon: 'Zap',
        description: 'Performance runners, street lows & trainers'
      },
      {
        id: 'sub-formal-shoes',
        name: 'Formal & Loafers',
        slug: 'formal-shoes',
        categorySlug: 'shoes',
        imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800&q=80',
        itemCount: 2,
        icon: 'Award',
        description: 'Leather Oxfords, Chelsea boots & loafers'
      },
      {
        id: 'sub-casual-shoes',
        name: 'Casual Footwear',
        slug: 'casual-shoes',
        categorySlug: 'shoes',
        imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80',
        itemCount: 2,
        icon: 'Smile',
        description: 'Canvas slip-ons, mules & walking shoes'
      }
    ]
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    color: '#10b981',
    accentBg: 'bg-green-50 dark:bg-green-950/60',
    borderColor: 'border-green-300 dark:border-green-700',
    description: 'Laptops, flagship smartphones, studio headphones & wireless audio.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    itemCount: 9,
    icon: 'Laptop',
    subcategories: [
      {
        id: 'sub-laptop',
        name: 'Laptop & Computing',
        slug: 'laptop',
        categorySlug: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        itemCount: 3,
        icon: 'Laptop',
        description: 'Creator workstations, ultrabooks & typing setups'
      },
      {
        id: 'sub-phone',
        name: 'Phone & Mobile',
        slug: 'phone',
        categorySlug: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
        itemCount: 3,
        icon: 'Smartphone',
        description: 'Flagship 5G phones, telephoto lenses & foldables'
      },
      {
        id: 'sub-earbuds',
        name: 'Earbuds & Audio',
        slug: 'earbuds',
        categorySlug: 'electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        itemCount: 3,
        icon: 'Headphones',
        description: 'Studio ANC headphones, TWS earbuds & wireless sound'
      }
    ]
  }
];

export const initialBrands = [
  { id: 'b-1', name: 'Aether Sound', slug: 'aether-sound', logoUrl: '' },
  { id: 'b-2', name: 'NovaTech', slug: 'novatech', logoUrl: '' },
  { id: 'b-3', name: 'Horizon Gear', slug: 'horizon-gear', logoUrl: '' },
  { id: 'b-4', name: 'Vanguard Apparel', slug: 'vanguard-apparel', logoUrl: '' },
  { id: 'b-5', name: 'Kinetics Footwear', slug: 'kinetics-footwear', logoUrl: '' },
  { id: 'b-6', name: 'Urban Linen', slug: 'urban-linen', logoUrl: '' }
];

export const initialProducts = [
  // ================= CLOTHES -> SHIRTS =================
  {
    id: 'prod-shirt-1',
    name: 'Classic Oxford Pure Linen Shirt',
    slug: 'classic-oxford-pure-linen-shirt',
    sku: 'LIN-OXF-001-WHT',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Urban Linen',
    price: 2499,
    originalPrice: 3499,
    stock: 50,
    rating: 4.9,
    reviewsCount: 84,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80'
    ],
    description: 'Crafted from 100% French flax linen for supreme breathability. Features a relaxed collar, mother-of-pearl buttons, and moisture-wicking weave perfect for all-season styling.',
    specifications: {
      'Material': '100% French Flax Linen',
      'Fit': 'Tailored Relaxed Fit',
      'Care': 'Machine Wash Cold / Air Dry',
      'Origin': 'Sustainably Milled in India'
    },
    variants: [
      { id: 'vs-1', name: 'Crisp White / Medium', color: '#FFFFFF', size: 'M', price: 2499, stock: 20, sku: 'LIN-OXF-WHT-M' },
      { id: 'vs-2', name: 'Sage Green / Large', color: '#84cc16', size: 'L', price: 2499, stock: 15, sku: 'LIN-OXF-SGE-L' }
    ],
    tags: ['100% Linen', 'Breathable', 'Best Seller']
  },
  {
    id: 'prod-shirt-2',
    name: 'Heavyweight Minimalist Oversized Tee',
    slug: 'heavyweight-minimalist-oversized-tee',
    sku: 'CLT-OVS-240-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Vanguard Apparel',
    price: 1499,
    originalPrice: 1999,
    stock: 65,
    rating: 4.8,
    reviewsCount: 142,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=80'
    ],
    description: '240 GSM organic combed cotton drop-shoulder tee. Dense luxury drape with pre-shrunk rib collar and anti-pilling wash.',
    specifications: {
      'Fabric Weight': '240 GSM Heavyweight Organic Cotton',
      'Fit': 'Drop Shoulder Oversized Fit',
      'Neckline': 'Thick Ribbed Crewneck'
    },
    variants: [
      { id: 'vs-3', name: 'Pitch Black / L', color: '#000000', size: 'L', price: 1499, stock: 35, sku: 'CLT-OVS-BLK-L' },
      { id: 'vs-4', name: 'Forest Green / M', color: '#064e3b', size: 'M', price: 1499, stock: 30, sku: 'CLT-OVS-GRN-M' }
    ],
    tags: ['240 GSM', 'Organic Cotton', 'Oversized']
  },
  {
    id: 'prod-shirt-3',
    name: 'Brushed Cotton Flannel Over-Shirt',
    slug: 'brushed-cotton-flannel-shirt',
    sku: 'FLN-CHK-880-GRN',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Urban Linen',
    price: 2999,
    originalPrice: 3999,
    stock: 40,
    rating: 4.7,
    reviewsCount: 56,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&q=80'
    ],
    description: 'Dual-brushed thermal flannel overshirt. Heavy duty metal snaps, double chest utility pockets, and warm insulating fleece interior.',
    specifications: {
      'Material': '100% Double Brushed Cotton Flannel',
      'Closure': 'Heavy Antique Metal Snaps'
    },
    variants: [
      { id: 'vs-5', name: 'Pine Check / XL', color: '#047857', size: 'XL', price: 2999, stock: 20, sku: 'FLN-CHK-GRN-XL' }
    ],
    tags: ['Thermal Flannel', 'Winter Layer']
  },
  {
    id: 'prod-shirt-4',
    name: 'Tailored Poplin Formal Dress Shirt',
    slug: 'tailored-poplin-dress-shirt',
    sku: 'POP-DRS-100-BLU',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Urban Linen',
    price: 2799,
    originalPrice: 3599,
    stock: 30,
    rating: 4.9,
    reviewsCount: 39,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15c429fbb41?w=1000&q=80'
    ],
    description: '120s 2-ply Egyptian cotton poplin with non-iron wrinkle resistance finish and structured spread collar.',
    specifications: {
      'Weave': '120s 2-Ply Egyptian Cotton Poplin',
      'Collar': 'Structured Semi-Spread Collar'
    },
    variants: [
      { id: 'vs-6', name: 'Sky Blue / 40', color: '#93c5fd', size: '40', price: 2799, stock: 15, sku: 'POP-DRS-BLU-40' }
    ],
    tags: ['Non-Iron', 'Egyptian Cotton']
  },

  // ================= CLOTHES -> PANTS =================
  {
    id: 'prod-pant-1',
    name: 'Tailored Slim Stretch Chino Trousers',
    slug: 'tailored-slim-stretch-chinos',
    sku: 'PNT-CHN-SLM-KHK',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Vanguard Apparel',
    price: 2299,
    originalPrice: 3299,
    stock: 45,
    rating: 4.8,
    reviewsCount: 110,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1000&q=80'
    ],
    description: 'Engineered 4-way stretch cotton twill chinos. Wrinkle-resistant with internal flex-waistband for commuter ease.',
    specifications: {
      'Material': '97% Cotton Twill, 3% Elastane',
      'Rise': 'Mid-Rise Tapered Leg',
      'Pockets': '4 Deep Pockets + Hidden Zipper Coin Pocket'
    },
    variants: [
      { id: 'vp-1', name: 'Olive Khaki / 32', color: '#65a30d', size: '32', price: 2299, stock: 25, sku: 'PNT-CHN-KHK-32' },
      { id: 'vp-2', name: 'Navy Blue / 34', color: '#1e3a8a', size: '34', price: 2299, stock: 20, sku: 'PNT-CHN-NVY-34' }
    ],
    tags: ['4-Way Stretch', 'Flex Waistband']
  },
  {
    id: 'prod-pant-2',
    name: 'Tactical Utility Cargo Pants',
    slug: 'tactical-utility-cargo-pants',
    sku: 'PNT-CRG-TAC-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Vanguard Apparel',
    price: 2899,
    originalPrice: 3999,
    stock: 35,
    rating: 4.9,
    reviewsCount: 78,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&q=80'
    ],
    description: 'Ripstop reinforced fabric with 6 ergonomic utility pockets, ankle drawstrings, and Teflon water-repellent coating.',
    specifications: {
      'Fabric': 'High-Density Ripstop Cotton',
      'Pockets': '6 Multi-Compartment Utility Pockets'
    },
    variants: [
      { id: 'vp-3', name: 'Obsidian Black / 32', color: '#111827', size: '32', price: 2899, stock: 20, sku: 'PNT-CRG-BLK-32' }
    ],
    tags: ['Ripstop', 'Water Repellent']
  },
  {
    id: 'prod-pant-3',
    name: 'Everyday Comfort Knit Jogger Trousers',
    slug: 'everyday-comfort-knit-joggers',
    sku: 'PNT-JOG-KNT-GRY',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Urban Linen',
    price: 1999,
    originalPrice: 2799,
    stock: 50,
    rating: 4.7,
    reviewsCount: 95,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=80'
    ],
    description: 'Ultra-soft French terry fabric with clean tapered cuffs, tailored seam detail, and deep zip security pockets.',
    specifications: {
      'Material': '320 GSM French Terry Cotton',
      'Fit': 'Tapered Athletic Cut'
    },
    variants: [
      { id: 'vp-4', name: 'Heather Charcoal / L', color: '#4b5563', size: 'L', price: 1999, stock: 30, sku: 'PNT-JOG-GRY-L' }
    ],
    tags: ['French Terry', 'Athletic Fit']
  },
  {
    id: 'prod-pant-4',
    name: 'Pleated Wool-Blend Formal Trousers',
    slug: 'pleated-wool-blend-formal-trousers',
    sku: 'PNT-WOL-PLT-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Urban Linen',
    price: 3499,
    originalPrice: 4499,
    stock: 25,
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1000&q=80'
    ],
    description: 'Italian style single pleat trousers in a crease-resistant wool-viscose blend with side adjusters.',
    specifications: {
      'Fabric': '60% Merino Wool, 40% Viscose',
      'Closure': 'Extended Waistband with Side Buckle Adjusters'
    },
    variants: [
      { id: 'vp-5', name: 'Charcoal Wool / 34', color: '#374151', size: '34', price: 3499, stock: 15, sku: 'PNT-WOL-CHR-34' }
    ],
    tags: ['Merino Wool', 'Side Adjusters']
  },

  // ================= SHOES -> SNEAKERS =================
  {
    id: 'prod-shoe-1',
    name: 'Kinetics Runner X Speed Knit Sneaker',
    slug: 'kinetics-runner-x-sneaker',
    sku: 'KIN-RNX-001-RED',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'sneakers',
    subcategoryName: 'Sneakers & Sports',
    brand: 'Kinetics Footwear',
    price: 7499,
    originalPrice: 9999,
    stock: 35,
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=80'
    ],
    description: 'Aerodynamic knit jacquard sneaker with bio-based energy-return foam cushioning and Continental wet-grip rubber sole.',
    specifications: {
      'Upper': 'Zero-Waste Seamless Engineered Knit',
      'Midsole': 'HyperBurst Nitrogen-Infused Foam',
      'Weight': '210g (UK 9)'
    },
    variants: [
      { id: 'vs-10', name: 'Crimson Red / UK 8', color: '#EF4444', size: 'UK 8', price: 7499, stock: 15, sku: 'KIN-RNX-RED-8' },
      { id: 'vs-11', name: 'Crimson Red / UK 9', color: '#EF4444', size: 'UK 9', price: 7499, stock: 20, sku: 'KIN-RNX-RED-9' }
    ],
    tags: ['Responsive Foam', 'Ultra-Lightweight']
  },
  {
    id: 'prod-shoe-2',
    name: 'AeroStreet Low Leather Court Sneakers',
    slug: 'aerostreet-low-leather-court-sneakers',
    sku: 'KIN-CRT-WHT-002',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'sneakers',
    subcategoryName: 'Sneakers & Sports',
    brand: 'Kinetics Footwear',
    price: 5999,
    originalPrice: 7999,
    stock: 40,
    rating: 4.9,
    reviewsCount: 114,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=1000&q=80'
    ],
    description: 'Minimalist full-grain Italian leather sneaker with orthotic arch-support footbed and stitched cupsole construction.',
    specifications: {
      'Leather': 'Full-Grain Calfskin Leather',
      'Footbed': 'Memory Foam Orthotic Insert',
      'Outsole': 'Natural Rubber Cupsole'
    },
    variants: [
      { id: 'vs-12', name: 'Clean White / UK 9', color: '#FFFFFF', size: 'UK 9', price: 5999, stock: 25, sku: 'KIN-CRT-WHT-9' }
    ],
    tags: ['Full Grain Leather', 'Stitched Cupsole']
  },
  {
    id: 'prod-shoe-3',
    name: 'CloudStride Trail Marathon Runner',
    slug: 'cloudstride-trail-marathon-runner',
    sku: 'KIN-TRL-990-BLK',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'sneakers',
    subcategoryName: 'Sneakers & Sports',
    brand: 'Kinetics Footwear',
    price: 8999,
    originalPrice: 11999,
    stock: 25,
    rating: 4.7,
    reviewsCount: 45,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&q=80'
    ],
    description: 'Carbon-infused rocker plate for long-distance marathon power transfer with waterproof Gore-Tex membrane.',
    specifications: {
      'Membrane': 'Gore-Tex Invisible Fit Waterproof',
      'Plate': 'Full Length Curved Carbon Fiber Plate'
    },
    variants: [
      { id: 'vs-13', name: 'Stealth Black / UK 10', color: '#111827', size: 'UK 10', price: 8999, stock: 15, sku: 'KIN-TRL-BLK-10' }
    ],
    tags: ['Carbon Plate', 'Waterproof']
  },

  // ================= SHOES -> FORMAL & LOAFERS =================
  {
    id: 'prod-shoe-4',
    name: 'Handcrafted Italian Suede Penny Loafers',
    slug: 'handcrafted-italian-suede-penny-loafers',
    sku: 'KIN-LOF-SUD-BRN',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'formal-shoes',
    subcategoryName: 'Formal & Loafers',
    brand: 'Kinetics Footwear',
    price: 8499,
    originalPrice: 11499,
    stock: 20,
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1000&q=80'
    ],
    description: 'Blake-stitched Italian reverse suede penny loafers. Unlined construction for butter-soft sockless comfort and leather stacked heel.',
    specifications: {
      'Upper': 'Hand-Selected Tuscan Reverse Suede',
      'Construction': 'Blake Stitched Hand Welt'
    },
    variants: [
      { id: 'vf-1', name: 'Snuff Brown / UK 9', color: '#78350f', size: 'UK 9', price: 8499, stock: 12, sku: 'KIN-LOF-BRN-9' }
    ],
    tags: ['Blake Stitched', 'Tuscan Suede']
  },
  {
    id: 'prod-shoe-5',
    name: 'Classic Goodyear Welted Chelsea Boots',
    slug: 'classic-goodyear-welted-chelsea-boots',
    sku: 'KIN-CHS-WLT-BLK',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'formal-shoes',
    subcategoryName: 'Formal & Loafers',
    brand: 'Kinetics Footwear',
    price: 11999,
    originalPrice: 14999,
    stock: 18,
    rating: 5.0,
    reviewsCount: 29,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=1000&q=80'
    ],
    description: 'Goodyear-welted 100% resoleable Chelsea boots with French calfskin leather and British Dainite rubber stud soles.',
    specifications: {
      'Construction': 'Goodyear Welt 360-Degree Storm Welt',
      'Sole': 'Genuine British Dainite Studded Rubber'
    },
    variants: [
      { id: 'vf-2', name: 'Onyx Black / UK 8', color: '#000000', size: 'UK 8', price: 11999, stock: 10, sku: 'KIN-CHS-BLK-8' }
    ],
    tags: ['Goodyear Welt', 'Dainite Sole']
  },

  // ================= SHOES -> CASUAL FOOTWEAR =================
  {
    id: 'prod-shoe-6',
    name: 'Minimalist Canvas Slip-On Mules',
    slug: 'minimalist-canvas-slip-on-mules',
    sku: 'KIN-MUL-CNV-OAT',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'casual-shoes',
    subcategoryName: 'Casual Footwear',
    brand: 'Kinetics Footwear',
    price: 3499,
    originalPrice: 4999,
    stock: 35,
    rating: 4.6,
    reviewsCount: 62,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&q=80'
    ],
    description: 'Easy on/off canvas mules with cork footbed and flexible vulcanized gum rubber sole.',
    specifications: {
      'Upper': '16oz Heavy Organic Duck Canvas',
      'Footbed': 'Anatomical Natural Cork'
    },
    variants: [
      { id: 'vc-1', name: 'Oatmeal / UK 9', color: '#fef3c7', size: 'UK 9', price: 3499, stock: 20, sku: 'KIN-MUL-OAT-9' }
    ],
    tags: ['Cork Footbed', 'Slip On']
  },
  {
    id: 'prod-shoe-7',
    name: 'Ultra-Light Breathable City Walkers',
    slug: 'ultra-light-breathable-city-walkers',
    sku: 'KIN-WLK-BRT-GRY',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'casual-shoes',
    subcategoryName: 'Casual Footwear',
    brand: 'Kinetics Footwear',
    price: 4499,
    originalPrice: 5999,
    stock: 40,
    rating: 4.7,
    reviewsCount: 75,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1000&q=80'
    ],
    description: 'Featherweight slip-on walking shoes featuring bamboo-fiber knit uppers and shock-absorbing EVA outsoles.',
    specifications: {
      'Weight': '165 grams only',
      'Material': 'Bamboo Fiber Breathable Mesh'
    },
    variants: [
      { id: 'vc-2', name: 'Stone Grey / UK 8', color: '#9ca3af', size: 'UK 8', price: 4499, stock: 25, sku: 'KIN-WLK-GRY-8' }
    ],
    tags: ['Bamboo Knit', '165 Grams']
  },

  // ================= ELECTRONICS -> LAPTOP =================
  {
    id: 'prod-elec-1',
    name: 'NovaBook Studio 16 Pro M3 Workstation',
    slug: 'novabook-studio-16-pro',
    sku: 'NOVA-NB16-PRO',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'laptop',
    subcategoryName: 'Laptop & Computing',
    brand: 'NovaTech',
    price: 189999,
    originalPrice: 219999,
    stock: 14,
    rating: 5.0,
    reviewsCount: 42,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80'
    ],
    description: 'Equipped with 16.2" Mini-LED ProMotion XDR display, vapor chamber cooling, 36GB unified memory, and 22-hour battery life.',
    specifications: {
      'Display': '16.2" Liquid Retina XDR 120Hz',
      'Memory': '36GB Unified Memory',
      'Storage': '1TB NVMe PCIe 4.0 SSD'
    },
    variants: [
      { id: 'v-6', name: 'Space Black / 36GB / 1TB', color: '#111827', size: '16-inch', price: 189999, stock: 8, sku: 'NOVA-NB16-36G-1T' }
    ],
    tags: ['Mini-LED', 'Creator Workstation']
  },
  {
    id: 'prod-elec-2',
    name: 'ZenBook Slim 14 OLED Ultraportable',
    slug: 'zenbook-slim-14-oled',
    sku: 'NOVA-ZB14-OLED',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'laptop',
    subcategoryName: 'Laptop & Computing',
    brand: 'NovaTech',
    price: 104999,
    originalPrice: 124999,
    stock: 22,
    rating: 4.8,
    reviewsCount: 68,
    isFeatured: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80'
    ],
    description: 'Sub-1kg magnesium chassis with 2.8K 120Hz OLED screen, Intel Core Ultra 7 processor, and 16-hour endurance.',
    specifications: {
      'Weight': '990 grams',
      'Screen': '14-inch 2.8K OLED 120Hz 100% DCI-P3'
    },
    variants: [
      { id: 'v-15', name: 'Pine Grey / 16GB / 512GB', color: '#4b5563', size: '14-inch', price: 104999, stock: 15, sku: 'NOVA-ZB14-GRY' }
    ],
    tags: ['990g Ultra-Light', '2.8K OLED']
  },
  {
    id: 'prod-elec-3',
    name: 'Apex Titan G17 RTX 4090 Gaming Rig',
    slug: 'apex-titan-g17-gaming-rig',
    sku: 'NOVA-TTN-G17-4090',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'laptop',
    subcategoryName: 'Laptop & Computing',
    brand: 'NovaTech',
    price: 249999,
    originalPrice: 289999,
    stock: 8,
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&q=80'
    ],
    description: 'Uncapped 175W RTX 4090 GPU, 240Hz QHD+ G-Sync display, liquid metal thermal cooling, and mechanical per-key RGB keyboard.',
    specifications: {
      'GPU': 'NVIDIA GeForce RTX 4090 16GB VRAM (175W TGP)',
      'Screen': '17.3" QHD 240Hz 3ms G-Sync'
    },
    variants: [
      { id: 'v-16', name: 'Titan Black / 64GB / 2TB', color: '#000000', size: '17.3-inch', price: 249999, stock: 5, sku: 'NOVA-TTN-G17-64G' }
    ],
    tags: ['RTX 4090', 'Liquid Metal Cooling']
  },

  // ================= ELECTRONICS -> PHONE =================
  {
    id: 'prod-elec-4',
    name: 'Horizon Ultra Pro 5G Flagship',
    slug: 'horizon-ultra-pro-5g-flagship',
    sku: 'HORZ-PHN-PRO-5G',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'phone',
    subcategoryName: 'Phone & Mobile',
    brand: 'Horizon Gear',
    price: 89999,
    originalPrice: 104999,
    stock: 30,
    rating: 4.9,
    reviewsCount: 165,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80'
    ],
    description: 'Aerospace titanium frame with 200MP quad telephoto camera system, 5400mAh silicon-carbon battery, and 120W HyperCharge.',
    specifications: {
      'Camera': '200MP Main + 50MP 5x Periscope + 50MP Ultrawide',
      'Display': '6.82" LTPO 120Hz AMOLED (4500 nits peak)',
      'Battery': '5400mAh with 120W Wired + 50W Wireless'
    },
    variants: [
      { id: 'vp-6', name: 'Emerald Forest / 256GB', color: '#059669', size: '256GB', price: 89999, stock: 18, sku: 'HORZ-PHN-GRN-256' },
      { id: 'vp-7', name: 'Titanium Grey / 512GB', color: '#6b7280', size: '512GB', price: 99999, stock: 12, sku: 'HORZ-PHN-GRY-512' }
    ],
    tags: ['200MP Camera', 'Titanium Frame', '120W Charge']
  },
  {
    id: 'prod-elec-5',
    name: 'Phantom Fold 3 Ultra Dual Display',
    slug: 'phantom-fold-3-ultra-dual-display',
    sku: 'HORZ-FLD-3-TIT',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'phone',
    subcategoryName: 'Phone & Mobile',
    brand: 'Horizon Gear',
    price: 149999,
    originalPrice: 174999,
    stock: 12,
    rating: 4.8,
    reviewsCount: 52,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1000&q=80'
    ],
    description: 'Zero-gap titanium hinge folding smartphone. Opens into an 8.03-inch productivity tablet with stylus support.',
    specifications: {
      'Inner Screen': '8.03-inch 120Hz LTPO OLED Tablet Display',
      'Hinge': 'Grade 5 Titanium Zero-Crease Mechanism'
    },
    variants: [
      { id: 'vp-8', name: 'Obsidian Black / 512GB', color: '#111827', size: '512GB', price: 149999, stock: 8, sku: 'HORZ-FLD-BLK-512' }
    ],
    tags: ['Foldable OLED', 'Titanium Hinge']
  },
  {
    id: 'prod-elec-6',
    name: 'Nova 12 Studio Zoom Edition',
    slug: 'nova-12-studio-zoom-edition',
    sku: 'NOVA-12-ZM-5G',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'phone',
    subcategoryName: 'Phone & Mobile',
    brand: 'NovaTech',
    price: 54999,
    originalPrice: 64999,
    stock: 45,
    rating: 4.7,
    reviewsCount: 98,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1000&q=80'
    ],
    description: 'Cinematic portrait creator phone with studio studio flash ring and 10x lossless zoom sensor.',
    specifications: {
      'Sensor': '1-inch Sony LYT-900 Main Sensor',
      'Charging': '80W Fast Charge in 25 mins'
    },
    variants: [
      { id: 'vp-9', name: 'Pearl White / 256GB', color: '#FFFFFF', size: '256GB', price: 54999, stock: 25, sku: 'NOVA-12-WHT-256' }
    ],
    tags: ['1-inch Sensor', 'Portrait Pro']
  },

  // ================= ELECTRONICS -> EARBUDS =================
  {
    id: 'prod-elec-7',
    name: 'Aether Pro ANC Wireless Headphones',
    slug: 'aether-pro-anc-headphones',
    sku: 'AETH-NC900-BLK',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'earbuds',
    subcategoryName: 'Earbuds & Audio',
    brand: 'Aether Sound',
    price: 24999,
    originalPrice: 29999,
    stock: 45,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&q=80'
    ],
    description: 'Studio-grade sound with 40mm titanium drivers, -42dB active noise cancellation, spatial audio tracking, and 50-hour battery life.',
    specifications: {
      'Driver Size': '40mm Custom Titanium Drivers',
      'Battery Life': '50 Hours (ANC On)',
      'Noise Cancelling': '-42dB Hybrid ANC'
    },
    variants: [
      { id: 'v-1', name: 'Midnight Obsidian', color: '#111827', size: 'Over-Ear', price: 24999, stock: 25, sku: 'AETH-NC900-BLK' }
    ],
    tags: ['Best Seller', 'Spatial Audio']
  },
  {
    id: 'prod-elec-8',
    name: 'Vanguard Pulse True Wireless Earbuds',
    slug: 'vanguard-pulse-earbuds',
    sku: 'VNG-TWS-PULSE',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'earbuds',
    subcategoryName: 'Earbuds & Audio',
    brand: 'Aether Sound',
    price: 9999,
    originalPrice: 14999,
    stock: 75,
    rating: 4.7,
    reviewsCount: 210,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=1000&q=80'
    ],
    description: 'Compact acoustic earbuds with IPX7 waterproofing, customizable EQ, Qi wireless charging, and 37-hour total battery life.',
    specifications: {
      'Driver': '11mm Graphene Dynamic Drivers',
      'Playtime': '9 hrs earbuds + 28 hrs with charging case',
      'Waterproof': 'IPX7 Sweat & Water Resistant'
    },
    variants: [
      { id: 'v-8', name: 'Matte White', color: '#F9FAFB', size: 'Universal', price: 9999, stock: 45, sku: 'VNG-TWS-WHT' }
    ],
    tags: ['IPX7', 'Wireless Charging']
  },
  {
    id: 'prod-elec-9',
    name: 'Sonic Studio In-Ear Audiophile IEM Monitors',
    slug: 'sonic-studio-iem-monitors',
    sku: 'AETH-IEM-PRO',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'earbuds',
    subcategoryName: 'Earbuds & Audio',
    brand: 'Aether Sound',
    price: 15999,
    originalPrice: 19999,
    stock: 20,
    rating: 5.0,
    reviewsCount: 36,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80'
    ],
    description: 'Quad balanced-armature + 10mm dynamic hybrid IEMs with silver-plated detachable MMCX cable and pure lossless tuning.',
    specifications: {
      'Drivers': '4 Balanced Armatures + 1 Dynamic Driver per ear',
      'Cable': 'Silver-Plated Monocrystalline Copper (3.5mm/4.4mm Balanced)'
    },
    variants: [
      { id: 'v-17', name: 'Transparent Emerald', color: '#059669', size: 'Universal', price: 15999, stock: 12, sku: 'AETH-IEM-GRN' }
    ],
    tags: ['Audiophile IEM', '5-Driver Hybrid']
  }
];

export const initialCoupons = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountAmount: 2000,
    description: '10% off on your first Cartly purchase',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z'
  },
  {
    id: 'coup-2',
    code: 'CARTLY20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 3000,
    maxDiscountAmount: 5000,
    description: '20% off for fashion & tech lovers on orders above ₹3,000',
    isActive: true,
    expiresAt: '2026-12-31T23:59:59Z'
  }
];

export const initialBanners = [
  {
    id: 'ban-1',
    title: 'Discover Premium Clothes, Shoes & Electronics',
    subtitle: 'From French linen shirts and Italian leather footwear to M3 workstations and 200MP smartphones — verified quality with certified warranty.',
    badgeText: 'CURATED COLLECTION 2026',
    ctaText: 'Explore Categories',
    ctaLink: '/catalog',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=85',
    isActive: true,
    displayOrder: 1
  }
];

export const initialOrders = [
  {
    id: 'ord-101',
    orderNumber: 'CRT-784291',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    customerPhone: '+91 98765 43210',
    createdAt: '2026-08-28T14:32:00Z',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentGateway: 'razorpay',
    paymentId: 'pay_Nz9dK28sLq19a',
    trackingNumber: 'BLUEDART-88219034',
    subtotal: 2499,
    discountAmount: 249,
    couponCode: 'WELCOME10',
    shippingCost: 0,
    taxAmount: 0,
    totalAmount: 2250,
    shippingAddress: {
      fullName: 'Aarav Sharma',
      street: 'Flat 402, Skyline Residency, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      phone: '+91 98765 43210',
      country: 'India'
    },
    items: [
      {
        id: 'oi-1',
        productId: 'prod-shirt-1',
        productName: 'Classic Oxford Pure Linen Shirt',
        sku: 'LIN-OXF-WHT-M',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
        unitPrice: 2499,
        quantity: 1,
        variantName: 'Crisp White / Medium'
      }
    ]
  }
];

export const initialReviews = [
  {
    id: 'rev-1',
    productId: 'prod-shirt-1',
    author: 'Vikram Seth',
    rating: 5,
    title: 'Outstanding linen texture and comfort',
    comment: 'The French linen is breathable, soft, and feels premium right out of the packaging. Fits perfectly.',
    createdAt: '2026-08-20T11:20:00Z',
    isVerifiedPurchase: true,
    isApproved: true
  }
];

export const initialAuditLogs = [
  {
    id: 'log-1',
    timestamp: '2026-08-30T08:15:00Z',
    action: 'INVENTORY_UPDATE',
    entity: 'Product: Classic Oxford Linen Shirt',
    user: 'admin@cartly.com',
    details: 'Restocked 20 units of Crisp White SKU'
  }
];
