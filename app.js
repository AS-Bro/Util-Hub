/* ==========================================================================
   UTILITY HUB — app.js
   --------------------------------------------------------------------------
   HOW TO ADD A NEW TOOL (this is the only thing you should ever need to do):

     1. Open this file.
     2. Add one object to the `toolsData` array below with:
          id, title, description, category, url, icon
     3. Save. That's it.

   Everything else — filter tabs, the "coordinate" tag on each card
   (e.g. DEV-03), the footer category links, and the search index — is
   derived automatically from `toolsData` at runtime. Nothing in index.html
   or elsewhere in this file needs to change.

   `icon` must be a valid icon name from the Lucide icon set (lucide.dev).
   ========================================================================== */

'use strict';

/* ------------------------------ Configuration ---------------------------- */

const CONFIG = {
  storageKeys: {
    theme: 'utilityhub:theme',
    favorites: 'utilityhub:favorites',
    recents: 'utilityhub:recents',
    requests: 'utilityhub:requests',
  },
  maxRecents: 5,
  // Swap this for a real inbox, or point buildRequestPayload() at a form
  // endpoint (Formspree, Getform, your own API, etc.) instead of mailto:.
  requestEmail: 'probro.offl@gmail.com',
  // Optional: force a specific 3-letter code for a category's coordinate
  // tag instead of the auto-generated one. Leave empty to auto-derive.
  categoryCodeOverrides: {},
};

/* --------------------------------- Data ----------------------------------
   The single source of truth. Add / remove / edit tool objects here only. */

const toolsData = [
  {
    id: 'terminal-editor',
    title: 'Terminal Editor',
    description: 'Edit the terminal UI.',
    category: 'Development',
    url: 'tools/terminal-editor.html',
    icon: 'code',
  },
  // {
  //   id: 'share-qr',
  //   title: 'Share QR',
  //   description: 'Generate and share QR codes for any URL.',
  //   category: 'Utility',
  //   url: 'tools/share-qr.html',
  //   icon: 'share',
  // },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate your age in years, months, and days.',
    category: 'Utility',
    url: 'tools/age-calculator.html',
    icon: 'calendar',
  },
  {
    id: 'photo-anonymizer',
    title: 'Photo Anonymizer',
    description: 'Remove faces and other identifying features from your photos.',
    category: 'Utility',
    url: 'tools/photo-anonymizer.html',
    icon: 'user',
  },
  {
    id: 'age-difference',
    title: 'Age Difference',
    description: 'Calculate the difference in age between two people.',
    category: 'Utility',
    url: 'tools/age-difference.html',
    icon: 'calendar',
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and estimated reading time as you type.',
    category: 'Text',
    url: 'tools/word-counter.html',
    icon: 'type',
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images between various formats with a single click.',
    category: 'Design',
    url: 'tools/image-converter.html',
    icon: 'image',
  },
  {
    id: 'mp4-mp3-converter',
    title: 'MP4 to MP3 Converter',
    description: 'Convert MP4 videos to MP3 audio files with high quality output.',
    category: 'Audio',
    url: 'tools/mp4-mp3-converter.html',
    icon: 'music',
  },
  {
    id: 'basic-pdf-tool',
    title: 'Basic PDF Tool',
    description: 'Split pdf files with ease.',
    category: 'Document',
    url: 'tools/pdf-tool.html',
    icon: 'file-text',
  },
  {
    id: 'pdf-toolkit',
    title: 'PDF Toolkit',
    description: 'Edit and manipulate PDF files with ease.',
    category: 'Document',
    url: 'pdf-toolkit/index.html',
    icon: 'file-text',
  },
  {
    id: 'spin-wheel',
    title: 'Spin Wheel',
    description: 'Create a spin wheel for games, contests, or decision-making.',
    category: 'Fun',
    url: 'tools/spin-wheel.html',
    icon: 'rotate-cw',
  },
  {
    id: 'tournament',
    title: 'Tournament Bracket',
    description: 'Create and manage tournament brackets for your competitions.',
    category: 'Fun',
    url: 'tools/tournament.html',
    icon: 'users',
  },
  {
    id: 'text-repeater',
    title: 'Text Repeater',
    description: 'Repeat any block of text a specified number of times.',
    category: 'Text',
    url: 'tools/text-repeater.html',
    icon: 'repeat',
  },
  {
    id: 'background-studio',
    title: 'Background Studio',
    description: 'Create and customize beautiful backgrounds for your projects.',
    category: 'Design',
    url: 'tools/background-studio.html',
    icon: 'image',
  },
  {
    id: 'color-swapper',
    title: 'Color Swapper',
    description: 'Easily swap colors in your designs and see the results in real-time.',
    category: 'Design',
    url: 'tools/color-swapper.html',
    icon: 'palette',
  },
  {
    id: 'chroma-key',
    title: 'Chroma Key',
    description: 'Remove backgrounds from images and replace them with custom ones.',
    category: 'Design',
    url: 'tools/chroma-key.html',
    icon: 'image',
  },
  {
    id: 'html-content',
    title: 'HTML Content',
    description: 'Extracts text content from HTML code, stripping away all tags and scripts.',
    category: 'Developer',
    url: 'tools/html-content.html',
    icon: 'code',
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Switch any block of text between UPPER, lower, Title, and Sentence case.',
    category: 'Text',
    url: 'tools/case-converter.html',
    icon: 'align-left',
  },
  {
    id: 'color-palette',
    title: 'Color Palette Picker',
    description: 'Generate harmonious color palettes and copy hex codes with a single click.',
    category: 'Design',
    url: 'tools/color-palette.html',
    icon: 'palette',
  },
  {
    id: 'gradient-generator',
    title: 'Gradient Generator',
    description: 'Build smooth CSS gradients visually and export ready-to-use code.',
    category: 'Design',
    url: 'tools/gradient-generator.html',
    icon: 'paintbrush',
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Validate, beautify, and minify JSON with clear inline error messages.',
    category: 'Developer',
    url: 'tools/json-formatter.html',
    icon: 'braces',
  },
  {
    id: 'social-previewer',
    title: 'Social Previewer',
    description: 'Preview how your links will appear when shared on social media platforms.',
    category: 'Developer',
    url: 'tools/social-previewer.html',
    icon: 'share2',
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Turn any link or block of text into a downloadable QR code, live.',
    category: 'Developer',
    url: 'tools/qr-generator.html',
    icon: 'qr-code',
  },
  {
    id: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate barcodes for any text or number, with support for multiple formats.',
    category: 'Developer',
    url: 'tools/barcode-generator.html',
    icon: 'barcode',
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, and temperature between metric and imperial.',
    category: 'Convert',
    url: 'tools/unit-converter.html',
    icon: 'ruler',
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Switch between Unix timestamps and human-readable dates and times.',
    category: 'Convert',
    url: 'tools/timestamp-converter.html',
    icon: 'clock',
  },
  {
    id: 'todo-checklist',
    title: 'Todo Checklist',
    description: 'Jot down a quick task list that saves itself locally as you go.',
    category: 'Productivity',
    url: 'tools/todo-checklist.html',
    icon: 'list-checks',
  },
  {
    id: 'quick-calculator',
    title: 'Quick Calculator',
    description: 'A no-frills calculator for fast arithmetic without leaving the hub.',
    category: 'Productivity',
    url: 'tools/quick-calculator.html',
    icon: 'calculator',
  },
];

/* ============================================================================
   Everything below this line is generic engine code. It reads `toolsData`
   and `CONFIG` above and should not need to change when tools are added.
   ============================================================================ */

(function () {
  /* ------------------------------- State -------------------------------- */

  const state = {
    query: '',
    activeCategory: 'All',
    favorites: loadJSON(CONFIG.storageKeys.favorites, []),
    recents: loadJSON(CONFIG.storageKeys.recents, []),
    previewToolId: null,
  };

  /* ---------------------------- DOM references ---------------------------- */

  const el = {
    html: document.documentElement,
    themeToggle: document.getElementById('theme-toggle'),
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    resultsCount: document.getElementById('results-count'),
    tabs: document.getElementById('category-tabs'),
    recentsSection: document.getElementById('recents-section'),
    recentsTrack: document.getElementById('recents-track'),
    favoritesSection: document.getElementById('favorites-section'),
    favoritesGrid: document.getElementById('favorites-grid'),
    grid: document.getElementById('tool-grid'),
    emptyState: document.getElementById('empty-state'),
    clearFiltersBtn: document.getElementById('clear-filters-btn'),
    footerCategories: document.getElementById('footer-categories'),
    footerToolCount: document.getElementById('footer-tool-count'),
    footerRev: document.getElementById('footer-rev-date'),
    footerYear: document.getElementById('footer-year'),
    requestBtn: document.getElementById('request-tool-btn'),
    requestModal: document.getElementById('request-modal'),
    requestForm: document.getElementById('request-form'),
    requestClose: document.getElementById('request-close'),
    requestCancel: document.getElementById('request-cancel'),
    requestSuccess: document.getElementById('request-success'),
    previewModal: document.getElementById('preview-modal'),
    previewIframe: document.getElementById('preview-iframe'),
    previewTitle: document.getElementById('preview-title'),
    previewClose: document.getElementById('preview-close'),
    previewOpenFull: document.getElementById('preview-open-full'),
    toastRegion: document.getElementById('toast-region'),
  };

  /* ----------------------------- Storage helpers --------------------------- */

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn('Utility Hub: could not read', key, err);
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Utility Hub: could not save', key, err);
    }
  }

  /* -------------------------------- Theme --------------------------------- */

  function getPreferredTheme() {
    const saved = localStorage.getItem(CONFIG.storageKeys.theme);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    el.html.classList.remove('light', 'dark');
    el.html.classList.add(theme);
    el.html.style.colorScheme = theme;
    if (el.themeToggle) el.themeToggle.setAttribute('aria-checked', String(theme === 'light'));
  }

  function toggleTheme() {
    const next = el.html.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(CONFIG.storageKeys.theme, next);
  }

  /* ------------------------------ Derived data ------------------------------ */

  // Unique categories, alphabetically sorted — nothing hardcoded in HTML.
  function getCategories() {
    return Array.from(new Set(toolsData.map((t) => t.category))).sort((a, b) =>
      a.localeCompare(b)
    );
  }

  function categoryCode(category) {
    if (CONFIG.categoryCodeOverrides[category]) return CONFIG.categoryCodeOverrides[category];
    const letters = category.replace(/[^a-zA-Z]/g, '').toUpperCase();
    return (letters + 'XXX').slice(0, 3);
  }

  // Per-category running index, e.g. Text -> TXT-01, TXT-02 (like a real
  // drawing register — the tag encodes what the tool actually is, it's not
  // a decorative global counter).
  function withCoordinateTags(tools) {
    const counters = {};
    return tools.map((tool) => {
      counters[tool.category] = (counters[tool.category] || 0) + 1;
      const num = String(counters[tool.category]).padStart(2, '0');
      return { ...tool, tag: `${categoryCode(tool.category)}-${num}` };
    });
  }

  const tagged = withCoordinateTags(toolsData);
  const byId = Object.fromEntries(tagged.map((t) => [t.id, t]));

  /* -------------------------------- Filtering ------------------------------- */

  function matchesQuery(tool, query) {
    if (!query) return true;
    const haystack = (tool.title + ' ' + tool.description).toLowerCase();
    return haystack.includes(query.toLowerCase());
  }

  function getFilteredTools() {
    return tagged.filter((tool) => {
      const categoryOk = state.activeCategory === 'All' || tool.category === state.activeCategory;
      return categoryOk && matchesQuery(tool, state.query);
    });
  }

  function getFavoriteTools() {
    return tagged.filter((t) => state.favorites.includes(t.id) && matchesQuery(t, state.query));
  }

  function getRecentTools() {
    return state.recents.map((id) => byId[id]).filter(Boolean);
  }

  /* --------------------------------- Actions -------------------------------- */

  function toggleFavorite(id) {
    const isFav = state.favorites.includes(id);
    state.favorites = isFav ? state.favorites.filter((f) => f !== id) : [id, ...state.favorites];
    saveJSON(CONFIG.storageKeys.favorites, state.favorites);
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites');
    render();
  }

  function addToRecents(id) {
    const withoutId = state.recents.filter((r) => r !== id);
    state.recents = [id, ...withoutId].slice(0, CONFIG.maxRecents);
    saveJSON(CONFIG.storageKeys.recents, state.recents);
  }

  function openTool(id) {
    const tool = byId[id];
    if (!tool) return;
    addToRecents(id);
    window.location.href = tool.url;
  }

  function openPreview(id) {
    const tool = byId[id];
    if (!tool) return;
    state.previewToolId = id;
    addToRecents(id);
    el.previewTitle.textContent = `${tool.title} — ${tool.tag}`;
    el.previewIframe.src = tool.url;
    el.previewOpenFull.href = tool.url;
    openModal(el.previewModal);
    renderRecents(); // reflect the new recent immediately behind the modal
  }

  function closePreview() {
    closeModal(el.previewModal);
    el.previewIframe.src = 'about:blank';
    state.previewToolId = null;
  }

  /* --------------------------------- Toasts --------------------------------- */

  let toastTimer = null;
  function showToast(message) {
    if (!el.toastRegion) return;
    el.toastRegion.textContent = message;
    el.toastRegion.classList.remove('opacity-0', 'translate-y-2');
    el.toastRegion.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toastRegion.classList.add('opacity-0', 'translate-y-2');
      el.toastRegion.classList.remove('opacity-100', 'translate-y-0');
    }, 2200);
  }

  /* --------------------------------- Modals --------------------------------- */

  let lastFocusedBeforeModal = null;

  function openModal(modalEl) {
    lastFocusedBeforeModal = document.activeElement;
    modalEl.classList.remove('hidden');
    requestAnimationFrame(() => modalEl.classList.add('is-open'));
    document.body.classList.add('overflow-hidden');
    const focusTarget = modalEl.querySelector('[data-autofocus]') || modalEl;
    focusTarget.focus({ preventScroll: true });
  }

  function closeModal(modalEl) {
    modalEl.classList.remove('is-open');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => modalEl.classList.add('hidden'), 150);
    if (lastFocusedBeforeModal) lastFocusedBeforeModal.focus({ preventScroll: true });
  }

  function anyModalOpen() {
    return el.previewModal.classList.contains('is-open') || el.requestModal.classList.contains('is-open');
  }

  /* --------------------------------- Templates -------------------------------- */

  function iconMarkup(name, extraClass) {
    return `<i data-lucide="${name}" class="${extraClass || ''}" aria-hidden="true"></i>`;
  }

  function cardTemplate(tool, { compact = false } = {}) {
    const isFav = state.favorites.includes(tool.id);
    return `
      <article
        class="tool-card card-frame group relative flex ${compact ? 'w-64 shrink-0' : ''} flex-col gap-3 rounded-card border border-line bg-panel p-5 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-glow focus-visible:-translate-y-0.5 focus-visible:border-accent focus-visible:shadow-glow"
        data-card
        data-id="${tool.id}"
        tabindex="0"
        role="button"
        aria-label="Open ${escapeHtml(tool.title)}"
      >
        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>

        <div class="flex items-start justify-between gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-bg text-accent">
            ${iconMarkup(tool.icon, 'h-5 w-5')}
          </div>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="favorite-btn rounded-md border border-transparent p-1.5 text-muted transition hover:border-line hover:text-signal focus-visible:border-line"
              data-action="favorite"
              data-id="${tool.id}"
              data-favorited="${isFav}"
              aria-pressed="${isFav}"
              aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}"
            >
              ${iconMarkup('star', 'h-4 w-4 star-icon')}
            </button>
            <button
              type="button"
              class="rounded-md border border-transparent p-1.5 text-muted transition hover:border-line hover:text-accent focus-visible:border-line"
              data-action="preview"
              data-id="${tool.id}"
              aria-label="Preview ${escapeHtml(tool.title)}"
            >
              ${iconMarkup('eye', 'h-4 w-4')}
            </button>
          </div>
        </div>

        <div class="flex-1">
          <h3 class="font-display text-base font-semibold text-ink">${escapeHtml(tool.title)}</h3>
          <p class="mt-1 text-sm leading-relaxed text-muted">${escapeHtml(tool.description)}</p>
        </div>

        <div class="flex items-center justify-between border-t border-line pt-3">
          <span class="font-mono text-[11px] tracking-wide text-faint">${tool.tag}</span>
          <span class="font-mono text-[11px] uppercase tracking-wide text-accent">${escapeHtml(tool.category)}</span>
        </div>
      </article>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* --------------------------------- Renderers -------------------------------- */

  function renderTabs() {
    const categories = getCategories();
    const counts = { All: tagged.length };
    categories.forEach((c) => (counts[c] = tagged.filter((t) => t.category === c).length));
    const all = ['All', ...categories];

    el.tabs.innerHTML = all
      .map((cat) => {
        const active = cat === state.activeCategory;
        return `
          <button
            type="button"
            class="tab-btn shrink-0 rounded-md border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              active
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-line text-muted hover:border-line-strong hover:text-ink'
            }"
            data-category="${escapeHtml(cat)}"
            aria-pressed="${active}"
          >
            ${escapeHtml(cat)} <span class="opacity-60">(${counts[cat]})</span>
          </button>
        `;
      })
      .join('');
  }

  function renderFooterCategories() {
    const categories = getCategories();
    el.footerCategories.innerHTML = categories
      .map(
        (cat) => `
          <button
            type="button"
            class="footer-cat-link font-mono text-xs text-muted underline decoration-line underline-offset-4 transition hover:text-accent hover:decoration-accent"
            data-category="${escapeHtml(cat)}"
          >
            ${escapeHtml(cat)}
          </button>
        `
      )
      .join('');
    el.footerToolCount.textContent = String(tagged.length).padStart(2, '0');
  }

  function renderRecents() {
    const recents = getRecentTools();
    if (!recents.length) {
      el.recentsSection.classList.add('hidden');
      return;
    }
    el.recentsSection.classList.remove('hidden');
    el.recentsTrack.innerHTML = recents.map((t) => cardTemplate(t, { compact: true })).join('');
  }

  function renderFavorites() {
    const favs = getFavoriteTools();
    if (!favs.length) {
      el.favoritesSection.classList.add('hidden');
      return;
    }
    el.favoritesSection.classList.remove('hidden');
    el.favoritesGrid.innerHTML = favs.map((t) => cardTemplate(t)).join('');
  }

  function renderGrid() {
    const filtered = getFilteredTools();
    el.resultsCount.textContent = `${filtered.length} tool${filtered.length === 1 ? '' : 's'}`;

    if (!filtered.length) {
      el.grid.innerHTML = '';
      el.grid.classList.add('hidden');
      el.emptyState.classList.remove('hidden');
      return;
    }
    el.emptyState.classList.add('hidden');
    el.grid.classList.remove('hidden');
    el.grid.innerHTML = filtered.map((t) => cardTemplate(t)).join('');
  }

  function render() {
    renderTabs();
    renderFooterCategories();
    renderRecents();
    renderFavorites();
    renderGrid();
    if (window.lucide) window.lucide.createIcons();
  }

  /* ----------------------------- Event delegation ------------------------------ */

  function handleGridClick(e) {
    const favBtn = e.target.closest('[data-action="favorite"]');
    const previewBtn = e.target.closest('[data-action="preview"]');
    const card = e.target.closest('[data-card]');

    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.id);
      return;
    }
    if (previewBtn) {
      e.stopPropagation();
      openPreview(previewBtn.dataset.id);
      return;
    }
    if (card) {
      openTool(card.dataset.id);
    }
  }

  [el.grid, el.favoritesGrid, el.recentsTrack].forEach((container) => {
    container.addEventListener('click', handleGridClick);
  });

  el.tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-category]');
    if (!btn) return;
    state.activeCategory = btn.dataset.category;
    render();
    el.grid.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  el.footerCategories.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-category]');
    if (!btn) return;
    state.activeCategory = btn.dataset.category;
    state.query = '';
    el.searchInput.value = '';
    render();
    document.getElementById('browse').scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  el.clearFiltersBtn.addEventListener('click', () => {
    state.query = '';
    state.activeCategory = 'All';
    el.searchInput.value = '';
    render();
  });

  /* --------------------------------- Search --------------------------------- */

  let searchDebounce = null;
  el.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    const value = e.target.value;
    el.clearSearch.classList.toggle('hidden', value.length === 0);
    searchDebounce = setTimeout(() => {
      state.query = value.trim();
      render();
    }, 80);
  });

  el.clearSearch.addEventListener('click', () => {
    el.searchInput.value = '';
    el.clearSearch.classList.add('hidden');
    state.query = '';
    render();
    el.searchInput.focus();
  });

  /* -------------------------------- Theme toggle ------------------------------- */

  el.themeToggle.addEventListener('click', toggleTheme);

  /* -------------------------------- Preview modal ------------------------------- */

  el.previewClose.addEventListener('click', closePreview);
  el.previewModal.addEventListener('click', (e) => {
    if (e.target.dataset.backdrop !== undefined) closePreview();
  });

  /* -------------------------------- Request modal ------------------------------- */

  function openRequestModal() {
    el.requestForm.reset();
    el.requestForm.classList.remove('hidden');
    el.requestSuccess.classList.add('hidden');
    openModal(el.requestModal);
  }

  function closeRequestModal() {
    closeModal(el.requestModal);
  }

  el.requestBtn.addEventListener('click', openRequestModal);
  el.requestClose.addEventListener('click', closeRequestModal);
  el.requestCancel.addEventListener('click', closeRequestModal);
  el.requestModal.addEventListener('click', (e) => {
    if (e.target.dataset.backdrop !== undefined) closeRequestModal();
  });

  el.requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(el.requestForm);
    const name = (formData.get('tool-name') || '').toString().trim();
    const details = (formData.get('tool-details') || '').toString().trim();
    if (!name) return;

    // Persist locally so nothing is lost even without a backend wired up.
    const requests = loadJSON(CONFIG.storageKeys.requests, []);
    requests.unshift({ name, details, submittedAt: new Date().toISOString() });
    saveJSON(CONFIG.storageKeys.requests, requests);

    // Also offer a ready-to-send email as the zero-backend fallback.
    // Replace this block with a fetch() to your form endpoint if you have one.
    const subject = encodeURIComponent(`Utility Hub tool request: ${name}`);
    const body = encodeURIComponent(`Tool idea: ${name}\n\nDetails:\n${details || '(none provided)'}`);
    const mailtoLink = document.getElementById('request-mailto-fallback');
    if (mailtoLink) mailtoLink.href = `mailto:${CONFIG.requestEmail}?subject=${subject}&body=${body}`;

    el.requestForm.classList.add('hidden');
    el.requestSuccess.classList.remove('hidden');
  });

  /* ---------------------------------- Keyboard ---------------------------------- */

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

    // Escape closes whichever modal is open, or blurs the search field.
    if (e.key === 'Escape') {
      if (el.previewModal.classList.contains('is-open')) return closePreview();
      if (el.requestModal.classList.contains('is-open')) return closeRequestModal();
      if (document.activeElement === el.searchInput) el.searchInput.blur();
      return;
    }

    if (anyModalOpen()) return; // don't let grid shortcuts leak under a modal

    // Focus search with "/" or Cmd/Ctrl+K.
    const isSearchShortcut = (e.key === '/' && !isTyping) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k');
    if (isSearchShortcut) {
      e.preventDefault();
      el.searchInput.focus();
      el.searchInput.select();
      return;
    }

    if (isTyping) return;

    // Arrow-key navigation + Enter-to-open across the currently visible grid.
    const cards = Array.from(el.grid.querySelectorAll('[data-card]'));
    if (!cards.length) return;
    const currentIndex = cards.indexOf(document.activeElement);

    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      let next;
      if (currentIndex === -1) next = 0;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = Math.min(currentIndex + 1, cards.length - 1);
      else next = Math.max(currentIndex - 1, 0);
      cards[next].focus();
    } else if (e.key === 'Enter' && currentIndex !== -1) {
      cards[currentIndex].click();
    }
  });

  // Cards use role="button" so Space should activate them like a native button.
  document.addEventListener('keydown', (e) => {
    if (e.key !== ' ') return;
    const card = e.target.closest && e.target.closest('[data-card]');
    if (!card) return;
    e.preventDefault();
    card.click();
  });

  /* ---------------------------------- Init ---------------------------------- */

  function init() {
    applyTheme(getPreferredTheme());
    el.footerYear.textContent = String(new Date().getFullYear());
    el.footerRev.textContent = new Date().toISOString().slice(0, 10);
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
