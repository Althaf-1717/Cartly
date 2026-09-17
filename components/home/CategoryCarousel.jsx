'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

const carouselSlides = [
  {
    id: 'slide-1',
    title: 'Curated Fashion: Men & Women Collections',
    description: 'Explore tailored shirts, oversized tees, wide-leg pants, breezy linen shorts, evening dresses & intimates.',
    badge: 'NEW SEASON 2026',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&q=85',
    categoryLink: '/catalog?category=clothes',
    categoryName: 'Clothes',
    tags: ['Shirts', 'T-Shirts', 'Pants', 'Dresses', 'Innerwear']
  },
  {
    id: 'slide-2',
    title: 'Men’s Wardrobe: Precision & Comfort',
    description: '100% French linen shirts, heavy 240 GSM organic tees, selvedge denim & combed cotton inner banyans.',
    badge: 'MEN EXCLUSIVE',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=85',
    categoryLink: '/catalog?category=clothes&gender=male',
    categoryName: 'Men’s Clothes',
    tags: ['Shirts', 'Pants', 'T-Shirts', 'Shorts', 'Banyans', 'Underwears']
  },
  {
    id: 'slide-3',
    title: 'Women’s Studio: Elegance & Confidence',
    description: 'Floral wrap midi dresses, mulberry silk blouses, pleated wide-leg trousers & seamless comfort bralettes.',
    badge: 'WOMEN EXCLUSIVE',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=85',
    categoryLink: '/catalog?category=clothes&gender=female',
    categoryName: 'Women’s Clothes',
    tags: ['Dresses', 'Shirts & Tops', 'Pants', 'Shorts', 'Bras', 'Underwears']
  },
  {
    id: 'slide-4',
    title: 'Footwear: Engineered Performance & Italian Craft',
    description: 'Supercritical carbon plate marathon runners, Goodyear-welted leather Oxfords & handcrafted waxed canvas slip-ons.',
    badge: 'PRO PERFORMANCE',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=85',
    categoryLink: '/catalog?category=shoes',
    categoryName: 'Shoes',
    tags: ['Sneakers & Sports', 'Formal & Loafers', 'Casual Footwear']
  },
  {
    id: 'slide-5',
    title: 'Electronics: M3 Max Power & 200MP Photography',
    description: 'Creator workstations with Liquid Retina XDR, Titanium periscope zoom smartphones & Planar magnetic ANC sound.',
    badge: 'NEXT-GEN HARDWARE',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&q=85',
    categoryLink: '/catalog?category=electronics',
    categoryName: 'Electronics',
    tags: ['Laptops', '5G Phones', 'Audiophile Audio']
  }
];

export default function CategoryCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = carouselSlides.length;
  const timerRef = useRef(null);

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleGoTo = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Header info with custom themed tooltip */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Featured Categories Showcase
          </span>
        </div>

        {/* Custom Tooltip Button */}
        <div className="custom-tooltip-wrapper">
          <button
            type="button"
            className="btn btn-secondary text-[11px] font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-orange-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition flex items-center gap-1.5"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            data-bs-custom-class="custom-tooltip"
            data-bs-title="Interactive category carousel with drilldown links"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Interactive Carousel</span>
          </button>
          <div className="custom-tooltip">
            Click any slide to explore specific category items!
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOOTSTRAP-COMPATIBLE CAROUSEL WITH EXACT IDS AND CLASSES
          ========================================================================= */}
      <div
        id="carouselExampleCaptions"
        className="carousel slide shadow-xl group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {carouselSlides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to={idx}
              className={currentSlide === idx ? 'active' : ''}
              aria-current={currentSlide === idx ? 'true' : 'false'}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => handleGoTo(idx)}
            />
          ))}
        </div>

        {/* Carousel Inner & Items */}
        <div className="carousel-inner h-[380px] sm:h-[420px] md:h-[460px]">
          {carouselSlides.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <div
                key={slide.id}
                className={`carousel-item ${isActive ? 'active' : ''} h-full`}
                style={{
                  display: isActive ? 'block' : 'none',
                }}
              >
                {/* Slide Background Image */}
                <div className="relative w-full h-full overflow-hidden bg-slate-900">
                  <img
                    src={slide.imageUrl}
                    className="d-block w-100 h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 opacity-65"
                    alt={slide.title}
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Carousel Caption */}
                  <div className="carousel-caption d-none d-md-block max-w-2xl">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-orange-600 text-white font-black text-[10px] tracking-wider uppercase rounded-full shadow-md shadow-orange-600/30">
                          {slide.badge}
                        </span>
                        <span className="text-xs text-orange-300 font-semibold bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                          {slide.categoryName}
                        </span>
                      </div>

                      <h5 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                        {slide.title}
                      </h5>

                      <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-xl leading-relaxed">
                        {slide.description}
                      </p>

                      {/* Tag pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {slide.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium bg-white/15 text-white/90 px-2 py-0.5 rounded-md backdrop-blur-xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Action CTA with Tooltip */}
                      <div className="pt-2 flex items-center gap-3">
                        <div className="custom-tooltip-wrapper">
                          <Link
                            href={slide.categoryLink}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-bs-custom-class="custom-tooltip"
                            data-bs-title={`Explore all items in ${slide.categoryName}`}
                          >
                            <span>Explore {slide.categoryName}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <div className="custom-tooltip">
                            Direct filter for {slide.categoryName}
                          </div>
                        </div>

                        <span className="text-[11px] text-white/60 font-medium">
                          Slide {idx + 1} of {totalSlides}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Caption (Visible on small screens) */}
                  <div className="md:hidden absolute inset-x-4 bottom-14 p-4 bg-black/70 backdrop-blur-md rounded-2xl border border-white/10 text-white space-y-2 z-10">
                    <span className="inline-block px-2 py-0.5 bg-orange-600 text-white text-[9px] font-bold rounded-md uppercase">
                      {slide.badge}
                    </span>
                    <h5 className="text-base font-bold text-white line-clamp-1">
                      {slide.title}
                    </h5>
                    <p className="text-[11px] text-slate-300 line-clamp-2">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.categoryLink}
                      className="inline-flex items-center gap-1 text-xs text-orange-400 font-bold hover:underline"
                    >
                      <span>Explore Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Controls (Previous & Next) */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true">
            <ChevronLeft className="w-5 h-5 text-white" />
          </span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
          onClick={handleNext}
          aria-label="Next Slide"
        >
          <span className="carousel-control-next-icon" aria-hidden="true">
            <ChevronRight className="w-5 h-5 text-white" />
          </span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* =========================================================================
          PAGINATION COMPONENT (EXACT BOOTSTRAP STRUCTURE REQUESTED)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 px-1">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing category <strong className="text-slate-900 dark:text-white font-bold">{currentSlide + 1}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white font-bold">{totalSlides}</strong>: {carouselSlides[currentSlide].categoryName}
        </div>

        <nav aria-label="Category Carousel Pagination">
          <ul className="pagination">
            {/* Previous link */}
            <li className={`page-item ${currentSlide === 0 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                aria-label="Previous Page"
              >
                Previous
              </button>
            </li>

            {/* Page numbers */}
            {carouselSlides.map((_, idx) => {
              const isActive = currentSlide === idx;
              return (
                <li
                  key={idx}
                  className={`page-item ${isActive ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handleGoTo(idx)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {idx + 1}
                  </button>
                </li>
              );
            })}

            {/* Next link */}
            <li className={`page-item ${currentSlide === totalSlides - 1 ? 'disabled' : ''}`}>
              <button
                type="button"
                className="page-link"
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
                aria-label="Next Page"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
