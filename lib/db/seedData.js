// Comprehensive Catalog Seed Data for Cartly
// Categories with Male & Female hierarchy under Clothes, plus Shoes and Electronics

export const initialCategories = [
  {
    id: 'cat-clothes',
    name: 'Clothes',
    slug: 'clothes',
    color: '#ea580c',
    accentBg: 'bg-orange-50 dark:bg-slate-900/60',
    borderColor: 'border-orange-300 dark:border-orange-700',
    description: 'Designer shirts, t-shirts, tailored pants, shorts, dresses, innerwear & essentials for Men & Women.',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    itemCount: 30,
    icon: 'Shirt',
    genders: [
      {
        id: 'gender-male',
        name: 'Men',
        slug: 'male',
        description: 'Shirts, Pants, T-Shirts, Shorts, Banyans & Underwears',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
        subcategories: [
          {
            id: 'sub-m-shirts',
            name: 'Shirts',
            slug: 'shirts',
            gender: 'male',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            itemCount: 3,
            icon: 'Shirt',
            description: 'Classic Oxford, casual linen & tailored formal button-downs'
          },
          {
            id: 'sub-m-tshirts',
            name: 'T-Shirts',
            slug: 't-shirts',
            gender: 'male',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
            itemCount: 3,
            icon: 'Shirt',
            description: '240 GSM organic cotton, drop-shoulder & graphic streetwear tees'
          },
          {
            id: 'sub-m-pants',
            name: 'Pants',
            slug: 'pants',
            gender: 'male',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
            itemCount: 4,
            icon: 'Scissors',
            description: 'Tailored slim chinos, cargo trousers & selvedge denim jeans'
          },
          {
            id: 'sub-m-shorts',
            name: 'Shorts',
            slug: 'shorts',
            gender: 'male',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
            itemCount: 2,
            icon: 'Scissors',
            description: 'Linen drawstring summer shorts & athletic training shorts'
          },
          {
            id: 'sub-m-bunnies',
            name: 'Banyans / Vests',
            slug: 'bunnies',
            gender: 'male',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
            itemCount: 2,
            icon: 'Layers',
            description: '100% combed ribbed cotton sleeveless inner vests & banyans'
          },
          {
            id: 'sub-m-underwears',
            name: 'Underwears',
            slug: 'underwears',
            gender: 'male',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
            itemCount: 2,
            icon: 'ShieldCheck',
            description: 'Ultra-soft bamboo fiber boxer briefs & breathable mid-rise trunks'
          }
        ]
      },
      {
        id: 'gender-female',
        name: 'Women',
        slug: 'female',
        description: 'Dresses, Shirts & Tops, Pants, Shorts, Bras & Underwears',
        imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        subcategories: [
          {
            id: 'sub-f-dresses',
            name: 'Dresses',
            slug: 'dresses',
            gender: 'female',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
            itemCount: 3,
            icon: 'Sparkles',
            description: 'Floral wrap midi dresses, evening silk slips & casual sundresses'
          },
          {
            id: 'sub-f-shirts',
            name: 'Shirts & Tops',
            slug: 'shirts',
            gender: 'female',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=800&q=80',
            itemCount: 3,
            icon: 'Shirt',
            description: 'Mulberry silk blouses, relaxed linen shirts & contour crop tops'
          },
          {
            id: 'sub-f-pants',
            name: 'Pants',
            slug: 'pants',
            gender: 'female',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80',
            itemCount: 2,
            icon: 'Scissors',
            description: 'Tailored high-rise wide leg trousers & stretch flare ankle pants'
          },
          {
            id: 'sub-f-shorts',
            name: 'Shorts',
            slug: 'shorts',
            gender: 'female',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=80',
            itemCount: 2,
            icon: 'Scissors',
            description: 'High-rise denim cut-offs & breezy linen resort lounge shorts'
          },
          {
            id: 'sub-f-underwears',
            name: 'Underwears',
            slug: 'underwears',
            gender: 'female',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
            itemCount: 2,
            icon: 'ShieldCheck',
            description: 'Seamless no-show microfiber hipsters & organic cotton bikini briefs'
          },
          {
            id: 'sub-f-bras',
            name: 'Bras',
            slug: 'bras',
            gender: 'female',
            categorySlug: 'clothes',
            imageUrl: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80',
            itemCount: 2,
            icon: 'Heart',
            description: 'Wireless comfort contour bralettes & everyday seamless T-shirt bras'
          }
        ]
      }
    ],
    subcategories: [
      {
        id: 'sub-shirts',
        name: 'Shirts',
        slug: 'shirts',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
        itemCount: 6,
        icon: 'Shirt',
        description: 'Oxford, casual linen, silk tops & formal button-downs'
      },
      {
        id: 'sub-t-shirts',
        name: 'T-Shirts',
        slug: 't-shirts',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        itemCount: 3,
        icon: 'Shirt',
        description: 'Heavyweight organic cotton, drop shoulder & streetwear tees'
      },
      {
        id: 'sub-pants',
        name: 'Pants',
        slug: 'pants',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
        itemCount: 6,
        icon: 'Scissors',
        description: 'Chinos, trousers, denim jeans & wide leg pants'
      },
      {
        id: 'sub-shorts',
        name: 'Shorts',
        slug: 'shorts',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
        itemCount: 4,
        icon: 'Scissors',
        description: 'Linen casual, training athletic & denim shorts'
      },
      {
        id: 'sub-bunnies',
        name: 'Banyans / Vests',
        slug: 'bunnies',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
        itemCount: 2,
        icon: 'Layers',
        description: '100% combed cotton sleeveless inner vests'
      },
      {
        id: 'sub-underwears',
        name: 'Underwears',
        slug: 'underwears',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
        itemCount: 4,
        icon: 'ShieldCheck',
        description: 'Breathable bamboo boxer briefs, hipsters & seamless trunks'
      },
      {
        id: 'sub-dresses',
        name: 'Dresses',
        slug: 'dresses',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
        itemCount: 3,
        icon: 'Sparkles',
        description: 'Floral wrap midi dresses, evening silk slips & sundresses'
      },
      {
        id: 'sub-bras',
        name: 'Bras',
        slug: 'bras',
        categorySlug: 'clothes',
        imageUrl: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&q=80',
        itemCount: 2,
        icon: 'Heart',
        description: 'Wireless comfort bralettes & everyday seamless bras'
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
  { id: 'b-6', name: 'Urban Linen', slug: 'urban-linen', logoUrl: '' },
  { id: 'b-7', name: 'Aura Intimates', slug: 'aura-intimates', logoUrl: '' },
  { id: 'b-8', name: 'Serene Studio', slug: 'serene-studio', logoUrl: '' }
];

export const initialProducts = [
  // ==========================================
  // CLOTHES -> MEN (MALE) -> SHIRTS
  // ==========================================
  {
    id: 'prod-m-shirt-1',
    name: 'Men’s Classic Oxford Pure Linen Shirt',
    slug: 'mens-classic-oxford-pure-linen-shirt',
    sku: 'LIN-OXF-001-WHT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
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
      'Gender': 'Men'
    },
    variants: [
      { id: 'vs-1', name: 'Crisp White / Medium', color: '#FFFFFF', size: 'M', price: 2499, stock: 20, sku: 'LIN-OXF-WHT-M' },
      { id: 'vs-2', name: 'Sage Green / Large', color: '#84cc16', size: 'L', price: 2499, stock: 15, sku: 'LIN-OXF-SGE-L' }
    ],
    tags: ['100% Linen', 'Breathable', 'Men Shirts']
  },
  {
    id: 'prod-m-shirt-2',
    name: 'Men’s Brushed Flannel Button-Down Over-Shirt',
    slug: 'mens-brushed-flannel-overshirt',
    sku: 'FLN-CHK-880-GRN',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
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
      'Closure': 'Heavy Antique Metal Snaps',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vs-5', name: 'Pine Check / XL', color: '#047857', size: 'XL', price: 2999, stock: 20, sku: 'FLN-CHK-GRN-XL' }
    ],
    tags: ['Thermal Flannel', 'Men Shirts']
  },
  {
    id: 'prod-m-shirt-3',
    name: 'Men’s Tailored Poplin Formal Dress Shirt',
    slug: 'mens-tailored-poplin-dress-shirt',
    sku: 'POP-DRS-100-BLU',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
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
    description: 'Crisp 120-thread-count Egyptian cotton formal shirt with French cuffs and removable brass collar stays. Ideal for evening black-tie or corporate wear.',
    specifications: {
      'Material': '100% Egyptian Giza Cotton',
      'Collar Style': 'Semi-Spread Collar with Stays',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vs-6', name: 'Sky Blue / 40 Slim', color: '#38bdf8', size: '40', price: 2799, stock: 15, sku: 'POP-DRS-BLU-40' }
    ],
    tags: ['Formal Wear', 'Men Shirts']
  },

  // ==========================================
  // CLOTHES -> MEN (MALE) -> T-SHIRTS
  // ==========================================
  {
    id: 'prod-m-tshirt-1',
    name: 'Men’s Heavyweight Minimalist Oversized Tee',
    slug: 'mens-heavyweight-oversized-tee',
    sku: 'CLT-OVS-240-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 't-shirts',
    subcategoryName: 'T-Shirts',
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
      'Gender': 'Men'
    },
    variants: [
      { id: 'vs-3', name: 'Pitch Black / L', color: '#000000', size: 'L', price: 1499, stock: 35, sku: 'CLT-OVS-BLK-L' }
    ],
    tags: ['240 GSM', 'Organic Cotton', 'Men T-Shirts']
  },
  {
    id: 'prod-m-tshirt-2',
    name: 'Men’s Premium Pima Cotton Crewneck T-Shirt',
    slug: 'mens-pima-cotton-crewneck-tshirt',
    sku: 'TSH-PIM-002-NVY',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 't-shirts',
    subcategoryName: 'T-Shirts',
    brand: 'Vanguard Apparel',
    price: 1299,
    originalPrice: 1799,
    stock: 45,
    rating: 4.9,
    reviewsCount: 78,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=80'
    ],
    description: 'Extra-long staple Peruvian Pima cotton with a silk-soft touch. Highly durable, breathable, and colorfast after 50+ washes.',
    specifications: {
      'Material': '100% Peruvian Pima Cotton',
      'Fit': 'Athletic Slim Fit',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vs-pm-1', name: 'Navy Blue / M', color: '#1e3a8a', size: 'M', price: 1299, stock: 25, sku: 'TSH-PIM-NVY-M' }
    ],
    tags: ['Pima Cotton', 'Men T-Shirts']
  },
  {
    id: 'prod-m-tshirt-3',
    name: 'Men’s Vintage Acid Wash Streetwear T-Shirt',
    slug: 'mens-vintage-acid-wash-tee',
    sku: 'TSH-ACD-003-CHA',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 't-shirts',
    subcategoryName: 'T-Shirts',
    brand: 'Vanguard Apparel',
    price: 1699,
    originalPrice: 2299,
    stock: 35,
    rating: 4.6,
    reviewsCount: 45,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=80'
    ],
    description: 'Heavy stonewashed mineral vintage dye with distressed hems. Unique distressed character on each garment.',
    specifications: {
      'Material': '100% Heavy Combed Cotton',
      'Wash': 'Enzyme Acid Stonewash',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vs-acd-1', name: 'Charcoal Grey / L', color: '#334155', size: 'L', price: 1699, stock: 20, sku: 'TSH-ACD-CHA-L' }
    ],
    tags: ['Streetwear', 'Acid Wash', 'Men T-Shirts']
  },

  // ==========================================
  // CLOTHES -> MEN (MALE) -> PANTS
  // ==========================================
  {
    id: 'prod-m-pant-1',
    name: 'Men’s Tailored Stretch Slim Chino Pants',
    slug: 'mens-tailored-stretch-slim-chino-pants',
    sku: 'PNT-CHN-001-KHK',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Urban Linen',
    price: 3199,
    originalPrice: 4299,
    stock: 45,
    rating: 4.9,
    reviewsCount: 92,
    isFeatured: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&q=80'
    ],
    description: 'Italian cotton-twill chinos infused with 3% elastane for unrestricted 4-way flexibility. Clean flat front with hidden interior passport pocket.',
    specifications: {
      'Composition': '97% Twill Cotton, 3% Elastane',
      'Fit': 'Tailored Slim Tapered',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vp-1', name: 'Desert Khaki / 32', color: '#c2b280', size: '32', price: 3199, stock: 25, sku: 'PNT-CHN-KHK-32' }
    ],
    tags: ['Stretch Chino', 'Men Pants']
  },
  {
    id: 'prod-m-pant-2',
    name: 'Men’s Japanese Selvedge Raw Denim Jeans',
    slug: 'mens-japanese-selvedge-raw-denim',
    sku: 'DNM-SLV-145-IND',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Vanguard Apparel',
    price: 4999,
    originalPrice: 6499,
    stock: 25,
    rating: 4.8,
    reviewsCount: 68,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=1000&q=80'
    ],
    description: '14.5 oz Kurabo Mills red-line selvedge denim. Shuttle-loom woven in Kojima, Japan. Unwashed rigid indigo that fades into a custom patina with wear.',
    specifications: {
      'Weight': '14.5 oz Rigid Selvedge',
      'Hardware': 'Solid Copper Rivets',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vp-2', name: 'Raw Deep Indigo / 32x32', color: '#1e1b4b', size: '32', price: 4999, stock: 15, sku: 'DNM-SLV-IND-32' }
    ],
    tags: ['Selvedge Denim', 'Men Pants']
  },
  {
    id: 'prod-m-pant-3',
    name: 'Men’s Tech-Weave Water-Resistant Cargo Trousers',
    slug: 'mens-tech-weave-water-resistant-cargo-trousers',
    sku: 'CRG-TCH-003-OLV',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Horizon Gear',
    price: 3799,
    originalPrice: 4899,
    stock: 35,
    rating: 4.7,
    reviewsCount: 47,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&q=80'
    ],
    description: 'Ripstop Cordura fabric coated with DWR water-shedding finish. Features magnetic fidlock utility cargo pockets and ergonomic articulated knees.',
    specifications: {
      'Material': 'Cordura Ripstop Nylon Blend',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vp-3', name: 'Military Olive / 34', color: '#3f6212', size: '34', price: 3799, stock: 15, sku: 'CRG-TCH-OLV-34' }
    ],
    tags: ['Techwear', 'Cargo', 'Men Pants']
  },
  {
    id: 'prod-m-pant-4',
    name: 'Men’s Heavy Terry Ribbed Cuff Joggers',
    slug: 'mens-heavy-terry-ribbed-cuff-joggers',
    sku: 'JOG-TRY-400-GRY',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Vanguard Apparel',
    price: 2499,
    originalPrice: 3299,
    stock: 40,
    rating: 4.8,
    reviewsCount: 53,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1000&q=80'
    ],
    description: '400 GSM brushed French terry fleece sweatpants. Chunky braided drawstrings, deep zip pockets, and thick ribbed cuffs for cozy lounging.',
    specifications: {
      'Material': '100% French Terry Cotton',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vp-4', name: 'Heather Grey / M', color: '#94a3b8', size: 'M', price: 2499, stock: 20, sku: 'JOG-TRY-GRY-M' }
    ],
    tags: ['French Terry', 'Joggers', 'Men Pants']
  },

  // ==========================================
  // CLOTHES -> MEN (MALE) -> SHORTS
  // ==========================================
  {
    id: 'prod-m-short-1',
    name: 'Men’s French Linen Drawstring Casual Shorts',
    slug: 'mens-french-linen-drawstring-shorts',
    sku: 'SHR-LIN-001-SGE',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'shorts',
    subcategoryName: 'Shorts',
    brand: 'Urban Linen',
    price: 1899,
    originalPrice: 2499,
    stock: 40,
    rating: 4.8,
    reviewsCount: 38,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&q=80'
    ],
    description: '100% pure linen casual shorts with elasticated waistband and natural cotton drawstring. Ideal for resort trips and beach walks.',
    specifications: {
      'Material': '100% Pure Flax Linen',
      'Inseam': '7 inch Mid-Thigh Length',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vms-1', name: 'Sage Green / M', color: '#84cc16', size: 'M', price: 1899, stock: 20, sku: 'SHR-LIN-SGE-M' }
    ],
    tags: ['Linen Shorts', 'Summer', 'Men Shorts']
  },
  {
    id: 'prod-m-short-2',
    name: 'Men’s 4-Way Stretch Athletic Training Shorts',
    slug: 'mens-stretch-athletic-training-shorts',
    sku: 'SHR-ATH-002-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'shorts',
    subcategoryName: 'Shorts',
    brand: 'Horizon Gear',
    price: 1599,
    originalPrice: 2199,
    stock: 50,
    rating: 4.9,
    reviewsCount: 62,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&q=80'
    ],
    description: 'Quick-dry hydro-wicking running and workout shorts with built-in compression liner and zippered phone pocket.',
    specifications: {
      'Material': '88% Recycled Polyester, 12% Spandex',
      'Features': 'Built-in Compression Liner, Zip Pocket',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vms-2', name: 'Stealth Black / L', color: '#000000', size: 'L', price: 1599, stock: 30, sku: 'SHR-ATH-BLK-L' }
    ],
    tags: ['Training Shorts', 'Gym', 'Men Shorts']
  },

  // ==========================================
  // CLOTHES -> MEN (MALE) -> BUNNIES (BANYANS / VESTS)
  // ==========================================
  {
    id: 'prod-m-bunny-1',
    name: 'Men’s 100% Combed Ribbed Cotton Banyan / Vest (Pack of 2)',
    slug: 'mens-combed-ribbed-cotton-banyan-vest-pack',
    sku: 'VST-RIB-001-WHT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'bunnies',
    subcategoryName: 'Banyans / Vests',
    brand: 'Vanguard Apparel',
    price: 899,
    originalPrice: 1299,
    stock: 80,
    rating: 4.9,
    reviewsCount: 110,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=80'
    ],
    description: 'Super combed 100% Egyptian cotton ribbed vests / banyans. Sweat-absorbent contoured armholes designed for day-long under-shirt comfort.',
    specifications: {
      'Material': '100% Super Combed Ribbed Cotton',
      'Pack Details': '2 Sleeveless Inner Vests included',
      'Fit': 'Body Hugging Contoured Fit',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vmb-1', name: 'Snow White / L (Pack of 2)', color: '#FFFFFF', size: 'L', price: 899, stock: 45, sku: 'VST-RIB-WHT-L' }
    ],
    tags: ['Banyan', 'Vest', 'Men Banyans']
  },
  {
    id: 'prod-m-bunny-2',
    name: 'Men’s Ultra-Cool Modal Seamless Gym Banyan',
    slug: 'mens-modal-seamless-gym-banyan',
    sku: 'VST-MDL-002-GRY',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'bunnies',
    subcategoryName: 'Banyans / Vests',
    brand: 'Vanguard Apparel',
    price: 999,
    originalPrice: 1499,
    stock: 60,
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=80'
    ],
    description: 'Micro-modal blended cooling sleeveless undershirt with anti-chafing flatlock seams and active anti-odor silver thread infusion.',
    specifications: {
      'Material': '95% Micro-Modal, 5% Elastane',
      'Technology': 'Silver-Ion Anti-Odor',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vmb-2', name: 'Space Grey / M', color: '#64748b', size: 'M', price: 999, stock: 30, sku: 'VST-MDL-GRY-M' }
    ],
    tags: ['Modal Banyan', 'Inner Vest', 'Men Banyans']
  },

  // ==========================================
  // CLOTHES -> MEN (MALE) -> UNDERWEARS
  // ==========================================
  {
    id: 'prod-m-und-1',
    name: 'Men’s Ultra-Soft Bamboo Boxer Briefs (Pack of 3)',
    slug: 'mens-ultra-soft-bamboo-boxer-briefs-pack-of-3',
    sku: 'UND-BAM-001-AST',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'underwears',
    subcategoryName: 'Underwears',
    brand: 'Vanguard Apparel',
    price: 1399,
    originalPrice: 1999,
    stock: 75,
    rating: 4.9,
    reviewsCount: 165,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1000&q=80'
    ],
    description: 'Naturally temperature-regulating organic bamboo viscose boxer briefs. Features a plush no-roll microfiber waistband and ergonomic ball pouch.',
    specifications: {
      'Fabric': '95% Eco Bamboo Viscose, 5% Spandex',
      'Waistband': 'Anti-Roll 38mm Microfiber',
      'Pack': '3 Boxer Briefs (Black, Navy, Charcoal)',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vmu-1', name: 'Assorted 3-Pack / M', color: '#1e293b', size: 'M', price: 1399, stock: 40, sku: 'UND-BAM-AST-M' }
    ],
    tags: ['Bamboo Underwear', 'Boxer Briefs', 'Men Underwears']
  },
  {
    id: 'prod-m-und-2',
    name: 'Men’s Cotton Stretch Breathable Trunks (Pack of 2)',
    slug: 'mens-cotton-stretch-breathable-trunks-pack-of-2',
    sku: 'UND-TRK-002-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'male',
    subcategory: 'underwears',
    subcategoryName: 'Underwears',
    brand: 'Vanguard Apparel',
    price: 999,
    originalPrice: 1499,
    stock: 55,
    rating: 4.8,
    reviewsCount: 88,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1000&q=80'
    ],
    description: 'Low-rise short-leg stretch cotton trunks with breathable mesh fly panel for all-day ventilation.',
    specifications: {
      'Fabric': '92% Combed Cotton, 8% Elastane',
      'Length': 'Short Inseam Trunk',
      'Gender': 'Men'
    },
    variants: [
      { id: 'vmu-2', name: 'Jet Black 2-Pack / L', color: '#000000', size: 'L', price: 999, stock: 30, sku: 'UND-TRK-BLK-L' }
    ],
    tags: ['Trunks', 'Cotton Stretch', 'Men Underwears']
  },

  // ==========================================
  // CLOTHES -> WOMEN (FEMALE) -> DRESSES
  // ==========================================
  {
    id: 'prod-f-dress-1',
    name: 'Women’s Floral Print Wrap A-Line Midi Dress',
    slug: 'womens-floral-wrap-aline-midi-dress',
    slugUrl: 'womens-floral-wrap-aline-midi-dress',
    sku: 'DRS-FLR-001-BLU',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'dresses',
    subcategoryName: 'Dresses',
    brand: 'Serene Studio',
    price: 3499,
    originalPrice: 4799,
    stock: 35,
    rating: 4.9,
    reviewsCount: 76,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1000&q=80'
    ],
    description: 'Ethereal floral printed chiffon wrap dress with ruffled tiered hemline, delicate flutter sleeves, and an adjustable waist sash.',
    specifications: {
      'Material': 'Chiffon Georgette with Cotton Voile Lining',
      'Length': 'Midi Calf-Length',
      'Fit': 'Adjustable Wrap Fit',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfd-1', name: 'Azure Floral / S', color: '#60a5fa', size: 'S', price: 3499, stock: 15, sku: 'DRS-FLR-BLU-S' },
      { id: 'vfd-2', name: 'Azure Floral / M', color: '#60a5fa', size: 'M', price: 3499, stock: 20, sku: 'DRS-FLR-BLU-M' }
    ],
    tags: ['Midi Dress', 'Floral Dress', 'Women Dresses']
  },
  {
    id: 'prod-f-dress-2',
    name: 'Women’s Silk Satin Cowl Neck Slip Evening Dress',
    slug: 'womens-silk-satin-cowl-neck-slip-dress',
    sku: 'DRS-SLK-002-EMR',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'dresses',
    subcategoryName: 'Dresses',
    brand: 'Serene Studio',
    price: 4299,
    originalPrice: 5999,
    stock: 25,
    rating: 4.8,
    reviewsCount: 52,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&q=80'
    ],
    description: 'Luscious bias-cut mulberry silk blend that skims curves effortlessly. Features a sultry draped cowl neckline, side leg slit, and criss-cross back straps.',
    specifications: {
      'Fabric': 'Mulberry Silk & Viscose Satin Blend',
      'Silhouette': 'Bias Cut Maxi Slip',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfd-3', name: 'Emerald Forest / M', color: '#047857', size: 'M', price: 4299, stock: 12, sku: 'DRS-SLK-EMR-M' }
    ],
    tags: ['Silk Slip', 'Evening Gown', 'Women Dresses']
  },
  {
    id: 'prod-f-dress-3',
    name: 'Women’s Tiered Cotton Sundress with Pockets',
    slug: 'womens-tiered-cotton-sundress-with-pockets',
    sku: 'DRS-SUN-003-WHT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'dresses',
    subcategoryName: 'Dresses',
    brand: 'Serene Studio',
    price: 2799,
    originalPrice: 3699,
    stock: 40,
    rating: 4.7,
    reviewsCount: 41,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80'
    ],
    description: 'Lightweight breezy summer tiered sundress cut from 100% breathable poplin cotton. Complete with deep hidden side pockets.',
    specifications: {
      'Material': '100% Breathable Poplin Cotton',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfd-4', name: 'Cream Ivory / M', color: '#fef3c7', size: 'M', price: 2799, stock: 25, sku: 'DRS-SUN-WHT-M' }
    ],
    tags: ['Sundress', 'Pockets', 'Women Dresses']
  },

  // ==========================================
  // CLOTHES -> WOMEN (FEMALE) -> SHIRTS & TOPS
  // ==========================================
  {
    id: 'prod-f-shirt-1',
    name: 'Women’s Pure Silk Button-Down Collared Shirt',
    slug: 'womens-pure-silk-button-down-collared-shirt',
    sku: 'TOP-SLK-001-IVR',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Serene Studio',
    price: 3299,
    originalPrice: 4599,
    stock: 30,
    rating: 4.9,
    reviewsCount: 64,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1000&q=80'
    ],
    description: 'Sophisticated 19mm crepe de chine pure silk button-down shirt. Clean covered placket, French seams, and polished mother-of-pearl buttons.',
    specifications: {
      'Material': '100% Mulberry Silk',
      'Fit': 'Tailored Button-Down Shirt',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfs-1', name: 'Ivory Pearl / S', color: '#fdf4dc', size: 'S', price: 3299, stock: 15, sku: 'TOP-SLK-IVR-S' }
    ],
    tags: ['Silk Shirt', 'Button Down', 'Women Shirts']
  },
  {
    id: 'prod-f-shirt-2',
    name: 'Women’s Relaxed Linen Boyfriend Button-Down Shirt',
    slug: 'womens-relaxed-linen-boyfriend-shirt',
    sku: 'TOP-LIN-002-BLU',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Urban Linen',
    price: 2399,
    originalPrice: 3199,
    stock: 45,
    rating: 4.8,
    reviewsCount: 48,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1000&q=80'
    ],
    description: 'Slouchy relaxed oversized linen button-up shirt with dropped shoulders, patch pocket, and curved high-low shirttail hem.',
    specifications: {
      'Material': '100% Washed European Linen',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfs-2', name: 'Pastel Blue / M', color: '#93c5fd', size: 'M', price: 2399, stock: 25, sku: 'TOP-LIN-BLU-M' }
    ],
    tags: ['Linen Shirt', 'Women Shirts']
  },
  {
    id: 'prod-f-shirt-3',
    name: 'Women’s Crisp Cotton Poplin Oxford Shirt',
    slug: 'womens-crisp-cotton-poplin-oxford-shirt',
    sku: 'TOP-OXF-003-WHT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'shirts',
    subcategoryName: 'Shirts',
    brand: 'Serene Studio',
    price: 2699,
    originalPrice: 3499,
    stock: 40,
    rating: 4.9,
    reviewsCount: 89,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&q=80'
    ],
    description: 'Tailored crisp white poplin cotton Oxford shirt with pointed collar, chest pocket, and barrel cuffs. Essential workwear and formal styling.',
    specifications: {
      'Fabric': '100% Long-Staple Poplin Cotton',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfs-3', name: 'Bright White / S', color: '#ffffff', size: 'S', price: 2699, stock: 25, sku: 'TOP-OXF-WHT-S' }
    ],
    tags: ['Oxford Shirt', 'Poplin Cotton', 'Women Shirts']
  },

  // ==========================================
  // CLOTHES -> WOMEN (FEMALE) -> PANTS
  // ==========================================
  {
    id: 'prod-f-pant-1',
    name: 'Women’s High-Waisted Wide Leg Tailored Trousers',
    slug: 'womens-high-waisted-wide-leg-trousers',
    sku: 'PNT-WDL-001-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Serene Studio',
    price: 3299,
    originalPrice: 4499,
    stock: 35,
    rating: 4.9,
    reviewsCount: 81,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=1000&q=80'
    ],
    description: 'Floor-sweeping pleated front wide-leg trousers. Cut with a sculpting ultra-high waist, tailored belt loops, and fluid drape crepe weave.',
    specifications: {
      'Composition': '78% Poly-Crepe, 18% Rayon, 4% Spandex',
      'Waist Rise': 'High-Rise 12 inch',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfp-1', name: 'Classic Black / 28', color: '#000000', size: '28', price: 3299, stock: 20, sku: 'PNT-WDL-BLK-28' }
    ],
    tags: ['Wide Leg', 'Tailored Pants', 'Women Pants']
  },
  {
    id: 'prod-f-pant-2',
    name: 'Women’s Flare Ankle Stretch Chino Pants',
    slug: 'womens-flare-ankle-stretch-chino-pants',
    sku: 'PNT-FLR-002-OAT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'pants',
    subcategoryName: 'Pants',
    brand: 'Urban Linen',
    price: 2799,
    originalPrice: 3699,
    stock: 30,
    rating: 4.8,
    reviewsCount: 39,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=1000&q=80'
    ],
    description: 'Cropped kick-flare cotton stretch trousers with concealed hook-and-eye closure. Versatile day-to-night wardrobe essential.',
    specifications: {
      'Material': '96% Cotton Twill, 4% Elastane',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfp-2', name: 'Oatmeal Beige / 26', color: '#f5f5f4', size: '26', price: 2799, stock: 15, sku: 'PNT-FLR-OAT-26' }
    ],
    tags: ['Flare Pants', 'Chinos', 'Women Pants']
  },

  // ==========================================
  // CLOTHES -> WOMEN (FEMALE) -> SHORTS
  // ==========================================
  {
    id: 'prod-f-short-1',
    name: 'Women’s High-Rise Denim Cut-Off Shorts',
    slug: 'womens-high-rise-denim-cut-off-shorts',
    sku: 'SHR-DNM-001-LGT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'shorts',
    subcategoryName: 'Shorts',
    brand: 'Vanguard Apparel',
    price: 1899,
    originalPrice: 2499,
    stock: 45,
    rating: 4.8,
    reviewsCount: 57,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=1000&q=80'
    ],
    description: 'Classic 90s vintage wash rigid denim shorts with raw distressed hemline and classic 5-pocket construction.',
    specifications: {
      'Fabric': '100% Rigid Organic Cotton Denim',
      'Rise': 'High Rise 11.5 inch',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfs-sh-1', name: 'Light Wash Indigo / 28', color: '#93c5fd', size: '28', price: 1899, stock: 25, sku: 'SHR-DNM-LGT-28' }
    ],
    tags: ['Denim Shorts', 'High Rise', 'Women Shorts']
  },
  {
    id: 'prod-f-short-2',
    name: 'Women’s Breezy Linen Resort Lounge Shorts',
    slug: 'womens-breezy-linen-resort-lounge-shorts',
    sku: 'SHR-LIN-002-WHT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'shorts',
    subcategoryName: 'Shorts',
    brand: 'Urban Linen',
    price: 1699,
    originalPrice: 2299,
    stock: 50,
    rating: 4.7,
    reviewsCount: 34,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&q=80'
    ],
    description: 'Breathable linen shorts with smocked elastic waistband and subtle scalloped hem. Ideal for holiday packing.',
    specifications: {
      'Material': '100% Pure Washed Linen',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfs-sh-2', name: 'Optic White / M', color: '#ffffff', size: 'M', price: 1699, stock: 30, sku: 'SHR-LIN-WHT-M' }
    ],
    tags: ['Linen Shorts', 'Resort', 'Women Shorts']
  },

  // ==========================================
  // CLOTHES -> WOMEN (FEMALE) -> UNDERWEARS
  // ==========================================
  {
    id: 'prod-f-und-1',
    name: 'Women’s Seamless No-Show Microfiber Hipsters (Pack of 3)',
    slug: 'womens-seamless-no-show-microfiber-hipsters-pack',
    sku: 'UND-HIP-001-AST',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'underwears',
    subcategoryName: 'Underwears',
    brand: 'Aura Intimates',
    price: 1299,
    originalPrice: 1799,
    stock: 70,
    rating: 4.9,
    reviewsCount: 138,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1000&q=80'
    ],
    description: 'Laser-cut edges for 100% zero panty lines under fitted leggings or dresses. 100% pure cotton gusset lining for day-long hygiene.',
    specifications: {
      'Fabric': '82% Microfiber Polyamide, 18% Elastane',
      'Gusset': '100% Breathable Cotton',
      'Pack Details': '3 Hipster Briefs (Nude, Rose, Black)',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfu-1', name: 'Assorted 3-Pack / S', color: '#fbcfe8', size: 'S', price: 1299, stock: 35, sku: 'UND-HIP-AST-S' }
    ],
    tags: ['Seamless Underwear', 'No Show', 'Women Underwears']
  },
  {
    id: 'prod-f-und-2',
    name: 'Women’s Organic Cotton Breathable Bikini Briefs (Pack of 3)',
    slug: 'womens-organic-cotton-breathable-bikini-briefs',
    sku: 'UND-BIK-002-MLT',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'underwears',
    subcategoryName: 'Underwears',
    brand: 'Aura Intimates',
    price: 1099,
    originalPrice: 1499,
    stock: 65,
    rating: 4.8,
    reviewsCount: 94,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1000&q=80'
    ],
    description: 'Ultra-gentle GOTS certified organic combed cotton bikini briefs with delicate lace waistband trim.',
    specifications: {
      'Material': '95% GOTS Organic Cotton, 5% Spandex',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfu-2', name: 'Pastel Trio / M', color: '#e0e7ff', size: 'M', price: 1099, stock: 30, sku: 'UND-BIK-MLT-M' }
    ],
    tags: ['Organic Cotton', 'Bikini Briefs', 'Women Underwears']
  },

  // ==========================================
  // CLOTHES -> WOMEN (FEMALE) -> BRAS
  // ==========================================
  {
    id: 'prod-f-bra-1',
    name: 'Women’s Wireless Comfort Contour Bralette',
    slug: 'womens-wireless-comfort-contour-bralette',
    sku: 'BRA-WIR-001-NDE',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'bras',
    subcategoryName: 'Bras',
    brand: 'Aura Intimates',
    price: 1799,
    originalPrice: 2499,
    stock: 50,
    rating: 4.9,
    reviewsCount: 112,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1000&q=80'
    ],
    description: 'Butter-soft cloud-foam wireless bralette. Provides natural lift without digging wires, with 4-way stretch smoothing back wings and convertible straps.',
    specifications: {
      'Cup Type': 'Wireless Molded Cloud Foam',
      'Closure': 'Triple Hook-and-Eye',
      'Strap Type': 'Convertible Standard / Cross-Back',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfb-1', name: 'Soft Sand Nude / 34B', color: '#fed7aa', size: '34B', price: 1799, stock: 25, sku: 'BRA-WIR-NDE-34B' }
    ],
    tags: ['Wireless Bra', 'Bralette', 'Women Bras']
  },
  {
    id: 'prod-f-bra-2',
    name: 'Women’s Everyday Invisible T-Shirt Bra',
    slug: 'womens-everyday-invisible-t-shirt-bra',
    sku: 'BRA-TSH-002-BLK',
    category: 'clothes',
    categoryName: 'Clothes',
    gender: 'female',
    subcategory: 'bras',
    subcategoryName: 'Bras',
    brand: 'Aura Intimates',
    price: 1999,
    originalPrice: 2799,
    stock: 45,
    rating: 4.8,
    reviewsCount: 86,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1000&q=80'
    ],
    description: 'Ultra-thin memory cups that sculpt to your body temperature. Smooth bonded edges that stay completely invisible under the thinnest tees.',
    specifications: {
      'Cup Type': 'Thermal Memory Foam Underwire',
      'Gender': 'Women'
    },
    variants: [
      { id: 'vfb-2', name: 'Midnight Black / 34C', color: '#000000', size: '34C', price: 1999, stock: 20, sku: 'BRA-TSH-BLK-34C' }
    ],
    tags: ['T-Shirt Bra', 'Seamless', 'Women Bras']
  },

  // ==========================================
  // SHOES -> SNEAKERS & SPORTS
  // ==========================================
  {
    id: 'prod-shoe-1',
    name: 'AeroGlide Carbon Plate Marathon Running Shoes',
    slug: 'aeroglide-carbon-plate-running-shoes',
    sku: 'SH-RUN-CARB-001',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'sneakers',
    subcategoryName: 'Sneakers & Sports',
    brand: 'Kinetics Footwear',
    price: 9499,
    originalPrice: 12999,
    stock: 35,
    rating: 4.9,
    reviewsCount: 118,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80'
    ],
    description: 'Engineered for competitive long-distance road runners. Full-length curved carbon fiber propulsion plate sandwiched between dual layers of supercritical PEBA nitrogen-infused foam.',
    specifications: {
      'Stack Height': '39mm Heel / 31mm Forefoot (8mm Drop)',
      'Plate': 'Full-length 3D Carbon Propulsion Plate'
    },
    variants: [
      { id: 'vs-sh1-1', name: 'Crimson Volt / UK 9', color: '#ef4444', size: 'UK 9', price: 9499, stock: 15, sku: 'SH-RUN-CARB-RED-9' }
    ],
    tags: ['Carbon Plate', 'Marathon', 'Sneakers']
  },
  {
    id: 'prod-shoe-2',
    name: 'Horizon Minimalist Court Retro Sneakers',
    slug: 'horizon-minimalist-court-sneakers',
    sku: 'SH-CRT-LOW-002',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'sneakers',
    subcategoryName: 'Sneakers & Sports',
    brand: 'Kinetics Footwear',
    price: 4499,
    originalPrice: 5999,
    stock: 55,
    rating: 4.8,
    reviewsCount: 164,
    isFeatured: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&q=80'
    ],
    description: 'Clean-lined tennis court silhouette crafted from full-grain white nappa calf leather. Margom rubber cupsole hand-stitched for longevity.',
    specifications: {
      'Upper': 'Italian Full-Grain Nappa Leather'
    },
    variants: [
      { id: 'vs-sh2-1', name: 'Chalk White / UK 8', color: '#f8fafc', size: 'UK 8', price: 4499, stock: 25, sku: 'SH-CRT-WHT-8' }
    ],
    tags: ['Court Sneakers', 'Nappa Leather']
  },
  {
    id: 'prod-shoe-3',
    name: 'Velocity Ultra-Light Trail Running Shoes',
    slug: 'velocity-ultra-light-trail-shoes',
    sku: 'SH-TRL-VIB-003',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'sneakers',
    subcategoryName: 'Sneakers & Sports',
    brand: 'Kinetics Footwear',
    price: 6799,
    originalPrice: 8499,
    stock: 30,
    rating: 4.7,
    reviewsCount: 42,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&q=80'
    ],
    description: 'Tackle steep mud and gravel terrain with 5mm directional lugs and rock-protection shank. Breathable abrasion-resistant ballistic mesh upper.',
    specifications: {
      'Outsole': 'Vibram Megagrip All-Terrain Rubber'
    },
    variants: [
      { id: 'vs-sh3-1', name: 'Slate Teal / UK 10', color: '#0d9488', size: 'UK 10', price: 6799, stock: 12, sku: 'SH-TRL-TEL-10' }
    ],
    tags: ['Vibram', 'Trail Runner']
  },

  // ==========================================
  // SHOES -> FORMAL & LOAFERS
  // ==========================================
  {
    id: 'prod-shoe-4',
    name: 'Cap-Toe Goodyear Welted Oxford Shoes',
    slug: 'cap-toe-goodyear-welted-oxfords',
    sku: 'SH-OXF-BLK-004',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'formal-shoes',
    subcategoryName: 'Formal & Loafers',
    brand: 'Kinetics Footwear',
    price: 8999,
    originalPrice: 11999,
    stock: 25,
    rating: 4.9,
    reviewsCount: 57,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1000&q=80'
    ],
    description: 'Traditional bench-crafted dress Oxfords. Goodyear-welted construction with vegetable-tanned Argentine leather sole and hand-burnished toe cap.',
    specifications: {
      'Construction': 'Goodyear Welt 360-degree'
    },
    variants: [
      { id: 'vs-sh4-1', name: 'Hand-Burnished Black / UK 9', color: '#0f172a', size: 'UK 9', price: 8999, stock: 10, sku: 'SH-OXF-BLK-9' }
    ],
    tags: ['Goodyear Welt', 'Formal Shoes']
  },
  {
    id: 'prod-shoe-5',
    name: 'Suede Belgian Penny Loafers with Cork Cushioning',
    slug: 'suede-belgian-penny-loafers',
    sku: 'SH-LOA-SUE-005',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'formal-shoes',
    subcategoryName: 'Formal & Loafers',
    brand: 'Kinetics Footwear',
    price: 6499,
    originalPrice: 7999,
    stock: 30,
    rating: 4.8,
    reviewsCount: 46,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1000&q=80'
    ],
    description: 'Unlined buttery calf suede slip-on loafers. Molded natural cork footbed adapts to your arch within 2 weeks of wear.',
    specifications: {
      'Material': 'English Reverse Calf Suede'
    },
    variants: [
      { id: 'vs-sh5-1', name: 'Snuff Suede Brown / UK 8', color: '#78350f', size: 'UK 8', price: 6499, stock: 15, sku: 'SH-LOA-BRN-8' }
    ],
    tags: ['Suede Loafer', 'Penny Loafers']
  },

  // ==========================================
  // SHOES -> CASUAL FOOTWEAR
  // ==========================================
  {
    id: 'prod-shoe-6',
    name: 'Handcrafted Waxed Canvas Deck Slip-Ons',
    slug: 'handcrafted-waxed-canvas-deck-shoes',
    sku: 'SH-SLP-CAN-006',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'casual-shoes',
    subcategoryName: 'Casual Footwear',
    brand: 'Urban Linen',
    price: 2999,
    originalPrice: 3999,
    stock: 45,
    rating: 4.7,
    reviewsCount: 63,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&q=80'
    ],
    description: 'Heavy 16 oz Martexin water-resistant waxed cotton canvas slip-ons with vulcanized gum rubber soles and memory foam insoles.',
    specifications: {
      'Upper': '16 oz Waxed Duck Canvas'
    },
    variants: [
      { id: 'vs-sh6-1', name: 'Navy Canvas / UK 9', color: '#1e3a8a', size: 'UK 9', price: 2999, stock: 20, sku: 'SH-SLP-NVY-9' }
    ],
    tags: ['Deck Shoes', 'Casual Slip-On']
  },
  {
    id: 'prod-shoe-7',
    name: 'Anatomical Ergonomic Cork Footbed Slides',
    slug: 'anatomical-cork-footbed-slides',
    sku: 'SH-SLD-CRK-007',
    category: 'shoes',
    categoryName: 'Shoes',
    subcategory: 'casual-shoes',
    subcategoryName: 'Casual Footwear',
    brand: 'Kinetics Footwear',
    price: 3499,
    originalPrice: 4499,
    stock: 40,
    rating: 4.8,
    reviewsCount: 71,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1000&q=80'
    ],
    description: 'Natural sustainable cork-latex footbed with deep heel cup, transversal arch support, and double oiled leather adjustable buckles.',
    specifications: {
      'Footbed': '100% Natural Cork Latex'
    },
    variants: [
      { id: 'vs-sh7-1', name: 'Oiled Habana Leather / UK 8', color: '#451a03', size: 'UK 8', price: 3499, stock: 18, sku: 'SH-SLD-HBN-8' }
    ],
    tags: ['Cork Slides', 'Summer Casual']
  },

  // ==========================================
  // ELECTRONICS -> LAPTOP & COMPUTING
  // ==========================================
  {
    id: 'prod-elec-1',
    name: 'NovaBook Pro 16 Creator Workstation (M3 Max 16-Core)',
    slug: 'novabook-pro-16-creator-workstation',
    sku: 'NVB-16-M3M-001',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'laptop',
    subcategoryName: 'Laptop & Computing',
    brand: 'NovaTech',
    price: 189999,
    originalPrice: 209999,
    stock: 15,
    rating: 5.0,
    reviewsCount: 79,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80'
    ],
    description: 'Built for 8K RED RAW editing, 3D neural rendering, and AI fine-tuning. 16-inch 120Hz Mini-LED Liquid XDR display with 1600 nits peak HDR brightness.',
    specifications: {
      'Processor': 'Nova M3 Max (16-Core CPU, 40-Core GPU)',
      'Memory': '64GB Unified High-Bandwidth RAM',
      'Storage': '2TB Gen 5 NVMe PCIe SSD'
    },
    variants: [
      { id: 've-1', name: 'Space Black / 64GB / 2TB', color: '#18181b', size: '16 inch', price: 189999, stock: 10, sku: 'NVB-16-BLK-64-2T' }
    ],
    tags: ['Creator Laptop', 'M3 Max', 'Mini-LED']
  },
  {
    id: 'prod-elec-2',
    name: 'NovaBook Air 13 Ultra-Thin Laptop (Fanless M3)',
    slug: 'novabook-air-13-fanless-laptop',
    sku: 'NVB-13-AIR-002',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'laptop',
    subcategoryName: 'Laptop & Computing',
    brand: 'NovaTech',
    price: 89999,
    originalPrice: 99999,
    stock: 30,
    rating: 4.8,
    reviewsCount: 124,
    isFeatured: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80'
    ],
    description: 'Weighs only 1.15 kg in a CNC aluminum unibody. Completely silent fanless thermal architecture with 18-hour battery life and MagSafe charging.',
    specifications: {
      'Processor': 'Nova M3 (8-Core CPU, 10-Core GPU)',
      'Display': '13.6-inch Retina TrueTone Display'
    },
    variants: [
      { id: 've-2', name: 'Midnight Blue / 16GB / 512GB', color: '#0f172a', size: '13.6 inch', price: 89999, stock: 20, sku: 'NVB-13-MID-16-512' }
    ],
    tags: ['Ultra Thin', 'Fanless', '18h Battery']
  },
  {
    id: 'prod-elec-3',
    name: 'Aether 75% Wireless Mechanical Keyboard',
    slug: 'aether-75-wireless-mechanical-keyboard',
    sku: 'ATH-KB-75-003',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'laptop',
    subcategoryName: 'Laptop & Computing',
    brand: 'Aether Sound',
    price: 11999,
    originalPrice: 14999,
    stock: 45,
    rating: 4.9,
    reviewsCount: 96,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&q=80'
    ],
    description: 'CNC anodized aluminum gasket-mounted keyboard. Factory lubricated pre-lubed linear jade switches, hot-swappable PCB, and rotary encoder volume knob.',
    specifications: {
      'Mounting': 'Poron Gasket Mount Structure'
    },
    variants: [
      { id: 've-3', name: 'Anodized Silver / Jade Linear', color: '#e2e8f0', size: '75%', price: 11999, stock: 25, sku: 'ATH-KB-SLV-JAD' }
    ],
    tags: ['Mechanical Keyboard', 'Gasket Mount']
  },

  // ==========================================
  // ELECTRONICS -> PHONE & MOBILE
  // ==========================================
  {
    id: 'prod-elec-4',
    name: 'Horizon Prime 16 Pro Flagship Smartphone (1TB Titanium)',
    slug: 'horizon-prime-16-pro-flagship-smartphone',
    sku: 'HORZ-PHN-001-TI',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'phone',
    subcategoryName: 'Phone & Mobile',
    brand: 'Horizon Gear',
    price: 119999,
    originalPrice: 134999,
    stock: 20,
    rating: 4.9,
    reviewsCount: 153,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1000&q=80'
    ],
    description: 'Aerospace Grade 5 titanium enclosure. 200MP periscope zoom lens with 10x optical magnification and 4K 120fps spatial HDR recording.',
    specifications: {
      'Processor': 'Snapdragon 8 Gen 3 Extreme Edition',
      'Camera': '200MP Main + 50MP Periscope (10x) + 50MP Ultrawide'
    },
    variants: [
      { id: 'vp-5', name: 'Natural Titanium / 512GB', color: '#78716c', size: '512GB', price: 119999, stock: 12, sku: 'HORZ-PHN-NAT-512' }
    ],
    tags: ['Titanium', '200MP Camera', 'Flagship Phone']
  },
  {
    id: 'prod-elec-5',
    name: 'Horizon Flip Z Folding OLED Smartphone',
    slug: 'horizon-flip-z-folding-oled-smartphone',
    sku: 'HORZ-FLP-002-VIO',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'phone',
    subcategoryName: 'Phone & Mobile',
    brand: 'Horizon Gear',
    price: 84999,
    originalPrice: 99999,
    stock: 18,
    rating: 4.7,
    reviewsCount: 68,
    isFeatured: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=1000&q=80'
    ],
    description: 'Zero-crease waterdrop hinge folding flagship with a 3.4-inch outer cover screen for quick replies, viewfinder selfies, and widgets.',
    specifications: {
      'Displays': '6.7-inch 120Hz LTPO Dynamic AMOLED + 3.4-inch Cover'
    },
    variants: [
      { id: 'vp-7', name: 'Mystic Violet / 256GB', color: '#a855f7', size: '256GB', price: 84999, stock: 10, sku: 'HORZ-FLP-VIO-256' }
    ],
    tags: ['Foldable OLED', 'Cover Screen']
  },
  {
    id: 'prod-elec-6',
    name: 'MagShield 10,000mAh Ultra-Slim Wireless Power Bank',
    slug: 'magshield-wireless-magnetic-power-bank',
    sku: 'MAG-PB-10K-003',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'phone',
    subcategoryName: 'Phone & Mobile',
    brand: 'NovaTech',
    price: 3499,
    originalPrice: 4999,
    stock: 50,
    rating: 4.8,
    reviewsCount: 89,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1b5e3d74c?w=1000&q=80'
    ],
    description: 'N52 Neodymium snap-on magnets with 15W Qi2 fast wireless charging and 30W USB-C PD two-way passthrough delivery.',
    specifications: {
      'Capacity': '10,000mAh Lithium-Polymer 38.5Wh'
    },
    variants: [
      { id: 'vp-8', name: 'Matte Graphite / 10000mAh', color: '#334155', size: '10000mAh', price: 3499, stock: 35, sku: 'MAG-PB-GRP-10K' }
    ],
    tags: ['MagSafe Battery', 'Qi2 15W']
  },

  // ==========================================
  // ELECTRONICS -> EARBUDS & AUDIO
  // ==========================================
  {
    id: 'prod-elec-7',
    name: 'Aether Sound Studio Pro Over-Ear ANC Headphones',
    slug: 'aether-sound-studio-pro-anc-headphones',
    sku: 'ATH-HP-ANC-001',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'earbuds',
    subcategoryName: 'Earbuds & Audio',
    brand: 'Aether Sound',
    price: 24999,
    originalPrice: 29999,
    stock: 25,
    rating: 4.9,
    reviewsCount: 147,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80'
    ],
    description: 'Reference-grade 40mm custom planar magnetic drivers delivering frequency response from 5Hz to 48kHz. Hybrid active noise cancelling with 40-hour battery life.',
    specifications: {
      'Acoustic Driver': '40mm Custom Planar Magnetic',
      'ANC Performance': '-42dB Adaptive Hybrid Active Noise Cancellation'
    },
    variants: [
      { id: 'v-15', name: 'Matte Obsidian Black', color: '#09090b', size: 'Over-Ear', price: 24999, stock: 15, sku: 'ATH-HP-BLK-01' }
    ],
    tags: ['Planar Magnetic', 'ANC Headphones']
  },
  {
    id: 'prod-elec-8',
    name: 'Aether AirBuds X True Wireless ANC Earbuds',
    slug: 'aether-airbuds-x-true-wireless-earbuds',
    sku: 'ATH-TWS-AIR-002',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'earbuds',
    subcategoryName: 'Earbuds & Audio',
    brand: 'Aether Sound',
    price: 8999,
    originalPrice: 11999,
    stock: 45,
    rating: 4.8,
    reviewsCount: 215,
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&q=80'
    ],
    description: 'Spatial audio with dynamic head-tracking. 11mm beryllium-coated dynamic drivers, Bluetooth 5.4 LE Audio LC3 codec, and 36-hour total playback with Qi charging case.',
    specifications: {
      'Water Resistance': 'IPX7 Sweat & Water Proof'
    },
    variants: [
      { id: 'v-16', name: 'Ceramic Glacier White', color: '#f8fafc', size: 'In-Ear TWS', price: 8999, stock: 25, sku: 'ATH-TWS-WHT-02' }
    ],
    tags: ['Spatial Audio', 'TWS Earbuds']
  },
  {
    id: 'prod-elec-9',
    name: 'Aether Precision IEM Audiophile In-Ear Monitors',
    slug: 'aether-precision-iem-in-ear-monitors',
    sku: 'ATH-IEM-AUD-003',
    category: 'electronics',
    categoryName: 'Electronics',
    subcategory: 'earbuds',
    subcategoryName: 'Earbuds & Audio',
    brand: 'Aether Sound',
    price: 15999,
    originalPrice: 19999,
    stock: 20,
    rating: 4.9,
    reviewsCount: 62,
    isFeatured: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80'
    ],
    description: 'Quad-driver hybrid system: 1 dynamic woofer + 3 Knowles balanced armatures. 8-core silver-plated copper 2-pin detachable cable with 4.4mm balanced termination.',
    specifications: {
      'Driver Setup': '1DD + 3BA Knowles Balanced Armatures'
    },
    variants: [
      { id: 'v-17', name: 'Transparent Amber', color: '#ea580c', size: 'Universal', price: 15999, stock: 12, sku: 'ATH-IEM-AMB' }
    ],
    tags: ['Audiophile IEM', 'Quad Driver']
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
        productId: 'prod-m-shirt-1',
        productName: 'Men’s Classic Oxford Pure Linen Shirt',
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
    productId: 'prod-m-shirt-1',
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
