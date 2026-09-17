'use client';

import { supabase, isSupabaseConfigured } from '@/lib/db/supabase';

/**
 * Supabase Storage Asset Manager
 * Handles uploading 5-angle product assets, banners, and avatars directly to Supabase CDN buckets
 * with seamless local Base64 fallback when offline or unconfigured.
 */

export const SupabaseStorage = {
  /**
   * Upload a single image to Supabase Storage
   * @param {File|Blob} file - The file to upload
   * @param {string} bucket - Target bucket ('product-images' | 'avatars' | 'banners')
   * @param {string} folder - Subfolder prefix
   * @returns {Promise<string>} Public URL of the uploaded image
   */
  async uploadImage(file, bucket = 'product-images', folder = 'items') {
    if (!file) return null;

    // Live Supabase Storage Upload
    if (isSupabaseConfigured() && supabase) {
      try {
        const fileExt = file.name ? file.name.split('.').pop() : 'jpg';
        const cleanName = file.name
          ? file.name.replace(/[^a-zA-Z0-9]/g, '_')
          : 'image';
        const filePath = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!error && data?.path) {
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

          if (urlData?.publicUrl) {
            console.log(`[Supabase Storage] Successfully uploaded to ${urlData.publicUrl}`);
            return urlData.publicUrl;
          }
        } else if (error) {
          console.warn('[Supabase Storage] Upload error, falling back to local encoding:', error.message);
        }
      } catch (err) {
        console.warn('[Supabase Storage] Exception during upload:', err);
      }
    }

    // Local Fallback: Convert File/Blob to Base64 Data URL
    return new Promise((resolve) => {
      if (typeof file === 'string') {
        resolve(file); // Already a URL or Base64
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        resolve('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80');
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Upload up to 5 product photos concurrently
   * @param {Array<File|string>} files - List of 5 image files or existing URLs
   * @returns {Promise<string[]>} List of 5 public URLs
   */
  async uploadProductGallery(files) {
    if (!Array.isArray(files) || files.length === 0) return [];

    const uploadPromises = files.map((file, idx) => {
      if (typeof file === 'string') return Promise.resolve(file);
      return this.uploadImage(file, 'product-images', `product_${idx + 1}`);
    });

    return Promise.all(uploadPromises);
  },
};
