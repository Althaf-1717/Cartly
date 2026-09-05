import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').regex(/^[0-9+ -]+$/, 'Invalid phone format'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid postal/PIN code is required'),
  country: z.string().default('India'),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  slug: z.string().min(3, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().min(1, 'Price must be greater than 0'),
  originalPrice: z.number().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  sku: z.string().min(3, 'SKU is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
});

export const reviewSchema = z.object({
  author: z.string().min(2, 'Your name is required'),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Review title is required'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
});
