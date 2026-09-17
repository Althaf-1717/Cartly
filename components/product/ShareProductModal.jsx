'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Smartphone,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

export default function ShareProductModal({ isOpen, onClose, product }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && product?.slug) {
      const url = `${window.location.origin}/product/${product.slug}?shared=true`;
      setShareUrl(url);
      setCanNativeShare(Boolean(navigator?.share));
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | Cartly`,
          text: `Check out ${product.name} on Cartly!`,
          url: shareUrl,
        });
      } catch (e) {
        // User cancelled or share failed
      }
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const shareText = encodeURIComponent(`Take a look at ${product.name} on Cartly!`);

  const shareChannels = [
    {
      name: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      icon: MessageCircle,
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
      color: 'bg-sky-500 hover:bg-sky-400 text-white',
      icon: Send,
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodeURIComponent(product.name)}&body=${shareText}%0A%0A${encodedUrl}`,
      color: 'bg-slate-700 hover:bg-slate-600 text-white',
      icon: Mail,
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl z-10 space-y-5 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Share This Product
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Generate a direct link for anyone to view this product
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Card Snippet */}
        <div className="p-3 bg-slate-50 dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80'}
            alt={product.name}
            className="w-14 h-14 object-cover rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase font-bold text-orange-600 dark:text-orange-400 tracking-wider block truncate">
              {product.brand || 'Cartly Brand'}
            </span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {product.name}
            </h4>
            <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>

        {/* Link Generation & Copy Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Product Shareable Link:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => e.target.select()}
              className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {copied && (
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
              <Check className="w-3.5 h-3.5" /> Shareable link copied to clipboard!
            </p>
          )}
        </div>

        {/* Quick Share Platforms */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Or Share Directly Via:
          </span>

          <div className="grid grid-cols-3 gap-2">
            {shareChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${channel.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{channel.name}</span>
                </a>
              );
            })}
          </div>

          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 mt-2"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>Share via Device Apps</span>
            </button>
          )}
        </div>

        {/* Informative Note About Guest vs Member Experience */}
        <div className="p-3.5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="text-orange-600 dark:text-orange-400 block mb-0.5">
            How it works when opened:
          </strong>
          Anyone with this link can view this product. If they are already logged in, they can add it to cart and buy immediately. If they do not have an account, the product is displayed with a prompt to <strong>create an account or login</strong>.
        </div>
      </div>
    </div>
  );
}
