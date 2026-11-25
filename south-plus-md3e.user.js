// ==UserScript==
// @name         South Plus MD3E — 南+ Material Design 3 Expressive
// @namespace    https://south-plus.net/md3e
// @version      1.0.0
// @description  将南+ (South Plus / North Plus 等镜像站) 全面重构为 Google Material Design 3 Expressive (MD3E) 视觉风格与现代交互操作逻辑
// @author       Jenision
// @homepageURL  https://github.com/Jenision/south-plus-md3e
// @supportURL   https://github.com/Jenision/south-plus-md3e/issues
// @updateURL    https://raw.githubusercontent.com/Jenision/south-plus-md3e/main/south-plus-md3e.user.js
// @downloadURL  https://raw.githubusercontent.com/Jenision/south-plus-md3e/main/south-plus-md3e.user.js
// @match        *://south-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.org/*
// @match        *://*.south-plus.org/*
// @match        *://north-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.east-plus.net/*
// @match        *://imoutolove.me/*
// @match        *://*.imoutolove.me/*
// @exclude      *://*/simple/*
// @exclude      *://*/rss.php*
// @exclude      *://*/pw_ajax.php*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  /* ============================================================================
   * 1. PERSISTENT PREFERENCES & THEME SYSTEM
   * ========================================================================== */

  const STORAGE_KEY = 'sp_md3e_prefs_v1';

  const DEFAULT_PREFS = {
    colorMode: 'auto', // 'auto' | 'light' | 'dark'
    palette: 'sakura', // 'sakura' | 'violet' | 'ocean' | 'matcha' | 'amber'
    railExpanded: false,
    cleanAds: true,
    density: 'comfortable', // 'comfortable' | 'compact'
    wallAspect: 'cover', // 'cover' | 'contain'
    fontSize: 'medium', // 'small' | 'medium' | 'large'
    wideMode: false,
    collapseNoticeByDefault: true,
    collapsePinnedByDefault: true,
    collapsedCategories: {},
    cachedForumTree: [],
    cachedUserProfile: null
  };

  const Store = {
    _cache: null,
    load() {
      if (this._cache) return this._cache;
      let parsed = {};
      try {
        if (typeof GM_getValue === 'function') {
          const raw = GM_getValue(STORAGE_KEY, '');
          if (raw) parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        }
      } catch (_) {}
      if (!parsed || Object.keys(parsed).length === 0) {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) parsed = JSON.parse(raw);
        } catch (_) {}
      }
      this._cache = Object.assign({}, DEFAULT_PREFS, parsed || {});
      return this._cache;
    },
    get(key) {
      return this.load()[key];
    },
    set(key, val) {
      const data = this.load();
      data[key] = val;
      try {
        const serialized = JSON.stringify(data);
        if (typeof GM_setValue === 'function') {
          GM_setValue(STORAGE_KEY, serialized);
        }
        localStorage.setItem(STORAGE_KEY, serialized);
      } catch (_) {}
      return val;
    }
  };

  const PALETTES = {
    sakura: {
      name: '樱粉 Expressive',
      swatch: '#B33B5F',
      light: {
        '--md-primary': '#B33B5F',
        '--md-on-primary': '#FFFFFF',
        '--md-primary-container': '#FFD9E1',
        '--md-on-primary-container': '#3F0018',
        '--md-secondary': '#75565E',
        '--md-on-secondary': '#FFFFFF',
        '--md-secondary-container': '#FFD9E1',
        '--md-on-secondary-container': '#2B151B',
        '--md-tertiary': '#7B5733',
        '--md-on-tertiary': '#FFFFFF',
        '--md-tertiary-container': '#FFDCBE',
        '--md-on-tertiary-container': '#2D1600',
        '--md-error': '#BA1A1A',
        '--md-on-error': '#FFFFFF',
        '--md-error-container': '#FFDAD6',
        '--md-on-error-container': '#410002',
        '--md-surface': '#FFF8F8',
        '--md-surface-dim': '#E7D6D8',
        '--md-surface-container-lowest': '#FFFFFF',
        '--md-surface-container-low': '#FDF0F2',
        '--md-surface-container': '#F7EAEC',
        '--md-surface-container-high': '#F1E4E6',
        '--md-surface-container-highest': '#EBDEE1',
        '--md-on-surface': '#22191B',
        '--md-on-surface-variant': '#524346',
        '--md-outline': '#847376',
        '--md-outline-variant': '#D6C2C5',
        '--md-inverse-surface': '#382E30',
        '--md-inverse-on-surface': '#FEEDEF',
        '--md-inverse-primary': '#FFB1C4',
        '--md-scrim': 'rgba(34, 25, 27, 0.42)'
      },
      dark: {
        '--md-primary': '#FFB1C4',
        '--md-on-primary': '#66002A',
        '--md-primary-container': '#901E44',
        '--md-on-primary-container': '#FFD9E1',
        '--md-secondary': '#E4BDC5',
        '--md-on-secondary': '#432930',
        '--md-secondary-container': '#5B3F46',
        '--md-on-secondary-container': '#FFD9E1',
        '--md-tertiary': '#EEBD92',
        '--md-on-tertiary': '#472A0A',
        '--md-tertiary-container': '#60401E',
        '--md-on-tertiary-container': '#FFDCBE',
        '--md-error': '#FFB4AB',
        '--md-on-error': '#690005',
        '--md-error-container': '#93000A',
        '--md-on-error-container': '#FFDAD6',
        '--md-surface': '#191113',
        '--md-surface-dim': '#140C0E',
        '--md-surface-container-lowest': '#130C0E',
        '--md-surface-container-low': '#22191B',
        '--md-surface-container': '#261D1F',
        '--md-surface-container-high': '#31272A',
        '--md-surface-container-highest': '#3C3234',
        '--md-on-surface': '#F0DEE0',
        '--md-on-surface-variant': '#D6C2C5',
        '--md-outline': '#9F8C90',
        '--md-outline-variant': '#524346',
        '--md-inverse-surface': '#F0DEE0',
        '--md-inverse-on-surface': '#382E30',
        '--md-inverse-primary': '#B33B5F',
        '--md-scrim': 'rgba(0, 0, 0, 0.62)'
      }
    },
    violet: {
      name: '电光紫 M3',
      swatch: '#6750A4',
      light: {
        '--md-primary': '#6750A4',
        '--md-on-primary': '#FFFFFF',
        '--md-primary-container': '#EADDFF',
        '--md-on-primary-container': '#21005D',
        '--md-secondary': '#625B71',
        '--md-on-secondary': '#FFFFFF',
        '--md-secondary-container': '#E8DEF8',
        '--md-on-secondary-container': '#1D192B',
        '--md-tertiary': '#7D5260',
        '--md-on-tertiary': '#FFFFFF',
        '--md-tertiary-container': '#FFD8E4',
        '--md-on-tertiary-container': '#31111D',
        '--md-error': '#B3261E',
        '--md-on-error': '#FFFFFF',
        '--md-error-container': '#F9DEDC',
        '--md-on-error-container': '#410E0B',
        '--md-surface': '#FEF7FF',
        '--md-surface-dim': '#DED8E1',
        '--md-surface-container-lowest': '#FFFFFF',
        '--md-surface-container-low': '#F7F2FA',
        '--md-surface-container': '#F3EDF7',
        '--md-surface-container-high': '#ECE6F0',
        '--md-surface-container-highest': '#E6E0E9',
        '--md-on-surface': '#1D1B20',
        '--md-on-surface-variant': '#49454F',
        '--md-outline': '#79747E',
        '--md-outline-variant': '#CAC4D0',
        '--md-inverse-surface': '#322F35',
        '--md-inverse-on-surface': '#F5EFF7',
        '--md-inverse-primary': '#D0BCFF',
        '--md-scrim': 'rgba(29, 27, 32, 0.42)'
      },
      dark: {
        '--md-primary': '#D0BCFF',
        '--md-on-primary': '#381E72',
        '--md-primary-container': '#4F378B',
        '--md-on-primary-container': '#EADDFF',
        '--md-secondary': '#CCC2DC',
        '--md-on-secondary': '#332D41',
        '--md-secondary-container': '#4A4458',
        '--md-on-secondary-container': '#E8DEF8',
        '--md-tertiary': '#EFB8C8',
        '--md-on-tertiary': '#492532',
        '--md-tertiary-container': '#633B48',
        '--md-on-tertiary-container': '#FFD8E4',
        '--md-error': '#F2B8B5',
        '--md-on-error': '#601410',
        '--md-error-container': '#8C1D18',
        '--md-on-error-container': '#F9DEDC',
        '--md-surface': '#141218',
        '--md-surface-dim': '#0F0D13',
        '--md-surface-container-lowest': '#0F0D13',
        '--md-surface-container-low': '#1D1B20',
        '--md-surface-container': '#211F26',
        '--md-surface-container-high': '#2B2930',
        '--md-surface-container-highest': '#36343B',
        '--md-on-surface': '#E6E0E9',
        '--md-on-surface-variant': '#CAC4D0',
        '--md-outline': '#938F99',
        '--md-outline-variant': '#49454F',
        '--md-inverse-surface': '#E6E0E9',
        '--md-inverse-on-surface': '#322F35',
        '--md-inverse-primary': '#6750A4',
        '--md-scrim': 'rgba(0, 0, 0, 0.62)'
      }
    },
    ocean: {
      name: '钴蓝 Pixel',
      swatch: '#0061A4',
      light: {
        '--md-primary': '#0061A4',
        '--md-on-primary': '#FFFFFF',
        '--md-primary-container': '#D1E4FF',
        '--md-on-primary-container': '#001D36',
        '--md-secondary': '#535F70',
        '--md-on-secondary': '#FFFFFF',
        '--md-secondary-container': '#D7E3F7',
        '--md-on-secondary-container': '#101C2B',
        '--md-tertiary': '#6B5778',
        '--md-on-tertiary': '#FFFFFF',
        '--md-tertiary-container': '#F2DAFF',
        '--md-on-tertiary-container': '#251431',
        '--md-error': '#BA1A1A',
        '--md-on-error': '#FFFFFF',
        '--md-error-container': '#FFDAD6',
        '--md-on-error-container': '#410002',
        '--md-surface': '#F8F9FF',
        '--md-surface-dim': '#D8DAE0',
        '--md-surface-container-lowest': '#FFFFFF',
        '--md-surface-container-low': '#F2F3FA',
        '--md-surface-container': '#ECEEF4',
        '--md-surface-container-high': '#E6E8EE',
        '--md-surface-container-highest': '#E0E2E8',
        '--md-on-surface': '#191C20',
        '--md-on-surface-variant': '#43474E',
        '--md-outline': '#73777F',
        '--md-outline-variant': '#C3C7CF',
        '--md-inverse-surface': '#2E3135',
        '--md-inverse-on-surface': '#EFF0F7',
        '--md-inverse-primary': '#9ECAFF',
        '--md-scrim': 'rgba(25, 28, 32, 0.42)'
      },
      dark: {
        '--md-primary': '#9ECAFF',
        '--md-on-primary': '#003258',
        '--md-primary-container': '#00497D',
        '--md-on-primary-container': '#D1E4FF',
        '--md-secondary': '#BBC7DB',
        '--md-on-secondary': '#253140',
        '--md-secondary-container': '#3B4858',
        '--md-on-secondary-container': '#D7E3F7',
        '--md-tertiary': '#D6BEE4',
        '--md-on-tertiary': '#3B2948',
        '--md-tertiary-container': '#523F5F',
        '--md-on-tertiary-container': '#F2DAFF',
        '--md-error': '#FFB4AB',
        '--md-on-error': '#690005',
        '--md-error-container': '#93000A',
        '--md-on-error-container': '#FFDAD6',
        '--md-surface': '#111318',
        '--md-surface-dim': '#0C0E13',
        '--md-surface-container-lowest': '#0C0E13',
        '--md-surface-container-low': '#191C20',
        '--md-surface-container': '#1D2024',
        '--md-surface-container-high': '#282A2F',
        '--md-surface-container-highest': '#33353A',
        '--md-on-surface': '#E2E2E9',
        '--md-on-surface-variant': '#C3C7CF',
        '--md-outline': '#8D9199',
        '--md-outline-variant': '#43474E',
        '--md-inverse-surface': '#E2E2E9',
        '--md-inverse-on-surface': '#2E3135',
        '--md-inverse-primary': '#0061A4',
        '--md-scrim': 'rgba(0, 0, 0, 0.62)'
      }
    },
    matcha: {
      name: '青柠茶绿',
      swatch: '#386A20',
      light: {
        '--md-primary': '#386A20',
        '--md-on-primary': '#FFFFFF',
        '--md-primary-container': '#B8F397',
        '--md-on-primary-container': '#072100',
        '--md-secondary': '#55624C',
        '--md-on-secondary': '#FFFFFF',
        '--md-secondary-container': '#D9E7CB',
        '--md-on-secondary-container': '#131F0D',
        '--md-tertiary': '#386666',
        '--md-on-tertiary': '#FFFFFF',
        '--md-tertiary-container': '#BBEBEB',
        '--md-on-tertiary-container': '#002020',
        '--md-error': '#BA1A1A',
        '--md-on-error': '#FFFFFF',
        '--md-error-container': '#FFDAD6',
        '--md-on-error-container': '#410002',
        '--md-surface': '#F8FAF0',
        '--md-surface-dim': '#D8DBD1',
        '--md-surface-container-lowest': '#FFFFFF',
        '--md-surface-container-low': '#F2F5EA',
        '--md-surface-container': '#ECEFE5',
        '--md-surface-container-high': '#E6E9DF',
        '--md-surface-container-highest': '#E0E4D9',
        '--md-on-surface': '#191D16',
        '--md-on-surface-variant': '#43483E',
        '--md-outline': '#74796D',
        '--md-outline-variant': '#C3C8BB',
        '--md-inverse-surface': '#2E312B',
        '--md-inverse-on-surface': '#EFF2E7',
        '--md-inverse-primary': '#9CD67E',
        '--md-scrim': 'rgba(25, 29, 22, 0.42)'
      },
      dark: {
        '--md-primary': '#9CD67E',
        '--md-on-primary': '#113800',
        '--md-primary-container': '#205107',
        '--md-on-primary-container': '#B8F397',
        '--md-secondary': '#BDCBB0',
        '--md-on-secondary': '#283420',
        '--md-secondary-container': '#3E4A35',
        '--md-on-secondary-container': '#D9E7CB',
        '--md-tertiary': '#A0CFCF',
        '--md-on-tertiary': '#003737',
        '--md-tertiary-container': '#1E4E4E',
        '--md-on-tertiary-container': '#BBEBEB',
        '--md-error': '#FFB4AB',
        '--md-on-error': '#690005',
        '--md-error-container': '#93000A',
        '--md-on-error-container': '#FFDAD6',
        '--md-surface': '#11140E',
        '--md-surface-dim': '#0C0F0A',
        '--md-surface-container-lowest': '#0C0F0A',
        '--md-surface-container-low': '#191D16',
        '--md-surface-container': '#1D211A',
        '--md-surface-container-high': '#282B24',
        '--md-surface-container-highest': '#32362F',
        '--md-on-surface': '#E1E4D9',
        '--md-on-surface-variant': '#C3C8BB',
        '--md-outline': '#8D9286',
        '--md-outline-variant': '#43483E',
        '--md-inverse-surface': '#E1E4D9',
        '--md-inverse-on-surface': '#2E312B',
        '--md-inverse-primary': '#386A20',
        '--md-scrim': 'rgba(0, 0, 0, 0.62)'
      }
    },
    amber: {
      name: '落日琥珀',
      swatch: '#904D00',
      light: {
        '--md-primary': '#904D00',
        '--md-on-primary': '#FFFFFF',
        '--md-primary-container': '#FFDCC0',
        '--md-on-primary-container': '#2E1500',
        '--md-secondary': '#745944',
        '--md-on-secondary': '#FFFFFF',
        '--md-secondary-container': '#FFDCC0',
        '--md-on-secondary-container': '#2A1707',
        '--md-tertiary': '#5B6237',
        '--md-on-tertiary': '#FFFFFF',
        '--md-tertiary-container': '#E0E7B1',
        '--md-on-tertiary-container': '#191E00',
        '--md-error': '#BA1A1A',
        '--md-on-error': '#FFFFFF',
        '--md-error-container': '#FFDAD6',
        '--md-on-error-container': '#410002',
        '--md-surface': '#FFF8F5',
        '--md-surface-dim': '#E6D7CE',
        '--md-surface-container-lowest': '#FFFFFF',
        '--md-surface-container-low': '#FDF1EB',
        '--md-surface-container': '#F7EBE5',
        '--md-surface-container-high': '#F1E5DF',
        '--md-surface-container-highest': '#EBE0DA',
        '--md-on-surface': '#221A14',
        '--md-on-surface-variant': '#51443B',
        '--md-outline': '#84746A',
        '--md-outline-variant': '#D6C3B7',
        '--md-inverse-surface': '#382E28',
        '--md-inverse-on-surface': '#FFEDE3',
        '--md-inverse-primary': '#FFB779',
        '--md-scrim': 'rgba(34, 26, 20, 0.42)'
      },
      dark: {
        '--md-primary': '#FFB779',
        '--md-on-primary': '#4D2600',
        '--md-primary-container': '#6D3900',
        '--md-on-primary-container': '#FFDCC0',
        '--md-secondary': '#E3C0A5',
        '--md-on-secondary': '#422C19',
        '--md-secondary-container': '#5A422E',
        '--md-on-secondary-container': '#FFDCC0',
        '--md-tertiary': '#C4CB97',
        '--md-on-tertiary': '#2D330D',
        '--md-tertiary-container': '#434A22',
        '--md-on-tertiary-container': '#E0E7B1',
        '--md-error': '#FFB4AB',
        '--md-on-error': '#690005',
        '--md-error-container': '#93000A',
        '--md-on-error-container': '#FFDAD6',
        '--md-surface': '#19120D',
        '--md-surface-dim': '#140D08',
        '--md-surface-container-lowest': '#140D08',
        '--md-surface-container-low': '#221A14',
        '--md-surface-container': '#261E18',
        '--md-surface-container-high': '#312822',
        '--md-surface-container-highest': '#3C332C',
        '--md-on-surface': '#F0DFD6',
        '--md-on-surface-variant': '#D6C3B7',
        '--md-outline': '#9E8E83',
        '--md-outline-variant': '#51443B',
        '--md-inverse-surface': '#F0DFD6',
        '--md-inverse-on-surface': '#382E28',
        '--md-inverse-primary': '#904D00',
        '--md-scrim': 'rgba(0, 0, 0, 0.62)'
      }
    }
  };

  function resolveThemeMode() {
    const mode = Store.get('colorMode');
    if (mode === 'light' || mode === 'dark') return mode;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyThemeTokens() {
    const root = document.documentElement;
    const paletteKey = PALETTES[Store.get('palette')] ? Store.get('palette') : 'sakura';
    const mode = resolveThemeMode();
    const tokens = PALETTES[paletteKey][mode];
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-palette', paletteKey);
    root.setAttribute('data-density', Store.get('density') || 'comfortable');
    root.setAttribute('data-fontsize', Store.get('fontSize') || 'medium');
    root.setAttribute('data-wide', Store.get('wideMode') ? 'true' : 'false');
    Object.keys(tokens).forEach((k) => {
      root.style.setProperty(k, tokens[k]);
    });
  }

  /* ============================================================================
   * 2. MATERIAL SYMBOLS ROUNDED INLINE SVG ICON SYSTEM (ZERO EXTERNAL CDN)
   * ========================================================================== */

  const ICONS = {
    menu: '<path d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1z"/>',
    menu_open: '<path d="M4 18h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zm0-5h8c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm17.3 7.88L17.42 12l2.88-2.88a.996.996 0 1 0-1.41-1.41L15.3 11.3a.996.996 0 0 0 0 1.41l3.59 3.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42z"/>',
    home: '<path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z"/>',
    forum: '<path d="M20 6h-1v8c0 .55-.45 1-1 1H6v1c0 1.1.9 2 2 2h10l4 4V8c0-1.1-.9-2-2-2zm-3 5V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v13l4-4h9c1.1 0 2-.9 2-2z"/>',
    apps: '<path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>',
    search: '<path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
    task: '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-1.71 13.71l-3.59-3.59a.996.996 0 1 1 1.41-1.41L11 14.59l5.29-5.3a.996.996 0 1 1 1.41 1.41l-6 6c-.39.39-1.02.39-1.41.01z"/>',
    mail: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44z"/>',
    person: '<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/>',
    block: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 0 1 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0 1 20 12c0 4.42-3.58 8-8 8z"/>',
    palette: '<path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
    dark_mode: '<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>',
    light_mode: '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>',
    settings: '<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>',
    edit: '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
    reply: '<path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/>',
    quote: '<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>',
    bookmark: '<path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>',
    bookmark_filled: '<path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>',
    star: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
    list: '<path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zm0-6h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1s.45 1 1 1zM7 6c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1z"/>',
    grid: '<path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>',
    push_pin: '<path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>',
    lock: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>',
    campaign: '<path d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"/>',
    chevron_down: '<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>',
    chevron_right: '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>',
    chevron_left: '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>',
    arrow_up: '<path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/>',
    more_vert: '<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
    close: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
    rss: '<circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>',
    image: '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
    zip: '<path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-4 10h-2v-2h2v2zm0-4h-2v-2h2v2zm-2-4h-2V6h2v2zm2 0h-2v2h2V8z"/>',
    poll: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
    bolt: '<path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>',
    copy: '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>',
    open_new: '<path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>',
    zoom_in: '<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2V7z"/>',
    coins: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>',
    history: '<path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>',
    print: '<path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>',
    logout: '<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>',
    layers: '<path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"/>',
    filter: '<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>',
    snow: '<path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/>',
    check: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
    eye: '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>',
    send: '<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>',
    aspect: '<path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/>',
    refresh: '<path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>'
  };

  function icon(name, cls = '') {
    const path = ICONS[name] || ICONS.apps;
    return `<svg class="m3-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  }

  const BRAND_LOGO_SVG = `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="2" width="28" height="28" rx="10" fill="var(--md-primary)"/>
    <path d="M16 7.2L17.9 12.1L22.8 14L17.9 15.9L16 20.8L14.1 15.9L9.2 14L14.1 12.1L16 7.2Z" fill="var(--md-on-primary)"/>
    <circle cx="22.5" cy="22.5" r="4.8" fill="var(--md-tertiary-container)"/>
    <path d="M22.5 20.2V24.8M20.2 22.5H24.8" stroke="var(--md-on-tertiary-container)" stroke-width="1.9" stroke-linecap="round"/>
  </svg>`;

  /* ============================================================================
   * 3. EXPRESSIVE MD3E STYLESHEET (INJECTED EARLY)
   * ========================================================================== */

  const CSS_TEXT = `
/* Anti-FOUC guard */
html.sp-md3e-loading body {
  opacity: 0 !important;
}
html.sp-md3e-ready body {
  opacity: 1 !important;
  transition: opacity 220ms cubic-bezier(0.31, 0.94, 0.34, 1);
}

:root {
  --md-font-sans: "Google Sans", "Plus Jakarta Sans", "HarmonyOS Sans SC", "MiSans", "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", system-ui, -apple-system, sans-serif;
  --md-font-mono: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
  --md-spring-spatial: cubic-bezier(0.38, 1.21, 0.22, 1);
  --md-spring-fast: cubic-bezier(0.34, 1.28, 0.24, 1);
  --md-spring-effects: cubic-bezier(0.31, 0.94, 0.34, 1);
  --md-elev-1: 0 1px 3px 1px rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --md-elev-2: 0 2px 6px 2px rgba(0, 0, 0, 0.09), 0 1px 2px 0 rgba(0, 0, 0, 0.07);
  --md-elev-3: 0 6px 16px 4px rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  --md-rail-w: 80px;
  --md-topbar-h: 68px;
  --md-content-max: 1220px;
  --md-row-pad-y: 12px;
  --md-card-pad: 18px;
}

html[data-wide="true"] {
  --md-content-max: 1520px;
}
html[data-density="compact"] {
  --md-row-pad-y: 8px;
  --md-card-pad: 14px;
}
html[data-theme="dark"] {
  --md-elev-1: 0 1px 3px 1px rgba(0, 0, 0, 0.36), 0 1px 2px 0 rgba(0, 0, 0, 0.28);
  --md-elev-2: 0 3px 8px 2px rgba(0, 0, 0, 0.44), 0 1px 3px 0 rgba(0, 0, 0, 0.32);
  --md-elev-3: 0 8px 24px 6px rgba(0, 0, 0, 0.56), 0 2px 6px 0 rgba(0, 0, 0, 0.38);
}

/* Global reset & base */
html, body {
  background: var(--md-surface) !important;
  background-image: none !important;
  color: var(--md-on-surface) !important;
  font-family: var(--md-font-sans) !important;
  font-size: 14px !important;
  line-height: 1.55 !important;
  margin: 0 !important;
  padding: 0 !important;
  -webkit-font-smoothing: antialiased;
}
*, *::before, *::after {
  box-sizing: border-box;
}
a {
  color: var(--md-primary);
  text-decoration: none;
  transition: color 180ms var(--md-spring-effects);
}
a:hover {
  color: var(--md-primary);
  text-decoration: underline;
}

/* Hide legacy chrome visually while keeping DOM anchors/menus alive */
html.sp-md3e-ready #toptool,
html.sp-md3e-ready #wrapA > #header,
html.sp-md3e-ready #footer,
html.sp-md3e-ready #bottom,
html.sp-md3e-ready center.hidden-md.hidden-lg {
  display: none !important;
}
html.sp-md3e-ready #wrapA {
  display: none !important;
}

/* Legacy font color overrides in Dark Mode */
html[data-theme="dark"] #sp-md3e-shell font[color="#000000"],
html[data-theme="dark"] #sp-md3e-shell font[color="black"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#000000"],
html[data-theme="dark"] #sp-md3e-shell [style*="color: #000000"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:black"] {
  color: var(--md-on-surface) !important;
}
html[data-theme="dark"] #sp-md3e-shell font[color="#FF0000"],
html[data-theme="dark"] #sp-md3e-shell font[color="red"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#FF0000"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#ff0000"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:red"] {
  color: var(--md-error) !important;
}
html[data-theme="dark"] #sp-md3e-shell font[color="#0000FF"],
html[data-theme="dark"] #sp-md3e-shell font[color="#0064FF"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#0000FF"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#0064FF"] {
  color: var(--md-primary) !important;
}
html[data-theme="dark"] #sp-md3e-shell font[color="#FF00FF"],
html[data-theme="dark"] #sp-md3e-shell font[color="#FF1493"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#FF00FF"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#D200D2"],
html[data-theme="dark"] #sp-md3e-shell [style*="color:#6633cc"] {
  color: var(--md-tertiary) !important;
}
html[data-theme="dark"] #sp-md3e-shell [style*="color:#66cc00"] {
  color: #9CD67E !important;
}

/* Icons & Ripple */
.m3-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}
.m3-icon-lg {
  width: 24px;
  height: 24px;
}
.m3-ripple-host {
  position: relative;
  overflow: hidden;
}
.m3-ripple-ink {
  position: absolute;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.16;
  transform: scale(0);
  animation: m3-ripple-anim 520ms var(--md-spring-effects) forwards;
  pointer-events: none;
}
@keyframes m3-ripple-anim {
  to {
    transform: scale(2.8);
    opacity: 0;
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--md-outline-variant);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover { background: var(--md-outline); }

/* ============================================================================
 * APP SHELL LAYOUT (RAIL + TOPBAR + WORKSPACE)
 * ========================================================================== */
#sp-md3e-shell {
  display: flex;
  min-height: 100vh;
  background: var(--md-surface);
  color: var(--md-on-surface);
}
#sp-md3e-shell.rail-expanded {
  --md-rail-w: 248px;
}

/* Navigation Rail */
.m3-rail {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--md-rail-w);
  background: var(--md-surface-container-low);
  border-right: 1px solid var(--md-outline-variant);
  display: flex;
  flex-direction: column;
  padding: 12px 10px 16px;
  z-index: 400;
  transition: width 320ms var(--md-spring-spatial), transform 300ms var(--md-spring-spatial);
  user-select: none;
}
.m3-rail-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
#sp-md3e-shell.rail-expanded .m3-rail-top {
  align-items: stretch;
}
.m3-rail-toggle-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 44px;
}
#sp-md3e-shell.rail-expanded .m3-rail-toggle-row {
  justify-content: flex-start;
  padding: 0 6px;
}
.m3-rail-brand-text {
  display: none;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: var(--md-on-surface);
}
#sp-md3e-shell.rail-expanded .m3-rail-brand-text {
  display: inline-flex;
}
.m3-rail-brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}
.m3-rail-brand-mark svg {
  width: 24px;
  height: 24px;
  display: block;
}

.m3-rail-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 52px;
  width: 52px;
  border-radius: 18px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: var(--md-elev-1);
  transition: all 260ms var(--md-spring-fast);
  text-decoration: none !important;
}
#sp-md3e-shell.rail-expanded .m3-rail-fab {
  width: 100%;
  padding: 0 18px;
  justify-content: flex-start;
}
.m3-rail-fab:hover {
  box-shadow: var(--md-elev-2);
  transform: translateY(-1px);
}
.m3-rail-fab:active {
  border-radius: 12px;
  transform: scale(0.96);
}
.m3-rail-fab-label {
  display: none;
  white-space: nowrap;
}
#sp-md3e-shell.rail-expanded .m3-rail-fab-label {
  display: inline;
}

.m3-rail-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}
.m3-rail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 4px 2px;
  border: none;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  text-decoration: none !important;
  border-radius: 16px;
  transition: color 200ms var(--md-spring-effects);
  position: relative;
}
#sp-md3e-shell.rail-expanded .m3-rail-item {
  flex-direction: row;
  justify-content: flex-start;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 9999px;
}
.m3-rail-pill {
  width: 56px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 260ms var(--md-spring-fast);
  position: relative;
}
#sp-md3e-shell.rail-expanded .m3-rail-pill {
  width: auto;
  height: auto;
  background: transparent !important;
}
.m3-rail-item:hover .m3-rail-pill {
  background: var(--md-surface-container-highest);
}
#sp-md3e-shell.rail-expanded .m3-rail-item:hover {
  background: var(--md-surface-container-highest);
}
.m3-rail-item.is-active {
  color: var(--md-on-secondary-container);
  font-weight: 600;
}
.m3-rail-item.is-active .m3-rail-pill {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}
#sp-md3e-shell.rail-expanded .m3-rail-item.is-active {
  background: var(--md-secondary-container);
}
.m3-rail-label {
  font-size: 11px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70px;
}
#sp-md3e-shell.rail-expanded .m3-rail-label {
  font-size: 14px;
  max-width: none;
}
.m3-unread-dot {
  position: absolute;
  top: 4px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--md-error);
  box-shadow: 0 0 0 2px var(--md-surface-container-low);
}
#sp-md3e-shell.rail-expanded .m3-unread-dot {
  position: static;
  margin-left: auto;
}

.m3-rail-bottom {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--md-outline-variant);
}

/* Main workspace column */
.m3-workspace {
  flex: 1;
  margin-left: var(--md-rail-w);
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: margin-left 320ms var(--md-spring-spatial);
}

/* Top App Bar */
.m3-topbar {
  position: sticky;
  top: 0;
  z-index: 350;
  min-height: var(--md-topbar-h);
  padding: 10px 24px;
  background: color-mix(in srgb, var(--md-surface) 88%, transparent);
  backdrop-filter: blur(18px) saturate(1.25);
  -webkit-backdrop-filter: blur(18px) saturate(1.25);
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 65%, transparent);
  display: flex;
  align-items: center;
  gap: 14px;
}
.m3-mobile-menu-btn {
  display: none !important;
}
.m3-brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 40px;
  padding: 0 14px 0 6px;
  border-radius: 9999px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  font-weight: 700;
  font-size: 14.5px;
  letter-spacing: 0.01em;
  white-space: nowrap;
  text-decoration: none !important;
  transition: transform 240ms var(--md-spring-fast), background 200ms var(--md-spring-effects), border-color 200ms var(--md-spring-effects);
}
.m3-brand-pill:hover {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  border-color: color-mix(in srgb, var(--md-primary) 38%, transparent);
  transform: translateY(-1px);
}
.m3-brand-pill:hover .m3-brand-mark svg {
  transform: scale(1.06) rotate(-4deg);
}
.m3-brand-mark {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.m3-brand-mark svg {
  width: 30px;
  height: 30px;
  display: block;
  transition: transform 260ms var(--md-spring-spatial);
}
.m3-brand-name {
  line-height: 1;
}

.m3-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  overflow: hidden;
  flex-shrink: 1;
}
.m3-crumb {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none !important;
}
.m3-crumb:hover {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.m3-crumb.is-current {
  color: var(--md-on-surface);
  font-weight: 600;
  background: var(--md-surface-container);
}
.m3-crumb-sep {
  color: var(--md-outline);
  display: inline-flex;
}

/* Docked Pill Search Bar */
.m3-search-pill {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  min-width: 220px;
  max-width: 380px;
  flex: 1;
  padding: 0 8px 0 14px;
  border-radius: 9999px;
  background: var(--md-surface-container-high);
  border: 1px solid transparent;
  transition: all 240ms var(--md-spring-fast);
}
.m3-search-pill:focus-within {
  background: var(--md-surface-container-lowest);
  border-color: var(--md-primary);
  box-shadow: var(--md-elev-1);
}
.m3-search-pill input {
  border: none !important;
  background: transparent !important;
  outline: none !important;
  color: var(--md-on-surface) !important;
  font-family: var(--md-font-sans) !important;
  font-size: 13.5px !important;
  width: 100%;
  min-width: 0;
  padding: 0 !important;
  margin: 0 !important;
}
.m3-search-pill input::placeholder {
  color: var(--md-on-surface-variant);
}
.m3-kbd {
  font-family: var(--md-font-mono);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
  border: 1px solid var(--md-outline-variant);
  flex-shrink: 0;
}

.m3-topbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.m3-user-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 4px 12px 4px 4px;
  border-radius: 9999px;
  background: var(--md-surface-container);
  border: 1px solid var(--md-outline-variant);
  color: var(--md-on-surface);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 220ms var(--md-spring-fast);
}
.m3-user-chip:hover {
  background: var(--md-surface-container-high);
  box-shadow: var(--md-elev-1);
}
.m3-user-chip img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--md-surface-container-highest);
}
.m3-sp-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 9999px;
  background: var(--md-tertiary-container);
  color: var(--md-on-tertiary-container);
}

/* Main Content Area */
.m3-main {
  width: 100%;
  max-width: var(--md-content-max);
  margin: 0 auto;
  padding: 20px 24px 88px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.m3-footer {
  max-width: var(--md-content-max);
  width: 100%;
  margin: 0 auto;
  padding: 18px 24px 36px;
  color: var(--md-on-surface-variant);
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid var(--md-outline-variant);
}

/* ============================================================================
 * MD3E PRIMITIVES (BUTTONS, CHIPS, CARDS, SEGMENTED, GROUPED LISTS)
 * ========================================================================== */
.m3-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: none;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: all 220ms var(--md-spring-fast);
  text-decoration: none !important;
  flex-shrink: 0;
}
.m3-icon-btn:hover {
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface);
}
.m3-icon-btn:active {
  border-radius: 12px;
  transform: scale(0.94);
}
.m3-icon-btn.is-tonal {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}

.m3-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 20px;
  border-radius: 9999px;
  border: 1px solid transparent;
  font-family: var(--md-font-sans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none !important;
  white-space: nowrap;
  transition: all 250ms var(--md-spring-fast);
}
.m3-btn:active {
  border-radius: 12px;
  transform: scale(0.97);
}
.m3-btn-sm {
  height: 34px;
  padding: 0 14px;
  font-size: 12.5px;
}
.m3-btn-filled {
  background: var(--md-primary);
  color: var(--md-on-primary) !important;
  box-shadow: var(--md-elev-1);
}
.m3-btn-filled:hover {
  filter: brightness(1.06);
  box-shadow: var(--md-elev-2);
}
.m3-btn-tonal {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container) !important;
}
.m3-btn-tonal:hover {
  filter: brightness(0.96);
}
.m3-btn-outlined {
  background: transparent;
  border-color: var(--md-outline);
  color: var(--md-on-surface) !important;
}
.m3-btn-outlined:hover {
  background: var(--md-surface-container-high);
}
.m3-btn-text {
  background: transparent;
  color: var(--md-primary) !important;
  padding: 0 12px;
}
.m3-btn-text:hover {
  background: color-mix(in srgb, var(--md-primary) 10%, transparent);
}

/* Chips */
.m3-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 9999px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface-variant);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none !important;
  white-space: nowrap;
  transition: all 220ms var(--md-spring-fast);
}
.m3-chip:hover {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
}
.m3-chip:active {
  border-radius: 8px;
}
.m3-chip.is-selected {
  background: var(--md-secondary-container);
  border-color: transparent;
  color: var(--md-on-secondary-container);
  font-weight: 600;
}
.m3-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 9px;
  border-radius: 9999px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}
.m3-badge-primary { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.m3-badge-secondary { background: var(--md-secondary-container); color: var(--md-on-secondary-container); }
.m3-badge-tertiary { background: var(--md-tertiary-container); color: var(--md-on-tertiary-container); }
.m3-badge-error { background: var(--md-error-container); color: var(--md-on-error-container); }
.m3-badge-neutral { background: var(--md-surface-container-highest); color: var(--md-on-surface-variant); }

/* Connected Segmented Button Group (MD3E) */
.m3-segmented {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px;
  border-radius: 9999px;
  background: var(--md-surface-container-high);
}
.m3-seg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border: none;
  background: transparent;
  color: var(--md-on-surface-variant);
  font-family: var(--md-font-sans);
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none !important;
  white-space: nowrap;
  transition: all 240ms var(--md-spring-fast);
}
.m3-seg-btn:first-child { border-top-left-radius: 9999px; border-bottom-left-radius: 9999px; }
.m3-seg-btn:last-child { border-top-right-radius: 9999px; border-bottom-right-radius: 9999px; }
.m3-seg-btn:hover { background: var(--md-surface-container-highest); color: var(--md-on-surface); }
.m3-seg-btn.is-active {
  background: var(--md-primary);
  color: var(--md-on-primary) !important;
  border-radius: 9999px;
  box-shadow: var(--md-elev-1);
}

/* Expressive Cards */
.m3-card {
  background: var(--md-surface-container-low);
  border-radius: 24px;
  padding: var(--md-card-pad);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  transition: box-shadow 240ms var(--md-spring-effects), transform 240ms var(--md-spring-spatial);
}
.m3-card-elevated {
  background: var(--md-surface-container-lowest);
  box-shadow: var(--md-elev-1);
}
.m3-card-tonal {
  background: var(--md-surface-container);
  border-color: transparent;
}

/* MD3E Grouped List Pattern */
.m3-group-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.m3-group-item {
  background: var(--md-surface-container-low);
  padding: var(--md-row-pad-y) 18px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 42%, transparent);
  transition: background 180ms var(--md-spring-effects), border-radius 240ms var(--md-spring-fast), transform 240ms var(--md-spring-spatial);
}
.m3-group-item:first-child {
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}
.m3-group-item:last-child {
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
}
.m3-group-item:only-child {
  border-radius: 24px;
}
.m3-group-item:hover {
  background: var(--md-surface-container);
  border-radius: 16px;
}

/* Accordion / Collapsible Card */
.m3-accordion {
  background: var(--md-surface-container-low);
  border-radius: 24px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  overflow: hidden;
}
.m3-accordion-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  background: transparent;
  border: none;
  color: var(--md-on-surface);
  font-family: var(--md-font-sans);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: background 180ms var(--md-spring-effects);
}
.m3-accordion-head:hover {
  background: var(--md-surface-container);
}
.m3-accordion-chev {
  transition: transform 280ms var(--md-spring-fast);
}
.m3-accordion.is-collapsed .m3-accordion-chev {
  transform: rotate(-90deg);
}
.m3-accordion-body {
  padding: 4px 20px 18px;
}
.m3-accordion.is-collapsed .m3-accordion-body {
  display: none;
}

/* ============================================================================
 * INDEX PAGE
 * ========================================================================== */
.m3-pulse-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--md-primary-container) 0%, var(--md-surface-container) 100%);
  color: var(--md-on-surface);
}
.m3-pulse-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--md-on-primary-container);
  margin: 0 0 6px;
}
.m3-pulse-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12.5px;
  color: var(--md-on-surface-variant);
}
.m3-stat-pill {
  background: color-mix(in srgb, var(--md-surface-container-lowest) 78%, transparent);
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 600;
  color: var(--md-on-surface);
}

.m3-notice-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 20px;
  background: var(--md-tertiary-container);
  color: var(--md-on-tertiary-container);
}
.m3-notice-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  flex: 1;
}
.m3-notice-items a {
  color: var(--md-on-tertiary-container);
  font-weight: 600;
  font-size: 13px;
}

.m3-feeds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.m3-feeds-grid.is-single {
  grid-template-columns: 1fr;
}
.m3-feed-box {
  background: var(--md-surface-container-lowest);
  border-radius: 18px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.m3-feed-box-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.m3-feed-box-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--md-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}
.m3-feed-box-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--md-on-surface);
}
.m3-feeds-grid.is-single .m3-feed-box-body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 14px;
}
@media (max-width: 720px) {
  .m3-feeds-grid.is-single .m3-feed-box-body {
    grid-template-columns: 1fr;
  }
}
.m3-feed-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 12px;
  color: var(--md-on-surface) !important;
  text-decoration: none !important;
  transition: background 180ms var(--md-spring-effects);
  min-width: 0;
}
.m3-feed-item:hover {
  background: var(--md-surface-container);
  color: var(--md-primary) !important;
}
.m3-feed-num {
  font-family: var(--md-font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--md-primary);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.m3-feed-item-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.m3-feeds-grid.is-single .m3-feed-item-title {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.m3-feed-item-meta {
  font-size: 11.5px;
  color: var(--md-on-surface-variant);
  flex-shrink: 0;
}
.m3-feed-box-foot {
  margin-top: auto;
  padding-top: 6px;
  border-top: 1px dashed var(--md-outline-variant);
  display: flex;
  justify-content: flex-end;
}
.m3-feed-skeleton {
  height: 32px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    var(--md-surface-container) 20%,
    var(--md-surface-container-high) 50%,
    var(--md-surface-container) 80%
  );
  background-size: 200% 100%;
  animation: m3Shimmer 1.3s ease-in-out infinite;
}
@keyframes m3Shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.m3-board-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 12px;
}
.m3-board-card {
  background: var(--md-surface-container-lowest);
  border-radius: 22px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 260ms var(--md-spring-spatial);
}
.m3-board-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--md-elev-2);
  border-color: var(--md-primary);
}
.m3-board-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.m3-board-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  flex-shrink: 0;
}
.m3-board-icon.has-new {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}
.m3-board-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--md-on-surface);
  text-decoration: none !important;
}
.m3-board-title:hover { color: var(--md-primary); }
.m3-board-desc {
  font-size: 12.5px;
  color: var(--md-on-surface-variant);
}
.m3-subforum-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.m3-sub-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 9999px;
  background: var(--md-surface-container);
  color: var(--md-on-surface-variant);
  font-size: 12px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-decoration: none !important;
}
.m3-sub-chip:hover {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}
.m3-board-foot {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed var(--md-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: var(--md-on-surface-variant);
}
.m3-board-last {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================================================
 * FORUM HERO, FILTER BAR, THREAD LIST & GALLERY WALL
 * ========================================================================== */
.m3-forum-hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 20px 24px;
  border-radius: 28px;
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.m3-forum-hero-title {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--md-on-surface);
}
.m3-toolbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.m3-chip-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.m3-sort-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.m3-select {
  height: 34px;
  padding: 0 12px;
  border-radius: 9999px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  font-family: var(--md-font-sans);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
}

/* Thread Row */
.m3-thread-row {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px 14px;
}
.m3-thread-status {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
}
.m3-thread-status.is-new { background: var(--md-primary-container); color: var(--md-on-primary-container); }
.m3-thread-status.is-hot { background: var(--md-tertiary-container); color: var(--md-on-tertiary-container); }
.m3-thread-status.is-lock { background: var(--md-surface-container-highest); opacity: 0.78; }
.m3-thread-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.m3-thread-title-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  line-height: 1.45;
}
.m3-thread-link {
  font-size: 15px;
  font-weight: 600;
  color: var(--md-on-surface);
  text-decoration: none !important;
  word-break: break-word;
}
.m3-thread-link:hover { color: var(--md-primary); }
.m3-thread-link:visited { color: var(--md-on-surface-variant); }
.m3-thread-submeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  font-size: 12px;
  color: var(--md-on-surface-variant);
}
.m3-thread-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  text-align: right;
  font-size: 12px;
  color: var(--md-on-surface-variant);
  white-space: nowrap;
}
.m3-page-jump {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.m3-page-jump a {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  font-size: 11px;
  font-weight: 600;
}
.m3-page-jump a:hover {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  text-decoration: none;
}

/* Gallery Wall Cards */
.m3-wall-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 16px;
}
.m3-wall-card {
  background: var(--md-surface-container-low);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  display: flex;
  flex-direction: column;
  transition: transform 280ms var(--md-spring-spatial), box-shadow 260ms var(--md-spring-effects), border-color 220ms;
}
.m3-wall-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--md-elev-2);
  border-color: var(--md-primary);
}
.m3-wall-media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--md-surface-container-highest);
  overflow: hidden;
}
.m3-wall-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 360ms var(--md-spring-spatial);
}
.m3-wall-grid.is-contain .m3-wall-media img {
  object-fit: contain;
}
.m3-wall-card:hover .m3-wall-media img {
  transform: scale(1.04);
}
.m3-wall-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
}
.m3-wall-float-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: rgba(20, 18, 24, 0.62);
  backdrop-filter: blur(8px);
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 200ms var(--md-spring-fast), background 200ms;
}
.m3-wall-float-btn:hover {
  background: var(--md-primary);
  transform: scale(1.08);
}
.m3-wall-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.m3-wall-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--md-on-surface);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none !important;
}
.m3-wall-title:hover { color: var(--md-primary); }
.m3-wall-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.m3-wall-foot {
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px dashed var(--md-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 12px;
  color: var(--md-on-surface-variant);
}

/* Pagination */
.m3-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 20px;
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent);
}
.m3-page-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
.m3-page-pill {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--md-on-surface-variant);
  text-decoration: none !important;
  transition: all 200ms var(--md-spring-fast);
}
.m3-page-pill:hover {
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface);
}
.m3-page-pill.is-current {
  background: var(--md-primary);
  color: var(--md-on-primary);
}
.m3-page-go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--md-on-surface-variant);
}
.m3-page-go input {
  width: 56px;
  height: 30px;
  border-radius: 9999px;
  border: 1px solid var(--md-outline-variant);
  background: var(--md-surface-container-lowest);
  color: var(--md-on-surface);
  text-align: center;
  font-size: 12.5px;
  outline: none;
}

/* ============================================================================
 * READ THREAD PAGE
 * ========================================================================== */
.m3-thread-hero {
  background: var(--md-surface-container-low);
  border-radius: 28px;
  padding: 22px 26px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.m3-thread-h1 {
  font-size: 22px;
  font-weight: 800;
  line-height: 1.4;
  margin: 0;
  color: var(--md-on-surface);
  word-break: break-word;
}
.m3-post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.m3-post-card {
  background: var(--md-surface-container-lowest);
  border-radius: 26px;
  padding: 20px 24px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  box-shadow: var(--md-elev-1);
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-margin-top: 84px;
}
.m3-post-card.is-op {
  border-color: color-mix(in srgb, var(--md-primary) 42%, var(--md-outline-variant));
}
.m3-post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.m3-post-author-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.m3-avatar-btn {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  padding: 0;
  border: 2px solid var(--md-outline-variant);
  background: var(--md-surface-container-high);
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 220ms var(--md-spring-fast), border-color 200ms;
}
.m3-avatar-btn:hover {
  transform: scale(1.06);
  border-color: var(--md-primary);
}
.m3-avatar-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.m3-post-author-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.m3-post-author-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}
.m3-post-author-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--md-on-surface);
}
.m3-post-sub {
  font-size: 12px;
  color: var(--md-on-surface-variant);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.m3-post-header-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.m3-floor-pill {
  height: 30px;
  padding: 0 12px;
  border-radius: 9999px;
  border: none;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  font-family: var(--md-font-mono);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.m3-floor-pill:hover {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

/* Re-parented Post Body */
.m3-post-body {
  min-width: 0;
  overflow-x: auto;
}
.m3-post-body .tpc_content,
.m3-post-body .f14 {
  padding: 4px 2px !important;
  margin: 0 !important;
  line-height: 1.8 !important;
  color: var(--md-on-surface) !important;
  font-family: var(--md-font-sans) !important;
}
html[data-fontsize="small"] .m3-post-body .f14 { font-size: 13px !important; }
html[data-fontsize="medium"] .m3-post-body .f14 { font-size: 15px !important; }
html[data-fontsize="large"] .m3-post-body .f14 { font-size: 17px !important; }

.m3-post-body img {
  max-width: 100% !important;
  width: auto !important;
  height: auto !important;
  border-radius: 16px;
  margin: 8px 0;
  cursor: zoom-in;
  box-shadow: var(--md-elev-1);
}
.m3-post-body img[src*="smile/"] {
  border-radius: 4px;
  margin: 0 2px;
  cursor: default;
  box-shadow: none;
}
.m3-post-body hr {
  border: none;
  border-top: 1px solid var(--md-outline-variant);
  margin: 16px 0;
}
.m3-post-body .blockquote,
.m3-post-body .blockquote2,
.m3-post-body .blockquote3,
.m3-post-body .quote2 {
  width: 100% !important;
  background: var(--md-surface-container) !important;
  color: var(--md-on-surface-variant) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-left: 4px solid var(--md-primary) !important;
  border-radius: 16px !important;
  padding: 12px 16px !important;
  margin: 12px 0 !important;
  font-size: 13px !important;
}

/* Expressive Purchase Card (replacing h6.quote.jumbotron) */
.m3-buy-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 16px 0;
  padding: 16px 20px;
  border-radius: 22px;
  background: linear-gradient(135deg, var(--md-tertiary-container), var(--md-surface-container));
  color: var(--md-on-tertiary-container);
  border: 1px solid color-mix(in srgb, var(--md-tertiary) 35%, transparent);
}
.m3-buy-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.m3-buy-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--md-tertiary);
  color: var(--md-on-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.m3-buy-card.is-unlocked {
  background: linear-gradient(135deg, var(--md-secondary-container), var(--md-surface-container));
  color: var(--md-on-secondary-container);
  border-color: color-mix(in srgb, var(--md-primary) 28%, transparent);
}
.m3-buy-card.is-unlocked .m3-buy-icon {
  background: var(--md-primary);
  color: var(--md-on-primary);
}
.m3-buy-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: 9999px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  font-size: 12.5px;
  font-weight: 700;
  white-space: nowrap;
}

/* Rating Marks */
.m3-marks-box {
  padding: 10px 14px;
  border-radius: 16px;
  background: var(--md-surface-container);
  font-size: 12.5px;
  color: var(--md-on-surface-variant);
}
.m3-marks-box .tips {
  float: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  color: inherit !important;
}
.m3-marks-box .tips li {
  width: auto !important;
  height: auto !important;
  float: none !important;
  display: inline-block;
  margin: 2px 10px 2px 0 !important;
}

.m3-post-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--md-outline-variant);
}
.m3-post-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Quick Reply Card */
.m3-reply-card {
  background: var(--md-surface-container-low);
  border-radius: 28px;
  padding: 22px 24px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.m3-reply-card form table,
.m3-reply-card form tr,
.m3-reply-card form td {
  background: transparent !important;
  border: none !important;
  color: var(--md-on-surface) !important;
}
.m3-reply-card input[type="text"],
.m3-reply-card textarea,
.m3-reply-card select {
  background: var(--md-surface-container-lowest) !important;
  color: var(--md-on-surface) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 14px !important;
  padding: 10px 14px !important;
  font-family: var(--md-font-sans) !important;
  font-size: 14px !important;
}
.m3-reply-card textarea {
  width: 100% !important;
  min-height: 140px;
  resize: vertical;
}
.m3-reply-card input[type="submit"],
.m3-reply-card .btn {
  height: 40px !important;
  padding: 0 24px !important;
  border-radius: 9999px !important;
  background: var(--md-primary) !important;
  background-image: none !important;
  color: var(--md-on-primary) !important;
  border: none !important;
  font-weight: 700 !important;
  cursor: pointer !important;
}
.m3-reply-card .abtn {
  border-radius: 9999px !important;
  background: var(--md-surface-container-high) !important;
  color: var(--md-on-surface) !important;
  border: 1px solid var(--md-outline-variant) !important;
  padding: 5px 12px !important;
  font-family: var(--md-font-sans) !important;
  text-decoration: none !important;
}

/* ============================================================================
 * FLOATING TOOLBAR & FAB
 * ========================================================================== */
.m3-floating-dock {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 380;
  display: flex;
  align-items: center;
  gap: 10px;
}
.m3-floating-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 48px;
  padding: 0 8px;
  border-radius: 9999px;
  background: var(--md-surface-container-high);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 65%, transparent);
  box-shadow: var(--md-elev-3);
}
.m3-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 56px;
  min-width: 56px;
  padding: 0 20px;
  border-radius: 20px;
  border: none;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container) !important;
  font-family: var(--md-font-sans);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--md-elev-3);
  text-decoration: none !important;
  transition: all 260ms var(--md-spring-fast);
}
.m3-fab:hover {
  transform: translateY(-2px);
}
.m3-fab:active {
  border-radius: 14px;
  transform: scale(0.96);
}

/* ============================================================================
 * OVERLAYS: DRAWERS, POPOVERS, DIALOGS, LIGHTBOX, SNACKBAR
 * ========================================================================== */
.m3-scrim {
  position: fixed;
  inset: 0;
  background: var(--md-scrim);
  z-index: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 220ms var(--md-spring-effects);
}
.m3-scrim.is-open {
  opacity: 1;
  pointer-events: auto;
}

.m3-drawer {
  position: fixed;
  top: 12px;
  left: 12px;
  bottom: 12px;
  width: min(460px, calc(100vw - 24px));
  background: var(--md-surface-container-low);
  border-radius: 28px;
  box-shadow: var(--md-elev-3);
  z-index: 520;
  display: flex;
  flex-direction: column;
  padding: 18px 20px;
  transform: translateX(-115%);
  transition: transform 320ms var(--md-spring-spatial);
}
.m3-drawer.is-open {
  transform: translateX(0);
}
.m3-drawer-body {
  flex: 1;
  overflow-y: auto;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.m3-drawer-board-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.m3-drawer-subwrap {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-left: 10px;
  margin: 2px 0 4px;
  border-left: 2px solid var(--md-outline-variant);
}
.m3-drawer-subchip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 10px;
  border-radius: 9999px;
  background: var(--md-surface-container);
  color: var(--md-on-surface-variant);
  font-size: 11.5px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  text-decoration: none !important;
}
.m3-drawer-subchip:hover {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

/* ============================================================================
 * POST COMPOSER PAGE (post.php)
 * ========================================================================== */
.m3-post-rule-banner {
  padding: 12px 18px;
  border-radius: 20px;
  background: var(--md-tertiary-container);
  color: var(--md-on-tertiary-container);
  font-size: 13px;
  line-height: 1.65;
}
.m3-post-rule-banner:empty,
.m3-post-rule-banner:has(#postrule:empty) {
  display: none;
}
.m3-post-rule-banner a {
  color: var(--md-on-tertiary-container);
  font-weight: 700;
  text-decoration: underline;
}
.m3-composer-card {
  background: var(--md-surface-container-low);
  border-radius: 28px;
  padding: 22px 24px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.m3-composer-card .t {
  background: transparent !important;
  border: none !important;
  min-width: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
}
.m3-composer-card .t > div[style*="max-width:1240px"] {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
}
.m3-composer-card .m3-composer-title-host {
  margin: 0 0 12px !important;
  height: auto !important;
  width: 100% !important;
}
.m3-composer-card .m3-composer-title-box {
  float: none !important;
  width: 100% !important;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  background: var(--md-surface-container-lowest) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 16px !important;
  padding: 8px 14px !important;
}
.m3-composer-card input[name="atc_title"] {
  flex: 1;
  min-width: 220px;
  width: 100% !important;
  border: none !important;
  background: transparent !important;
  color: var(--md-on-surface) !important;
  font-family: var(--md-font-sans) !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  outline: none !important;
  padding: 4px 0 !important;
}
.m3-composer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 232px;
  gap: 16px;
  align-items: start;
}
.m3-composer-card #editor-main {
  padding-left: 0 !important;
  min-width: 0 !important;
}
.m3-composer-card #editor-side {
  position: static !important;
  width: 100% !important;
  margin-top: 0 !important;
  z-index: 10 !important;
}
.m3-composer-card #editor-side > div {
  width: 100% !important;
}
.m3-composer-card #smiliebox {
  background: var(--md-surface-container-lowest) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 20px !important;
  padding: 10px !important;
  color: var(--md-on-surface) !important;
}
.m3-composer-card #smiliebox legend {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--md-primary);
  padding: 0 8px;
}
.m3-composer-card #editor-content {
  margin-top: 0 !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 20px !important;
  background: var(--md-surface-container-lowest) !important;
  overflow: hidden;
}
.m3-composer-card #editor-tab {
  position: static !important;
  margin: 0 !important;
  display: inline-flex;
  gap: 4px;
  padding: 10px 12px 6px;
}
.m3-composer-card #editor-tab span {
  float: none !important;
  width: auto !important;
  height: auto !important;
  line-height: 1.4 !important;
  margin: 0 !important;
  padding: 6px 14px !important;
  border-radius: 9999px !important;
  border: 1px solid var(--md-outline-variant) !important;
  background: var(--md-surface-container) !important;
  color: var(--md-on-surface-variant) !important;
  font-family: var(--md-font-sans) !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
}
.m3-composer-card #editor-tab span.buttonPressed {
  background: var(--md-primary) !important;
  color: var(--md-on-primary) !important;
  border-color: transparent !important;
}
.m3-composer-card #editor-tool {
  position: static !important;
  margin: 0 !important;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 12px 10px;
}
.m3-composer-card #editor-tool span {
  float: none !important;
  height: auto !important;
  line-height: 1.4 !important;
  margin: 0 !important;
  padding: 4px 12px !important;
  border-radius: 9999px !important;
  border: 1px solid var(--md-outline-variant) !important;
  background: var(--md-surface-container) !important;
  font-size: 12px !important;
}
.m3-composer-card #editor-tool span a {
  color: var(--md-on-surface) !important;
  text-decoration: none !important;
}
.m3-composer-card #editor-button {
  float: none !important;
  padding: 10px 12px !important;
  background: var(--md-surface-container) !important;
  border-top: 1px solid var(--md-outline-variant) !important;
  border-bottom: 1px solid var(--md-outline-variant) !important;
  color: var(--md-on-surface) !important;
}
.m3-composer-card .editor-button {
  display: inline-block;
  background: #F4EFF6;
  padding: 4px 6px;
  border-radius: 10px;
  color: #222;
}
.m3-composer-card .wysiwyg {
  padding: 0 !important;
}
.m3-composer-card textarea#textarea {
  width: 100% !important;
  min-height: 320px;
  padding: 14px 16px !important;
  border: none !important;
  outline: none !important;
  background: var(--md-surface-container-lowest) !important;
  color: var(--md-on-surface) !important;
  font-family: var(--md-font-sans) !important;
  font-size: 15px !important;
  line-height: 1.7 !important;
  resize: vertical;
}
.m3-composer-card .editor-mwidth {
  width: 100% !important;
  max-width: none !important;
}
.m3-composer-card .editor-mwidth > div[style*="margin-left"] {
  margin-left: 0 !important;
}
.m3-composer-card #post-option > .editor-mwidth > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.m3-composer-card #post-option span {
  width: auto !important;
  float: none !important;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: var(--md-surface-container);
  color: var(--md-on-surface);
  font-size: 12.5px;
}
.m3-composer-card tr.tr3 th {
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent) !important;
  padding: 12px 4px !important;
  color: var(--md-on-surface) !important;
}
.m3-composer-card .input,
.m3-composer-card select {
  background: var(--md-surface-container-lowest) !important;
  color: var(--md-on-surface) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 10px !important;
  padding: 5px 8px !important;
}
.m3-composer-card input[type="submit"],
.m3-composer-card .btn {
  height: 42px !important;
  padding: 0 28px !important;
  border-radius: 9999px !important;
  background: var(--md-primary) !important;
  background-image: none !important;
  color: var(--md-on-primary) !important;
  border: none !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
}
.m3-composer-card .btn3,
.m3-composer-card .abtn3 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 18px !important;
  border-radius: 9999px !important;
  background: var(--md-secondary-container) !important;
  color: var(--md-on-secondary-container) !important;
  border: none !important;
  text-decoration: none !important;
  font-weight: 600 !important;
  font-family: var(--md-font-sans) !important;
  margin-left: 10px !important;
  cursor: pointer !important;
}
@media (max-width: 960px) {
  .m3-composer-grid {
    grid-template-columns: 1fr;
  }
}

.m3-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -46%) scale(0.94);
  width: min(520px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  background: var(--md-surface-container-high);
  border-radius: 28px;
  padding: 24px;
  box-shadow: var(--md-elev-3);
  z-index: 530;
  display: flex;
  flex-direction: column;
  gap: 16px;
  opacity: 0;
  pointer-events: none;
  overflow-y: auto;
  transition: all 260ms var(--md-spring-spatial);
}
.m3-dialog.is-open {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, -50%) scale(1);
}

.m3-popover {
  position: fixed;
  z-index: 540;
  min-width: 240px;
  max-width: min(360px, calc(100vw - 24px));
  background: var(--md-surface-container-high);
  color: var(--md-on-surface);
  border-radius: 22px;
  padding: 14px 16px;
  box-shadow: var(--md-elev-3);
  border: 1px solid var(--md-outline-variant);
  display: none;
}
.m3-popover.is-open {
  display: block;
}

.m3-menu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.m3-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: var(--md-on-surface);
  font-family: var(--md-font-sans);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  text-decoration: none !important;
}
.m3-menu-item:hover {
  background: var(--md-surface-container-highest);
}

/* Settings swatches */
.m3-swatch-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.m3-swatch-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  border-radius: 16px;
  border: 2px solid transparent;
  background: var(--md-surface-container-low);
  color: var(--md-on-surface);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}
.m3-swatch-btn.is-active {
  border-color: var(--md-primary);
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}
.m3-swatch-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}
.m3-setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent);
}
.m3-switch {
  position: relative;
  width: 50px;
  height: 30px;
  border-radius: 9999px;
  border: 2px solid var(--md-outline);
  background: var(--md-surface-container-highest);
  cursor: pointer;
  transition: all 220ms var(--md-spring-fast);
  flex-shrink: 0;
}
.m3-switch::after {
  content: "";
  position: absolute;
  top: 4px;
  left: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--md-outline);
  transition: all 220ms var(--md-spring-fast);
}
.m3-switch.is-on {
  background: var(--md-primary);
  border-color: var(--md-primary);
}
.m3-switch.is-on::after {
  left: 24px;
  width: 20px;
  height: 20px;
  top: 3px;
  background: var(--md-on-primary);
}

/* Lightbox */
.m3-lightbox {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: rgba(12, 11, 14, 0.92);
  backdrop-filter: blur(12px);
  display: none;
  flex-direction: column;
}
.m3-lightbox.is-open { display: flex; }
.m3-lightbox-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  color: #FFFFFF;
}
.m3-lightbox-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px 64px;
  overflow: auto;
}
.m3-lightbox-stage img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 16px;
  object-fit: contain;
  transition: transform 240ms var(--md-spring-fast);
}
.m3-lightbox-stage img.is-zoomed {
  max-width: none;
  max-height: none;
  cursor: zoom-out;
}
.m3-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.16);
  color: #FFFFFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.m3-lightbox-nav:hover { background: rgba(255, 255, 255, 0.28); }
.m3-lightbox-prev { left: 16px; }
.m3-lightbox-next { right: 16px; }

/* Snackbar */
.m3-snackbar {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translate(-50%, 140%);
  z-index: 700;
  background: var(--md-inverse-surface);
  color: var(--md-inverse-on-surface);
  padding: 12px 20px;
  border-radius: 16px;
  font-size: 13.5px;
  font-weight: 500;
  box-shadow: var(--md-elev-3);
  transition: transform 260ms var(--md-spring-spatial);
  pointer-events: none;
}
.m3-snackbar.is-open {
  transform: translate(-50%, 0);
}

/* ============================================================================
 * LEGACY COMPATIBILITY (GENERIC PAGES, NATIVE POPUPS, PEACEMAKER)
 * ========================================================================== */
.m3-generic-host #breadcrumbs {
  display: none !important;
}
.m3-generic-host .t,
.m3-generic-host .t5 {
  background: var(--md-surface-container-low) !important;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent) !important;
  border-radius: 22px !important;
  padding: 10px !important;
  margin-bottom: 14px !important;
}
.m3-generic-host .h,
.m3-generic-host .h2,
.m3-generic-host .h3 {
  background: var(--md-surface-container-high) !important;
  background-image: none !important;
  color: var(--md-on-surface) !important;
  border-color: var(--md-outline-variant) !important;
  border-radius: 14px !important;
  padding: 6px 14px !important;
}
.m3-generic-host .tr1,
.m3-generic-host .tr2,
.m3-generic-host .tr3,
.m3-generic-host .f_one,
.m3-generic-host .f_two,
.m3-generic-host .t_one,
.m3-generic-host .t_two {
  background: transparent !important;
  background-image: none !important;
  color: var(--md-on-surface) !important;
}
.m3-generic-host .tr3 td,
.m3-generic-host .tr3 th,
.m3-generic-host .tr1 td.td1 {
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent) !important;
}
.m3-generic-host input[type="text"],
.m3-generic-host input[type="password"],
.m3-generic-host textarea,
.m3-generic-host select {
  background: var(--md-surface-container-lowest) !important;
  color: var(--md-on-surface) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 12px !important;
  padding: 6px 10px !important;
}
.m3-generic-host .btn,
.m3-generic-host input[type="submit"],
.m3-generic-host input[type="button"] {
  background: var(--md-primary) !important;
  background-image: none !important;
  color: var(--md-on-primary) !important;
  border: none !important;
  border-radius: 9999px !important;
  padding: 7px 18px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
}
.m3-generic-host .abtn,
.m3-generic-host .btn2 {
  background: var(--md-secondary-container) !important;
  color: var(--md-on-secondary-container) !important;
  border: none !important;
  border-radius: 9999px !important;
  padding: 5px 12px !important;
}

/* Native pw_ajax popups & peacemaker */
#pw_box, .menu {
  background: var(--md-surface-container-high) !important;
  color: var(--md-on-surface) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 18px !important;
  box-shadow: var(--md-elev-3) !important;
  padding: 8px !important;
  z-index: 650 !important;
}
#peacemakerconfig {
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  color: var(--md-primary) !important;
  font-weight: 600 !important;
}
#peacemakerconfig > div {
  position: static !important;
  display: flex !important;
  flex-direction: column;
  gap: 6px;
  background: transparent !important;
  border: none !important;
  margin-top: 8px;
}
#peacemakerconfig > div > div {
  background: var(--md-surface-container) !important;
  color: var(--md-on-surface) !important;
  border-radius: 12px !important;
  padding: 8px 12px !important;
  cursor: pointer;
}
#peacemakerconfig > div > div:hover {
  background: var(--md-secondary-container) !important;
}
.blackListPlan {
  position: static !important;
  width: 100% !important;
  margin-top: 8px;
  background: var(--md-surface-container-lowest) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 14px !important;
  padding: 10px !important;
}

/* ============================================================================
 * REDIRECT STATUS SCREEN (购买成功 / 提示信息)
 * ========================================================================== */
.m3-status-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top center, color-mix(in srgb, var(--md-primary-container) 35%, transparent), var(--md-surface) 60%);
}
.m3-status-card {
  width: min(460px, 100%);
  background: var(--md-surface-container-low);
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 60%, transparent);
  border-radius: 32px;
  padding: 32px 28px;
  box-shadow: var(--md-elev-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 14px;
}
.m3-status-icon {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}
.m3-status-icon .m3-icon {
  width: 32px;
  height: 32px;
}
.m3-status-progress {
  width: 100%;
  height: 4px;
  border-radius: 9999px;
  background: var(--md-surface-container-highest);
  overflow: hidden;
  margin-top: 4px;
}
.m3-status-progress-bar {
  height: 100%;
  width: 45%;
  border-radius: 9999px;
  background: var(--md-primary);
  animation: m3Indeterminate 1.2s ease-in-out infinite;
}
@keyframes m3Indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(260%); }
}

/* ============================================================================
 * USER CENTER PAGE (u.php)
 * ========================================================================== */
.m3-u-hero {
  background: linear-gradient(135deg, color-mix(in srgb, var(--md-primary-container) 65%, var(--md-surface-container-low)), var(--md-surface-container-low));
  border-radius: 28px;
  padding: 22px 24px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}
.m3-u-identity {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}
.m3-u-avatar {
  width: 78px;
  height: 78px;
  border-radius: 24px;
  object-fit: cover;
  border: 2px solid var(--md-surface-container-lowest);
  box-shadow: var(--md-elev-2);
  background: var(--md-surface-container);
  flex-shrink: 0;
}
.m3-u-title {
  margin: 0;
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--md-on-surface);
}
.m3-u-honor-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 13px;
  color: var(--md-on-surface-variant);
}
.m3-u-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background: var(--md-surface-container-low);
  padding: 8px;
  border-radius: 22px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 50%, transparent);
}
.m3-u-tab {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--md-on-surface-variant) !important;
  text-decoration: none !important;
  transition: all 200ms var(--md-spring-fast);
}
.m3-u-tab:hover {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface) !important;
}
.m3-u-tab.is-active {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container) !important;
}
.m3-u-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 310px;
  gap: 16px;
  align-items: start;
}
.m3-u-main-host,
.m3-u-side-host {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}
.m3-u-card {
  background: var(--md-surface-container-low);
  border-radius: 24px;
  padding: 18px 20px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.m3-u-main-host #u-contentmain,
.m3-u-side-host #u-contentside {
  width: 100% !important;
  float: none !important;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.m3-u-main-host .u-h2,
.m3-u-side-host .u-h2 {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid var(--md-outline-variant) !important;
  padding: 0 0 10px !important;
  margin: 0 0 12px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  color: var(--md-on-surface) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.m3-u-main-host #minifeed,
.m3-u-main-host #new-reply,
.m3-u-side-host #new-topic,
.m3-u-main-host .u-box,
.m3-u-side-host .u-box {
  background: var(--md-surface-container-low) !important;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent) !important;
  border-radius: 24px !important;
  padding: 18px 20px !important;
  margin: 0 !important;
}
.m3-u-main-host dl.article-list,
.m3-u-side-host dl.article-list {
  margin: 0 !important;
}
.m3-u-main-host dl.article-list dt,
.m3-u-side-host dl.article-list dt {
  padding: 9px 10px !important;
  border-radius: 12px !important;
  border-bottom: 1px dashed color-mix(in srgb, var(--md-outline-variant) 45%, transparent) !important;
  transition: background 180ms var(--md-spring-effects);
}
.m3-u-main-host dl.article-list dt:hover,
.m3-u-side-host dl.article-list dt:hover {
  background: var(--md-surface-container) !important;
}
.m3-u-kv-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}
.m3-u-kv-item {
  background: var(--md-surface-container-lowest);
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent);
}
.m3-u-kv-label {
  font-size: 11.5px;
  color: var(--md-on-surface-variant);
}
.m3-u-kv-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--md-on-surface);
  margin-top: 2px;
}

/* ============================================================================
 * MESSAGE INBOX PAGE (message.php)
 * ========================================================================== */
.m3-inbox-grid {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.m3-inbox-sidebar {
  background: var(--md-surface-container-low);
  border-radius: 24px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.m3-inbox-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 9999px;
  color: var(--md-on-surface-variant) !important;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none !important;
  transition: background 180ms var(--md-spring-effects), color 180ms var(--md-spring-effects);
}
.m3-inbox-nav-item:hover {
  background: var(--md-surface-container-high);
  color: var(--md-on-surface) !important;
}
.m3-inbox-nav-item.is-active {
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container) !important;
}
.m3-inbox-host {
  background: var(--md-surface-container-low);
  border-radius: 26px;
  padding: 20px 22px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  min-width: 0;
  overflow-x: auto;
}
.m3-inbox-host #set-content,
.m3-inbox-host #set-content-wrap {
  width: 100% !important;
  float: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
}
.m3-inbox-host .set-tab-table,
.m3-inbox-host .set-table2 {
  width: 100% !important;
  background: transparent !important;
  border-collapse: collapse !important;
}
.m3-inbox-host .set-tab-table td {
  padding: 8px 16px !important;
  border-radius: 9999px !important;
  cursor: pointer;
  font-weight: 600;
  background: var(--md-surface-container) !important;
  color: var(--md-on-surface-variant) !important;
  border: 1px solid var(--md-outline-variant) !important;
}
.m3-inbox-host .set-tab-table td.current,
.m3-inbox-host .set-tab-table td[class*="current"] {
  background: var(--md-primary-container) !important;
  color: var(--md-on-primary-container) !important;
  border-color: transparent !important;
}
.m3-inbox-host .set-table2 th,
.m3-inbox-host .set-table2 td,
.m3-inbox-host .tr3 td,
.m3-inbox-host .tr2 td {
  background: transparent !important;
  color: var(--md-on-surface) !important;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 45%, transparent) !important;
  padding: 10px 8px !important;
}
.m3-inbox-host .tr2 td {
  font-size: 12px !important;
  color: var(--md-on-surface-variant) !important;
  font-weight: 700 !important;
}

/* ============================================================================
 * COMMUNITY TASKS PAGE (plugin.php?H_name-tasks)
 * ========================================================================== */
.m3-task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 14px;
}
.m3-task-card {
  background: var(--md-surface-container-low);
  border-radius: 26px;
  padding: 18px 20px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 240ms var(--md-spring-spatial), box-shadow 240ms var(--md-spring-spatial);
}
.m3-task-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--md-elev-2);
}
.m3-task-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.m3-task-icon-box {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.m3-task-icon-box img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.m3-task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--md-on-surface);
  line-height: 1.35;
}
.m3-task-desc {
  font-size: 13px;
  line-height: 1.65;
  color: var(--md-on-surface-variant);
}
.m3-task-foot {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px dashed var(--md-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.m3-task-action-host a,
.m3-task-action-host input[type="button"],
.m3-task-action-host input[type="submit"],
.m3-task-action-host button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  background: var(--md-primary);
  color: var(--md-on-primary) !important;
  font-size: 13px;
  font-weight: 600;
  border: none;
  text-decoration: none !important;
  cursor: pointer;
}

/* ============================================================================
 * SEARCH FORM & RESULTS PAGES (search.php / search2.php)
 * ========================================================================== */
.m3-search-form-card {
  background: var(--md-surface-container-low);
  border-radius: 28px;
  padding: 22px 24px;
  border: 1px solid color-mix(in srgb, var(--md-outline-variant) 55%, transparent);
}
.m3-search-form-card table,
.m3-search-form-card tbody,
.m3-search-form-card tr {
  background: transparent !important;
}
.m3-search-form-card th,
.m3-search-form-card td {
  background: transparent !important;
  color: var(--md-on-surface) !important;
  border-bottom: 1px solid color-mix(in srgb, var(--md-outline-variant) 42%, transparent) !important;
  padding: 12px 10px !important;
  vertical-align: middle !important;
}
.m3-search-form-card input[type="text"],
.m3-search-form-card select {
  background: var(--md-surface-container-lowest) !important;
  color: var(--md-on-surface) !important;
  border: 1px solid var(--md-outline-variant) !important;
  border-radius: 14px !important;
  padding: 8px 12px !important;
  font-family: inherit !important;
}
.m3-search-form-card input[type="submit"],
.m3-search-form-card input[type="reset"] {
  height: 40px;
  padding: 0 22px !important;
  border-radius: 9999px !important;
  font-weight: 600 !important;
  border: none !important;
  cursor: pointer !important;
}
.m3-search-form-card input[type="submit"] {
  background: var(--md-primary) !important;
  color: var(--md-on-primary) !important;
}
.m3-search-form-card input[type="reset"] {
  background: var(--md-secondary-container) !important;
  color: var(--md-on-secondary-container) !important;
  margin-left: 8px;
}

/* Responsive Breakpoints */
@media (max-width: 900px) {
  .m3-u-grid,
  .m3-inbox-grid,
  .m3-task-grid {
    grid-template-columns: 1fr;
  }
  .m3-rail {
    transform: translateX(-105%);
    width: 260px;
  }
  #sp-md3e-shell.mobile-rail-open .m3-rail {
    transform: translateX(0);
    box-shadow: var(--md-elev-3);
  }
  #sp-md3e-shell.mobile-rail-open .m3-rail-label,
  #sp-md3e-shell.mobile-rail-open .m3-rail-fab-label,
  #sp-md3e-shell.mobile-rail-open .m3-rail-brand-text {
    display: inline;
  }
  #sp-md3e-shell.mobile-rail-open .m3-rail-item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 10px 16px;
  }
  #sp-md3e-shell.mobile-rail-open .m3-rail-fab {
    width: 100%;
    padding: 0 18px;
    justify-content: flex-start;
  }
  .m3-workspace {
    margin-left: 0 !important;
  }
  .m3-mobile-menu-btn {
    display: inline-flex !important;
  }
  .m3-topbar {
    padding: 8px 12px;
    gap: 8px;
  }
  .m3-breadcrumbs,
  .m3-kbd {
    display: none;
  }
  .m3-main {
    padding: 14px 12px 92px;
  }
  .m3-board-grid {
    grid-template-columns: 1fr;
  }
  .m3-thread-row {
    grid-template-columns: 34px minmax(0, 1fr);
  }
  .m3-thread-stats {
    grid-column: 2;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
  }
  .m3-floating-dock {
    right: 12px;
    bottom: 14px;
  }
}
`;

  function injectStyles() {
    document.documentElement.classList.add('sp-md3e-loading');
    applyThemeTokens();
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(CSS_TEXT);
    } else {
      const style = document.createElement('style');
      style.id = 'sp-md3e-styles';
      style.textContent = CSS_TEXT;
      (document.head || document.documentElement).appendChild(style);
    }
  }

  injectStyles();

  // Failsafe so body never remains invisible if anything goes wrong
  setTimeout(() => {
    document.documentElement.classList.remove('sp-md3e-loading');
    document.documentElement.classList.add('sp-md3e-ready');
  }, 1200);

  /* ============================================================================
   * 4. DOM HELPERS & PAGE PARSERS
   * ========================================================================== */

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.keys(attrs).forEach((k) => {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'className') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'dataset' && typeof v === 'object') Object.assign(node.dataset, v);
      else node.setAttribute(k, v);
    });
    const list = Array.isArray(children) ? children : [children];
    list.forEach((c) => {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isAdElement(node) {
    if (!node) return false;
    const html = node.innerHTML || '';
    return /segucrwj|equity\.tmall\.com|dwz\.cn|onclick="ga\([^"]*'(ad|newmoe|moe80|sswg|menggongfang)'/i.test(html);
  }

  const SUBFORUM_FALLBACK = {
    '229': [{ name: '同人志&CG', href: 'thread.php?fid-230.html', fid: '230' }, { name: '同人志&CG (图墙模式)', href: 'thread.php?fid-231.html', fid: '231' }],
    '226': [{ name: '同人志&CG', href: 'thread.php?fid-227.html', fid: '227' }, { name: '同人志&CG (图墙模式)', href: 'thread.php?fid-228.html', fid: '228' }],
    '223': [{ name: '同人志&CG', href: 'thread.php?fid-224.html', fid: '224' }, { name: '同人志&CG (图墙模式)', href: 'thread.php?fid-225.html', fid: '225' }],
    '136': [{ name: '同人志&CG', href: 'thread.php?fid-219.html', fid: '219' }, { name: '同人志&CG (图墙模式)', href: 'thread.php?fid-220.html', fid: '220' }],
    '107': [{ name: '同人志&CG', href: 'thread.php?fid-216.html', fid: '216' }, { name: '同人志&CG (图墙模式)', href: 'thread.php?fid-217.html', fid: '217' }],
    '44': [{ name: '图墙模式', href: 'thread.php?fid-103.html', fid: '103' }],
    '46': [{ name: '图墙模式', href: 'thread.php?fid-104.html', fid: '104' }],
    '47': [{ name: '图墙模式', href: 'thread.php?fid-105.html', fid: '105' }],
    '16': [{ name: '原版交流', href: 'thread.php?fid-20.html', fid: '20' }],
    '45': [{ name: '图墙模式', href: 'thread.php?fid-106.html', fid: '106' }],
    '36': [{ name: '图墙模式', href: 'thread.php?fid-102.html', fid: '102' }],
    '43': [
      '218:C103', '215:C102', '212:C101', '209:C100', '205:C99', '202:C98', '196:C97',
      '189:C96', '182:C95', '176:C94', '164:C93', '158:C92', '152:C91', '144:C90',
      '143:C89', '129:C88', '116:C87', '97:C86', '78:C85', '89:C84', '30:C83',
      '67:C82', '62:C81', '55:C80', '53:C79', '54:C78'
    ].map((s) => {
      const [id, name] = s.split(':');
      return { name, href: `thread.php?fid-${id}.html`, fid: id };
    }),
    '12': [{ name: '自扫小说图源区', href: 'thread.php?fid-83.html', fid: '83' }],
    '9': [{ name: '茶楼', href: 'thread.php?fid-188.html', fid: '188' }],
    '13': [
      { name: 'CG资源', href: 'thread.php?fid-14.html', fid: '14' },
      { name: '同人音声', href: 'thread.php?fid-128.html', fid: '128' },
      { name: '实用动画', href: 'thread.php?fid-4.html', fid: '4' },
      { name: '高清里番', href: 'thread.php?fid-73.html', fid: '73' },
      { name: '实用漫画', href: 'thread.php?fid-5.html', fid: '5' },
      { name: '图墙模式', href: 'thread.php?fid-109.html', fid: '109' },
      { name: '游戏资源', href: 'thread.php?fid-6.html', fid: '6' },
      { name: 'COSPLAY', href: 'thread.php?fid-201.html', fid: '201' },
      { name: 'GALGAME汉化区', href: 'thread.php?fid-221.html', fid: '221' },
      { name: 'GALGAME汉化区 (图墙模式)', href: 'thread.php?fid-222.html', fid: '222' }
    ],
    '170': [
      { name: 'CG资源', href: 'thread.php?fid-171.html', fid: '171' },
      { name: '实用动画', href: 'thread.php?fid-172.html', fid: '172' },
      { name: '实用漫画', href: 'thread.php?fid-173.html', fid: '173' },
      { name: '游戏资源', href: 'thread.php?fid-174.html', fid: '174' }
    ]
  };

  function htmlToLines(node) {
    if (!node) return [];
    const text = (node.innerHTML || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:div|p|li|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, '');
    const tmp = document.createElement('textarea');
    tmp.innerHTML = text;
    return tmp.value.split('\n').map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  }

  function parseFidFromHref(href) {
    const m = (href || '').match(/fid[-=](\d+)/i);
    return m ? m[1] : '';
  }

  function detectPageType() {
    const file = (location.pathname.split('/').pop() || '').toLowerCase();
    const hasShell = !!(qs('#wrapA') || qs('#main') || qs('#u-wrap') || qs('#set-wrap'));
    if (!hasShell && (qs('meta[http-equiv="refresh"]') || /提示信息/.test(document.body?.textContent || ''))) {
      return 'redirect';
    }
    if (file === 'post.php' || qs('form[name="FORM"] #editor-content')) return 'post';
    if (file === 'read.php' || qs('table.js-post')) return 'read';
    if (file === 'thread_new.php' || qs('#wall .stream li.dcsns-li')) return 'thread_wall';
    if (file === 'thread.php' || (qs('#ajaxtable') && !qs('#wall'))) return 'thread_list';
    if (file === 'u.php' || qs('#u-wrap')) return 'user';
    if (file === 'message.php' || qs('#set-wrap #infolist') || qs('#set-menu')) return 'message';
    if (/H_name[-=]tasks/i.test(location.href) || (qs('#main a[href*="H_name-tasks"]') && /任务/.test(document.title))) {
      return 'tasks';
    }
    const searchTable = qs('#main .t table');
    const searchHeaderText = searchTable ? (qs('tr.tr2', searchTable)?.textContent || '') : '';
    const isSearchResultsTable = !!(
      searchTable
      && /主题列表/.test(searchTable.textContent)
      && /状态/.test(searchHeaderText)
      && /标题/.test(searchHeaderText)
    );
    if (file === 'search2.php' || isSearchResultsTable) return 'search_results';
    if (file === 'search.php' || qs('form[name="sF"]')) return 'search';
    if (file === '' || file === 'index.php' || qs('tbody[id^="cate_"] tr[id^="fid_"]')) return 'index';
    return 'other';
  }

  function parseSmartTitle(raw) {
    const text = (raw || '').trim();
    const tags = [];
    let remaining = text;

    const prefixes = [
      { re: /【新汉化作品】/g, label: '新汉化', tone: 'error' },
      { re: /\[自购\]/g, label: '自购', tone: 'primary' },
      { re: /\[原创\]/g, label: '原创', tone: 'primary' },
      { re: /\[无码\]/g, label: '无码', tone: 'tertiary' },
      { re: /\[合集\]/g, label: '合集', tone: 'secondary' },
      { re: /\[公告\]/g, label: '公告', tone: 'error' }
    ];

    prefixes.forEach((p) => {
      if (p.re.test(remaining)) {
        tags.push({ label: p.label, tone: p.tone });
        remaining = remaining.replace(p.re, '');
      }
    });

    const sizeMatch = remaining.match(/\[(\d+(?:\.\d+)?\s*(?:GB|MB|TB|G|M))\]/i);
    if (sizeMatch) {
      tags.push({ label: sizeMatch[1].toUpperCase(), tone: 'neutral' });
    }

    const driveMatch = remaining.match(/\[((?:BD|GF|TR|OD|GD|MEGA|PikPak|115|123|度娘|秒传)[^\]]{0,18})\]/i);
    if (driveMatch) {
      tags.push({ label: driveMatch[1], tone: 'neutral' });
    }

    return {
      raw: text,
      clean: remaining.replace(/\s{2,}/g, ' ').trim() || text,
      tags
    };
  }

  function extractUserContext() {
    const loginEl = qs('#user-login');
    const infoBox = qs('#infobox');
    const ctx = {
      loggedIn: false,
      username: '游客',
      userHref: 'login.php',
      hasUnreadMsg: false,
      avatar: '',
      uid: '',
      hp: '',
      sp: '',
      po: '',
      lastLogin: '',
      levelText: '',
      honorText: '您还没有设置个性签名',
      shortcuts: [],
      statsToday: '',
      statsYesterday: '',
      statsMax: '',
      statsTotal: '',
      quitHref: '',
      myTopicHref: 'u.php?action-topic.html',
      myPostHref: 'u.php?action-post.html'
    };

    if (loginEl) {
      const links = qsa('a', loginEl);
      const userLink = links.find((a) => /u\.php/i.test(a.getAttribute('href') || ''));
      if (userLink) {
        ctx.loggedIn = true;
        ctx.username = userLink.textContent.trim() || '用户';
        ctx.userHref = userLink.getAttribute('href') || 'u.php';
      }
      const quitLink = links.find((a) => /action-quit/i.test(a.getAttribute('href') || ''));
      if (quitLink) ctx.quitHref = quitLink.getAttribute('href') || '';
      const msgImg = qs('#td_msg img', loginEl);
      if (msgImg) {
        const src = msgImg.getAttribute('src') || '';
        ctx.hasUnreadMsg = !/no-shortmail/i.test(src);
      }
    }

    if (infoBox) {
      const avatarImg = qs('#user_info img', infoBox);
      if (avatarImg) ctx.avatar = avatarImg.getAttribute('src') || '';
      const showFace = qs('#showface', infoBox);
      if (showFace) {
        const lines = htmlToLines(showFace);
        lines.forEach((line) => {
          let m;
          if ((m = line.match(/^UID:\s*(\d+)/i))) ctx.uid = m[1].trim();
          else if ((m = line.match(/^HP:\s*(.+)$/i))) ctx.hp = m[1].trim();
          else if ((m = line.match(/^SP币:\s*(.+)$/i))) ctx.sp = m[1].trim();
          else if ((m = line.match(/^魄:\s*(.+)$/i))) ctx.po = m[1].trim();
          else if ((m = line.match(/^最后登录:\s*(.+)$/i))) ctx.lastLogin = m[1].trim();
        });
      }
      const honorEl = qs('#honor', infoBox);
      if (honorEl) ctx.honorText = honorEl.textContent.trim();
      const levelSpan = qs('#user_info .gray2 > span.fl', infoBox);
      if (levelSpan) {
        ctx.levelText = levelSpan.textContent.replace(/我的主题.*$/, '').trim().replace(/,\s*$/, '');
      }
      qsa('#shortcutforum li a', infoBox).forEach((a) => {
        ctx.shortcuts.push({ name: a.textContent.trim(), href: a.getAttribute('href') || '#' });
      });
      const rightStats = qs('td:last-child', infoBox);
      if (rightStats && !qs('#shortcutforum', rightStats)) {
        const statText = rightStats.textContent.replace(/\s+/g, ' ').trim();
        const tM = statText.match(/今日:(\d+)/);
        const yM = statText.match(/昨日:(\d+)/);
        const mM = statText.match(/最高日:(\d+)/);
        const thM = statText.match(/主题:(\d+)/);
        const poTotalM = statText.match(/帖子:(\d+)/);
        const memM = statText.match(/会员:(\d+)/);
        if (tM) ctx.statsToday = tM[1];
        if (yM) ctx.statsYesterday = yM[1];
        if (mM) ctx.statsMax = mM[1];
        if (thM && poTotalM && memM) {
          ctx.statsTotal = `主题 ${thM[1]} · 帖子 ${poTotalM[1]} · 会员 ${memM[1]}`;
        }
      }
    }

    if (ctx.loggedIn) {
      if (infoBox && (ctx.sp || ctx.uid)) {
        Store.set('cachedUserProfile', {
          username: ctx.username,
          avatar: ctx.avatar,
          uid: ctx.uid,
          hp: ctx.hp,
          sp: ctx.sp,
          po: ctx.po,
          lastLogin: ctx.lastLogin,
          levelText: ctx.levelText,
          honorText: ctx.honorText
        });
      } else {
        const cached = Store.get('cachedUserProfile');
        if (cached && cached.username === ctx.username) {
          ctx.avatar = ctx.avatar || cached.avatar || '';
          ctx.uid = ctx.uid || cached.uid || '';
          ctx.hp = ctx.hp || cached.hp || '';
          ctx.sp = ctx.sp || cached.sp || '';
          ctx.po = ctx.po || cached.po || '';
          ctx.lastLogin = ctx.lastLogin || cached.lastLogin || '';
          ctx.levelText = ctx.levelText || cached.levelText || '';
          if (!infoBox && cached.honorText) ctx.honorText = cached.honorText;
        }
      }
    }

    return ctx;
  }

  function extractForumTree() {
    const prevTree = Store.get('cachedForumTree') || [];
    const prevSubsByFid = {};
    prevTree.forEach((cat) => {
      (cat.boards || []).forEach((b) => {
        const fid = b.fid || parseFidFromHref(b.href);
        if (fid && Array.isArray(b.subs) && b.subs.length) {
          prevSubsByFid[fid] = b.subs;
        }
      });
    });

    const categories = [];
    const indexBoxes = qsa('.contentwrap .t[id^="t_"]');
    if (indexBoxes.length) {
      indexBoxes.forEach((box) => {
        const h2a = qs('th.h h2 a', box);
        if (!h2a) return;
        const boards = qsa('tr[id^="fid_"]', box).map((tr) => {
          const fid = tr.id.replace('fid_', '');
          const link = qs(`#fn_${fid}`, tr) || qs('h3 a', tr);
          if (!link) return null;
          const subs = qsa('th > div h3 a', tr).map((sa) => {
            const href = sa.getAttribute('href') || '#';
            return { name: sa.textContent.trim(), href, fid: parseFidFromHref(href) };
          }).filter((s) => s.name);
          return {
            fid,
            name: link.textContent.trim(),
            href: link.getAttribute('href') || '#',
            subs
          };
        }).filter(Boolean);
        categories.push({
          title: h2a.textContent.trim(),
          href: h2a.getAttribute('href') || '#',
          boards
        });
      });
    } else if (qs('#menu_cate')) {
      qsa('ul.ul3', qs('#menu_cate')).forEach((ul) => {
        const h2a = qs('h2 a', ul);
        if (!h2a) return;
        const boards = qsa('li a', ul).map((a) => {
          const href = a.getAttribute('href') || '#';
          const fid = parseFidFromHref(href);
          const subs = prevSubsByFid[fid] || SUBFORUM_FALLBACK[fid] || [];
          return {
            fid,
            name: a.textContent.trim(),
            href,
            subs
          };
        }).filter((b) => b.name);
        categories.push({
          title: h2a.textContent.trim(),
          href: h2a.getAttribute('href') || '#',
          boards
        });
      });
    }

    if (categories.length > 0) {
      Store.set('cachedForumTree', categories);
      return categories;
    }
    return prevTree;
  }

  function extractBreadcrumbs() {
    const main = qs('#main');
    const first = main ? qs('#breadcrumbs', main) : qs('#breadcrumbs');
    const info = {
      crumbs: [],
      rssHref: '',
      shortcutNode: null,
      modeLink: null,
      rawEl: first
    };
    if (!first) return info;

    qsa('.crumbs-item', first).forEach((item) => {
      if (qs('#td_cate', item)) return;
      if (item.tagName === 'A') {
        info.crumbs.push({
          text: item.textContent.trim(),
          href: item.getAttribute('href') || '#',
          isCurrent: item.classList.contains('current')
        });
      } else {
        const strongA = qs('strong a', item) || qs('a', item);
        if (strongA) {
          info.crumbs.push({
            text: strongA.textContent.trim(),
            href: strongA.getAttribute('href') || '#',
            isCurrent: true
          });
        }
        const rssA = qs('a[href*="rss.php"]', item);
        if (rssA) info.rssHref = rssA.getAttribute('href') || '';
        const sc = qs('#shortcut', item);
        if (sc) info.shortcutNode = sc;
      }
    });

    const modeA = qs('span.fr a', first);
    if (modeA) {
      info.modeLink = {
        text: modeA.textContent.trim(),
        href: modeA.getAttribute('href') || '#'
      };
    }

    return info;
  }

  function extractPagination(root = document) {
    const pagesBox = qs('.t3 .pages', root) || qs('.pages', root);
    if (!pagesBox) return null;
    const ul = qs('ul', pagesBox);
    if (!ul) return null;
    const items = [];
    let summary = '';
    let goTemplate = '';
    qsa('li', ul).forEach((li) => {
      if (li.classList.contains('pagesone')) {
        const m = li.textContent.match(/Pages:\s*(\d+\s*\/\s*\d+)/i);
        if (m) summary = m[1].replace(/\s+/g, '');
        const inp = qs('input', li);
        if (inp) {
          const kd = inp.getAttribute('onkeydown') || '';
          const locM = kd.match(/location\s*=\s*'([^']+)'/);
          if (locM) goTemplate = locM[1];
        }
        return;
      }
      const b = qs('b', li);
      if (b) {
        items.push({ label: b.textContent.trim(), href: '', current: true });
        return;
      }
      const a = qs('a', li);
      if (a) {
        items.push({ label: a.textContent.trim(), href: a.getAttribute('href') || '#', current: false });
      }
    });
    if (items.length === 0) return null;
    return { items, summary, goTemplate };
  }

  /* ============================================================================
   * 5. OVERLAYS: SNACKBAR, LIGHTBOX, DRAWER, SETTINGS, POPOVERS
   * ========================================================================== */

  let snackTimer = null;
  function showToast(msg) {
    let bar = qs('#sp-md3e-snackbar');
    if (!bar) {
      bar = el('div', { id: 'sp-md3e-snackbar', className: 'm3-snackbar' });
      document.body.appendChild(bar);
    }
    bar.textContent = msg;
    bar.classList.add('is-open');
    clearTimeout(snackTimer);
    snackTimer = setTimeout(() => bar.classList.remove('is-open'), 2600);
  }

  const Lightbox = {
    images: [],
    index: 0,
    root: null,
    imgEl: null,
    counterEl: null,
    openLink: null,
    init() {
      if (this.root) return;
      this.imgEl = el('img', { referrerpolicy: 'no-referrer', alt: 'Preview' });
      this.imgEl.addEventListener('click', () => this.imgEl.classList.toggle('is-zoomed'));
      this.counterEl = el('span', { style: 'font-size:13px;font-weight:600;' });
      this.openLink = el('a', {
        className: 'm3-icon-btn',
        target: '_blank',
        rel: 'noopener noreferrer',
        title: '新标签页打开原图',
        style: 'color:#fff;',
        html: icon('open_new')
      });
      this.root = el('div', { className: 'm3-lightbox', id: 'sp-md3e-lightbox' }, [
        el('div', { className: 'm3-lightbox-bar' }, [
          this.counterEl,
          el('div', { style: 'display:flex;gap:8px;align-items:center;' }, [
            el('button', {
              className: 'm3-icon-btn',
              type: 'button',
              title: '缩放',
              style: 'color:#fff;',
              html: icon('zoom_in'),
              onClick: () => this.imgEl.classList.toggle('is-zoomed')
            }),
            this.openLink,
            el('button', {
              className: 'm3-icon-btn',
              type: 'button',
              title: '关闭 (Esc)',
              style: 'color:#fff;',
              html: icon('close'),
              onClick: () => this.close()
            })
          ])
        ]),
        el('div', {
          className: 'm3-lightbox-stage',
          onClick: (e) => {
            if (e.target === e.currentTarget) this.close();
          }
        }, [
          el('button', {
            className: 'm3-lightbox-nav m3-lightbox-prev',
            type: 'button',
            html: icon('chevron_left'),
            onClick: () => this.step(-1)
          }),
          this.imgEl,
          el('button', {
            className: 'm3-lightbox-nav m3-lightbox-next',
            type: 'button',
            html: icon('chevron_right'),
            onClick: () => this.step(1)
          })
        ])
      ]);
      document.body.appendChild(this.root);
    },
    open(images, startIndex = 0) {
      this.init();
      this.images = images && images.length ? images : [];
      if (!this.images.length) return;
      this.index = Math.max(0, Math.min(startIndex, this.images.length - 1));
      this.render();
      this.root.classList.add('is-open');
    },
    step(delta) {
      if (!this.images.length) return;
      this.index = (this.index + delta + this.images.length) % this.images.length;
      this.imgEl.classList.remove('is-zoomed');
      this.render();
    },
    render() {
      const src = this.images[this.index];
      this.imgEl.src = src;
      this.openLink.href = src;
      this.counterEl.textContent = `${this.index + 1} / ${this.images.length}`;
    },
    close() {
      if (this.root) this.root.classList.remove('is-open');
    }
  };

  function closeAllPopovers() {
    qsa('.m3-popover.is-open').forEach((p) => p.classList.remove('is-open'));
  }

  function openPopoverNear(popover, anchorEl) {
    const wasOpen = popover.classList.contains('is-open');
    closeAllPopovers();
    if (wasOpen) return;
    popover.classList.add('is-open');
    const rect = anchorEl.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    let top = rect.bottom + 8;
    let left = rect.right - popRect.width;
    if (top + popRect.height > window.innerHeight - 12) {
      top = Math.max(12, rect.top - popRect.height - 8);
    }
    if (left < 12) left = Math.min(rect.left, window.innerWidth - popRect.width - 12);
    popover.style.top = `${Math.round(top)}px`;
    popover.style.left = `${Math.round(left)}px`;
  }

  function buildPaginationNode(pag) {
    if (!pag) return null;
    const pills = el('div', { className: 'm3-page-pills' });
    pag.items.forEach((it) => {
      if (it.current) {
        pills.appendChild(el('span', { className: 'm3-page-pill is-current', text: it.label }));
      } else {
        pills.appendChild(el('a', { className: 'm3-page-pill m3-ripple-host', href: it.href, text: it.label }));
      }
    });

    const right = el('div', { className: 'm3-page-go' });
    if (pag.summary) {
      right.appendChild(el('span', { text: `第 ${pag.summary} 页` }));
    }
    if (pag.goTemplate) {
      const inp = el('input', { type: 'number', min: '1', placeholder: '页码' });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && inp.value.trim()) {
          location.href = pag.goTemplate + encodeURIComponent(inp.value.trim());
        }
      });
      right.appendChild(inp);
      right.appendChild(el('button', {
        type: 'button',
        className: 'm3-btn m3-btn-sm m3-btn-tonal',
        text: '跳转',
        onClick: () => {
          if (inp.value.trim()) location.href = pag.goTemplate + encodeURIComponent(inp.value.trim());
        }
      }));
    }

    return el('div', { className: 'm3-pagination' }, [pills, right]);
  }

  function renderTagBadges(tags) {
    return tags.map((t) => el('span', { className: `m3-badge m3-badge-${t.tone}`, text: t.label }));
  }

  function favorThread(tid, btnEl) {
    if (!tid) return;
    if (typeof window.sendmsg === 'function') {
      try {
        window.sendmsg(`pw_ajax.php?action=favor&tid=${encodeURIComponent(tid)}`, '', btnEl ? btnEl.id : '');
      } catch (_) {}
    } else {
      fetch(`pw_ajax.php?action=favor&tid=${encodeURIComponent(tid)}`, { credentials: 'include' }).catch(() => {});
    }
    showToast('已发送收藏请求');
  }

  /* ============================================================================
   * 6. PAGE BUILDERS
   * ========================================================================== */

  function buildIndexPage(mainMount, userCtx) {
    const containers = [];

    // 1. Site Pulse Hero
    const heroStats = [];
    if (userCtx.statsToday) heroStats.push(el('span', { className: 'm3-stat-pill', text: `今日 ${userCtx.statsToday}` }));
    if (userCtx.statsYesterday) heroStats.push(el('span', { className: 'm3-stat-pill', text: `昨日 ${userCtx.statsYesterday}` }));
    if (userCtx.statsMax) heroStats.push(el('span', { className: 'm3-stat-pill', text: `最高日 ${userCtx.statsMax}` }));
    if (userCtx.statsTotal) heroStats.push(el('span', { className: 'm3-stat-pill', text: userCtx.statsTotal }));

    const onlineTd = qs('#cate_info .tr2 td');
    if (onlineTd) {
      const onlineM = onlineTd.textContent.match(/共\s*\d+\s*人在线/);
      if (onlineM) heroStats.push(el('span', { className: 'm3-stat-pill', text: onlineM[0] }));
    }

    containers.push(el('section', { className: 'm3-pulse-hero' }, [
      el('div', {}, [
        el('h1', { className: 'm3-pulse-title', text: '南+ South Plus' }),
        el('div', { className: 'm3-pulse-stats' }, heroStats)
      ]),
      el('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;' }, [
        el('a', { className: 'm3-btn m3-btn-sm m3-btn-filled m3-ripple-host', href: 'search2.php?orderway-postdate-asc-desc-newatc-1.html', target: '_blank', html: `${icon('bolt')}<span>最新帖子</span>` }),
        el('a', { className: 'm3-btn m3-btn-sm m3-btn-tonal m3-ripple-host', href: 'job.php?action-sign.html', html: `${icon('check')}<span>标记已读</span>` }),
        el('a', { className: 'm3-btn m3-btn-sm m3-btn-outlined m3-ripple-host', href: 'plugin.php?H_name-tasks.html', html: `${icon('task')}<span>社区任务</span>` })
      ])
    ]));

    // 2. Site Announcements Banner
    const noticeItems = qsa('#notice0 ul li a');
    if (noticeItems.length > 0) {
      containers.push(el('div', { className: 'm3-notice-strip' }, [
        el('span', { html: icon('campaign'), style: 'display:inline-flex;' }),
        el('strong', { text: '站点公告', style: 'font-size:13px;' }),
        el('div', { className: 'm3-notice-items' }, noticeItems.map((a) => el('a', {
          href: a.getAttribute('href') || '#',
          text: a.textContent.trim()
        })))
      ]));
    }

    // 3. Top Feeds Bento Widget (with sessionStorage cache, quiet preload & skeleton guard)
    const feedTable = qs('#main > .t table');
    if (feedTable && !feedTable.closest('.contentwrap')) {
      const titles = qsa('tr.tr2 td', feedTable).map((td) => td.textContent.trim());
      const cells = qsa('tr.tr3 td', feedTable);
      if (titles.length && cells.length) {
        const segBar = el('div', { className: 'm3-segmented' });
        const feedGrid = el('div', { className: 'm3-feeds-grid' });
        const feedStates = [];
        let currentTab = 'all';

        const FEEDS_CACHE_KEY = 'sp_md3e_feeds_cache_v1';
        const FEEDS_CACHE_TTL = 120000;

        const readFeedsCache = () => {
          try {
            const raw = sessionStorage.getItem(FEEDS_CACHE_KEY);
            if (!raw) return {};
            const parsed = JSON.parse(raw);
            if (!parsed || Date.now() - (parsed.ts || 0) > FEEDS_CACHE_TTL) return {};
            return parsed.data || {};
          } catch (_) {
            return {};
          }
        };

        const writeFeedsCache = () => {
          try {
            const data = {};
            feedStates.forEach((st, idx) => {
              if (st.expandedLoaded && st.expandedItems.length) {
                data[String(idx)] = { title: st.title, items: st.expandedItems };
              }
            });
            sessionStorage.setItem(FEEDS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
          } catch (_) {}
        };

        const parseTidFromHref = (href) => {
          const m = (href || '').match(/tid[-=](\d+)/i);
          return m ? m[1] : '';
        };

        const cleanFeedTitle = (txt) => (txt || '').replace(/^[\s●•·]+/, '').trim();

        const getFallbackFeedUrl = (scriptSrc, title) => {
          if (/fidin=221/i.test(scriptSrc) || /GALGAME/i.test(title)) return 'thread.php?fid-221.html';
          if (/fidin=48/i.test(scriptSrc) || /求物/.test(title)) return 'thread.php?fid-48.html';
          if (/order=1/.test(scriptSrc) || /最新回复/.test(title)) return 'thread.php?fid-9.html';
          return 'search2.php?orderway-postdate-asc-desc-newatc-1.html';
        };

        const parseInitialFeedItems = (cell) => {
          if (!cell) return [];
          const items = [];
          const seen = new Set();
          qsa('a[href]', cell).forEach((a) => {
            const href = a.getAttribute('href') || '#';
            const title = cleanFeedTitle(a.getAttribute('title') || a.textContent);
            if (!title) return;
            const key = parseTidFromHref(href) || href;
            if (seen.has(key)) return;
            seen.add(key);
            items.push({ title, href, meta: '' });
          });
          return items;
        };

        const loadMoreFeedItems = async (state, force = false) => {
          if (state.loading) return;
          if (state.expandedLoaded && !force) return;
          state.loading = true;
          if (currentTab !== 'all' && feedStates[Number(currentTab)] === state) renderFeedBoxes();

          const merged = [];
          const byKey = new Map();
          const upsertItem = (item) => {
            const key = parseTidFromHref(item.href) || item.href;
            if (!item.title) return;
            const existing = byKey.get(key);
            if (!existing) {
              const entry = { title: item.title, href: item.href, meta: item.meta || '' };
              byKey.set(key, entry);
              merged.push(entry);
            } else {
              // Replace truncated ".." title when fuller title arrives
              const existingTruncated = /\.\.$/.test(existing.title);
              const incomingLonger = item.title.length > existing.title.length && !/\.\.$/.test(item.title);
              if (existingTruncated && incomingLonger) existing.title = item.title;
              if (!existing.meta && item.meta) existing.meta = item.meta;
            }
          };

          state.initialItems.forEach(upsertItem);

          try {
            if (state.scriptSrc) {
              const expandedSrc = state.scriptSrc
                .replace(/num=\d+/i, 'num=18')
                .replace(/length=\d+/i, 'length=96');
              const res = await fetch(expandedSrc, { credentials: 'include' });
              if (res.ok) {
                const text = await res.text();
                const tmp = document.createElement('div');
                const matches = [...text.matchAll(/<a\s+[^>]*href=['"]([^'"]+)['"][^>]*>([\s\S]*?)<\/a>/gi)];
                matches.forEach((m) => {
                  tmp.innerHTML = m[2];
                  const t = cleanFeedTitle(tmp.textContent);
                  if (t) upsertItem({ title: t, href: m[1], meta: '' });
                });
              }
            }
          } catch (_) {}

          try {
            if (merged.length < 18 && state.boardHref) {
              const res = await fetch(state.boardHref, { credentials: 'include' });
              if (res.ok) {
                const html = await res.text();
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const rows = qsa('#ajaxtable tr', doc);
                let inNormal = !rows.some((r) => r.classList.contains('tr2') && /普通主题/.test(r.textContent));
                for (const tr of rows) {
                  if (tr.classList.contains('tr2')) {
                    if (/普通主题/.test(tr.textContent)) inNormal = true;
                    continue;
                  }
                  if (!tr.classList.contains('tr3') || !inNormal) continue;
                  if (isAdElement(tr)) continue;
                  const cellsTr = qsa(':scope > td, :scope > th', tr);
                  if (cellsTr.length < 4) continue;
                  const titleA = qs('h3 a', cellsTr[1]) || qs('a', cellsTr[1]);
                  if (!titleA) continue;
                  const authorA = qs('a', cellsTr[2]);
                  const statTxt = cellsTr[3].textContent.replace(/\s+/g, ' ').trim();
                  const fullTitle = cleanFeedTitle(titleA.textContent);
                  const href = titleA.getAttribute('href') || '#';
                  const tid = parseTidFromHref(href);
                  if (tid && byKey.has(tid)) {
                    upsertItem({ title: fullTitle, href, meta: [authorA ? authorA.textContent.trim() : '', statTxt].filter(Boolean).join(' · ') });
                  } else if (merged.length < 18) {
                    upsertItem({
                      title: fullTitle,
                      href,
                      meta: [authorA ? authorA.textContent.trim() : '', statTxt].filter(Boolean).join(' · ')
                    });
                  }
                }
              }
            }
          } catch (_) {}

          state.expandedItems = merged.slice(0, 18);
          state.expandedLoaded = true;
          state.loading = false;
          writeFeedsCache();
          if (currentTab !== 'all' && feedStates[Number(currentTab)] === state) renderFeedBoxes();
        };

        const renderFeedBoxes = () => {
          const isSingle = currentTab !== 'all';
          feedGrid.classList.toggle('is-single', isSingle);
          feedGrid.innerHTML = '';

          feedStates.forEach((st, idx) => {
            if (isSingle && String(idx) !== String(currentTab)) return;
            const list = isSingle ? (st.expandedItems.length ? st.expandedItems : st.initialItems) : st.initialItems.slice(0, 6);

            const headLeft = el('div', { className: 'm3-feed-box-title' }, [
              el('span', { text: st.title }),
              isSingle ? el('span', { className: 'm3-badge m3-badge-primary', text: `${list.length} 条` }) : null,
              isSingle && st.loading ? el('span', { className: 'm3-badge m3-badge-neutral', text: '同步最新列表中...' }) : null
            ]);

            const headRight = isSingle
              ? el('div', { style: 'display:flex;align-items:center;gap:6px;' }, [
                  el('button', {
                    type: 'button',
                    className: 'm3-btn m3-btn-sm m3-btn-outlined',
                    html: `${icon('refresh')}<span>刷新</span>`,
                    onClick: () => loadMoreFeedItems(st, true)
                  }),
                  el('a', {
                    className: 'm3-btn m3-btn-sm m3-btn-tonal',
                    href: st.boardHref,
                    html: `<span>进入版块</span>${icon('chevron_right')}`
                  })
                ])
              : null;

            const body = el('div', { className: 'm3-feed-box-body' });
            if (list.length) {
              list.forEach((item, i) => {
                body.appendChild(el('a', {
                  className: 'm3-feed-item',
                  href: item.href,
                  target: '_blank',
                  title: item.title
                }, [
                  el('span', { className: 'm3-feed-num', text: String(i + 1) }),
                  el('span', { className: 'm3-feed-item-title', text: item.title }),
                  isSingle && item.meta ? el('span', { className: 'm3-feed-item-meta', text: item.meta }) : null
                ]));
              });
              if (isSingle && st.loading && list.length < 14) {
                for (let s = list.length; s < 14; s++) {
                  body.appendChild(el('div', { className: 'm3-feed-skeleton', 'aria-hidden': 'true' }));
                }
              }
            } else {
              body.appendChild(el('span', {
                style: 'opacity:.65;font-size:12.5px;',
                text: '动态排行由站内脚本实时加载（离线快照无实时数据）'
              }));
            }

            const foot = !isSingle
              ? el('div', { className: 'm3-feed-box-foot' }, [
                  el('button', {
                    type: 'button',
                    className: 'm3-btn m3-btn-sm m3-btn-text',
                    html: `<span>展开更多</span>${icon('chevron_right')}`,
                    onClick: () => applyFeedTab(idx)
                  })
                ])
              : null;

            feedGrid.appendChild(el('div', { className: 'm3-feed-box' }, [
              el('div', { className: 'm3-feed-box-head' }, [headLeft, headRight]),
              body,
              foot
            ]));
          });
        };

        const applyFeedTab = (activeIdx) => {
          currentTab = activeIdx;
          qsa('.m3-seg-btn', segBar).forEach((b) => {
            b.classList.toggle('is-active', b.dataset.idx === String(activeIdx));
          });
          renderFeedBoxes();
          if (activeIdx !== 'all') {
            const st = feedStates[Number(activeIdx)];
            if (st && !st.expandedLoaded) loadMoreFeedItems(st);
          }
        };

        const cachedFeeds = readFeedsCache();
        titles.forEach((title, idx) => {
          const cell = cells[idx];
          const scriptEl = cell ? qs('script[src*="new.php"]', cell) : null;
          const scriptSrc = scriptEl ? scriptEl.getAttribute('src') || '' : '';
          const initialItems = parseInitialFeedItems(cell);
          const cached = cachedFeeds[String(idx)];
          const hasCache = !!(cached && cached.title === title && Array.isArray(cached.items) && cached.items.length >= initialItems.length);
          feedStates.push({
            title,
            scriptSrc,
            boardHref: getFallbackFeedUrl(scriptSrc, title),
            initialItems,
            expandedItems: hasCache ? cached.items : initialItems.slice(),
            expandedLoaded: hasCache,
            loading: false
          });
        });

        setTimeout(() => {
          feedStates.forEach((st) => {
            if (!st.expandedLoaded && !st.loading) loadMoreFeedItems(st);
          });
        }, 120);

        segBar.appendChild(el('button', {
          type: 'button',
          className: 'm3-seg-btn is-active',
          text: '全部看板',
          dataset: { idx: 'all' },
          onClick: () => applyFeedTab('all')
        }));
        titles.forEach((t, idx) => {
          segBar.appendChild(el('button', {
            type: 'button',
            className: 'm3-seg-btn',
            text: t,
            dataset: { idx: String(idx) },
            onClick: () => applyFeedTab(idx)
          }));
        });

        renderFeedBoxes();

        containers.push(el('section', { className: 'm3-card' }, [
          el('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;' }, [
            el('strong', { text: '实时动态聚合', style: 'font-size:15px;' }),
            segBar
          ]),
          feedGrid
        ]));
      }
    }

    // 4. Forum Categories & Board Cards
    const collapsedMap = Store.get('collapsedCategories') || {};
    qsa('.contentwrap .t[id^="t_"]').forEach((catBox) => {
      const cid = catBox.id.replace('t_', '');
      const h2a = qs('th.h h2 a', catBox);
      if (!h2a) return;
      const grid = el('div', { className: 'm3-board-grid' });

      qsa('tr[id^="fid_"]', catBox).forEach((tr) => {
        const fid = tr.id.replace('fid_', '');
        const titleA = qs(`#fn_${fid}`, tr) || qs('h3 a', tr);
        if (!titleA) return;
        const iconImg = qs('td.icon img', tr);
        const iconSrc = iconImg ? iconImg.getAttribute('src') || '' : '';
        const hasNew = /new\.gif/i.test(iconSrc);
        const isLocked = /lock\.gif/i.test(iconSrc);
        const todaySpan = qs('th span.s3', tr);
        const todayCount = todaySpan ? todaySpan.textContent.replace(/[()]/g, '').trim() : '0';
        const descEl = qs(`#desc_${fid}`, tr);
        const subLinks = qsa('th > div h3 a', tr);
        const statsTd = qs('td.tal.y-style.f10.e', tr);
        const lastTh = qsa('th', tr)[1];
        const lastA = lastTh ? qs('a.a2', lastTh) : null;
        const lastMeta = lastTh ? qs('span.gray2', lastTh) : null;

        const subWrap = el('div', { className: 'm3-subforum-wrap' });
        const MAX_SUB = 6;
        subLinks.forEach((sa, idx) => {
          const chip = el('a', {
            className: 'm3-sub-chip',
            href: sa.getAttribute('href') || '#',
            text: sa.textContent.trim(),
            style: idx >= MAX_SUB ? 'display:none;' : ''
          });
          subWrap.appendChild(chip);
        });
        if (subLinks.length > MAX_SUB) {
          const expandBtn = el('button', {
            type: 'button',
            className: 'm3-sub-chip',
            text: `+${subLinks.length - MAX_SUB} 展开`,
            style: 'background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:600;',
            onClick: () => {
              qsa('.m3-sub-chip', subWrap).forEach((c) => { c.style.display = ''; });
              expandBtn.remove();
            }
          });
          subWrap.appendChild(expandBtn);
        }

        const card = el('article', {
          className: 'm3-board-card',
          dataset: { filterText: `${titleA.textContent} ${descEl ? descEl.textContent : ''} ${subLinks.map((s) => s.textContent).join(' ')}`.toLowerCase() }
        }, [
          el('div', { className: 'm3-board-head' }, [
            el('div', { style: 'display:flex;align-items:center;gap:12px;min-width:0;' }, [
              el('div', {
                className: `m3-board-icon ${hasNew ? 'has-new' : ''}`,
                html: icon(isLocked ? 'lock' : 'forum')
              }),
              el('div', { style: 'min-width:0;' }, [
                el('a', { className: 'm3-board-title', href: titleA.getAttribute('href') || '#', text: titleA.textContent.trim() }),
                descEl && descEl.innerHTML.trim()
                  ? el('div', { className: 'm3-board-desc', html: descEl.innerHTML })
                  : null
              ])
            ]),
            todayCount !== '0'
              ? el('span', { className: 'm3-badge m3-badge-primary', text: `今日 +${todayCount}` })
              : el('span', { className: 'm3-badge m3-badge-neutral', text: '0' })
          ]),
          subLinks.length ? subWrap : null,
          el('div', { className: 'm3-board-foot' }, [
            el('span', { text: statsTd ? statsTd.textContent.replace(/\s+/g, ' ').trim() : '', style: 'flex-shrink:0;' }),
            lastA
              ? el('div', { className: 'm3-board-last', title: lastA.textContent.trim() }, [
                  el('a', { href: lastA.getAttribute('href') || '#', text: lastA.textContent.trim() }),
                  lastMeta ? el('span', { text: ` · ${lastMeta.textContent.trim()}`, style: 'opacity:.75;' }) : null
                ])
              : null
          ])
        ]);

        grid.appendChild(card);
      });

      const acc = el('section', {
        className: `m3-accordion ${collapsedMap[cid] ? 'is-collapsed' : ''}`
      }, [
        el('button', {
          type: 'button',
          className: 'm3-accordion-head',
          onClick: () => {
            const next = !acc.classList.contains('is-collapsed');
            acc.classList.toggle('is-collapsed', next);
            const map = Object.assign({}, Store.get('collapsedCategories') || {});
            map[cid] = next;
            Store.set('collapsedCategories', map);
          }
        }, [
          el('span', { text: h2a.textContent.trim() }),
          el('span', { className: 'm3-accordion-chev', html: icon('chevron_down') })
        ]),
        el('div', { className: 'm3-accordion-body' }, [grid])
      ]);
      containers.push(acc);
    });

    // 5. Forum Links & Online Info
    const cateInfo = qs('#cate_info');
    if (cateInfo) {
      const linkChips = qsa('a', cateInfo).filter((a) => !a.getAttribute('name')).map((a) => el('a', {
        className: 'm3-sub-chip',
        href: a.getAttribute('href') || '#',
        target: '_blank',
        rel: 'noopener noreferrer',
        text: a.textContent.replace(/[\[\]]/g, '').trim()
      })).filter((a) => a.textContent);

      if (linkChips.length) {
        const infoAcc = el('section', { className: 'm3-accordion is-collapsed' }, [
          el('button', {
            type: 'button',
            className: 'm3-accordion-head',
            onClick: () => infoAcc.classList.toggle('is-collapsed')
          }, [
            el('span', { text: '友情链接与在线统计' }),
            el('span', { className: 'm3-accordion-chev', html: icon('chevron_down') })
          ]),
          el('div', { className: 'm3-accordion-body' }, [
            el('div', { className: 'm3-subforum-wrap' }, linkChips)
          ])
        ]);
        containers.push(infoAcc);
      }
    }

    containers.forEach((c) => mainMount.appendChild(c));
  }

  function buildForumSharedHeader(crumbsInfo) {
    const nodes = [];
    const forumCrumb = crumbsInfo.crumbs[crumbsInfo.crumbs.length - 1];
    const forumTitle = forumCrumb ? forumCrumb.text : document.title.split('-')[0].trim();
    const postBtnA = qs('#td_post') ? qs('#td_post').closest('a') : qs('a[href^="post.php?fid-"]');
    const isWall = detectPageType() === 'thread_wall';

    // Mode Switcher URLs
    let listHref = '';
    let wallHref = '';
    if (crumbsInfo.modeLink) {
      if (isWall) {
        wallHref = location.href;
        listHref = crumbsInfo.modeLink.href;
      } else {
        listHref = location.href;
        wallHref = crumbsInfo.modeLink.href;
      }
    }

    const heroActions = el('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:10px;' });
    if (listHref && wallHref) {
      heroActions.appendChild(el('div', { className: 'm3-segmented' }, [
        el('a', { className: `m3-seg-btn ${!isWall ? 'is-active' : ''}`, href: listHref, html: `${icon('list')}<span>列表</span>` }),
        el('a', { className: `m3-seg-btn ${isWall ? 'is-active' : ''}`, href: wallHref, html: `${icon('grid')}<span>图墙</span>` })
      ]));
    }
    if (crumbsInfo.shortcutNode) {
      const scWrap = el('button', {
        type: 'button',
        className: 'm3-btn m3-btn-sm m3-btn-tonal m3-ripple-host',
        html: `${icon('star')}<span>收藏版块</span>`,
        onClick: () => {
          const origA = qs('a', crumbsInfo.shortcutNode);
          if (origA) origA.click();
          showToast('已切换版块收藏状态');
        }
      });
      heroActions.appendChild(scWrap);
    }
    if (crumbsInfo.rssHref) {
      heroActions.appendChild(el('a', {
        className: 'm3-icon-btn is-tonal',
        href: crumbsInfo.rssHref,
        target: '_blank',
        title: 'RSS 订阅',
        html: icon('rss')
      }));
    }
    if (postBtnA) {
      heroActions.appendChild(el('a', {
        className: 'm3-btn m3-btn-filled m3-ripple-host',
        href: postBtnA.getAttribute('href') || '#',
        html: `${icon('edit')}<span>发布新帖</span>`
      }));
    }

    nodes.push(el('section', { className: 'm3-forum-hero' }, [
      el('div', {}, [
        el('h1', { className: 'm3-forum-hero-title', text: forumTitle }),
        el('div', { style: 'font-size:12.5px;color:var(--md-on-surface-variant);margin-top:4px;' }, [
          el('span', { text: isWall ? '图墙画廊视图' : '主题列表视图' })
        ])
      ]),
      heroActions
    ]));

    // Announcement Accordion (#tab_1)
    const noticeTab = qs('#cate_thread #tab_1') || qs('#tab_1');
    if (noticeTab && noticeTab.innerHTML.trim()) {
      const noticeBody = el('div', { className: 'm3-accordion-body m3-post-body' });
      noticeBody.appendChild(noticeTab);
      const noticeAcc = el('section', {
        className: `m3-accordion ${Store.get('collapseNoticeByDefault') ? 'is-collapsed' : ''}`
      }, [
        el('button', {
          type: 'button',
          className: 'm3-accordion-head',
          onClick: () => noticeAcc.classList.toggle('is-collapsed')
        }, [
          el('span', { style: 'display:inline-flex;align-items:center;gap:8px;', html: `${icon('campaign')}<span>版块公告与发帖规范</span>` }),
          el('span', { className: 'm3-accordion-chev', html: icon('chevron_down') })
        ]),
        noticeBody
      ]);
      nodes.push(noticeAcc);
    }

    // Sub-forums Strip (#cate_children)
    const childTbody = qs('#cate_children');
    if (childTbody) {
      const subRow = el('div', { className: 'm3-card', style: 'padding:14px 18px;display:flex;flex-wrap:wrap;align-items:center;gap:10px;' }, [
        el('strong', { text: '子版块', style: 'font-size:13px;color:var(--md-on-surface-variant);' })
      ]);
      qsa('tr.tr3', childTbody).forEach((tr) => {
        const a = qs('h2 a', tr);
        if (!a) return;
        const countTd = qs('td.f10', tr);
        subRow.appendChild(el('a', {
          className: 'm3-chip m3-ripple-host',
          href: a.getAttribute('href') || '#',
          html: `${icon('forum')}<span>${escapeHtml(a.textContent.trim())}</span>${countTd ? `<span style="opacity:.7;font-size:11px;">(${escapeHtml(countTd.textContent.trim())})</span>` : ''}`
        }));
      });
      nodes.push(subRow);
    }

    // Filter Chips + Sort Form
    const filterRow = el('div', { className: 'm3-toolbar-row' });
    const chipStrip = el('div', { className: 'm3-chip-strip' });
    qsa('.threadlist li').forEach((li) => {
      const a = qs('a', li);
      if (!a) return;
      chipStrip.appendChild(el('a', {
        className: `m3-chip m3-ripple-host ${li.classList.contains('current') ? 'is-selected' : ''}`,
        href: a.getAttribute('href') || '#',
        text: a.textContent.trim()
      }));
    });
    filterRow.appendChild(chipStrip);

    const nativeSortForm = qs('form[action*="thread.php"]');
    if (nativeSortForm) {
      const sortBar = el('div', { className: 'm3-sort-bar' });
      qsa('select', nativeSortForm).forEach((origSel) => {
        const cloneSel = el('select', { className: 'm3-select', name: origSel.name });
        qsa('option', origSel).forEach((opt) => {
          const o = el('option', { value: opt.value, text: opt.textContent });
          if (opt.selected) o.selected = true;
          cloneSel.appendChild(o);
        });
        cloneSel.addEventListener('change', () => {
          origSel.value = cloneSel.value;
          nativeSortForm.submit();
        });
        sortBar.appendChild(cloneSel);
      });
      const readlogBtn = qs('#readlog');
      if (readlogBtn) {
        sortBar.appendChild(el('button', {
          type: 'button',
          className: 'm3-btn m3-btn-sm m3-btn-outlined',
          html: `${icon('history')}<span>浏览记录</span>`,
          onClick: () => readlogBtn.click()
        }));
      }
      filterRow.appendChild(sortBar);
    }
    nodes.push(filterRow);

    return nodes;
  }

  function buildThreadRow(tr) {
    const cells = qsa(':scope > td, :scope > th', tr);
    if (cells.length < 5) return null;
    if (Store.get('cleanAds') && isAdElement(tr)) return null;

    const statusImg = qs('img', cells[0]);
    const statusSrc = statusImg ? statusImg.getAttribute('src') || '' : '';
    const isAnc = /anc\.gif/i.test(statusSrc);
    const isPinned = !!qs('img[src*="headtopic_"]', cells[1]);
    const isDigest = !!qs('img[src*="digest_"]', cells[1]);
    const hasImg = !!qs('img[src*="file/img.gif"]', cells[1]);
    const hasZip = !!qs('img[src*="file/zip.gif"]', cells[1]);
    const isNew = /topicnew\.gif/i.test(statusSrc) || !!qs('img[src*="file/new.gif"]', cells[1]);
    const isHot = /topichot\.gif/i.test(statusSrc);
    const isLock = /topiclock\.gif|topicclose\.gif/i.test(statusSrc);
    const isVote = /vote/i.test(statusSrc);

    const h3 = qs('h3', cells[1]);
    const titleA = h3 ? qs('a', h3) : qs('a', cells[1]);
    if (!titleA) return null;

    const typeA = qs('a.s8', cells[1]);
    const authorA = qs('a', cells[2]);
    const postDateEl = qs('.f10', cells[2]);
    const statText = cells[3].textContent.replace(/\s+/g, ' ').trim();
    const lastA = qs('a', cells[4]);
    const lastByEl = qs('.gray2', cells[4]);
    const multiPageLinks = qsa('.tpage a', cells[1]);

    const statusClass = isLock ? 'is-lock' : isNew ? 'is-new' : isHot ? 'is-hot' : '';
    const statusIconName = isAnc ? 'campaign' : isPinned ? 'push_pin' : isVote ? 'poll' : isLock ? 'lock' : isHot ? 'bolt' : 'forum';

    const titleLine = el('div', { className: 'm3-thread-title-line' });
    if (isPinned) titleLine.appendChild(el('span', { className: 'm3-badge m3-badge-primary', text: '置顶' }));
    if (isDigest) titleLine.appendChild(el('span', { className: 'm3-badge m3-badge-tertiary', text: '精华' }));
    if (typeA) {
      titleLine.appendChild(el('a', {
        className: 'm3-badge m3-badge-secondary',
        href: typeA.getAttribute('href') || '#',
        text: typeA.textContent.replace(/[\[\]]/g, '').trim()
      }));
    }
    titleLine.appendChild(el('a', {
      className: 'm3-thread-link',
      href: titleA.getAttribute('href') || '#',
      text: titleA.textContent.trim()
    }));
    if (hasImg) titleLine.appendChild(el('span', { className: 'm3-badge m3-badge-neutral', html: icon('image'), title: '含图片' }));
    if (hasZip) titleLine.appendChild(el('span', { className: 'm3-badge m3-badge-neutral', html: icon('zip'), title: '含附件' }));
    if (isNew) titleLine.appendChild(el('span', { className: 'm3-badge m3-badge-error', text: 'NEW' }));

    const subMeta = el('div', { className: 'm3-thread-submeta' });
    if (authorA) {
      subMeta.appendChild(el('a', {
        href: authorA.getAttribute('href') || '#',
        text: authorA.textContent.trim(),
        style: 'color:var(--md-on-surface-variant);font-weight:600;'
      }));
    }
    if (postDateEl) {
      subMeta.appendChild(el('span', { text: `发表于 ${postDateEl.textContent.trim()}` }));
    }
    if (multiPageLinks.length) {
      const jump = el('div', { className: 'm3-page-jump' });
      multiPageLinks.forEach((pa) => {
        jump.appendChild(el('a', { href: pa.getAttribute('href') || '#', text: pa.textContent.trim() }));
      });
      subMeta.appendChild(jump);
    }

    const statsCol = el('div', { className: 'm3-thread-stats' }, [
      el('span', { className: 'm3-badge m3-badge-neutral', text: `回复/人气 ${statText}` }),
      lastA
        ? el('div', {}, [
            el('a', { href: lastA.getAttribute('href') || '#', text: lastA.textContent.trim(), style: 'color:var(--md-on-surface-variant);' }),
            lastByEl ? el('span', { text: ` · ${lastByEl.textContent.replace(/^by:\s*/i, '').trim()}` }) : null
          ])
        : null
    ]);

    return {
      isPinnedOrAnc: isAnc || isPinned,
      node: el('article', {
        className: 'm3-group-item m3-thread-row',
        dataset: { filterText: `${titleA.textContent} ${authorA ? authorA.textContent : ''}`.toLowerCase() }
      }, [
        el('div', { className: `m3-thread-status ${statusClass}`, html: icon(statusIconName) }),
        el('div', { className: 'm3-thread-main' }, [titleLine, subMeta]),
        statsCol
      ])
    };
  }

  function buildPinnedSection(pinnedNodes) {
    if (!pinnedNodes.length) return null;
    const list = el('div', { className: 'm3-group-list' }, pinnedNodes);
    const acc = el('section', {
      className: `m3-accordion ${Store.get('collapsePinnedByDefault') ? 'is-collapsed' : ''}`
    }, [
      el('button', {
        type: 'button',
        className: 'm3-accordion-head',
        onClick: () => acc.classList.toggle('is-collapsed')
      }, [
        el('span', { style: 'display:inline-flex;align-items:center;gap:8px;', html: `${icon('push_pin')}<span>置顶与版块公告帖 (${pinnedNodes.length})</span>` }),
        el('span', { className: 'm3-accordion-chev', html: icon('chevron_down') })
      ]),
      el('div', { className: 'm3-accordion-body' }, [list])
    ]);
    return acc;
  }

  function buildThreadListPage(mainMount, crumbsInfo) {
    buildForumSharedHeader(crumbsInfo).forEach((n) => mainMount.appendChild(n));

    const topPag = buildPaginationNode(extractPagination());
    if (topPag) mainMount.appendChild(topPag);

    const pinnedNodes = [];
    const normalNodes = [];
    let passedNormalSplit = false;

    qsa('#ajaxtable tr').forEach((tr) => {
      if (tr.classList.contains('tr2')) {
        if (/普通主题/.test(tr.textContent)) passedNormalSplit = true;
        return;
      }
      if (!tr.classList.contains('tr3')) return;
      const built = buildThreadRow(tr);
      if (!built) return;
      if (!passedNormalSplit && built.isPinnedOrAnc) pinnedNodes.push(built.node);
      else normalNodes.push(built.node);
    });

    const pinnedAcc = buildPinnedSection(pinnedNodes);
    if (pinnedAcc) mainMount.appendChild(pinnedAcc);

    if (normalNodes.length) {
      mainMount.appendChild(el('section', { className: 'm3-group-list' }, normalNodes));
    } else {
      mainMount.appendChild(el('div', { className: 'm3-card', text: '当前筛选下暂无主题帖。' }));
    }

    const botPag = buildPaginationNode(extractPagination());
    if (botPag) mainMount.appendChild(botPag);
  }

  function buildThreadWallPage(mainMount, crumbsInfo) {
    buildForumSharedHeader(crumbsInfo).forEach((n) => mainMount.appendChild(n));

    const pinnedNodes = [];
    qsa('#ajaxtable tr.tr3').forEach((tr) => {
      const built = buildThreadRow(tr);
      if (built) pinnedNodes.push(built.node);
    });
    const pinnedAcc = buildPinnedSection(pinnedNodes);
    if (pinnedAcc) mainMount.appendChild(pinnedAcc);

    const wallGrid = el('section', {
      className: `m3-wall-grid ${Store.get('wallAspect') === 'contain' ? 'is-contain' : ''}`
    });

    const wallToolbar = el('div', { className: 'm3-toolbar-row' }, [
      el('span', { style: 'font-size:13px;font-weight:700;color:var(--md-on-surface-variant);', text: '资源图墙' }),
      el('div', { className: 'm3-segmented' }, [
        el('button', {
          type: 'button',
          className: `m3-seg-btn ${Store.get('wallAspect') === 'cover' ? 'is-active' : ''}`,
          text: '裁剪填充',
          onClick: (e) => {
            Store.set('wallAspect', 'cover');
            wallGrid.classList.remove('is-contain');
            qsa('.m3-seg-btn', e.currentTarget.parentElement).forEach((b, i) => b.classList.toggle('is-active', i === 0));
          }
        }),
        el('button', {
          type: 'button',
          className: `m3-seg-btn ${Store.get('wallAspect') === 'contain' ? 'is-active' : ''}`,
          text: '完整比例',
          onClick: (e) => {
            Store.set('wallAspect', 'contain');
            wallGrid.classList.add('is-contain');
            qsa('.m3-seg-btn', e.currentTarget.parentElement).forEach((b, i) => b.classList.toggle('is-active', i === 1));
          }
        })
      ])
    ]);
    mainMount.appendChild(wallToolbar);

    const topPag = buildPaginationNode(extractPagination());
    if (topPag) mainMount.appendChild(topPag);

    const wallImages = [];
    qsa('#wall .stream li.dcsns-li').forEach((li) => {
      const titleA = qs('.section-title a', li);
      if (!titleA) return;
      const href = titleA.getAttribute('href') || '#';
      const tidM = href.match(/tid[-=](\d+)/i);
      const tid = tidM ? tidM[1] : '';
      const img = qs('.section-text img', li);
      const imgSrc = img ? img.getAttribute('src') || '' : '';
      const isNoImg = !imgSrc || /noimageavailble/i.test(imgSrc);
      if (!isNoImg) wallImages.push(imgSrc);
      const imgIndex = wallImages.length - 1;

      const parsed = parseSmartTitle(titleA.textContent);
      const textWrap = qs('.section-text', li);
      const statsMatch = textWrap ? textWrap.textContent.match(/回复\/人气：\s*([\d]+\s*\/\s*[\d]+)/) : null;
      const statsStr = statsMatch ? statsMatch[1].replace(/\s+/g, '') : '';
      const authorA = qs('.section-intro a', li);
      const dateTd = qsa('.section-intro td', li)[1];

      const mediaEl = el('div', { className: 'm3-wall-media' }, [
        isNoImg
          ? el('div', {
              style: 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:var(--md-on-surface-variant);',
              html: `${icon('image', 'm3-icon-lg')}<span style="font-size:12px;">暂无封面图</span>`
            })
          : el('a', { href, target: '_blank' }, [
              el('img', { src: imgSrc, loading: 'lazy', referrerpolicy: 'no-referrer', alt: parsed.clean })
            ]),
        el('div', { className: 'm3-wall-overlay' }, [
          !isNoImg
            ? el('button', {
                type: 'button',
                className: 'm3-wall-float-btn',
                title: '放大预览',
                html: icon('zoom_in'),
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  Lightbox.open(wallImages, imgIndex);
                }
              })
            : null,
          tid
            ? el('button', {
                type: 'button',
                id: `sp_favor_${tid}`,
                className: 'm3-wall-float-btn',
                title: '收藏该主题',
                html: icon('bookmark'),
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.innerHTML = icon('bookmark_filled');
                  favorThread(tid, e.currentTarget);
                }
              })
            : null
        ])
      ]);

      wallGrid.appendChild(el('article', {
        className: 'm3-wall-card',
        dataset: { filterText: `${parsed.raw} ${authorA ? authorA.textContent : ''}`.toLowerCase() }
      }, [
        mediaEl,
        el('div', { className: 'm3-wall-body' }, [
          parsed.tags.length ? el('div', { className: 'm3-wall-tags' }, renderTagBadges(parsed.tags.slice(0, 4))) : null,
          el('a', { className: 'm3-wall-title', href, target: '_blank', title: parsed.raw, text: parsed.clean }),
          el('div', { className: 'm3-wall-foot' }, [
            authorA
              ? el('a', { href: authorA.getAttribute('href') || '#', target: '_blank', text: authorA.textContent.trim(), style: 'color:var(--md-on-surface-variant);font-weight:600;' })
              : el('span', { text: '' }),
            el('span', { text: `${statsStr ? `${statsStr} · ` : ''}${dateTd ? dateTd.textContent.trim() : ''}` })
          ])
        ])
      ]));
    });

    mainMount.appendChild(wallGrid);
    const botPag = buildPaginationNode(extractPagination());
    if (botPag) mainMount.appendChild(botPag);
  }

  function buildReadPage(mainMount) {
    const subjectH1 = qs('#subject_tpc');
    const rawTitle = subjectH1 ? subjectH1.textContent.trim() : document.title.split('|')[0].trim();
    const parsedTitle = parseSmartTitle(rawTitle);

    const prevThreadA = qs('a[href*="goto-previous"]');
    const nextThreadA = qs('a[href*="goto-next"]');
    const newPostA = qs('#td_post') ? qs('#td_post').closest('a') : qs('a[href^="post.php?fid-"]');
    const replyPageA = qs('a[href*="post.php?action-reply"]');
    const printA = qs('.h2 a[href*="/simple/"]');
    const opOnlyA = qs('.tiptop a[href*="read.php?tid-"][href*="-uid-"]');
    const tidMatch = location.href.match(/tid[-=](\d+)/i) || (qs('input[name="tid"]') ? [null, qs('input[name="tid"]').value] : null);
    const tid = tidMatch ? tidMatch[1] : '';

    // 1. Thread Hero Card
    const fontSeg = el('div', { className: 'm3-segmented' });
    [
      { key: 'small', label: '小' },
      { key: 'medium', label: '中' },
      { key: 'large', label: '大' }
    ].forEach((f) => {
      const btn = el('button', {
        type: 'button',
        className: `m3-seg-btn ${Store.get('fontSize') === f.key ? 'is-active' : ''}`,
        text: f.label,
        onClick: () => {
          Store.set('fontSize', f.key);
          applyThemeTokens();
          qsa('.m3-seg-btn', fontSeg).forEach((b) => b.classList.toggle('is-active', b === btn));
        }
      });
      fontSeg.appendChild(btn);
    });

    const heroActions = el('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;' }, [
      el('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;align-items:center;' }, [
        prevThreadA ? el('a', { className: 'm3-btn m3-btn-sm m3-btn-outlined', href: prevThreadA.getAttribute('href'), html: `${icon('chevron_left')}<span>上一主题</span>` }) : null,
        nextThreadA ? el('a', { className: 'm3-btn m3-btn-sm m3-btn-outlined', href: nextThreadA.getAttribute('href'), html: `<span>下一主题</span>${icon('chevron_right')}` }) : null,
        opOnlyA ? el('a', { className: 'm3-btn m3-btn-sm m3-btn-tonal', href: opOnlyA.getAttribute('href'), html: `${icon('eye')}<span>只看楼主</span>` }) : null,
        tid ? el('button', {
          type: 'button',
          className: 'm3-btn m3-btn-sm m3-btn-tonal m3-ripple-host',
          html: `${icon('bookmark')}<span>收藏主题</span>`,
          onClick: (e) => favorThread(tid, e.currentTarget)
        }) : null,
        el('button', {
          type: 'button',
          className: 'm3-btn m3-btn-sm m3-btn-text',
          html: `${icon('copy')}<span>复制链接</span>`,
          onClick: () => {
            navigator.clipboard?.writeText(location.href).catch(() => {});
            showToast('已复制本帖链接');
          }
        }),
        printA ? el('a', { className: 'm3-icon-btn', href: printA.getAttribute('href'), title: '打印 / 无图版', html: icon('print') }) : null
      ]),
      el('div', { style: 'display:flex;align-items:center;gap:8px;' }, [
        fontSeg,
        replyPageA ? el('a', { className: 'm3-btn m3-btn-sm m3-btn-filled', href: replyPageA.getAttribute('href'), html: `${icon('reply')}<span>高级回复</span>` }) : null,
        newPostA ? el('a', { className: 'm3-btn m3-btn-sm m3-btn-tonal', href: newPostA.getAttribute('href'), html: `${icon('edit')}<span>发新帖</span>` }) : null
      ])
    ]);

    mainMount.appendChild(el('section', { className: 'm3-thread-hero' }, [
      parsedTitle.tags.length ? el('div', { className: 'm3-wall-tags' }, renderTagBadges(parsedTitle.tags)) : null,
      el('h1', { className: 'm3-thread-h1', text: rawTitle }),
      heroActions
    ]));

    const topPag = buildPaginationNode(extractPagination());
    if (topPag) mainMount.appendChild(topPag);

    // 2. Collect all content images for Lightbox gallery
    const allPostImages = [];
    const postListEl = el('div', { className: 'm3-post-list' });
    const floorEntries = [];
    let opAuthorName = '';

    // Shared Popover for Author User Info
    const userPopover = el('div', { className: 'm3-popover', id: 'sp-md3e-author-pop' });
    document.body.appendChild(userPopover);

    // Shared Popover for Overflow Actions (Peacemaker etc.)
    const postMenuPop = el('div', { className: 'm3-popover', id: 'sp-md3e-post-menu' });
    document.body.appendChild(postMenuPop);

    const postTables = qsa('table.js-post');
    postTables.forEach((tbl, idx) => {
      const tpcContent = qs('.tpc_content [id^="read_"]', tbl);
      if (!tpcContent) return;
      const pid = tpcContent.id.replace('read_', '');
      const isOP = pid === 'tpc' || idx === 0;

      // Preserve anchor above table
      const prevAnchor = tbl.parentElement && tbl.parentElement.previousElementSibling;
      const anchorName = (prevAnchor && prevAnchor.tagName === 'A' && prevAnchor.getAttribute('name')) || pid;

      const authorLink = qs('th.r_two div[align="center"] a', tbl);
      const authorName = authorLink ? authorLink.textContent.trim() : '匿名用户';
      if (isOP) opAuthorName = authorName;

      const avatarImg = qs('.user-pic img', tbl);
      const avatarSrc = avatarImg ? avatarImg.getAttribute('src') || '' : '';
      const showFace = qs('[id^="showface_"]', tbl);

      const floorA = qs('.tiptop a.s3', tbl);
      const floorText = floorA ? floorA.textContent.trim() : (isOP ? 'GF' : `B${idx}F`);
      const timeSpan = qs('.tiptop span.fl.gray', tbl);
      const timeText = timeSpan ? timeSpan.textContent.trim() : '';
      const bianjiEl = qs('.tiptop .bianji', tbl);
      const bianjiText = bianjiEl ? bianjiEl.textContent.trim() : '';
      const onlyAuthorA = qs('.tiptop .fr a[href*="-uid-"]', tbl);
      const peacemakers = qsa('.apeacemaker', tbl);

      // Re-parent post content
      const bodyWrap = el('div', { className: 'm3-post-body' });
      const contentBox = qs(`#td_${pid} .tpc_content`, tbl) || tpcContent.parentElement;
      if (contentBox) {
        // Remove fixed width attributes & bind lightbox on images
        qsa('img', contentBox).forEach((img) => {
          const src = img.getAttribute('data-original-src') || img.getAttribute('src') || '';
          if (!src || /smile\//i.test(src)) return;
          img.removeAttribute('width');
          img.removeAttribute('height');
          img.removeAttribute('onload');
          img.removeAttribute('onclick');
          const imgIdx = allPostImages.length;
          allPostImages.push(src);
          img.addEventListener('click', (e) => {
            e.preventDefault();
            Lightbox.open(allPostImages, imgIdx);
          });
        });

        // Upgrade h6.quote.jumbotron purchase box to MD3E Buy / Unlocked Card
        qsa('h6.quote.jumbotron', contentBox).forEach((hq) => {
          const spanText = qs('span', hq)?.textContent.trim() || hq.textContent.trim();
          const origBtn = qs('input[type="button"], button', hq);
          const onclickCode = origBtn ? origBtn.getAttribute('onclick') || '' : '';
          const hasBuyAction = !!(origBtn || /location\.href\s*=/.test(hq.innerHTML));

          if (!hasBuyAction) {
            const unlockedCard = el('div', { className: 'm3-buy-card is-unlocked' }, [
              el('div', { className: 'm3-buy-info' }, [
                el('div', { className: 'm3-buy-icon', html: icon('check') }),
                el('div', {}, [
                  el('div', { text: '资源已解锁 · 已购买', style: 'font-weight:700;font-size:14px;' }),
                  el('div', { text: spanText, style: 'font-size:12.5px;opacity:.85;' })
                ])
              ]),
              el('span', {
                className: 'm3-buy-status-pill',
                html: `${icon('check')}<span>已购买</span>`
              })
            ]);
            hq.replaceWith(unlockedCard);
            return;
          }

          const buyBtn = el('button', {
            type: 'button',
            className: 'm3-btn m3-btn-filled m3-ripple-host',
            html: `${icon('coins')}<span>${escapeHtml(origBtn?.value || '购买主题')}</span>`,
            onClick: () => {
              if (origBtn && typeof origBtn.onclick === 'function') origBtn.onclick();
              else if (onclickCode) {
                const m = onclickCode.match(/location\.href\s*=\s*'([^']+)'/);
                if (m) location.href = m[1];
              }
            }
          });
          const buyCard = el('div', { className: 'm3-buy-card' }, [
            el('div', { className: 'm3-buy-info' }, [
              el('div', { className: 'm3-buy-icon', html: icon('lock') }),
              el('div', {}, [
                el('div', { text: '付费资源内容', style: 'font-weight:700;font-size:14px;' }),
                el('div', { text: spanText, style: 'font-size:12.5px;opacity:.85;' })
              ])
            ]),
            buyBtn
          ]);
          hq.replaceWith(buyCard);
        });

        bodyWrap.appendChild(contentBox);
      }

      // Rating marks (#mark_tpc etc.)
      const markEl = qs(`#mark_${pid}`, tbl);
      let markWrap = null;
      if (markEl && markEl.textContent.trim()) {
        markWrap = el('div', { className: 'm3-marks-box' });
        markWrap.appendChild(markEl);
      }

      // Action buttons (reply / quote / favor)
      const replyOrigA = qs('.readbot .huifu a', tbl);
      const quoteOrigA = qs('.readbot .yinyong a', tbl);
      const favorOrigA = qs('.readbot .shou a', tbl);
      const shareOrigA = qs(`#recommend_${pid}`);

      const avatarBtn = el('button', {
        type: 'button',
        className: 'm3-avatar-btn',
        title: '查看作者信息与操作',
        onClick: (e) => {
          e.stopPropagation();
          userPopover.innerHTML = '';
          userPopover.appendChild(el('div', { style: 'font-weight:700;font-size:15px;margin-bottom:8px;', text: authorName }));
          if (showFace) {
            const lines = htmlToLines(showFace);
            const badges = [];
            lines.forEach((line) => {
              if (/^(UID|发帖|SP币|注册时间):/i.test(line)) {
                badges.push(line);
              }
            });
            const statsGrid = el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;' });
            badges.forEach((s) => {
              statsGrid.appendChild(el('span', { className: 'm3-badge m3-badge-neutral', text: s }));
            });
            userPopover.appendChild(statsGrid);

            const menuList = el('div', { className: 'm3-menu-list' });
            qsa('.listread li a', showFace).forEach((actA) => {
              const title = actA.parentElement?.getAttribute('title') || actA.textContent.trim() || '操作';
              const item = el('button', {
                type: 'button',
                className: 'm3-menu-item',
                text: title,
                onClick: () => {
                  closeAllPopovers();
                  const href = actA.getAttribute('href');
                  if (href && !href.startsWith('javascript:')) window.open(href, '_blank');
                  else actA.click();
                }
              });
              menuList.appendChild(item);
            });
            userPopover.appendChild(menuList);
          } else if (authorLink) {
            userPopover.appendChild(el('a', {
              className: 'm3-menu-item',
              href: authorLink.getAttribute('href'),
              target: '_blank',
              text: '查看个人主页'
            }));
          }
          openPopoverNear(userPopover, avatarBtn);
        }
      }, [
        el('img', { src: avatarSrc || 'images/face/none.gif', referrerpolicy: 'no-referrer', alt: authorName })
      ]);

      const moreBtn = el('button', {
        type: 'button',
        className: 'm3-icon-btn',
        title: '更多操作',
        html: icon('more_vert'),
        onClick: (e) => {
          e.stopPropagation();
          postMenuPop.innerHTML = '';
          const list = el('div', { className: 'm3-menu-list' });
          if (onlyAuthorA) {
            list.appendChild(el('a', {
              className: 'm3-menu-item',
              href: onlyAuthorA.getAttribute('href') || '#',
              html: `${icon('eye')}<span>${escapeHtml(onlyAuthorA.textContent.trim())}</span>`
            }));
          }
          if (shareOrigA) {
            list.appendChild(el('button', {
              type: 'button',
              className: 'm3-menu-item',
              html: `${icon('open_new')}<span>分享此帖</span>`,
              onClick: () => {
                closeAllPopovers();
                shareOrigA.click();
              }
            }));
          }
          peacemakers.forEach((pm) => {
            pm.classList.add('m3-menu-item');
            pm.style.display = 'flex';
            list.appendChild(pm);
          });
          postMenuPop.appendChild(list);
          openPopoverNear(postMenuPop, moreBtn);
        }
      });

      const floorPill = el('button', {
        type: 'button',
        className: 'm3-floor-pill',
        text: floorText,
        title: '复制此楼直达链接',
        onClick: () => {
          if (typeof window.copyUrl === 'function') {
            try { window.copyUrl(pid); } catch (_) {}
          } else {
            navigator.clipboard?.writeText(`${location.href.split('#')[0]}#${anchorName}`).catch(() => {});
          }
          showToast(`已复制 ${floorText} 楼层链接`);
        }
      });

      const cardId = `sp-post-${anchorName}`;
      floorEntries.push({ id: cardId, floor: floorText, author: authorName });

      const postCard = el('article', {
        id: cardId,
        className: `m3-post-card ${isOP ? 'is-op' : ''}`,
        dataset: { filterText: `${authorName} ${tpcContent.textContent}`.toLowerCase() }
      }, [
        el('a', { name: anchorName, id: `anchor_${anchorName}` }),
        el('header', { className: 'm3-post-header' }, [
          el('div', { className: 'm3-post-author-wrap' }, [
            avatarBtn,
            el('div', { className: 'm3-post-author-meta' }, [
              el('div', { className: 'm3-post-author-row' }, [
                el('a', {
                  className: 'm3-post-author-name',
                  href: authorLink ? authorLink.getAttribute('href') : '#',
                  target: '_blank',
                  text: authorName
                }),
                isOP ? el('span', { className: 'm3-badge m3-badge-primary', text: '楼主' }) : null,
                !isOP && authorName === opAuthorName ? el('span', { className: 'm3-badge m3-badge-secondary', text: '楼主' }) : null
              ]),
              el('div', { className: 'm3-post-sub' }, [
                timeText ? el('span', { text: timeText }) : null,
                bianjiText ? el('span', { text: bianjiText }) : null
              ])
            ])
          ]),
          el('div', { className: 'm3-post-header-right' }, [floorPill, moreBtn])
        ]),
        bodyWrap,
        markWrap,
        el('footer', { className: 'm3-post-footer' }, [
          el('div', { className: 'm3-post-actions' }, [
            replyOrigA ? el('button', {
              type: 'button',
              className: 'm3-btn m3-btn-sm m3-btn-tonal m3-ripple-host',
              html: `${icon('reply')}<span>回复</span>`,
              onClick: () => {
                replyOrigA.click();
                const rc = qs('#sp-md3e-reply-card');
                if (rc) rc.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }) : null,
            quoteOrigA ? el('button', {
              type: 'button',
              className: 'm3-btn m3-btn-sm m3-btn-outlined m3-ripple-host',
              html: `${icon('quote')}<span>引用</span>`,
              onClick: () => quoteOrigA.click()
            }) : null,
            favorOrigA ? el('button', {
              type: 'button',
              className: 'm3-btn m3-btn-sm m3-btn-text m3-ripple-host',
              html: `${icon('bookmark')}<span>收藏</span>`,
              onClick: () => {
                favorOrigA.click();
                showToast('已发送收藏请求');
              }
            }) : null
          ]),
          el('button', {
            type: 'button',
            className: 'm3-btn m3-btn-sm m3-btn-text',
            html: `${icon('arrow_up')}<span>顶部</span>`,
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
          })
        ])
      ]);

      postListEl.appendChild(postCard);
    });

    mainMount.appendChild(postListEl);

    const botPag = buildPaginationNode(extractPagination());
    if (botPag) mainMount.appendChild(botPag);

    // 3. Re-parent Quick Reply Form (form[name="FORM"]) intact
    const replyForm = qs('form[name="FORM"]');
    if (replyForm) {
      const replyCard = el('section', { id: 'sp-md3e-reply-card', className: 'm3-reply-card' }, [
        el('div', { style: 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;' }, [
          el('div', { style: 'display:flex;align-items:center;gap:10px;' }, [
            el('span', { html: icon('edit', 'm3-icon-lg'), style: 'color:var(--md-primary);display:inline-flex;' }),
            el('strong', { text: '快速回复', style: 'font-size:17px;' })
          ]),
          el('span', { text: 'Ctrl + Enter 直接提交', style: 'font-size:12px;color:var(--md-on-surface-variant);' })
        ])
      ]);
      // Hide redundant inner table header row of native quick reply
      const nativeHead = qs('tr:first-child', replyForm);
      if (nativeHead && /快速发帖/.test(nativeHead.textContent)) nativeHead.style.display = 'none';
      replyCard.appendChild(replyForm);
      mainMount.appendChild(replyCard);
    }

    return { floorEntries, tid };
  }

  function buildPostPage(mainMount, crumbsInfo) {
    const form = qs('form[name="FORM"]');
    if (!form) {
      buildGenericPage(mainMount);
      return;
    }

    const actionVal = qs('input[name="action"]', form)?.value || 'new';
    const modeTitle = actionVal === 'reply' ? '发表回复' : actionVal === 'modify' ? '编辑帖子' : '发表新主题';
    const forumCrumb = crumbsInfo.crumbs[crumbsInfo.crumbs.length - 1];
    const forumName = forumCrumb ? forumCrumb.text : '';
    const backHref = forumCrumb ? forumCrumb.href : 'index.php';

    // 1. Hero Header
    mainMount.appendChild(el('section', { className: 'm3-forum-hero' }, [
      el('div', {}, [
        el('h1', { className: 'm3-forum-hero-title', text: forumName ? `${modeTitle} · ${forumName}` : modeTitle }),
        el('div', { style: 'font-size:12.5px;color:var(--md-on-surface-variant);margin-top:4px;', text: 'MD3E 富文本编辑器（支持 WindCode 与所见即所得切换）' })
      ]),
      el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;' }, [
        el('a', { className: 'm3-btn m3-btn-sm m3-btn-outlined m3-ripple-host', href: backHref, html: `${icon('chevron_left')}<span>返回版块</span>` })
      ])
    ]));

    // 2. Posting Rules Callout (#postrule populated by native jQuery)
    const postRuleEl = qs('#postrule', form);
    if (postRuleEl) {
      const ruleBanner = el('div', { className: 'm3-post-rule-banner' });
      ruleBanner.appendChild(postRuleEl);
      mainMount.appendChild(ruleBanner);
    }

    // 3. Re-parent Live Composer Card
    const card = el('section', { className: 'm3-composer-card' });

    // Hide legacy top table inside form ("发表帖子")
    const legacyTitleTbl = qs('.t > table', form);
    if (legacyTitleTbl && /发表帖子/.test(legacyTitleTbl.textContent)) {
      legacyTitleTbl.style.display = 'none';
    }

    // Restyle Title input wrapper cleanly
    const titleInp = qs('input[name="atc_title"]', form);
    if (titleInp) {
      titleInp.placeholder = '请输入主题标题...';
      const innerBox = titleInp.parentElement;
      if (innerBox) {
        innerBox.classList.add('m3-composer-title-box');
        if (innerBox.parentElement) innerBox.parentElement.classList.add('m3-composer-title-host');
      }
    }

    // Group #editor-main and #editor-side into 2-column responsive grid
    const editorMain = qs('#editor-main', form);
    const editorSide = qs('#editor-side', form);
    if (editorMain && editorSide && editorMain.parentElement) {
      const grid = el('div', { className: 'm3-composer-grid' });
      editorMain.parentElement.insertBefore(grid, editorSide);
      grid.appendChild(editorMain);
      grid.appendChild(editorSide);
    }

    // Keep helper hidden nodes (#att_mode, form[name="preview"]) alive in DOM
    const attModeTable = qs('tbody#att_mode')?.closest('table');
    if (attModeTable) {
      attModeTable.style.display = 'none';
      card.appendChild(attModeTable);
    }
    card.appendChild(form);
    const previewForm = qs('form[name="preview"]');
    if (previewForm) card.appendChild(previewForm);

    mainMount.appendChild(card);
  }

  function buildRedirectPage() {
    if (qs('#sp-md3e-redirect-root')) return;
    const refreshMeta = qs('meta[http-equiv="refresh"]')?.getAttribute('content') || '';
    const metaUrlMatch = refreshMeta.match(/url\s*=\s*([^;\s]+)/i);
    const links = qsa('a[href]');
    const targetLink = links.find((a) => {
      const href = a.getAttribute('href') || '';
      return href && !/^index\.php$/i.test(href) && !/^javascript:/i.test(href);
    });
    const targetHref = (metaUrlMatch && metaUrlMatch[1]) || targetLink?.getAttribute('href') || 'index.php';

    const rawBox = qs('center div') || qs('center');
    const lines = htmlToLines(rawBox).filter((line) => (
      line && !/提示信息/.test(line) && !/如果您的浏览器/.test(line)
    ));
    const statusTitle = lines[0] || '操作已完成';
    const statusSub = lines.slice(1).join(' · ') || '正在为您跳转到目标页面...';

    Array.from(document.body.children).forEach((child) => {
      if (child.tagName !== 'SCRIPT') child.style.display = 'none';
    });

    const root = el('main', { id: 'sp-md3e-redirect-root', className: 'm3-status-screen' }, [
      el('div', { className: 'm3-status-card' }, [
        el('div', { className: 'm3-status-icon', html: icon('check') }),
        el('h1', { text: statusTitle, style: 'margin:0;font-size:22px;font-weight:700;color:var(--md-on-surface);' }),
        el('p', { text: statusSub, style: 'margin:0;font-size:13.5px;color:var(--md-on-surface-variant);line-height:1.6;' }),
        el('div', { className: 'm3-status-progress' }, [
          el('div', { className: 'm3-status-progress-bar' })
        ]),
        el('div', { style: 'display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:6px;' }, [
          el('a', {
            className: 'm3-btn m3-btn-filled m3-ripple-host',
            href: targetHref,
            html: `<span>立即前往</span>${icon('chevron_right')}`
          }),
          el('a', {
            className: 'm3-btn m3-btn-tonal m3-ripple-host',
            href: 'index.php',
            html: `${icon('home')}<span>返回首页</span>`
          })
        ])
      ])
    ]);
    document.body.appendChild(root);
  }

  function buildUserPage(mainMount, userCtx) {
    const h1El = qs('#u-top h1.u-h1') || qs('h1.u-h1');
    const profileName = (h1El?.textContent || '').replace(/\s+/g, ' ').trim() || userCtx.username || '个人中心';
    const avatarSrc = qs('#u-portrait img.pic')?.getAttribute('src')
      || qs('#u-portrait img')?.getAttribute('src')
      || userCtx.avatar
      || 'images/face/none.gif';

    const honorEl = qs('#honor');
    const setHonorEl = qs('#sethonor');
    const honorRow = el('div', { className: 'm3-u-honor-row' });
    if (honorEl) honorRow.appendChild(honorEl);
    if (setHonorEl) {
      setHonorEl.classList.add('m3-chip');
      honorRow.appendChild(setHonorEl);
    }

    const actionWrap = el('div', { style: 'display:flex;flex-wrap:wrap;gap:8px;' });
    const seenAct = new Set();
    qsa('#u-sidebar a[href]').forEach((a) => {
      const text = a.textContent.replace(/\s+/g, ' ').trim();
      const href = a.getAttribute('href') || '#';
      if (!text || seenAct.has(href) || /u\.php$/i.test(href)) return;
      seenAct.add(href);
      actionWrap.appendChild(el('a', {
        className: 'm3-btn m3-btn-sm m3-btn-tonal m3-ripple-host',
        href,
        text
      }));
    });

    const statBadges = el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;' });
    const sidebarLines = htmlToLines(qs('#u-sidebar')).filter((l) => (
      /(UID|等级|级别|发帖|威望|SP币|HP|注册|最后登录)/i.test(l)
    ));
    sidebarLines.slice(0, 6).forEach((l) => {
      statBadges.appendChild(el('span', { className: 'm3-badge m3-badge-neutral', text: l }));
    });
    if (!sidebarLines.length && userCtx.sp) {
      statBadges.appendChild(el('span', { className: 'm3-badge m3-badge-tertiary', text: `SP币 ${userCtx.sp}` }));
    }

    mainMount.appendChild(el('section', { className: 'm3-u-hero' }, [
      el('div', { className: 'm3-u-identity' }, [
        el('img', { className: 'm3-u-avatar', src: avatarSrc, alt: profileName, referrerpolicy: 'no-referrer' }),
        el('div', { style: 'min-width:0;' }, [
          el('h1', { className: 'm3-u-title', text: profileName }),
          honorRow,
          statBadges
        ])
      ]),
      actionWrap
    ]));

    // Profile navigation tabs (#u-top-nav)
    const tabLinks = qsa('#u-top-nav ul li a');
    if (tabLinks.length) {
      const tabBar = el('nav', { className: 'm3-u-tabs', 'aria-label': '个人中心导航' });
      tabLinks.forEach((a) => {
        const li = a.closest('li');
        const isActive = !!(li && (li.classList.contains('current') || li.id === 'current'));
        tabBar.appendChild(el('a', {
          className: `m3-u-tab ${isActive ? 'is-active' : ''}`,
          href: a.getAttribute('href') || '#',
          text: a.textContent.trim()
        }));
      });
      mainMount.appendChild(tabBar);
    }

    const uMain = qs('#u-contentmain');
    const uSide = qs('#u-contentside');
    if (uMain && uSide) {
      const mainHost = el('div', { className: 'm3-u-main-host m3-generic-host' });
      mainHost.appendChild(uMain);
      const sideHost = el('div', { className: 'm3-u-side-host m3-generic-host' });
      sideHost.appendChild(uSide);
      mainMount.appendChild(el('div', { className: 'm3-u-grid' }, [mainHost, sideHost]));
    } else if (uMain || qs('#u-content')) {
      const singleHost = el('div', { className: 'm3-u-main-host m3-generic-host' });
      const targetNode = uMain || qs('#u-content');
      singleHost.appendChild(targetNode);
      mainMount.appendChild(singleHost);
    } else {
      buildGenericPage(mainMount);
    }
  }

  function buildMessagePage(mainMount) {
    const writeHref = qs('#set-menu a[href*="write"], #set-menu a[href*="post"]')?.getAttribute('href') || 'message.php?action-write.html';
    mainMount.appendChild(el('section', { className: 'm3-forum-hero' }, [
      el('div', {}, [
        el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:4px;' }, [
          el('span', { html: icon('mail'), style: 'display:inline-flex;color:var(--md-primary);' }),
          el('h1', { className: 'm3-forum-title', text: '短消息中心' })
        ]),
        el('p', { className: 'm3-forum-desc', text: '收发站内私信、系统通知与消息管理' })
      ]),
      el('div', { className: 'm3-forum-actions' }, [
        el('a', {
          className: 'm3-btn m3-btn-sm m3-btn-filled m3-ripple-host',
          href: writeHref,
          html: `${icon('edit')}<span>发送短消息</span>`
        })
      ])
    ]));

    const sidebar = el('aside', { className: 'm3-inbox-sidebar' });
    const menuLinks = qsa('#set-menu a[href]');
    menuLinks.forEach((a) => {
      const li = a.closest('li');
      const href = a.getAttribute('href') || '#';
      const isActive = !!(
        (li && li.classList.contains('current'))
        || a.classList.contains('current')
        || (location.search && href.includes(location.search))
      );
      sidebar.appendChild(el('a', {
        className: `m3-inbox-nav-item ${isActive ? 'is-active' : ''}`,
        href,
        text: a.textContent.trim()
      }));
    });

    const contentHost = el('section', { className: 'm3-inbox-host m3-generic-host' });
    const liveWrap = qs('#set-content-wrap') || qs('#set-content');
    if (liveWrap) {
      contentHost.appendChild(liveWrap);
    } else {
      buildGenericPage(contentHost);
    }

    if (menuLinks.length) {
      mainMount.appendChild(el('div', { className: 'm3-inbox-grid' }, [sidebar, contentHost]));
    } else {
      mainMount.appendChild(contentHost);
    }
  }

  function buildTasksPage(mainMount) {
    const outerTable = qs('#main table');
    const sideBoxes = outerTable ? qsa('td[width="20%"] .t', outerTable) : [];
    const introBox = sideBoxes.find((b) => /功能简介/.test(b.textContent));
    const opsBox = sideBoxes.find((b) => /操作/.test(b.textContent));
    const copyBox = sideBoxes.find((b) => /版权/.test(b.textContent));

    const introLines = introBox ? htmlToLines(qs('tr:last-child, .f_one', introBox) || introBox).filter((l) => l !== '功能简介') : [];
    const opsLinks = opsBox ? qsa('a[href]', opsBox) : [];

    const tabsBar = opsLinks.length ? el('nav', { className: 'm3-segmented' }) : null;
    if (tabsBar) {
      opsLinks.forEach((a) => {
        const href = a.getAttribute('href') || '#';
        const isBold = !!qs('b, strong', a) || a.closest('b, strong');
        const matchesUrl = href && location.href.includes(href);
        tabsBar.appendChild(el('a', {
          className: `m3-seg-btn ${(isBold || matchesUrl) ? 'is-active' : ''}`,
          href,
          text: a.textContent.trim()
        }));
      });
    }

    mainMount.appendChild(el('section', { className: 'm3-forum-hero' }, [
      el('div', {}, [
        el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:4px;' }, [
          el('span', { html: icon('task'), style: 'display:inline-flex;color:var(--md-primary);' }),
          el('h1', { className: 'm3-forum-title', text: '社区论坛任务' })
        ]),
        el('p', { className: 'm3-forum-desc', text: introLines[0] || '完成社区指定任务即可领取 SP 币与积分奖励' })
      ]),
      tabsBar
    ]));

    // Parse right-side tasks table
    const rightTd = outerTable ? qsa(':scope > tbody > tr > td, :scope > tr > td', outerTable).find((td) => td.getAttribute('width') !== '20%') : null;
    const taskBox = rightTd ? qs('.t', rightTd) : null;
    const taskRows = taskBox ? qsa('tr.f_one, tr.tr3', taskBox) : [];
    const taskCards = [];

    for (let i = 0; i < taskRows.length; i++) {
      const row = taskRows[i];
      const cells = qsa(':scope > td, :scope > th', row);
      if (cells.length < 3) continue;

      const iconImg = qs('img', cells[0]);
      const infoCell = cells[1];
      const rewardCell = cells[2];
      const actionCell = cells[3] || cells[cells.length - 1];

      const rawInfoText = infoCell.textContent.replace(/\s+/g, ' ').trim();
      const titleEl = qs('b, strong, a', infoCell);
      const taskTitle = titleEl ? titleEl.textContent.trim() : rawInfoText.split(/\s+/)[0];
      if (!taskTitle) continue;

      const popMatch = rawInfoText.match(/人气[:：]\s*\S+/);
      const validEl = qs('font', infoCell);
      const validText = validEl ? validEl.textContent.trim() : '';

      // Check if next row is the paired description row
      let descText = '';
      const nextRow = taskRows[i + 1];
      if (nextRow) {
        const nextCells = qsa(':scope > td, :scope > th', nextRow);
        if (nextCells.length <= 2) {
          descText = nextRow.textContent.replace(/\s+/g, ' ').trim();
          i++;
        }
      }

      const rewardText = rewardCell ? rewardCell.textContent.replace(/\s+/g, ' ').trim() : '';
      const actionHost = el('div', { className: 'm3-task-action-host' });
      if (actionCell) {
        while (actionCell.firstChild) {
          actionHost.appendChild(actionCell.firstChild);
        }
      }

      const card = el('article', {
        className: 'm3-task-card',
        dataset: { filterText: `${taskTitle} ${descText} ${rewardText}`.toLowerCase() }
      }, [
        el('div', { className: 'm3-task-head' }, [
          el('div', { style: 'display:flex;align-items:flex-start;gap:12px;min-width:0;' }, [
            el('div', {
              className: 'm3-task-icon-box',
              html: iconImg ? `<img src="${escapeHtml(iconImg.getAttribute('src') || '')}" alt="">` : icon('task')
            }),
            el('div', { style: 'min-width:0;' }, [
              el('h3', { className: 'm3-task-title', text: taskTitle }),
              el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;' }, [
                popMatch ? el('span', { className: 'm3-badge m3-badge-neutral', text: popMatch[0] }) : null,
                validText ? el('span', { className: 'm3-badge m3-badge-primary', text: validText }) : null
              ])
            ])
          ])
        ]),
        descText ? el('div', { className: 'm3-task-desc', text: descText }) : null,
        el('div', { className: 'm3-task-foot' }, [
          rewardText ? el('span', {
            className: 'm3-badge m3-badge-tertiary',
            html: `${icon('coins')}<span>${escapeHtml(rewardText)}</span>`
          }) : el('span'),
          actionHost
        ])
      ]);
      taskCards.push(card);
    }

    if (taskCards.length) {
      mainMount.appendChild(el('section', { className: 'm3-task-grid' }, taskCards));
    } else if (rightTd) {
      const emptyWrap = el('div', { className: 'm3-card', text: rightTd.textContent.replace(/\s+/g, ' ').trim() || '当前分类暂无任务。' });
      mainMount.appendChild(emptyWrap);
    } else {
      buildGenericPage(mainMount);
    }

    if (introLines.length > 1 || copyBox) {
      const acc = el('details', { className: 'm3-accordion' });
      acc.appendChild(el('summary', {
        className: 'm3-accordion-summary',
        html: `<span>任务说明与插件信息</span>${icon('chevron_down')}`
      }));
      const body = el('div', { style: 'padding:0 18px 16px;font-size:13px;line-height:1.7;color:var(--md-on-surface-variant);' });
      introLines.forEach((l) => body.appendChild(el('div', { text: l })));
      if (copyBox) {
        htmlToLines(copyBox).filter((l) => l !== '版权').forEach((l) => body.appendChild(el('div', { text: l, style: 'opacity:.8;margin-top:4px;' })));
      }
      acc.appendChild(body);
      mainMount.appendChild(acc);
    }
  }

  function buildSearchPage(mainMount) {
    mainMount.appendChild(el('section', { className: 'm3-forum-hero' }, [
      el('div', {}, [
        el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:4px;' }, [
          el('span', { html: icon('search'), style: 'display:inline-flex;color:var(--md-primary);' }),
          el('h1', { className: 'm3-forum-title', text: '全站高级搜索' })
        ]),
        el('p', { className: 'm3-forum-desc', text: '按关键词、发布作者、所属版块、时间跨度与排序方式精准检索社区帖子' })
      ])
    ]));

    const form = qs('form[name="sF"]');
    if (form) {
      const urlKw = new URLSearchParams(location.search).get('keyword');
      const kwInput = qs('input[name="keyword"]', form);
      if (urlKw && kwInput && !kwInput.value) kwInput.value = urlKw;

      const host = el('section', { className: 'm3-search-form-card m3-generic-host' });
      host.appendChild(form);
      mainMount.appendChild(host);
    } else {
      buildGenericPage(mainMount);
    }
  }

  function buildSearchResultsPage(mainMount, crumbsInfo) {
    const searchTable = qs('#main .t table') || qs('#main table');
    const pagInfo = extractPagination();
    const resultRows = [];

    if (searchTable) {
      const rows = qsa('tr', searchTable);
      rows.forEach((tr) => {
        if (tr.classList.contains('tr2') || tr.classList.contains('h') || qs('th.h', tr)) return;
        if (isAdElement(tr)) return;
        const cells = qsa(':scope > td, :scope > th', tr);
        if (cells.length < 5) return;

        const statusImgSrc = (qs('img', cells[0])?.getAttribute('src') || '').toLowerCase();
        const titleA = qs('a[href*="read.php"]', cells[1]) || qs('h3 a', cells[1]) || qs('a', cells[1]);
        if (!titleA) return;

        const rawTitle = titleA.textContent.replace(/\s+/g, ' ').trim();
        const parsed = parseSmartTitle(rawTitle);
        const forumA = qs('a', cells[2]);
        const forumName = forumA ? forumA.textContent.trim() : cells[2].textContent.trim();
        const forumHref = forumA ? forumA.getAttribute('href') || '#' : '';

        const authorA = qs('a', cells[3]);
        const authorName = authorA ? authorA.textContent.trim() : cells[3].textContent.replace(/\s+/g, ' ').trim();
        const replies = parseInt(cells[4].textContent.trim(), 10) || 0;
        const views = cells[5] ? (parseInt(cells[5].textContent.trim(), 10) || 0) : 0;
        const lastInfo = cells[6] ? cells[6].textContent.replace(/\s+/g, ' ').trim() : '';

        let statusTone = 'is-normal';
        let statusIcon = 'forum';
        if (/lock/.test(statusImgSrc)) {
          statusTone = 'is-hot';
          statusIcon = 'lock';
        } else if (/top|head/.test(statusImgSrc)) {
          statusTone = 'is-pin';
          statusIcon = 'push_pin';
        } else if (/digest/.test(statusImgSrc)) {
          statusTone = 'is-digest';
          statusIcon = 'star';
        } else if (/hot/.test(statusImgSrc) || replies >= 20) {
          statusTone = 'is-hot';
          statusIcon = 'bolt';
        }

        const badgeNodes = parsed.tags.map((t) => el('span', { className: `m3-badge m3-badge-${t.tone}`, text: t.label }));
        if (forumName) {
          badgeNodes.unshift(forumHref
            ? el('a', {
                className: 'm3-badge m3-badge-secondary',
                href: forumHref,
                text: forumName,
                style: 'text-decoration:none;'
              })
            : el('span', { className: 'm3-badge m3-badge-secondary', text: forumName }));
        }

        const rowNode = el('article', {
          className: 'm3-thread-row',
          dataset: { filterText: `${rawTitle} ${forumName} ${authorName}`.toLowerCase() }
        }, [
          el('div', { className: `m3-thread-status ${statusTone}`, html: icon(statusIcon) }),
          el('div', { className: 'm3-thread-main' }, [
            el('div', { className: 'm3-thread-title-line' }, [
              el('a', {
                className: 'm3-thread-title',
                href: titleA.getAttribute('href') || '#',
                target: '_blank',
                text: parsed.clean
              }),
              ...badgeNodes
            ]),
            el('div', { className: 'm3-thread-meta' }, [
              authorName ? el('span', { text: `作者: ${authorName}` }) : null,
              lastInfo ? el('span', { text: `· ${lastInfo}` }) : null
            ])
          ]),
          el('div', { className: 'm3-thread-stats' }, [
            el('span', { className: 'm3-badge m3-badge-primary', text: `回复 ${replies}` }),
            views ? el('span', { className: 'm3-badge m3-badge-neutral', text: `人气 ${views}` }) : null
          ])
        ]);

        resultRows.push(rowNode);
      });
    }

    const pageTitle = crumbsInfo.crumbs[crumbsInfo.crumbs.length - 1]?.text || '搜索结果';
    mainMount.appendChild(el('section', { className: 'm3-forum-hero' }, [
      el('div', {}, [
        el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:4px;' }, [
          el('span', { html: icon('search'), style: 'display:inline-flex;color:var(--md-primary);' }),
          el('h1', { className: 'm3-forum-title', text: pageTitle }),
          el('span', { className: 'm3-badge m3-badge-primary', text: `本页 ${resultRows.length} 条` })
        ]),
        el('p', { className: 'm3-forum-desc', text: '已重构为 Expressive 状态徽章列表，可使用顶部搜索框继续按标题或版块二次过滤' })
      ]),
      el('div', { className: 'm3-forum-actions' }, [
        el('a', {
          className: 'm3-btn m3-btn-sm m3-btn-tonal m3-ripple-host',
          href: 'search.php',
          html: `${icon('search')}<span>高级搜索</span>`
        })
      ])
    ]));

    const topPag = buildPaginationNode(pagInfo);
    if (topPag) mainMount.appendChild(topPag);

    if (resultRows.length) {
      mainMount.appendChild(el('section', { className: 'm3-group-list' }, resultRows));
    } else {
      mainMount.appendChild(el('div', { className: 'm3-card', text: '未找到符合条件的主题帖。' }));
    }

    const botPag = buildPaginationNode(pagInfo);
    if (botPag) mainMount.appendChild(botPag);
  }

  function buildGenericPage(mainMount) {
    const legacyMain = qs('#main');
    if (!legacyMain) return;
    const host = el('div', { className: 'm3-generic-host' });
    while (legacyMain.firstChild) {
      host.appendChild(legacyMain.firstChild);
    }
    mainMount.appendChild(host);
  }

  /* ============================================================================
   * 7. APP SHELL & INTERACTIVE OVERLAYS
   * ========================================================================== */

  function mountShell() {
    if (qs('#sp-md3e-shell')) return;

    const pageType = detectPageType();
    if (pageType === 'redirect') {
      buildRedirectPage();
      document.documentElement.classList.remove('sp-md3e-loading');
      document.documentElement.classList.add('sp-md3e-ready');
      return;
    }

    const userCtx = extractUserContext();
    const forumTree = extractForumTree();
    const crumbsInfo = extractBreadcrumbs();

    const shell = el('div', {
      id: 'sp-md3e-shell',
      className: Store.get('railExpanded') ? 'rail-expanded' : ''
    });

    const scrim = el('div', { className: 'm3-scrim' });

    // --- Forum Directory Drawer ---
    const drawerSearch = el('input', {
      type: 'search',
      placeholder: '检索主版块或子版块（如 GALGAME、同人音声、茶楼）...'
    });
    const drawerBody = el('div', { className: 'm3-drawer-body' });

    const renderDrawerList = (kw = '') => {
      drawerBody.innerHTML = '';
      const q = kw.trim().toLowerCase();
      if (userCtx.shortcuts.length && !q) {
        drawerBody.appendChild(el('div', {}, [
          el('div', { text: '常用 / 收藏版块', style: 'font-size:12px;font-weight:700;color:var(--md-primary);margin-bottom:8px;' }),
          el('div', { className: 'm3-subforum-wrap' }, userCtx.shortcuts.map((sc) => el('a', {
            className: 'm3-chip',
            href: sc.href,
            text: sc.name
          })))
        ]));
      }
      if (!forumTree.length) {
        drawerBody.appendChild(el('div', {
          className: 'm3-card',
          text: '请先访问论坛首页以缓存完整的版块导航目录。'
        }));
        return;
      }
      let totalMatches = 0;
      forumTree.forEach((cat) => {
        const catMatches = q && cat.title.toLowerCase().includes(q);
        const matchedEntries = [];

        (cat.boards || []).forEach((b) => {
          const subs = b.subs || SUBFORUM_FALLBACK[b.fid || parseFidFromHref(b.href)] || [];
          const boardMatch = !q || catMatches || b.name.toLowerCase().includes(q);
          const matchedSubs = q
            ? subs.filter((s) => s.name.toLowerCase().includes(q) || boardMatch)
            : subs;

          if (boardMatch || matchedSubs.length > 0) {
            matchedEntries.push({ board: b, boardMatch, subs: matchedSubs });
          }
        });

        if (!matchedEntries.length) return;
        totalMatches += matchedEntries.length;

        const catSection = el('div', { className: 'm3-drawer-board-group' }, [
          el('a', {
            href: cat.href,
            text: cat.title,
            style: 'display:block;font-size:13px;font-weight:700;color:var(--md-on-surface-variant);'
          })
        ]);

        if (!q) {
          const boardWrap = el('div', { className: 'm3-drawer-board-group' });
          matchedEntries.forEach(({ board, subs }) => {
            boardWrap.appendChild(el('a', {
              className: 'm3-chip',
              href: board.href,
              text: board.name,
              style: 'align-self:flex-start;font-weight:600;'
            }));
            if (subs.length) {
              const subWrap = el('div', { className: 'm3-drawer-subwrap' });
              const MAX_DRAWER_SUB = 8;
              subs.forEach((s, idx) => {
                subWrap.appendChild(el('a', {
                  className: 'm3-drawer-subchip',
                  href: s.href,
                  text: s.name,
                  style: idx >= MAX_DRAWER_SUB ? 'display:none;' : ''
                }));
              });
              if (subs.length > MAX_DRAWER_SUB) {
                const moreSub = el('button', {
                  type: 'button',
                  className: 'm3-drawer-subchip',
                  text: `+${subs.length - MAX_DRAWER_SUB} 展开`,
                  style: 'background:var(--md-primary-container);color:var(--md-on-primary-container);font-weight:600;',
                  onClick: () => {
                    qsa('.m3-drawer-subchip', subWrap).forEach((c) => { c.style.display = ''; });
                    moreSub.remove();
                  }
                });
                subWrap.appendChild(moreSub);
              }
              boardWrap.appendChild(subWrap);
            }
          });
          catSection.appendChild(boardWrap);
        } else {
          const resultWrap = el('div', { className: 'm3-subforum-wrap' });
          matchedEntries.forEach(({ board, boardMatch, subs }) => {
            if (boardMatch) {
              resultWrap.appendChild(el('a', {
                className: 'm3-chip is-selected',
                href: board.href,
                text: board.name
              }));
            }
            subs.forEach((s) => {
              resultWrap.appendChild(el('a', {
                className: 'm3-chip',
                href: s.href,
                html: `<span>${escapeHtml(s.name)}</span><span style="opacity:.65;font-size:11px;">· ${escapeHtml(board.name)}</span>`
              }));
            });
          });
          catSection.appendChild(resultWrap);
        }

        drawerBody.appendChild(catSection);
      });

      if (q && totalMatches === 0) {
        drawerBody.appendChild(el('div', {
          className: 'm3-card',
          text: `未找到包含 “${kw.trim()}” 的版块或子版块。`
        }));
      }
    };
    drawerSearch.addEventListener('input', () => renderDrawerList(drawerSearch.value));

    const forumDrawer = el('aside', { className: 'm3-drawer', id: 'sp-md3e-forum-drawer' }, [
      el('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:10px;' }, [
        el('strong', { text: '全部版块目录', style: 'font-size:18px;' }),
        el('button', { type: 'button', className: 'm3-icon-btn', html: icon('close'), onClick: () => closeOverlays() })
      ]),
      el('div', { className: 'm3-search-pill', style: 'margin:12px 0 0;max-width:none;flex:none;' }, [
        el('span', { html: icon('search'), style: 'display:inline-flex;color:var(--md-on-surface-variant);' }),
        drawerSearch
      ]),
      drawerBody
    ]);

    // --- Settings Dialog ---
    const settingsDialog = el('div', { className: 'm3-dialog', id: 'sp-md3e-settings' });
    const renderSettings = () => {
      settingsDialog.innerHTML = '';
      settingsDialog.appendChild(el('div', { style: 'display:flex;align-items:center;justify-content:space-between;' }, [
        el('strong', { text: 'MD3E 主题与阅读偏好', style: 'font-size:19px;' }),
        el('button', { type: 'button', className: 'm3-icon-btn', html: icon('close'), onClick: () => closeOverlays() })
      ]));

      // Color Mode Segmented
      const modeSeg = el('div', { className: 'm3-segmented' });
      [
        { k: 'auto', label: '跟随系统' },
        { k: 'light', label: '浅色' },
        { k: 'dark', label: '深色' }
      ].forEach((m) => {
        modeSeg.appendChild(el('button', {
          type: 'button',
          className: `m3-seg-btn ${Store.get('colorMode') === m.k ? 'is-active' : ''}`,
          text: m.label,
          onClick: () => {
            Store.set('colorMode', m.k);
            applyThemeTokens();
            renderSettings();
          }
        }));
      });
      settingsDialog.appendChild(el('div', { className: 'm3-setting-row' }, [
        el('span', { text: '外观模式', style: 'font-weight:600;' }),
        modeSeg
      ]));

      // Expressive Palettes
      const swatchRow = el('div', { className: 'm3-swatch-row' });
      Object.keys(PALETTES).forEach((key) => {
        const p = PALETTES[key];
        swatchRow.appendChild(el('button', {
          type: 'button',
          className: `m3-swatch-btn ${Store.get('palette') === key ? 'is-active' : ''}`,
          onClick: () => {
            Store.set('palette', key);
            applyThemeTokens();
            renderSettings();
          }
        }, [
          el('span', { className: 'm3-swatch-dot', style: `background:${p.swatch};` }),
          el('span', { text: p.name.split(' ')[0] })
        ]));
      });
      settingsDialog.appendChild(el('div', { style: 'display:flex;flex-direction:column;gap:8px;' }, [
        el('span', { text: 'Expressive 动态色板', style: 'font-weight:600;' }),
        swatchRow
      ]));

      // Density
      const densSeg = el('div', { className: 'm3-segmented' });
      [
        { k: 'comfortable', label: '舒适' },
        { k: 'compact', label: '紧凑' }
      ].forEach((d) => {
        densSeg.appendChild(el('button', {
          type: 'button',
          className: `m3-seg-btn ${Store.get('density') === d.k ? 'is-active' : ''}`,
          text: d.label,
          onClick: () => {
            Store.set('density', d.k);
            applyThemeTokens();
            renderSettings();
          }
        }));
      });
      settingsDialog.appendChild(el('div', { className: 'm3-setting-row' }, [
        el('span', { text: '列表信息密度', style: 'font-weight:600;' }),
        densSeg
      ]));

      // Boolean Toggles
      const addToggle = (key, label, hint) => {
        const sw = el('button', {
          type: 'button',
          className: `m3-switch ${Store.get(key) ? 'is-on' : ''}`,
          onClick: () => {
            const next = !Store.get(key);
            Store.set(key, next);
            applyThemeTokens();
            sw.classList.toggle('is-on', next);
            if (key === 'cleanAds' || key === 'collapseNoticeByDefault' || key === 'collapsePinnedByDefault') {
              showToast('设置已保存，刷新页面后完整生效');
            }
          }
        });
        settingsDialog.appendChild(el('div', { className: 'm3-setting-row' }, [
          el('div', {}, [
            el('div', { text: label, style: 'font-weight:600;' }),
            hint ? el('div', { text: hint, style: 'font-size:12px;color:var(--md-on-surface-variant);' }) : null
          ]),
          sw
        ]));
      };

      addToggle('wideMode', '宽屏阅读布局', '将主内容最大宽度扩展至 1520px');
      addToggle('cleanAds', '自动净化横幅与置顶推广', '隐藏老旧广告位，保留版块与帖子正文');
      addToggle('collapseNoticeByDefault', '默认折叠版块公告', '减少进入版块时的首屏滚动距离');
      addToggle('collapsePinnedByDefault', '默认折叠置顶帖组', '优先展示最新普通主题');
    };

    const openDrawer = () => {
      renderDrawerList(drawerSearch.value);
      scrim.classList.add('is-open');
      forumDrawer.classList.add('is-open');
      setTimeout(() => drawerSearch.focus(), 80);
    };
    const openSettings = () => {
      renderSettings();
      scrim.classList.add('is-open');
      settingsDialog.classList.add('is-open');
    };
    const closeOverlays = () => {
      scrim.classList.remove('is-open');
      forumDrawer.classList.remove('is-open');
      settingsDialog.classList.remove('is-open');
      shell.classList.remove('mobile-rail-open');
      closeAllPopovers();
    };
    scrim.addEventListener('click', closeOverlays);

    // --- Navigation Rail ---
    const postBtnA = qs('#td_post') ? qs('#td_post').closest('a') : qs('a[href^="post.php?fid-"]');
    const primaryCta = pageType === 'post'
      ? el('button', {
          type: 'button',
          className: 'm3-rail-fab m3-ripple-host',
          html: `${icon('send')}<span class="m3-rail-fab-label">聚焦编辑</span>`,
          onClick: () => {
            qs('#textarea')?.focus();
          }
        })
      : pageType === 'read' && qs('form[name="FORM"]')
      ? el('button', {
          type: 'button',
          className: 'm3-rail-fab m3-ripple-host',
          html: `${icon('edit')}<span class="m3-rail-fab-label">快速回复</span>`,
          onClick: () => {
            const rc = qs('#sp-md3e-reply-card');
            if (rc) {
              rc.scrollIntoView({ behavior: 'smooth', block: 'center' });
              qs('textarea[name="atc_content"]', rc)?.focus();
            }
          }
        })
      : postBtnA
        ? el('a', {
            className: 'm3-rail-fab m3-ripple-host',
            href: postBtnA.getAttribute('href') || '#',
            html: `${icon('edit')}<span class="m3-rail-fab-label">发表新帖</span>`
          })
        : el('button', {
            type: 'button',
            className: 'm3-rail-fab m3-ripple-host',
            html: `${icon('apps')}<span class="m3-rail-fab-label">探索版块</span>`,
            onClick: openDrawer
          });

    // Peacemaker Popover (re-parents live #peacemakerconfig)
    const peacemakerPop = el('div', { className: 'm3-popover', id: 'sp-md3e-peacemaker-pop' });
    const nativePeacemaker = qs('#peacemakerconfig');
    if (nativePeacemaker) {
      peacemakerPop.appendChild(nativePeacemaker);
      const innerMenu = qs('div', nativePeacemaker);
      if (innerMenu) innerMenu.hidden = false;
    } else {
      peacemakerPop.appendChild(el('div', { text: '当前页面未加载屏蔽插件。', style: 'font-size:13px;' }));
    }
    document.body.appendChild(peacemakerPop);

    const rail = el('aside', { className: 'm3-rail' }, [
      el('div', { className: 'm3-rail-top' }, [
        el('div', { className: 'm3-rail-toggle-row' }, [
          el('button', {
            type: 'button',
            className: 'm3-icon-btn',
            title: '展开 / 收起导航栏',
            html: icon(Store.get('railExpanded') ? 'menu_open' : 'menu'),
            onClick: (e) => {
              const next = !shell.classList.contains('rail-expanded');
              shell.classList.toggle('rail-expanded', next);
              Store.set('railExpanded', next);
              e.currentTarget.innerHTML = icon(next ? 'menu_open' : 'menu');
            }
          }),
          el('span', {
            className: 'm3-rail-brand-text',
            html: `<span class="m3-rail-brand-mark">${BRAND_LOGO_SVG}</span><span>South Plus</span>`
          })
        ]),
        primaryCta
      ]),
      el('nav', { className: 'm3-rail-nav' }, [
        el('a', {
          className: `m3-rail-item m3-ripple-host ${pageType === 'index' ? 'is-active' : ''}`,
          href: 'index.php',
          html: `<span class="m3-rail-pill">${icon('home')}</span><span class="m3-rail-label">讨论区</span>`
        }),
        el('button', {
          type: 'button',
          className: `m3-rail-item m3-ripple-host ${pageType === 'thread_list' || pageType === 'thread_wall' ? 'is-active' : ''}`,
          html: `<span class="m3-rail-pill">${icon('apps')}</span><span class="m3-rail-label">全部版块 (g)</span>`,
          onClick: openDrawer
        }),
        el('a', {
          className: `m3-rail-item m3-ripple-host ${pageType === 'search' || pageType === 'search_results' || location.pathname.includes('search') ? 'is-active' : ''}`,
          href: 'search.php',
          html: `<span class="m3-rail-pill">${icon('search')}</span><span class="m3-rail-label">全站搜索</span>`
        }),
        el('a', {
          className: `m3-rail-item m3-ripple-host ${pageType === 'tasks' || location.href.includes('tasks') ? 'is-active' : ''}`,
          href: 'plugin.php?H_name-tasks.html',
          html: `<span class="m3-rail-pill">${icon('task')}</span><span class="m3-rail-label">社区任务</span>`
        }),
        el('a', {
          className: `m3-rail-item m3-ripple-host ${pageType === 'message' || location.pathname.includes('message') ? 'is-active' : ''}`,
          href: 'message.php',
          html: `<span class="m3-rail-pill">${icon('mail')}${userCtx.hasUnreadMsg ? '<span class="m3-unread-dot"></span>' : ''}</span><span class="m3-rail-label">短消息</span>`
        }),
        el('a', {
          className: `m3-rail-item m3-ripple-host ${pageType === 'user' || location.pathname.includes('u.php') ? 'is-active' : ''}`,
          href: userCtx.userHref,
          html: `<span class="m3-rail-pill">${icon('person')}</span><span class="m3-rail-label">个人中心</span>`
        })
      ]),
      el('div', { className: 'm3-rail-bottom' }, [
        el('button', {
          type: 'button',
          className: 'm3-rail-item m3-ripple-host',
          html: `<span class="m3-rail-pill">${icon('block')}</span><span class="m3-rail-label">屏蔽配置</span>`,
          onClick: (e) => {
            e.stopPropagation();
            openPopoverNear(peacemakerPop, e.currentTarget);
          }
        }),
        el('button', {
          type: 'button',
          className: 'm3-rail-item m3-ripple-host',
          html: `<span class="m3-rail-pill">${icon('palette')}</span><span class="m3-rail-label">主题设置</span>`,
          onClick: openSettings
        })
      ])
    ]);

    // --- User Profile Popover ---
    const profilePop = el('div', { className: 'm3-popover', id: 'sp-md3e-profile-pop' });
    if (userCtx.loggedIn) {
      const honorLine = el('div', {
        text: userCtx.honorText,
        style: 'font-size:12px;color:var(--md-on-surface-variant);margin:6px 0 10px;'
      });
      profilePop.appendChild(el('div', { style: 'display:flex;align-items:center;gap:10px;margin-bottom:8px;' }, [
        el('img', {
          src: userCtx.avatar || 'images/face/none.gif',
          style: 'width:42px;height:42px;border-radius:14px;object-fit:cover;'
        }),
        el('div', {}, [
          el('div', { text: userCtx.username, style: 'font-weight:700;font-size:15px;' }),
          el('div', { text: `${userCtx.uid ? `UID ${userCtx.uid} · ` : ''}${userCtx.levelText}`, style: 'font-size:12px;color:var(--md-on-surface-variant);' })
        ])
      ]));
      profilePop.appendChild(el('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;' }, [
        userCtx.sp ? el('span', { className: 'm3-badge m3-badge-tertiary', text: `SP币 ${userCtx.sp}` }) : null,
        userCtx.hp ? el('span', { className: 'm3-badge m3-badge-neutral', text: `HP ${userCtx.hp}` }) : null,
        userCtx.po ? el('span', { className: 'm3-badge m3-badge-neutral', text: `魄 ${userCtx.po}` }) : null
      ]));
      if (userCtx.lastLogin) {
        profilePop.appendChild(el('div', {
          text: `最后登录: ${userCtx.lastLogin}`,
          style: 'font-size:11.5px;color:var(--md-on-surface-variant);margin-bottom:4px;'
        }));
      }
      profilePop.appendChild(honorLine);
      profilePop.appendChild(el('div', { className: 'm3-menu-list' }, [
        qs('#sethonor') ? el('button', {
          type: 'button',
          className: 'm3-menu-item',
          html: `${icon('edit')}<span>编辑个性签名</span>`,
          onClick: () => {
            closeAllPopovers();
            qs('#sethonor')?.click();
          }
        }) : null,
        el('a', { className: 'm3-menu-item', href: userCtx.myTopicHref, html: `${icon('list')}<span>我的主题</span>` }),
        el('a', { className: 'm3-menu-item', href: userCtx.myPostHref, html: `${icon('forum')}<span>我的回复</span>` }),
        el('a', { className: 'm3-menu-item', href: 'u.php?action-favor.html', html: `${icon('bookmark')}<span>我的收藏夹</span>` }),
        el('a', { className: 'm3-menu-item', href: 'userpay.php', html: `${icon('coins')}<span>积分管理</span>` }),
        el('a', { className: 'm3-menu-item', href: 'profile.php', html: `${icon('settings')}<span>账号设置</span>` }),
        userCtx.quitHref ? el('a', { className: 'm3-menu-item', href: userCtx.quitHref, style: 'color:var(--md-error);', html: `${icon('logout')}<span>退出登录</span>` }) : null
      ]));
    } else {
      profilePop.appendChild(el('div', { className: 'm3-menu-list' }, [
        el('a', { className: 'm3-menu-item', href: 'login.php', html: `${icon('person')}<span>登录账号</span>` }),
        el('a', { className: 'm3-menu-item', href: 'register.php', html: `${icon('edit')}<span>注册新账号</span>` })
      ]));
    }
    document.body.appendChild(profilePop);

    // --- Top App Bar ---
    const searchInput = el('input', {
      type: 'search',
      id: 'sp-md3e-filter-input',
      placeholder: pageType === 'index' ? '快速过滤版块/子版块，或按 Enter 站内搜索...'
        : pageType === 'read' ? '页内筛选楼层内容，或按 Enter 站内搜索...'
        : pageType === 'post' ? '输入关键词按 Enter 站内搜索...'
        : '过滤当前页面主题，或按 Enter 站内搜索...'
    });
    const runPageFilter = () => {
      const q = searchInput.value.trim().toLowerCase();
      qsa('[data-filter-text]', shell).forEach((node) => {
        const match = !q || node.dataset.filterText.includes(q);
        node.style.display = match ? '' : 'none';
        if (q && match && node.classList.contains('m3-board-card')) {
          qsa('.m3-sub-chip', node).forEach((chip) => { chip.style.display = ''; });
        }
      });
    };
    searchInput.addEventListener('input', runPageFilter);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        const q = searchInput.value.trim();
        location.href = `search.php?keyword=${encodeURIComponent(q)}`;
      }
    });

    const breadEl = el('nav', { className: 'm3-breadcrumbs', 'aria-label': '面包屑导航' });
    if (pageType !== 'index') {
      crumbsInfo.crumbs.forEach((c, idx) => {
        if (idx > 0) breadEl.appendChild(el('span', { className: 'm3-crumb-sep', html: icon('chevron_right') }));
        breadEl.appendChild(el('a', {
          className: `m3-crumb ${c.isCurrent ? 'is-current' : ''}`,
          href: c.href,
          text: c.text,
          title: c.text
        }));
      });
    }

    const topbar = el('header', { className: 'm3-topbar' }, [
      el('button', {
        type: 'button',
        className: 'm3-icon-btn m3-mobile-menu-btn',
        html: icon('menu'),
        onClick: () => {
          scrim.classList.add('is-open');
          shell.classList.add('mobile-rail-open');
        }
      }),
      el('a', {
        className: 'm3-brand-pill',
        href: 'index.php',
        title: '返回 南+ 首页',
        html: `<span class="m3-brand-mark">${BRAND_LOGO_SVG}</span><span class="m3-brand-name">南+</span>`
      }),
      breadEl,
      el('div', { className: 'm3-search-pill' }, [
        el('span', { html: icon('search'), style: 'display:inline-flex;color:var(--md-on-surface-variant);' }),
        searchInput,
        el('span', { className: 'm3-kbd', text: '/' })
      ]),
      el('div', { className: 'm3-topbar-actions' }, [
        typeof window.isSnowSeason === 'function' && window.isSnowSeason()
          ? el('button', {
              type: 'button',
              className: 'm3-icon-btn',
              title: '冬季飘雪彩蛋',
              html: icon('snow'),
              onClick: () => { if (typeof window.wa2 === 'function') window.wa2(); }
            })
          : null,
        el('button', {
          type: 'button',
          className: 'm3-icon-btn',
          title: '切换浅色 / 深色模式',
          html: icon(resolveThemeMode() === 'dark' ? 'light_mode' : 'dark_mode'),
          onClick: (e) => {
            const next = resolveThemeMode() === 'dark' ? 'light' : 'dark';
            Store.set('colorMode', next);
            applyThemeTokens();
            e.currentTarget.innerHTML = icon(next === 'dark' ? 'light_mode' : 'dark_mode');
            showToast(next === 'dark' ? '已切换为深色主题' : '已切换为浅色主题');
          }
        }),
        el('button', {
          type: 'button',
          className: 'm3-icon-btn',
          title: '主题与偏好设置',
          html: icon('settings'),
          onClick: openSettings
        }),
        el('button', {
          type: 'button',
          className: 'm3-user-chip',
          onClick: (e) => {
            e.stopPropagation();
            openPopoverNear(profilePop, e.currentTarget);
          }
        }, [
          userCtx.avatar ? el('img', { src: userCtx.avatar, alt: userCtx.username }) : null,
          el('span', { text: userCtx.username }),
          userCtx.sp ? el('span', { className: 'm3-sp-tag', text: userCtx.sp }) : null
        ])
      ])
    ]);

    // --- Main Content Mount ---
    const mainMount = el('main', { className: 'm3-main' });
    let readMeta = null;

    if (pageType === 'index') buildIndexPage(mainMount, userCtx);
    else if (pageType === 'thread_list') buildThreadListPage(mainMount, crumbsInfo);
    else if (pageType === 'thread_wall') buildThreadWallPage(mainMount, crumbsInfo);
    else if (pageType === 'read') readMeta = buildReadPage(mainMount);
    else if (pageType === 'post') buildPostPage(mainMount, crumbsInfo);
    else if (pageType === 'user') buildUserPage(mainMount, userCtx);
    else if (pageType === 'message') buildMessagePage(mainMount);
    else if (pageType === 'tasks') buildTasksPage(mainMount);
    else if (pageType === 'search') buildSearchPage(mainMount);
    else if (pageType === 'search_results') buildSearchResultsPage(mainMount, crumbsInfo);
    else buildGenericPage(mainMount);

    // --- Footer ---
    const footer = el('footer', { className: 'm3-footer' }, [
      el('span', { text: 'South Plus · Material Design 3 Expressive 重构界面 (保留原生脚本与请求交互)' }),
      el('div', { style: 'display:flex;gap:14px;' }, [
        el('a', { href: 'simple/', target: '_blank', text: '无图移动版' }),
        el('a', { href: 'faq.php', text: '帮助' }),
        el('a', { href: 'job.php?action-erasecookie-verify-95940903.html', text: '清除 Cookies' })
      ])
    ]);

    const workspace = el('div', { className: 'm3-workspace' }, [topbar, mainMount, footer]);

    shell.appendChild(rail);
    shell.appendChild(workspace);
    shell.appendChild(scrim);
    shell.appendChild(forumDrawer);
    shell.appendChild(settingsDialog);

    // --- Floating Dock (Toolbar + FAB) ---
    const dock = el('div', { className: 'm3-floating-dock' });
    const pillTools = el('div', { className: 'm3-floating-pill' });

    if (pageType === 'read' && readMeta) {
      const floorPop = el('div', { className: 'm3-popover', id: 'sp-md3e-floor-pop' });
      const list = el('div', { className: 'm3-menu-list', style: 'max-height:300px;overflow-y:auto;' });
      readMeta.floorEntries.forEach((fe) => {
        list.appendChild(el('button', {
          type: 'button',
          className: 'm3-menu-item',
          text: `${fe.floor} · ${fe.author}`,
          onClick: () => {
            closeAllPopovers();
            qs(`#${fe.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }));
      });
      floorPop.appendChild(list);
      document.body.appendChild(floorPop);

      pillTools.appendChild(el('button', {
        type: 'button',
        className: 'm3-icon-btn',
        title: '楼层电梯',
        html: icon('layers'),
        onClick: (e) => {
          e.stopPropagation();
          openPopoverNear(floorPop, e.currentTarget);
        }
      }));
    }

    pillTools.appendChild(el('button', {
      type: 'button',
      className: 'm3-icon-btn',
      title: '回到顶部 (t)',
      html: icon('arrow_up'),
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    }));
    dock.appendChild(pillTools);

    if (pageType === 'read' && qs('form[name="FORM"]')) {
      dock.appendChild(el('button', {
        type: 'button',
        className: 'm3-fab m3-ripple-host',
        html: `${icon('edit')}<span>回复</span>`,
        onClick: () => {
          const rc = qs('#sp-md3e-reply-card');
          if (rc) {
            rc.scrollIntoView({ behavior: 'smooth', block: 'center' });
            qs('textarea[name="atc_content"]', rc)?.focus();
          }
        }
      }));
    } else if (postBtnA) {
      dock.appendChild(el('a', {
        className: 'm3-fab m3-ripple-host',
        href: postBtnA.getAttribute('href') || '#',
        html: `${icon('edit')}<span>发帖</span>`
      }));
    }

    shell.appendChild(dock);
    document.body.appendChild(shell);

    // Reveal body smoothly
    document.documentElement.classList.remove('sp-md3e-loading');
    document.documentElement.classList.add('sp-md3e-ready');

    // Global click & keyboard handlers
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.m3-popover')) {
        closeAllPopovers();
      }
    });

    // Material Ripple Delegation
    document.addEventListener('pointerdown', (e) => {
      const host = e.target.closest('.m3-ripple-host');
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ink = document.createElement('span');
      ink.className = 'm3-ripple-ink';
      ink.style.width = `${size}px`;
      ink.style.height = `${size}px`;
      ink.style.left = `${e.clientX - rect.left - size / 2}px`;
      ink.style.top = `${e.clientY - rect.top - size / 2}px`;
      host.appendChild(ink);
      setTimeout(() => ink.remove(), 550);
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (Lightbox.root && Lightbox.root.classList.contains('is-open')) {
        if (e.key === 'Escape') Lightbox.close();
        else if (e.key === 'ArrowLeft') Lightbox.step(-1);
        else if (e.key === 'ArrowRight') Lightbox.step(1);
        return;
      }
      if (e.key === 'Escape') {
        closeOverlays();
        return;
      }
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) {
        return;
      }
      if (e.key === '/') {
        e.preventDefault();
        searchInput.focus();
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        if (forumDrawer.classList.contains('is-open')) closeOverlays();
        else openDrawer();
      } else if ((e.key === 'r' || e.key === 'R') && pageType === 'read') {
        const rc = qs('#sp-md3e-reply-card');
        if (rc) {
          e.preventDefault();
          rc.scrollIntoView({ behavior: 'smooth', block: 'center' });
          qs('textarea[name="atc_content"]', rc)?.focus();
        }
      } else if (e.key === 't' || e.key === 'T') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (e.key === '[' || e.key === ']') {
        const cur = qs('.m3-page-pill.is-current');
        if (cur) {
          const target = e.key === '[' ? cur.previousElementSibling : cur.nextElementSibling;
          if (target && target.tagName === 'A' && target.href) location.href = target.href;
        }
      }
    });

    // Tampermonkey Menu Commands
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('🎨 打开 MD3E 主题与偏好设置', openSettings);
      GM_registerMenuCommand('📂 打开全部版块目录', openDrawer);
    }
  }

  // Watch system dark/light preference changes when colorMode === 'auto'
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (Store.get('colorMode') === 'auto') applyThemeTokens();
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountShell, { once: true });
  } else {
    mountShell();
  }
})();
