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
  },
  maxRecents: 5,
  // Optional: force a specific 3-letter code for a category's coordinate
  // tag instead of the auto-generated one. Leave empty to auto-derive.
  categoryCodeOverrides: {},
};

const SYNONYMS = {
  compress: ['shrink', 'reduce', 'optimize', 'downsize'],
  convert: ['change', 'transform'],
  photo: ['image', 'picture', 'jpg', 'png'],
  video: ['mp4', 'clip'],
  audio: ['mp3', 'sound'],
  pdf: ['document'],
  password: ['passcode', 'pwd'],
  timer: ['countdown', 'stopwatch'],
  text: ['words', 'string'],
  color: ['colour', 'hex', 'palette'],
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
    tags: ['terminal', 'editor', 'code', 'command', 'console', 'shell', 'text'],
    added: '2026-08-19',
  },
  {
    id: 'fam-tree',
    title: 'Family Tree',
    description: 'Create and visualize your family tree.',
    category: 'Utility',
    url: 'tools/fam-tree.html',
    icon: 'users',
    tags: ['family', 'tree', 'genealogy', 'relatives', 'ancestors', 'relationships', 'organize'],
    added: '2026-09-23',
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate your age in years, months, and days.',
    category: 'Utility',
    url: 'tools/age-calculator.html',
    icon: 'calendar',
    tags: ['age', 'calculate', 'birthday', 'years', 'months', 'days', 'date'],
    added: '2026-08-10',
  },
  {
    id: 'age-difference',
    title: 'Age Difference',
    description: 'Calculate the difference in age between two people.',
    category: 'Utility',
    url: 'tools/age-difference.html',
    icon: 'calendar',
    tags: ['age', 'difference', 'compare', 'calculate', 'years', 'months', 'dates'],
    added: '2026-08-10',
  },
  {
    id: 'photo-anonymizer',
    title: 'Photo Anonymizer',
    description: 'Remove faces and other identifying features from your photos.',
    category: 'Utility',
    url: 'tools/photo-anonymizer.html',
    icon: 'user',
    tags: ['photo', 'image', 'anonymize', 'blur', 'hide', 'faces', 'privacy'],
    added: '2026-08-12',
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and estimated reading time as you type.',
    category: 'Text',
    url: 'tools/word-counter.html',
    icon: 'type',
    tags: ['word', 'text', 'count', 'character', 'sentence', 'reading', 'length'],
    added: '2026-08-04',
  },
  {
    id: 'typing-speed-test',
    title: 'Typing Speed Test',
    description: 'Test your typing speed and accuracy in English or Malayalam, with WPM stats and history.',
    category: 'Text',
    url: 'tools/typing-speed-test.html',
    icon: 'keyboard',
    tags: ['typing', 'speed', 'wpm', 'accuracy', 'keyboard', 'practice', 'english', 'malayalam'],
    added: '2026-11-17',
  },
  {
    id: 'text-sorter',
    title: 'Text Sorter',
    description: 'Sort lines of text alphabetically, numerically, or by length.',
    category: 'Text',
    url: 'tools/text-sorter.html',
    icon: 'list-ordered',
    tags: ['text', 'sort', 'order', 'alphabetize', 'lines', 'arrange', 'words'],
    added: '2026-11-15',
  },
  {
    id: 'malayalam-to-fml',
    title: 'Malayalam to FML Converter',
    description: 'Convert Malayalam Unicode text to legacy FML encoding.',
    category: 'Text',
    url: 'tools/malayalam-to-fml.html',
    icon: 'languages',
    tags: ['malayalam', 'convert', 'text', 'unicode', 'fml', 'font', 'translate'],
    added: '2026-11-17',
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    description: 'Convert images between various formats with a single click.',
    category: 'Design',
    url: 'tools/image-converter.html',
    icon: 'image',
    tags: ['image', 'photo', 'convert', 'compress', 'format', 'jpg', 'png', 'webp'],
    added: '2026-08-04',
    popular: true,
  },
  {
    id: 'image-url-downloader',
    title: 'Image URL Downloader',
    description: 'Download images from a direct image URL.',
    category: 'Design',
    url: 'tools/image-url-downloader.html',
    icon: 'image-down',
    tags: ['image', 'photo', 'download', 'url', 'save', 'jpg', 'png'],
    added: '2026-11-17',
  },
  {
    id: 'mp4-mp3-converter',
    title: 'MP4 to MP3 Converter',
    description: 'Convert MP4 videos to MP3 audio files with high quality output.',
    category: 'Audio',
    url: 'tools/mp4-mp3-converter.html',
    icon: 'music',
    tags: ['video', 'audio', 'mp4', 'mp3', 'convert', 'extract', 'sound'],
    added: '2026-08-07',
  },
  {
    id: 'audio-converter',
    title: 'Audio Converter',
    description: 'Preview audio files, adjust output options, and download a browser-generated result.',
    category: 'Audio',
    url: 'tools/audio-converter.html',
    icon: 'music',
    tags: ['audio', 'sound', 'music', 'convert', 'format', 'mp3', 'wav', 'export'],
    added: '2026-10-23',
  },
  {
    id: 'video-trimmer',
    title: 'Video Trimmer',
    description: 'Preview videos, set clip start and end points, and export a trimmed segment locally.',
    category: 'Design',
    url: 'tools/video-trimmer.html',
    icon: 'scissors',
    tags: ['video', 'trim', 'cut', 'clip', 'mp4', 'edit', 'shorten'],
    added: '2026-10-23',
  },
  {
    id: 'basic-pdf-tool',
    title: 'Basic PDF Tool',
    description: 'Split pdf files with ease.',
    category: 'Document',
    url: 'tools/pdf-tool.html',
    icon: 'file-text',
    tags: ['pdf', 'document', 'split', 'compress', 'convert', 'pages', 'extract'],
    added: '2026-08-07',
  },
  {
    id: 'pdf-toolkit',
    title: 'PDF Toolkit',
    description: 'Edit and manipulate PDF files with ease.',
    category: 'Document',
    url: 'pdf-toolkit/index.html',
    icon: 'file-text',
    tags: ['pdf', 'document', 'merge', 'split', 'compress', 'convert', 'edit', 'pages'],
    added: '2026-08-10',
    popular: true,
  },
  {
    id: 'spin-wheel',
    title: 'Spin Wheel',
    description: 'Create a spin wheel for games, contests, or decision-making.',
    category: 'Fun',
    url: 'tools/spin-wheel.html',
    icon: 'rotate-cw',
    tags: ['wheel', 'spin', 'random', 'choose', 'picker', 'decision', 'names'],
    added: '2026-08-07',
  },
  {
    id: 'tournament',
    title: 'Tournament Bracket',
    description: 'Create and manage tournament brackets for your competitions.',
    category: 'Fun',
    url: 'tools/tournament.html',
    icon: 'users',
    tags: ['tournament', 'bracket', 'competition', 'teams', 'sports', 'organize', 'match'],
    added: '2026-08-07',
  },
  {
    id: 'text-repeater',
    title: 'Text Repeater',
    description: 'Repeat any block of text a specified number of times.',
    category: 'Text',
    url: 'tools/text-repeater.html',
    icon: 'repeat',
    tags: ['text', 'repeat', 'duplicate', 'copy', 'words', 'string', 'generate'],
    added: '2026-08-07',
  },
  {
    id: 'background-studio',
    title: 'Background Studio',
    description: 'Create and customize beautiful backgrounds for your projects.',
    category: 'Design',
    url: 'tools/background-studio.html',
    icon: 'image',
    tags: ['background', 'design', 'image', 'create', 'gradient', 'wallpaper', 'customize'],
    added: '2026-08-07',
  },
  {
    id: 'color-swapper',
    title: 'Color Swapper',
    description: 'Easily swap colors in your designs and see the results in real-time.',
    category: 'Design',
    url: 'tools/color-swapper.html',
    icon: 'palette',
    tags: ['color', 'colour', 'swap', 'replace', 'image', 'design', 'hex'],
    added: '2026-08-07',
  },
  {
    id: 'chroma-key',
    title: 'Chroma Key',
    description: 'Remove backgrounds from images and replace them with custom ones.',
    category: 'Design',
    url: 'tools/chroma-key.html',
    icon: 'image',
    tags: ['background', 'remove', 'image', 'photo', 'replace', 'transparent', 'color'],
    added: '2026-08-07',
  },
  {
    id: 'html-content',
    title: 'HTML Content',
    description: 'Extracts text content from HTML code, stripping away all tags and scripts.',
    category: 'Development',
    url: 'tools/html-content.html',
    icon: 'code',
    tags: ['html', 'text', 'extract', 'strip', 'tags', 'code', 'content'],
    added: '2026-08-07',
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Switch any block of text between UPPER, lower, Title, and Sentence case.',
    category: 'Text',
    url: 'tools/case-converter.html',
    icon: 'align-left',
    tags: ['text', 'case', 'convert', 'uppercase', 'lowercase', 'capitalize', 'words'],
    added: '2026-08-04',
  },
  {
    id: 'color-palette',
    title: 'Color Palette Picker',
    description: 'Generate harmonious color palettes and copy hex codes with a single click.',
    category: 'Design',
    url: 'tools/color-palette.html',
    icon: 'palette',
    tags: ['color', 'colour', 'palette', 'picker', 'hex', 'scheme', 'generate'],
    added: '2026-08-04',
  },
  {
    id: 'gradient-generator',
    title: 'Gradient Generator',
    description: 'Build smooth CSS gradients visually and export ready-to-use code.',
    category: 'Design',
    url: 'tools/gradient-generator.html',
    icon: 'paintbrush',
    tags: ['gradient', 'color', 'colour', 'css', 'background', 'design', 'generate'],
    added: '2026-08-04',
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Validate, beautify, and minify JSON with clear inline error messages.',
    category: 'Development',
    url: 'tools/json-formatter.html',
    icon: 'braces',
    tags: ['json', 'format', 'validate', 'beautify', 'minify', 'code', 'data'],
    added: '2026-08-04',
    popular: true,
  },
  {
    id: 'social-previewer',
    title: 'Social Previewer',
    description: 'Preview how your links will appear when shared on social media platforms.',
    category: 'Development',
    url: 'tools/social-previewer.html',
    icon: 'share2',
    tags: ['social', 'preview', 'post', 'image', 'share', 'link', 'media'],
    added: '2026-08-12',
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Turn any link or block of text into a downloadable QR code, live.',
    category: 'Development',
    url: 'tools/qr-generator.html',
    icon: 'qr-code',
    tags: ['qr', 'code', 'generate', 'scan', 'link', 'text', 'barcode'],
    added: '2026-08-04',
    popular: true,
  },
  {
    id: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate barcodes for any text or number, with support for multiple formats.',
    category: 'Development',
    url: 'tools/barcode-generator.html',
    icon: 'barcode',
    tags: ['barcode', 'generate', 'code', 'scan', 'product', 'number', 'label'],
    added: '2026-08-12',
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, and temperature between metric and imperial.',
    category: 'Convert',
    url: 'tools/unit-converter.html',
    icon: 'ruler',
    tags: ['unit', 'convert', 'change', 'length', 'weight', 'temperature', 'measurement'],
    added: '2026-08-04',
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Switch between Unix timestamps and human-readable dates and times.',
    category: 'Convert',
    url: 'tools/timestamp-converter.html',
    icon: 'clock',
    tags: ['timestamp', 'convert', 'date', 'time', 'unix', 'epoch', 'format'],
    added: '2026-08-04',
  },
  {
    id: 'todo-checklist',
    title: 'Todo Checklist',
    description: 'Jot down a quick task list that saves itself locally as you go.',
    category: 'Productivity',
    url: 'tools/todo-checklist.html',
    icon: 'list-checks',
    tags: ['todo', 'checklist', 'task', 'list', 'organize', 'productivity', 'save'],
    added: '2026-08-04',
  },
  {
    id: 'quick-calculator',
    title: 'Quick Calculator',
    description: 'A no-frills calculator for fast arithmetic without leaving the hub.',
    category: 'Productivity',
    url: 'tools/quick-calculator.html',
    icon: 'calculator',
    tags: ['calculator', 'calculate', 'math', 'arithmetic', 'add', 'multiply', 'numbers'],
    added: '2026-08-04',
  },
  {
    id: 'code-diff-checker',
    title: 'Code Diff Checker',
    description: 'Compare code snippets side by side or as a unified diff.',
    category: 'Development',
    url: 'tools/code-diff-checker.html',
    icon: 'file-diff',
    tags: ['code', 'diff', 'compare', 'changes', 'text', 'merge', 'developer'],
    added: '2026-10-22',
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize, convert, and batch-export images locally in your browser.',
    category: 'Design',
    url: 'tools/image-resizer.html',
    icon: 'scaling',
    tags: ['resize', 'compress', 'shrink', 'scale', 'photo', 'jpg', 'png', 'dimensions'],
    added: '2026-10-22',
    popular: true,
  },
  {
    id: 'font-previewer',
    title: 'Font Previewer',
    description: 'Preview uploaded fonts across sample text, scripts, and typography settings.',
    category: 'Design',
    url: 'tools/font-previewer.html',
    icon: 'type',
    tags: ['font', 'preview', 'text', 'typeface', 'upload', 'typography', 'design'],
    added: '2026-11-15',
  },
  {
    id: 'table-maker',
    title: 'Table Maker',
    description: 'Turn structured text into customizable tables and export them in multiple formats.',
    category: 'Productivity',
    url: 'tools/table-maker.html',
    icon: 'table',
    tags: ['table', 'data', 'text', 'convert', 'csv', 'export', 'format'],
    added: '2026-11-15',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong passwords with cryptographically secure randomness.',
    category: 'Utility',
    url: 'tools/password-generator.html',
    icon: 'key-round',
    tags: ['password', 'pwd', 'passcode', 'generate', 'secure', 'random', 'login'],
    added: '2026-10-22',
    popular: true,
  },
  {
    id: 'number-converter',
    title: 'Number Converter',
    description: 'Convert standard or custom-base integers and HEX/RGB color values.',
    category: 'Convert',
    url: 'tools/number-converter.html',
    icon: 'binary',
    tags: ['number', 'convert', 'hex', 'rgb', 'binary', 'decimal', 'color', 'colour'],
    added: '2026-10-22',
  },
  {
    id: 'countdown-timer',
    title: 'Countdown Timer',
    description: 'Run multiple named countdowns with presets, saved shortcuts, and accurate timing.',
    category: 'Timers',
    url: 'tools/countdown-timer.html',
    icon: 'timer',
    tags: ['countdown', 'timer', 'count', 'alarm', 'time', 'duration', 'reminder'],
    added: '2026-10-23',
  },
  {
    id: 'stopwatch',
    title: 'Stopwatch',
    description: 'Track precise elapsed time, lap splits, and exportable lap history.',
    category: 'Timers',
    url: 'tools/stopwatch.html',
    icon: 'watch',
    tags: ['stopwatch', 'timer', 'time', 'measure', 'elapsed', 'lap', 'count'],
    added: '2026-10-23',
  },
  {
    id: 'pomodoro-focus-timer',
    title: 'Pomodoro & Focus Timer',
    description: 'Structure focus sessions and breaks with local preferences and daily stats.',
    category: 'Timers',
    url: 'tools/pomodoro-focus-timer.html',
    icon: 'timer',
    tags: ['pomodoro', 'timer', 'focus', 'countdown', 'work', 'break', 'productivity'],
    added: '2026-10-23',
  },
  {
    id: 'event-countdown',
    title: 'Event Countdown',
    description: 'Create and organize local countdowns for important dates and milestones.',
    category: 'Timers',
    url: 'tools/event-countdown.html',
    icon: 'calendar-clock',
    tags: ['event', 'countdown', 'timer', 'date', 'time', 'occasion', 'reminder'],
    added: '2026-10-23',
  },
  {
    id: 'buzzer',
    title: 'Buzzer',
    description: 'A tactile, single-button stopwatch for games, quizzes, and quick timing.',
    category: 'Fun',
    url: 'tools/buzzer.html',
    icon: 'circle-dot',
    tags: ['buzzer', 'timer', 'stopwatch', 'game', 'quiz', 'button', 'sound'],
    added: '2026-10-23',
  },
];

window.UtilityHub = window.UtilityHub || {};
window.UtilityHub.tools = toolsData;

/* ============================================================================
   Everything below this line is generic engine code. It reads `toolsData`
   and `CONFIG` above and should not need to change when tools are added.
   ============================================================================ */

(function () {
  if (!document.getElementById('tool-grid')) return;

  /* ------------------------------- State -------------------------------- */

  const state = {
    query: '',
    activeCategory: 'All',
    quickFilter: null,
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
    emptyMessage: document.getElementById('empty-message'),
    suggestedTags: document.getElementById('suggested-tags'),
    favoritesSection: document.getElementById('favorites-section'),
    favoritesGrid: document.getElementById('favorites-grid'),
    grid: document.getElementById('tool-grid'),
    emptyState: document.getElementById('empty-state'),
    clearFiltersBtn: document.getElementById('clear-filters-btn'),
    footerCategories: document.getElementById('footer-categories'),
    footerToolCount: document.getElementById('footer-tool-count'),
    footerRev: document.getElementById('footer-rev-date'),
    footerYear: document.getElementById('footer-year'),
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

  function normalizeSearch(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  const synonymLookup = new Map();
  Object.keys(SYNONYMS).forEach((word) => {
    const group = [word, ...SYNONYMS[word]].map(normalizeSearch);
    group.forEach((member) => synonymLookup.set(member, group));
  });

  const ignoredQueryWords = new Set(['a', 'an', 'and', 'by', 'for', 'in', 'of', 'or', 'the', 'to', 'tool', 'tools']);

  function queryWords(query) {
    return normalizeSearch(query).split(/[^a-z0-9]+/).filter((word) => word && !ignoredQueryWords.has(word));
  }

  const searchIndex = new Map();
  const tagFrequency = new Map();
  tagged.forEach((tool, order) => {
    const title = normalizeSearch(tool.title);
    const description = normalizeSearch(tool.description);
    const category = normalizeSearch(tool.category);
    const tags = (tool.tags || []).map(normalizeSearch);
    const searchText = [title, description, category, ...tags].join(' ');
    searchIndex.set(tool.id, {
      order,
      title,
      description,
      category,
      tags,
      searchText,
      words: Array.from(new Set(searchText.split(/[^a-z0-9]+/).filter(Boolean))),
    });
    tags.forEach((tag) => tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1));
  });

  const suggestedSearchTags = Array.from(tagFrequency.keys())
    .sort((a, b) => tagFrequency.get(b) - tagFrequency.get(a) || a.localeCompare(b))
    .slice(0, 3);

  function isNewTool(tool, now = Date.now()) {
    const addedAt = Date.parse(`${tool.added}T00:00:00Z`);
    return Number.isFinite(addedAt) && addedAt <= now && now - addedAt <= 30 * 24 * 60 * 60 * 1000;
  }

  function isToolInQuickFilter(tool) {
    if (state.quickFilter === 'new') return isNewTool(tool);
    if (state.quickFilter === 'popular') return tool.popular === true;
    return true;
  }

  function editDistanceAtMostOne(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    let aIndex = 0;
    let bIndex = 0;
    let edits = 0;
    while (aIndex < a.length && bIndex < b.length) {
      if (a[aIndex] === b[bIndex]) {
        aIndex += 1;
        bIndex += 1;
      } else {
        edits += 1;
        if (edits > 1) return false;
        if (a.length > b.length) aIndex += 1;
        else if (b.length > a.length) bIndex += 1;
        else {
          aIndex += 1;
          bIndex += 1;
        }
      }
    }
    if (aIndex < a.length || bIndex < b.length) edits += 1;
    return edits <= 1;
  }

  function termMatchesField(term, field, words) {
    const alternatives = synonymLookup.get(term) || [term];
    if (alternatives.some((alternative) => field.includes(alternative))) return true;
    return term.length > 4 && words.some((word) => editDistanceAtMostOne(term, word));
  }

  function getQueryRank(tool, query) {
    const words = queryWords(query);
    if (!words.length) return 0;
    const index = searchIndex.get(tool.id);
    let rank = 0;

    for (const word of words) {
      const fields = [index.title, index.tags.join(' '), `${index.description} ${index.category}`];
      let wordRank = -1;
      for (let fieldRank = 0; fieldRank < fields.length; fieldRank += 1) {
        if (termMatchesField(word, fields[fieldRank], index.words)) {
          wordRank = fieldRank;
          break;
        }
      }
      if (wordRank === -1) return -1;
      rank = Math.max(rank, wordRank);
    }
    return rank;
  }

  /* -------------------------------- Filtering ------------------------------- */

  function matchesQuery(tool, query) {
    return getQueryRank(tool, query) !== -1;
  }

  function getFilteredTools() {
    return tagged.filter((tool) => {
      const categoryOk = state.activeCategory === 'All' || tool.category === state.activeCategory;
      return categoryOk && isToolInQuickFilter(tool) && matchesQuery(tool, state.query);
    }).sort((a, b) => {
      const rankDifference = getQueryRank(a, state.query) - getQueryRank(b, state.query);
      return rankDifference || searchIndex.get(a.id).order - searchIndex.get(b.id).order;
    });
  }

  function getFavoriteTools() {
    return tagged.filter((t) => state.favorites.includes(t.id) && isToolInQuickFilter(t) && matchesQuery(t, state.query));
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
    return el.previewModal.classList.contains('is-open');
  }

  /* --------------------------------- Templates -------------------------------- */

  function iconMarkup(name, extraClass) {
    return `<i data-lucide="${name}" class="${extraClass || ''}" aria-hidden="true"></i>`;
  }

  function badgeMarkup(tool) {
    const badge = isNewTool(tool) ? 'new' : (tool.popular === true ? 'popular' : '');
    if (!badge) return '';
    const label = badge === 'new' ? 'New' : 'Popular';
    return `<span class="uh-badge uh-badge--${badge}">${label}</span>`;
  }

  function highlightedTitle(tool) {
    const title = tool.title;
    const normalizedTitle = normalizeSearch(title);
    const words = queryWords(state.query);
    for (const word of words) {
      const alternatives = synonymLookup.get(word) || [word];
      for (const alternative of alternatives) {
        const start = normalizedTitle.indexOf(alternative);
        if (start !== -1) {
          const end = start + alternative.length;
          return `${escapeHtml(title.slice(0, start))}<mark class="tool-title-match">${escapeHtml(title.slice(start, end))}</mark>${escapeHtml(title.slice(end))}`;
        }
        if (alternative.length > 4) {
          const titleWords = Array.from(title.matchAll(/[a-z0-9]+/gi));
          const match = titleWords.find((part) => editDistanceAtMostOne(alternative, normalizeSearch(part[0])));
          if (match) {
            const startAt = match.index;
            const endAt = startAt + match[0].length;
            return `${escapeHtml(title.slice(0, startAt))}<mark class="tool-title-match">${escapeHtml(title.slice(startAt, endAt))}</mark>${escapeHtml(title.slice(endAt))}`;
          }
        }
      }
    }
    return escapeHtml(title);
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
            ${badgeMarkup(tool)}
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
          <h3 class="font-display text-base font-semibold text-ink">${highlightedTitle(tool)}</h3>
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

    const categoryTabs = all
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
    const quickTabs = [
      { id: 'new', label: 'New' },
      { id: 'popular', label: 'Popular' },
    ].map(({ id, label }) => `
      <button
        type="button"
        class="tab-btn quick-filter-btn shrink-0 rounded-md border px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${state.quickFilter === id ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-line-strong hover:text-ink'}"
        data-quick-filter="${id}"
        aria-pressed="${state.quickFilter === id}"
      >
        ${label}
      </button>
    `).join('');
    el.tabs.innerHTML = categoryTabs + quickTabs;
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
      el.emptyMessage.textContent = state.query
        ? `No tools match '${state.query}'.`
        : 'No tools match the current filters.';
      el.suggestedTags.innerHTML = suggestedSearchTags.map((tag) => `
        <button
          type="button"
          class="suggested-tag rounded-md border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted transition hover:border-accent hover:text-accent"
          data-search-tag="${escapeHtml(tag)}"
        >${escapeHtml(tag)}</button>
      `).join('');
      return;
    }
    el.emptyState.classList.add('hidden');
    el.grid.classList.remove('hidden');
    el.grid.innerHTML = filtered.map((t) => cardTemplate(t)).join('');
  }

  function render() {
    renderTabs();
    renderFooterCategories();
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

  [el.grid, el.favoritesGrid].forEach((container) => {
    container.addEventListener('click', handleGridClick);
  });

  el.tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-category]');
    if (!btn) return;
    state.activeCategory = btn.dataset.category;
    render();
    el.grid.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });

  el.tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quick-filter]');
    if (!btn) return;
    state.quickFilter = state.quickFilter === btn.dataset.quickFilter ? null : btn.dataset.quickFilter;
    render();
  });

  el.suggestedTags.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-search-tag]');
    if (!btn) return;
    state.query = btn.dataset.searchTag;
    state.activeCategory = 'All';
    state.quickFilter = null;
    el.searchInput.value = state.query;
    el.clearSearch.classList.remove('hidden');
    render();
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
    state.quickFilter = null;
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
    }, 180);
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
