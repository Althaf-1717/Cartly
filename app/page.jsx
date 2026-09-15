'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/authContext';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // 1. Each .appear -> own animationend -> add is-in
    const appears = document.querySelectorAll('.appear, .hero-photo');
    appears.forEach((el) => {
      el.addEventListener(
        'animationend',
        () => {
          el.classList.add('is-in');
        },
        { once: true }
      );
    });

    // 2. Fallback: if animations not running after two rAFs, force is-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let running = false;
        appears.forEach((el) => {
          if (
            el.getAnimations &&
            el.getAnimations().some((a) => a.playState === 'running' || a.playState === 'finished')
          ) {
            running = true;
          }
        });
        if (!running) {
          appears.forEach((el) => {
            el.classList.add('is-in');
          });
        }
      });
    });

    // 3. Escape key closes menu
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 4. Resize >= 901px closes menu
    const mq = window.matchMedia('(min-width: 901px)');
    const handleResize = (e) => {
      if (e.matches) {
        setMenuOpen(false);
      }
    };
    mq.addEventListener('change', handleResize);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      mq.removeEventListener('change', handleResize);
    };
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={`vesper-wrapper ${menuOpen ? 'menu-open' : ''}`}>
      {/* External Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900&family=Instrument+Serif:ital@1&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        /* Force black immediately */
        html,
        body {
          background: #000000 !important;
          color: #ffffff;
        }

        :root {
          --bg: #000000;
          --text: #ffffff;
          --muted: #9a9a9a;
          --stat: #d8d8d8;
          --border: rgba(255, 255, 255, 0.16);
          --border-soft: rgba(255, 255, 255, 0.12);

          --logo: 15.5px;
          --logo-mark: 22px;
          --nav: 14px;
          --nav-h: 40px;
          --btn: 13.5px;
          --btn-h: 40px;
          --hero-btn-h: 42px;
          --h1: 48px;
          --lede: 15.5px;
          --badge: 12.5px;
          --stat-size: 13.5px;
          --header-y: 22px;
          --header-x: 40px;
          --stats-x: 72px;
          --stats-y: 36px;
          --hero-gap: 85px;
          --copy-max: 860px;
          --lede-max: 470px;
        }

        .vesper-wrapper {
          background: #000000;
          color: #ffffff;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          overflow-x: hidden;
        }

        /* Background Layers */
        .vesper-wrapper .grain {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .vesper-wrapper .hero-photo {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(circle at 50% 35%, rgba(40, 45, 60, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
        }

        .vesper-wrapper .hero-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.8) 100%);
        }

        /* Page Grid */
        .vesper-wrapper .page {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: auto 1fr auto;
          min-height: 100vh;
          min-height: 100dvh;
        }

        /* Header — 3-column grid */
        .vesper-wrapper .header {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: var(--header-y) var(--header-x) 10px;
          z-index: 50;
          position: relative;
        }

        /* Logo (Left) */
        .vesper-wrapper .logo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          justify-self: start;
          font-size: var(--logo);
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #ffffff;
          cursor: pointer;
        }

        .vesper-wrapper .logo svg {
          width: var(--logo-mark);
          height: var(--logo-mark);
          flex-shrink: 0;
        }

        .vesper-wrapper .logo-suffix {
          font-weight: 400;
          opacity: 0.9;
        }

        /* Center Navigation — Liquid Metal Pills */
        .vesper-wrapper .nav {
          display: flex;
          align-items: center;
          gap: 8px;
          justify-self: center;
        }

        .vesper-wrapper .nav-link {
          height: var(--nav-h);
          padding: 0 18px;
          border-radius: 7px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(198, 198, 198, 0.55);
          background: linear-gradient(105deg, #050505 0%, #2a2a2a 48%, #4a4a4a 100%);
          color: #f3f3f3;
          font-size: var(--nav);
          font-weight: 400;
          letter-spacing: -0.01em;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .vesper-wrapper .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(255, 255, 255, 0.16) 50%, transparent 70%);
          transform: translateX(-120%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }

        .vesper-wrapper .nav-link:hover {
          border-color: rgba(235, 235, 235, 0.9);
          background: linear-gradient(105deg, #111111 0%, #3a3a3a 45%, #6a6a6a 100%);
          box-shadow: 0 0 18px rgba(200, 210, 230, 0.18);
        }

        .vesper-wrapper .nav-link:hover::before {
          transform: translateX(120%);
        }

        .vesper-wrapper .header-cta {
          justify-self: end;
        }

        /* Burger button (mobile) */
        .vesper-wrapper .burger {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: rgba(8, 8, 8, 0.55);
          z-index: 60;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          justify-self: end;
          transition: border-color 0.25s ease, background 0.25s ease;
        }

        .vesper-wrapper .burger:hover {
          border-color: rgba(255, 255, 255, 0.32);
          background: rgba(255, 255, 255, 0.05);
        }

        .vesper-wrapper .burger-bar {
          width: 16px;
          height: 1.5px;
          background: #ffffff;
          border-radius: 1px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }

        .vesper-wrapper.menu-open .burger .burger-bar:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .vesper-wrapper.menu-open .burger .burger-bar:nth-child(2) {
          opacity: 0;
        }
        .vesper-wrapper.menu-open .burger .burger-bar:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        .vesper-wrapper .menu-backdrop {
          display: none;
        }

        /* Buttons */
        .vesper-wrapper .btn {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: var(--btn-h);
          padding: 0 16px;
          border-radius: 6px;
          font-size: var(--btn);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, color 0.35s ease, filter 0.35s ease;
        }

        .vesper-wrapper .btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 48%, transparent 76%);
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
          z-index: 1;
        }

        .vesper-wrapper .btn:hover::after {
          transform: translateX(130%);
        }

        /* Solid Button */
        .vesper-wrapper .btn-solid {
          background: linear-gradient(180deg, #ffffff 0%, #e7e7e7 48%, #cfcfcf 100%);
          color: #111111;
          border: 1px solid #ffffff;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
        }

        .vesper-wrapper .btn-solid:hover {
          background: linear-gradient(180deg, #ffffff 0%, #f3f6ff 42%, #d5def2 100%);
          border-color: #f2f6ff;
          box-shadow: inset 0 1px 0 #ffffff, 0 0 22px rgba(186, 208, 255, 0.35), 0 8px 18px rgba(255, 255, 255, 0.12);
        }

        .vesper-wrapper .btn-hero.btn-solid:hover {
          box-shadow: inset 0 1px 0 #ffffff, 0 0 26px rgba(186, 208, 255, 0.4), 0 8px 18px rgba(255, 255, 255, 0.14);
        }

        /* Hero Ghost */
        .vesper-wrapper .btn-ghost-hero {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(0, 0, 0, 0.5) 46%, rgba(150, 170, 200, 0.1));
          color: #ffffff;
          border: 1px solid rgba(198, 198, 198, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }

        .vesper-wrapper .btn-ghost-hero:hover {
          border-color: rgba(220, 230, 255, 0.8);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 0 24px rgba(170, 200, 255, 0.28);
        }

        .vesper-wrapper .btn-hero {
          height: var(--hero-btn-h);
          padding: 0 18px;
        }

        /* Hero Section */
        .vesper-wrapper .hero {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 8px 24px var(--hero-gap);
          min-height: 0;
        }

        .vesper-wrapper .hero-copy {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: var(--copy-max);
          width: 100%;
        }

        /* Badge */
        .vesper-wrapper .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          padding: 9px 15px;
          border: 0;
          border-radius: 5px;
          background: linear-gradient(90deg, #7d7d7d 0%, #2a2a2a 52%, #0a0a0a 100%);
          color: #f2f2f2;
          font-size: var(--badge);
          font-weight: 400;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .vesper-wrapper .badge-star {
          width: 18px;
          height: 20px;
          flex-shrink: 0;
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.45));
        }

        /* H1 */
        .vesper-wrapper .hero-title {
          font-size: var(--h1);
          font-weight: 500;
          letter-spacing: -0.045em;
          line-height: 1.12;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .vesper-wrapper .headline-line {
          display: block;
          overflow: hidden;
          padding: 0.06em 0.15em 0.14em;
        }

        .vesper-wrapper .hero-title em {
          font-family: 'Instrument Serif', 'Times New Roman', Times, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.08em;
          letter-spacing: -0.03em;
          color: #9a9a9a;
        }

        /* Lede */
        .vesper-wrapper .lede {
          max-width: var(--lede-max);
          margin-top: 18px;
          color: #9a9a9a;
          font-size: var(--lede);
          font-weight: 400;
          line-height: 1.55;
          letter-spacing: -0.015em;
        }

        /* Hero Actions */
        .vesper-wrapper .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        /* Stats Footer */
        .vesper-wrapper .stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 0 var(--stats-x) var(--stats-y);
          padding-bottom: max(var(--stats-y), env(safe-area-inset-bottom));
          color: var(--stat, #d8d8d8);
          position: relative;
          z-index: 10;
        }

        .vesper-wrapper .stat {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-size: var(--stat-size);
          letter-spacing: -0.015em;
          white-space: nowrap;
        }

        .vesper-wrapper .stat svg:not(.stat-icon-wide) {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .vesper-wrapper .stat-icon-wide {
          width: 38px;
          height: 21px;
          flex-shrink: 0;
        }

        /* Motion System */
        .vesper-wrapper .appear {
          opacity: 1;
          animation-duration: 1.05s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-delay: var(--d, 0.08s);
        }

        .vesper-wrapper .appear--scale {
          animation-name: in-scale;
        }

        .vesper-wrapper .appear--soft {
          animation-name: in-soft;
        }

        .vesper-wrapper .lede.appear--soft {
          animation-duration: 1.25s;
        }

        .vesper-wrapper .appear--mask {
          animation-name: in-mask;
          display: inline-block;
        }

        .vesper-wrapper .appear--pop {
          animation-name: in-pop;
        }

        .vesper-wrapper .appear--btn {
          animation-name: in-btn;
        }

        .vesper-wrapper .appear--side {
          animation-name: in-side;
        }

        .vesper-wrapper .appear--stat {
          animation-name: in-stat;
        }

        .vesper-wrapper .badge-star {
          animation: in-star 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both;
        }

        .vesper-wrapper .hero-title em {
          animation: in-em 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.72s both;
        }

        .vesper-wrapper .appear.is-in,
        .vesper-wrapper .hero-photo.is-in {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          clip-path: none !important;
          filter: none !important;
        }

        @keyframes in-scale {
          0% { opacity: 0; transform: scale(0.84); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes in-soft {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes in-mask {
          0% { opacity: 0; transform: translateY(40%); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes in-pop {
          0% { opacity: 0; transform: scale(0.9); }
          70% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes in-btn {
          0% { opacity: 0; transform: translateY(18px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes in-side {
          0% { opacity: 0; transform: translateX(22px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes in-stat {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes in-star {
          0% { opacity: 0; transform: scale(0.2) rotate(-50deg); }
          65% { opacity: 1; transform: scale(1.2) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        @keyframes in-em {
          0% { opacity: 0.35; filter: blur(4px); }
          100% { opacity: 1; filter: blur(0px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vesper-wrapper *,
          .vesper-wrapper *::before,
          .vesper-wrapper *::after {
            animation: none !important;
            transition: none !important;
          }
          .vesper-wrapper .appear,
          .vesper-wrapper .hero-photo,
          .vesper-wrapper .hero h1 em,
          .vesper-wrapper .badge-star {
            opacity: 1 !important;
            transform: none !important;
            clip-path: none !important;
            filter: none !important;
          }
        }

        /* Desktop Lock >= 901px */
        @media (min-width: 901px) {
          html,
          body {
            height: 100%;
            overflow: hidden;
          }
          .vesper-wrapper .page {
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
          }
        }

        /* 1280px – 1599px */
        @media (min-width: 1280px) and (max-width: 1599px) {
          :root {
            --h1: 54px;
            --lede: 16px;
            --header-x: 48px;
            --stats-x: 80px;
            --copy-max: 900px;
          }
        }

        /* 901px – 1279px */
        @media (min-width: 901px) and (max-width: 1279px) {
          :root {
            --logo: 15px;
            --nav: 13px;
            --nav-h: 36px;
            --btn: 13px;
            --btn-h: 38px;
            --hero-btn-h: 40px;
            --h1: 42px;
            --lede: 15px;
            --badge: 12px;
            --stat-size: 12.5px;
            --header-y: 16px;
            --header-x: 28px;
            --stats-x: 36px;
            --stats-y: 28px;
            --hero-gap: 64px;
            --copy-max: 760px;
            --lede-max: 440px;
          }
          .vesper-wrapper .nav-link {
            padding: 0 14px;
          }
          .vesper-wrapper .badge {
            margin-bottom: 16px;
          }
          .vesper-wrapper .lede {
            margin-top: 14px;
          }
          .vesper-wrapper .hero-actions {
            margin-top: 20px;
          }
        }

        /* >= 1600px */
        @media (min-width: 1600px) {
          :root {
            --logo: 17px;
            --logo-mark: 24px;
            --nav: 15px;
            --nav-h: 44px;
            --btn: 15px;
            --btn-h: 44px;
            --hero-btn-h: 48px;
            --h1: 64px;
            --lede: 18px;
            --badge: 13.5px;
            --stat-size: 15px;
            --header-y: 28px;
            --header-x: 64px;
            --stats-x: 96px;
            --stats-y: 44px;
            --copy-max: 980px;
            --lede-max: 540px;
          }
          .vesper-wrapper .nav-link {
            padding: 0 20px;
          }
          .vesper-wrapper .badge {
            margin-bottom: 26px;
          }
          .vesper-wrapper .lede {
            margin-top: 22px;
          }
          .vesper-wrapper .hero-actions {
            margin-top: 30px;
            gap: 12px;
          }
          .vesper-wrapper .stat svg:not(.stat-icon-wide) {
            width: 22px;
            height: 22px;
          }
          .vesper-wrapper .stat-icon-wide {
            width: 45px;
            height: 24px;
          }
        }

        /* >= 1920px */
        @media (min-width: 1920px) {
          :root {
            --logo: 18px;
            --logo-mark: 26px;
            --nav: 16px;
            --nav-h: 48px;
            --btn: 16px;
            --btn-h: 48px;
            --hero-btn-h: 52px;
            --h1: 76px;
            --lede: 20px;
            --badge: 14.5px;
            --stat-size: 16px;
            --header-y: 32px;
            --header-x: 80px;
            --stats-x: 120px;
            --stats-y: 52px;
            --copy-max: 1120px;
            --lede-max: 620px;
          }
          .vesper-wrapper .nav {
            gap: 10px;
          }
          .vesper-wrapper .nav-link {
            padding: 0 22px;
          }
          .vesper-wrapper .btn {
            padding: 0 22px;
          }
          .vesper-wrapper .badge {
            padding: 10px 15px;
          }
          .vesper-wrapper .stat-icon-wide {
            width: 48px;
            height: 26px;
          }
        }

        /* >= 2560px */
        @media (min-width: 2560px) {
          :root {
            --h1: 88px;
            --lede: 22px;
            --header-x: 120px;
            --stats-x: 160px;
            --copy-max: 1280px;
            --lede-max: 680px;
          }
        }

        /* >= 901px and max-height 850px */
        @media (min-width: 901px) and (max-height: 850px) {
          :root {
            --header-y: 14px;
            --stats-y: 24px;
            --hero-gap: 48px;
            --h1: 40px;
          }
          .vesper-wrapper .badge {
            margin-bottom: 12px;
          }
          .vesper-wrapper .lede {
            margin-top: 12px;
          }
          .vesper-wrapper .hero-actions {
            margin-top: 16px;
          }
        }

        /* >= 901px and max-height 720px */
        @media (min-width: 901px) and (max-height: 720px) {
          :root {
            --h1: 34px;
            --lede: 14px;
            --hero-gap: 32px;
            --stats-y: 18px;
            --nav-h: 30px;
            --btn-h: 34px;
            --hero-btn-h: 36px;
          }
          .vesper-wrapper .badge {
            margin-bottom: 8px;
          }
        }

        /* Phone <= 900px */
        @media (max-width: 900px) {
          :root {
            --logo: 16px;
            --btn: 15px;
            --btn-h: 46px;
            --hero-btn-h: 48px;
            --h1: 36px;
            --lede: 16.5px;
            --badge: 13.5px;
            --stat-size: 15px;
            --header-y: 16px;
            --header-x: 18px;
            --stats-x: 20px;
            --stats-y: 28px;
            --hero-gap: 36px;
          }

          html,
          body {
            height: auto;
            overflow-y: auto;
          }

          .vesper-wrapper.menu-open {
            overflow: hidden;
          }

          .vesper-wrapper .header {
            grid-template-columns: 1fr auto auto;
            gap: 8px;
            padding-left: max(var(--header-x), env(safe-area-inset-left));
            padding-right: max(var(--header-x), env(safe-area-inset-right));
            padding-top: max(var(--header-y), env(safe-area-inset-top));
          }

          .vesper-wrapper .logo,
          .vesper-wrapper .header-cta,
          .vesper-wrapper .burger {
            z-index: 80;
          }

          .vesper-wrapper .burger {
            display: flex;
          }

          .vesper-wrapper .menu-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 40;
            background: rgba(8, 8, 8, 0.42);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.28s ease, visibility 0.28s ease;
          }

          .vesper-wrapper.menu-open .menu-backdrop {
            opacity: 1;
            visibility: visible;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }

          .vesper-wrapper #site-nav {
            display: flex;
            flex-direction: column;
            position: fixed;
            inset: 0;
            z-index: 45;
            background: transparent;
            justify-content: center;
            align-items: center;
            gap: 12px;
            padding: 96px 22px 32px;
            padding-top: max(96px, calc(env(safe-area-inset-top) + 88px));
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.28s ease, visibility 0.28s ease;
            pointer-events: none;
          }

          .vesper-wrapper.menu-open #site-nav {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
          }

          .vesper-wrapper #site-nav .nav-link {
            width: 100%;
            max-width: 320px;
            height: 56px;
            font-size: 19px;
            border-radius: 10px;
          }

          .vesper-wrapper .hero {
            padding: 20px 20px 64px;
            align-items: flex-end;
          }

          .vesper-wrapper .hero-copy,
          .vesper-wrapper .lede {
            max-width: 100%;
          }

          .vesper-wrapper .stats {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            white-space: normal;
          }
        }

        /* <= 560px */
        @media (max-width: 560px) {
          :root {
            --h1: 34px;
            --lede: 16px;
            --header-x: 16px;
          }
          .vesper-wrapper .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .vesper-wrapper .hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="grain" aria-hidden="true" />
      <div className="hero-photo" aria-hidden="true" />

      <div className="page">
        <div
          className="menu-backdrop"
          id="menu-backdrop"
          onClick={closeMenu}
        />

        {/* Header: 3-column grid */}
        <header className="header">
          {/* Left Logo */}
          <Link href="#top" className="logo appear appear--scale" style={{ '--d': '0.08s' }} aria-label="Vesper.ai">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" />
                <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <circle cx="16.7" cy="20.8" r="1.45" />
              </g>
            </svg>
            <span>
              Vesper<span className="logo-suffix">.ai</span>
            </span>
          </Link>

          {/* Center Nav */}
          <nav id="site-nav" className="nav" aria-label="Primary">
            <a href="#benefits" onClick={closeMenu} className="nav-link appear appear--scale" style={{ '--d': '0.16s' }}>
              Benefits
            </a>
            <a href="#how-it-works" onClick={closeMenu} className="nav-link appear appear--soft" style={{ '--d': '0.28s' }}>
              How It Works
            </a>
            <a href="#faqs" onClick={closeMenu} className="nav-link appear appear--scale" style={{ '--d': '0.40s' }}>
              FAQs
            </a>
            <a href="#pricing" onClick={closeMenu} className="nav-link appear appear--soft" style={{ '--d': '0.52s' }}>
              Pricing
            </a>
          </nav>

          {/* Right Header CTA */}
          <Link
            href={isAuthenticated ? '/catalog' : '/auth/signup'}
            className="btn btn-solid header-cta appear appear--scale"
            style={{ '--d': '0.34s' }}
          >
            Start for Free
          </Link>

          {/* Mobile Burger Button */}
          <button
            onClick={toggleMenu}
            className="burger appear appear--scale"
            style={{ '--d': '0.34s' }}
            aria-controls="site-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </header>

        {/* Main Hero (Bottom-centered) */}
        <main className="hero" id="top">
          <div className="hero-copy">
            {/* Badge */}
            <div className="badge appear appear--pop" style={{ '--d': '0.22s' }}>
              <svg className="badge-star" viewBox="0 0 24 24" fill="#ffffff" aria-hidden="true">
                <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
              </svg>
              <span>Operational AI Infrastructure</span>
            </div>

            {/* H1 Two Masked Lines */}
            <h1 className="hero-title">
              <span className="headline-line">
                <span className="appear appear--mask" style={{ '--d': '0.42s' }}>
                  Train <em>AI agents</em> on your
                </span>
              </span>
              <span className="headline-line">
                <span className="appear appear--mask" style={{ '--d': '0.62s' }}>
                  workflows in minutes.
                </span>
              </span>
            </h1>

            {/* Lede */}
            <p className="lede appear appear--soft" style={{ '--d': '0.82s' }}>
              Deploy adaptive AI agents that learn, execute, and scale operational tasks across your business.
            </p>

            {/* Actions */}
            <div className="hero-actions">
              <Link
                href={isAuthenticated ? '/catalog' : '/auth/signup'}
                className="btn btn-solid btn-hero appear appear--btn"
                style={{ '--d': '0.96s' }}
              >
                Start for Free
              </Link>
              <Link
                href="/catalog"
                className="btn btn-ghost-hero btn-hero appear appear--side"
                style={{ '--d': '1.10s' }}
              >
                See it in action
              </Link>
            </div>
          </div>
        </main>

        {/* Stats Footer */}
        <footer className="stats">
          {/* Stat 1 */}
          <div className="stat appear appear--stat" style={{ '--d': '1.12s' }}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="pill-g1" x1="3" y1="2" x2="14" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#3a3a3a" stopOpacity="0.62" />
                </linearGradient>
                <linearGradient id="pill-g2" x1="13" y1="2" x2="24" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.62" />
                </linearGradient>
              </defs>
              <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#pill-g1)" />
              <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#pill-g2)" />
              <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
            </svg>
            <span>4.2M+ workflows automated</span>
          </div>

          {/* Stat 2 */}
          <div className="stat appear appear--stat" style={{ '--d': '1.28s' }}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
              <path d="M12 7.1v7.4" stroke="#111111" strokeWidth="1.85" strokeLinecap="round" />
              <path
                d="M8.15 12.35L12 16.2l3.85-3.85"
                stroke="#111111"
                strokeWidth="1.85"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>92% reduction in manual operations</span>
          </div>

          {/* Stat 3 */}
          <div className="stat appear appear--stat" style={{ '--d': '1.44s' }}>
            <svg className="stat-icon-wide" viewBox="0 0 40 22" fill="none" aria-hidden="true">
              <g>
                <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
                <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
                <polygon points="8.2,5.2 6.5,8.2 9.5,8.2" fill="#2b2b2b" />
                <polygon points="12.2,5.2 10.9,8.2 13.9,8.2" fill="#2b2b2b" />
                <circle cx="9" cy="11.8" r="0.7" fill="#1a1a1a" />
                <circle cx="11.4" cy="11.8" r="0.7" fill="#1a1a1a" />
              </g>
              <g>
                <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
                <circle cx="17.8" cy="10" r="1.7" fill="#111111" />
                <circle cx="22.6" cy="10" r="1.7" fill="#111111" />
                <ellipse cx="20.2" cy="12.2" rx="0.9" ry="0.6" fill="#111111" />
                <path d="M18.6 13.8c.8.9 2.4.9 3.2 0" stroke="#111111" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              <g>
                <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
                <text
                  x="30.2"
                  y="15.1"
                  fontFamily="'Inter', sans-serif"
                  fontWeight="700"
                  fontSize="12.5"
                  fill="#ffffff"
                  textAnchor="middle"
                >
                  e
                </text>
              </g>
            </svg>
            <span>180+ operational teams onboarded</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
