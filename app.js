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
    dashboardView: 'utilityhub:dashboard-view',
    dashboardSort: 'utilityhub:dashboard-sort',
    collections: 'utilityhub:collections',
    pinnedCollections: 'utilityhub:pinned-collections',
    toolUsage: 'utilityhub:tool-usage',
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
    favorites: loadToolIds(loadJSON(CONFIG.storageKeys.favorites, [])),
    recents: loadToolIds(loadJSON(CONFIG.storageKeys.recents, [])).slice(0, CONFIG.maxRecents),
    view: loadPreference(CONFIG.storageKeys.dashboardView, ['grid', 'list'], 'grid'),
    sort: loadPreference(CONFIG.storageKeys.dashboardSort, ['az', 'recent', 'used'], 'az'),
    collections: loadCollections(loadJSON(CONFIG.storageKeys.collections, [])),
    pinnedCollections: [],
    toolUsage: loadToolUsage(loadJSON(CONFIG.storageKeys.toolUsage, {})),
    activeCollectionId: null,
    editingCollectionId: null,
    collectionModalMode: 'editor',
    returnToAssignment: false,
    pendingToolId: null,
    previewToolId: null,
    searchResultIndex: 0,
    dockCloseTimer: null,
    dockSearchOpen: false,
    dockTransitionId: 0,
  };
  state.pinnedCollections = loadPinnedCollections(
    loadJSON(CONFIG.storageKeys.pinnedCollections, []),
    state.collections
  );

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
    welcomeDate: document.getElementById('welcome-date'),
    welcomeTitle: document.getElementById('welcome-title'),
    welcomeToolCount: document.getElementById('welcome-tool-count'),
    welcomeFavoriteCount: document.getElementById('welcome-favorite-count'),
    recentlyAddedTools: document.getElementById('recently-added-tools'),
    recentTools: document.getElementById('recent-tools'),
    pinnedCollectionsSection: document.getElementById('pinned-collections-section'),
    pinnedCollections: document.getElementById('pinned-collections'),
    collectionsSection: document.getElementById('collections-section'),
    collectionsGrid: document.getElementById('collections-grid'),
    createCollectionBtn: document.getElementById('create-collection-btn'),
    toolsHeading: document.getElementById('tools-heading'),
    collectionBackBtn: document.getElementById('collection-back-btn'),
    gridViewBtn: document.getElementById('grid-view-btn'),
    listViewBtn: document.getElementById('list-view-btn'),
    sortSelect: document.getElementById('tool-sort'),
    collectionModal: document.getElementById('collection-modal'),
    collectionForm: document.getElementById('collection-form'),
    collectionModalTitle: document.getElementById('collection-modal-title'),
    collectionName: document.getElementById('collection-name'),
    collectionPinned: document.getElementById('collection-pinned'),
    collectionEditorFields: document.getElementById('collection-editor-fields'),
    collectionToolPicker: document.getElementById('collection-tool-picker'),
    collectionToolOptions: document.getElementById('collection-tool-options'),
    collectionAssignment: document.getElementById('collection-assignment'),
    collectionAssignmentTitle: document.getElementById('collection-assignment-title'),
    collectionAssignmentList: document.getElementById('collection-assignment-list'),
    collectionAssignmentEmpty: document.getElementById('collection-assignment-empty'),
    assignmentCreateCollectionBtn: document.getElementById('assignment-create-collection-btn'),
    collectionFormError: document.getElementById('collection-form-error'),
    collectionDeleteBtn: document.getElementById('collection-delete-btn'),
    collectionSaveBtn: document.getElementById('collection-save-btn'),
    collectionCloseBtn: document.getElementById('collection-close-btn'),
    collectionCancelBtn: document.getElementById('collection-cancel-btn'),
    actionDock: document.getElementById('uh-action-dock'),
    dockActions: document.querySelector('[data-dock-actions]'),
    openDockSearch: document.getElementById('open-dock-search'),
    dockSearchPanel: document.getElementById('uh-dock-search-panel'),
    dockResultsPanel: document.getElementById('uh-dock-results-panel'),
    dockResultsCount: document.getElementById('uh-dock-results-count'),
    dockResultsEmpty: document.getElementById('uh-dock-results-empty'),
    dockResultsList: document.getElementById('uh-dock-results-list'),
    closeDockSearch: document.getElementById('close-dock-search'),
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

  function loadPreference(key, allowedValues, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return allowedValues.includes(saved) ? saved : fallback;
    } catch (err) {
      console.warn('Utility Hub: could not read', key, err);
      return fallback;
    }
  }

  function isKnownToolId(id) {
    return typeof id === 'string' && toolsData.some((tool) => tool.id === id);
  }

  function loadToolIds(value) {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.filter(isKnownToolId)));
  }

  function loadCollections(value) {
    if (!Array.isArray(value)) return [];
    const seenIds = new Set();
    return value.reduce((collections, item) => {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' ||
        !item.id || seenIds.has(item.id) || typeof item.name !== 'string') return collections;
      const name = item.name.trim().slice(0, 48);
      if (!name) return collections;
      seenIds.add(item.id);
      collections.push({
        id: item.id,
        name,
        toolIds: loadToolIds(item.toolIds),
      });
      return collections;
    }, []);
  }

  function loadPinnedCollections(value, collections) {
    if (!Array.isArray(value)) return [];
    const validIds = new Set(collections.map((collection) => collection.id));
    return Array.from(new Set(value.filter((id) => typeof id === 'string' && validIds.has(id))));
  }

  function loadToolUsage(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.keys(value).reduce((usage, id) => {
      const item = value[id];
      if (isKnownToolId(id) && item && Number.isFinite(item.count) && item.count > 0) {
        usage[id] = {
          count: Math.floor(item.count),
          lastOpened: Number.isFinite(item.lastOpened) && item.lastOpened > 0 ? item.lastOpened : 0,
        };
      }
      return usage;
    }, {});
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
    const collection = state.collections.find((item) => item.id === state.activeCollectionId);
    const filtered = tagged.filter((tool) => {
      const categoryOk = state.activeCategory === 'All' || tool.category === state.activeCategory;
      const inCollection = !collection || collection.toolIds.includes(tool.id);
      return inCollection && categoryOk && isToolInQuickFilter(tool) && matchesQuery(tool, state.query);
    });
    return sortTools(filtered);
  }

  function sortTools(tools) {
    return tools.sort((a, b) => {
      if (state.query) {
        const rankDifference = getQueryRank(a, state.query) - getQueryRank(b, state.query);
        if (rankDifference) return rankDifference;
      }
      if (state.sort === 'recent') {
        const dateDifference = (Date.parse(`${b.added || ''}T00:00:00Z`) || 0) -
          (Date.parse(`${a.added || ''}T00:00:00Z`) || 0);
        if (dateDifference) return dateDifference;
      } else if (state.sort === 'used') {
        const usageA = state.toolUsage[a.id] || { count: 0, lastOpened: 0 };
        const usageB = state.toolUsage[b.id] || { count: 0, lastOpened: 0 };
        const usageDifference = usageB.count - usageA.count;
        if (usageDifference) return usageDifference;
        const lastOpenedDifference = usageB.lastOpened - usageA.lastOpened;
        if (lastOpenedDifference) return lastOpenedDifference;
      } else {
        const alphabetical = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
        if (alphabetical) return alphabetical;
      }
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }) ||
        searchIndex.get(a.id).order - searchIndex.get(b.id).order;
    });
  }

  function getFavoriteTools() {
    return sortTools(tagged.filter((t) => state.favorites.includes(t.id) &&
      isToolInQuickFilter(t) && matchesQuery(t, state.query)));
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

  function recordToolUse(id) {
    const previous = state.toolUsage[id] || { count: 0, lastOpened: 0 };
    state.toolUsage[id] = { count: previous.count + 1, lastOpened: Date.now() };
    saveJSON(CONFIG.storageKeys.toolUsage, state.toolUsage);
    addToRecents(id);
  }

  function openTool(id) {
    const tool = byId[id];
    if (!tool) return;
    if (!el.dockSearchPanel.hidden) closeDockSearch();
    recordToolUse(id);
    window.location.href = tool.url;
  }

  function openPreview(id) {
    const tool = byId[id];
    if (!tool) return;
    state.previewToolId = id;
    addToRecents(id);
    renderWelcomePanel();
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

  function persistCollections() {
    saveJSON(CONFIG.storageKeys.collections, state.collections);
    saveJSON(CONFIG.storageKeys.pinnedCollections, state.pinnedCollections);
  }

  function makeCollectionId() {
    let id;
    do {
      id = `collection-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    } while (state.collections.some((collection) => collection.id === id));
    return id;
  }

  function openCollectionEditor(collectionId = null, presetToolId = null, returnToAssignment = false) {
    const collection = state.collections.find((item) => item.id === collectionId);
    state.collectionModalMode = returnToAssignment ? 'create-from-assignment' : 'editor';
    state.returnToAssignment = returnToAssignment;
    state.editingCollectionId = collection ? collection.id : null;
    state.pendingToolId = isKnownToolId(presetToolId) ? presetToolId : null;
    el.collectionModalTitle.textContent = collection ? 'Edit collection' : 'Create collection';
    el.collectionSaveBtn.textContent = collection ? 'Save changes' : 'Create collection';
    el.collectionDeleteBtn.classList.toggle('hidden', !collection);
    el.collectionName.value = collection ? collection.name : '';
    el.collectionName.required = true;
    el.collectionPinned.checked = collection
      ? state.pinnedCollections.includes(collection.id)
      : false;
    el.collectionEditorFields.hidden = false;
    el.collectionToolPicker.hidden = false;
    el.collectionAssignment.classList.add('hidden');
    el.collectionFormError.hidden = true;
    const selectedIds = new Set(collection ? collection.toolIds : []);
    if (state.pendingToolId) selectedIds.add(state.pendingToolId);
    el.collectionToolOptions.innerHTML = sortTools(tagged.slice()).map((tool) => `
      <label class="uh-tool-option">
        <input type="checkbox" name="collection-tool" value="${escapeHtml(tool.id)}" ${selectedIds.has(tool.id) ? 'checked' : ''} />
        <span>${iconMarkup(tool.icon, 'h-4 w-4')}</span>
        <span class="uh-tool-option-copy"><strong>${escapeHtml(tool.title)}</strong><small>${escapeHtml(tool.category)}</small></span>
      </label>
    `).join('');
    el.collectionModal.setAttribute('aria-hidden', 'false');
    openModal(el.collectionModal);
    el.collectionName.focus({ preventScroll: true });
    if (window.lucide) window.lucide.createIcons();
  }

  function openCollectionAssignment(toolId) {
    const tool = byId[toolId];
    if (!tool) return;
    state.collectionModalMode = 'assignment';
    state.returnToAssignment = false;
    state.pendingToolId = toolId;
    state.editingCollectionId = null;
    el.collectionModalTitle.textContent = 'Add to collections';
    el.collectionSaveBtn.textContent = 'Save assignments';
    el.collectionDeleteBtn.classList.add('hidden');
    el.collectionName.required = false;
    el.collectionEditorFields.hidden = true;
    el.collectionToolPicker.hidden = true;
    el.collectionFormError.hidden = true;
    el.collectionAssignmentTitle.textContent = tool.title;
    el.collectionAssignmentList.innerHTML = state.collections.map((collection) => {
      const containsTool = collection.toolIds.includes(toolId);
      return `
        <label class="uh-assignment-option">
          <input type="checkbox" name="collection-assignment" value="${escapeHtml(collection.id)}" ${containsTool ? 'checked' : ''} />
          <span class="uh-assignment-copy">
            <strong>${escapeHtml(collection.name)}</strong>
            <small>${collection.toolIds.length} ${collection.toolIds.length === 1 ? 'tool' : 'tools'}</small>
          </span>
          <span class="uh-assignment-check" aria-hidden="true">${iconMarkup('check', 'h-4 w-4')}</span>
        </label>
      `;
    }).join('');
    el.collectionAssignmentEmpty.classList.toggle('hidden', state.collections.length > 0);
    el.collectionAssignment.classList.remove('hidden');
    el.collectionModal.setAttribute('aria-hidden', 'false');
    openModal(el.collectionModal);
    if (window.lucide) window.lucide.createIcons();
  }

  function closeCollectionEditor() {
    closeModal(el.collectionModal);
    el.collectionModal.setAttribute('aria-hidden', 'true');
    state.editingCollectionId = null;
    state.pendingToolId = null;
    state.collectionModalMode = 'editor';
    state.returnToAssignment = false;
  }

  function openDockSearch() {
    if (state.dockSearchOpen) {
      el.searchInput.focus({ preventScroll: true });
      return;
    }

    state.dockSearchOpen = true;
    const transitionId = ++state.dockTransitionId;
    clearTimeout(state.dockCloseTimer);
    state.dockCloseTimer = null;
    el.dockSearchPanel.hidden = false;
    el.dockSearchPanel.inert = false;
    el.dockSearchPanel.setAttribute('aria-hidden', 'false');
    el.dockSearchPanel.classList.remove('is-open');
    el.openDockSearch.classList.add('is-search-open');
    el.openDockSearch.setAttribute('aria-expanded', 'true');
    renderDockSearchResults();
    requestAnimationFrame(() => {
      if (state.dockSearchOpen && state.dockTransitionId === transitionId) {
        el.dockSearchPanel.classList.add('is-open');
      }
    });
    el.searchInput.focus({ preventScroll: true });
    el.searchInput.select();
  }

  function closeDockSearch(restoreFocus = false) {
    if (!state.dockSearchOpen) return;
    state.dockSearchOpen = false;
    const transitionId = ++state.dockTransitionId;
    clearTimeout(state.dockCloseTimer);
    el.dockSearchPanel.classList.remove('is-open');
    el.dockSearchPanel.inert = true;
    el.dockSearchPanel.setAttribute('aria-hidden', 'true');
    el.openDockSearch.classList.remove('is-search-open');
    el.openDockSearch.setAttribute('aria-expanded', 'false');
    if (document.activeElement === el.searchInput) el.searchInput.blur();
    if (restoreFocus) el.openDockSearch.focus({ preventScroll: true });

    state.dockCloseTimer = setTimeout(() => {
      if (state.dockSearchOpen || state.dockTransitionId !== transitionId) return;
      state.dockCloseTimer = null;
      el.dockSearchPanel.hidden = true;
      renderFavorites();
      renderGrid();
      if (window.lucide) window.lucide.createIcons();
    }, prefersReducedMotion() ? 0 : 240);
  }

  function dockResultTemplate(tool, index, featured = false) {
    const description = tool.description.length > 78
      ? `${tool.description.slice(0, 75).trimEnd()}…`
      : tool.description;
    const active = index === state.searchResultIndex;
    return `
      <button
        type="button"
        class="uh-dock-result${active ? ' is-active' : ''}"
        data-search-result="${escapeHtml(tool.id)}"
        tabindex="${active ? '0' : '-1'}"
        aria-label="Open ${escapeHtml(tool.title)}${featured ? ', popular tool' : ''}"
      >
        <span class="uh-dock-result-icon">${iconMarkup(tool.icon, 'h-4 w-4')}</span>
        <span class="uh-dock-result-copy">
          <strong>${highlightedTitle(tool)}</strong>
          <small>${escapeHtml(description)}</small>
        </span>
        <span class="uh-dock-result-meta">${escapeHtml(tool.category)}</span>
        <i data-lucide="arrow-up-right" class="uh-dock-result-open h-3.5 w-3.5" aria-hidden="true"></i>
      </button>
    `;
  }

  function renderDockSearchResults() {
    const query = state.query.trim();
    let results;
    let featured = false;
    if (query) {
      results = getFilteredTools();
      el.dockResultsCount.textContent = `${results.length} ${results.length === 1 ? 'match' : 'matches'}`;
      el.dockResultsEmpty.textContent = results.length
        ? ''
        : 'No tools found. Try a different keyword or search by category.';
    } else {
      results = tagged.filter((tool) => tool.popular).slice(0, 4);
      featured = results.length > 0;
      el.dockResultsCount.textContent = featured ? 'Popular' : '';
      el.dockResultsEmpty.textContent = 'What are you looking for?';
    }

    state.searchResultIndex = Math.min(state.searchResultIndex, Math.max(results.length - 1, 0));
    el.dockResultsList.innerHTML = results
      .map((tool, index) => dockResultTemplate(tool, index, featured))
      .join('');
    el.dockResultsList.hidden = results.length === 0;
    el.dockResultsEmpty.hidden = Boolean(results.length) && Boolean(query);
    el.dockResultsPanel.classList.toggle('has-query', Boolean(query));
    if (window.lucide) window.lucide.createIcons();
  }

  function moveDockResultFocus(direction) {
    const results = Array.from(el.dockResultsList.querySelectorAll('[data-search-result]'));
    if (!results.length) return;
    const currentIndex = results.indexOf(document.activeElement);
    const nextIndex = currentIndex < 0
      ? (direction > 0 ? 0 : results.length - 1)
      : Math.max(0, Math.min(results.length - 1, currentIndex + direction));
    state.searchResultIndex = nextIndex;
    results.forEach((result, index) => {
      result.classList.toggle('is-active', index === nextIndex);
      result.tabIndex = index === nextIndex ? 0 : -1;
    });
    results[nextIndex].focus({ preventScroll: true });
    results[nextIndex].scrollIntoView({ block: 'nearest' });
  }

  function saveCollection(event) {
    event.preventDefault();
    if (state.collectionModalMode === 'assignment') {
      const toolId = state.pendingToolId;
      if (!isKnownToolId(toolId)) {
        closeCollectionEditor();
        return;
      }
      const selectedIds = new Set(
        Array.from(el.collectionAssignmentList.querySelectorAll('input[name="collection-assignment"]:checked'))
          .map((input) => input.value)
      );
      state.collections.forEach((collection) => {
        const toolIds = new Set(collection.toolIds);
        if (selectedIds.has(collection.id)) toolIds.add(toolId);
        else toolIds.delete(toolId);
        collection.toolIds = Array.from(toolIds);
      });
      persistCollections();
      closeCollectionEditor();
      render();
      showToast('Collection assignments saved');
      return;
    }

    const name = el.collectionName.value.trim().slice(0, 48);
    const duplicate = state.collections.some((collection) =>
      collection.id !== state.editingCollectionId && collection.name.toLowerCase() === name.toLowerCase()
    );
    if (!name || duplicate) {
      el.collectionFormError.textContent = duplicate
        ? 'A collection with that name already exists.'
        : 'Enter a name for this collection.';
      el.collectionFormError.hidden = false;
      el.collectionName.focus();
      return;
    }

    const toolIds = Array.from(new Set(Array.from(el.collectionToolOptions.querySelectorAll('input[name="collection-tool"]:checked'))
      .map((input) => input.value)
      .filter(isKnownToolId)));
    if (state.collectionModalMode === 'create-from-assignment' && isKnownToolId(state.pendingToolId)) {
      if (!toolIds.includes(state.pendingToolId)) toolIds.push(state.pendingToolId);
    }
    let collection = state.collections.find((item) => item.id === state.editingCollectionId);
    if (collection) {
      collection.name = name;
      collection.toolIds = toolIds;
    } else {
      collection = { id: makeCollectionId(), name, toolIds };
      state.collections.push(collection);
    }

    const pinned = state.pinnedCollections.includes(collection.id);
    if (el.collectionPinned.checked && !pinned) state.pinnedCollections.push(collection.id);
    if (!el.collectionPinned.checked && pinned) {
      state.pinnedCollections = state.pinnedCollections.filter((id) => id !== collection.id);
    }
    persistCollections();
    if (state.returnToAssignment && isKnownToolId(state.pendingToolId)) {
      const toolId = state.pendingToolId;
      render();
      openCollectionAssignment(toolId);
      showToast('Collection created and tool assigned');
      return;
    }
    state.activeCollectionId = null;
    closeCollectionEditor();
    render();
    showToast('Collection saved');
  }

  function deleteCollection() {
    const collection = state.collections.find((item) => item.id === state.editingCollectionId);
    if (!collection || !window.confirm(`Delete "${collection.name}"?`)) return;
    state.collections = state.collections.filter((item) => item.id !== collection.id);
    state.pinnedCollections = state.pinnedCollections.filter((id) => id !== collection.id);
    if (state.activeCollectionId === collection.id) state.activeCollectionId = null;
    persistCollections();
    closeCollectionEditor();
    render();
    showToast('Collection deleted');
  }

  function openCollection(id) {
    if (!state.collections.some((collection) => collection.id === id)) return;
    state.activeCollectionId = id;
    state.activeCategory = 'All';
    state.quickFilter = null;
    render();
    el.grid.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function toggleCollectionPin(id) {
    if (state.pinnedCollections.includes(id)) {
      state.pinnedCollections = state.pinnedCollections.filter((pinnedId) => pinnedId !== id);
    } else if (state.collections.some((collection) => collection.id === id)) {
      state.pinnedCollections.push(id);
    }
    persistCollections();
    render();
  }

  function moveCollection(id, direction) {
    const index = state.collections.findIndex((collection) => collection.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= state.collections.length) return;
    [state.collections[index], state.collections[nextIndex]] =
      [state.collections[nextIndex], state.collections[index]];
    persistCollections();
    render();
  }

  function movePinnedCollection(id, direction) {
    const index = state.pinnedCollections.indexOf(id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= state.pinnedCollections.length) return;
    [state.pinnedCollections[index], state.pinnedCollections[nextIndex]] =
      [state.pinnedCollections[nextIndex], state.pinnedCollections[index]];
    persistCollections();
    render();
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
    if (!modalEl.open) lastFocusedBeforeModal = document.activeElement;
    modalEl.classList.remove('hidden');
    if (typeof modalEl.showModal === 'function' && !modalEl.open) modalEl.showModal();
    requestAnimationFrame(() => modalEl.classList.add('is-open'));
    document.body.classList.add('overflow-hidden');
    const focusTarget = modalEl.querySelector('[data-autofocus]') || modalEl;
    focusTarget.focus({ preventScroll: true });
  }

  function closeModal(modalEl) {
    modalEl.classList.remove('is-open');
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      if (modalEl.classList.contains('is-open')) return;
      if (typeof modalEl.close === 'function' && modalEl.open) modalEl.close();
      modalEl.classList.add('hidden');
    }, 150);
    if (lastFocusedBeforeModal) lastFocusedBeforeModal.focus({ preventScroll: true });
  }

  function anyModalOpen() {
    return el.previewModal.classList.contains('is-open') ||
      el.collectionModal.classList.contains('is-open');
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

  function cardTemplate(tool, { compact = false, view = state.view } = {}) {
    const isFav = state.favorites.includes(tool.id);
    return `
      <article
        class="tool-card card-frame group relative flex ${compact ? 'w-64 shrink-0' : ''} flex-col gap-3 rounded-card border border-line bg-panel p-5 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-glow focus-visible:-translate-y-0.5 focus-visible:border-accent focus-visible:shadow-glow ${view === 'list' ? 'is-list' : ''}"
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

        <div class="tool-card-header flex items-start justify-between gap-3">
          <div class="tool-card-icon flex h-10 w-10 items-center justify-center rounded-md border border-line bg-bg text-accent">
            ${iconMarkup(tool.icon, 'h-5 w-5')}
          </div>
          <div class="tool-card-actions flex items-center gap-1">
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
            <button
              type="button"
              class="uh-icon-button tool-collection-action"
              data-action="add-to-collection"
              data-id="${tool.id}"
              aria-label="Add ${escapeHtml(tool.title)} to collections"
              title="Add to collection"
            >
              ${iconMarkup('folder-plus', 'h-4 w-4')}
            </button>
          </div>
        </div>

        <div class="tool-card-content flex-1">
          <h3 class="font-display text-base font-semibold text-ink">${highlightedTitle(tool)}</h3>
          <p class="mt-1 text-sm leading-relaxed text-muted">${escapeHtml(tool.description)}</p>
        </div>

        <div class="tool-card-meta flex items-center justify-between border-t border-line pt-3">
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
            class="tab-btn shrink-0 rounded-md border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
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
        class="tab-btn quick-filter-btn shrink-0 rounded-md border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${state.quickFilter === id ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-line-strong hover:text-ink'}"
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
    if (!favs.length || state.activeCollectionId || !el.dockSearchPanel.hidden) {
      el.favoritesSection.classList.add('hidden');
      return;
    }
    el.favoritesSection.classList.remove('hidden');
    el.favoritesGrid.innerHTML = favs.map((t) => cardTemplate(t, { view: 'grid' })).join('');
  }

  function miniToolTemplate(tool) {
    return `
      <button type="button" class="uh-mini-tool" data-action="quick-open" data-id="${tool.id}" aria-label="Open ${escapeHtml(tool.title)}">
        <span class="uh-mini-icon">${iconMarkup(tool.icon, 'h-4 w-4')}</span>
        <span>${escapeHtml(tool.title)}</span>
      </button>
    `;
  }

  function renderWelcomePanel() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : (hour < 18 ? 'Good afternoon' : 'Good evening');
    el.welcomeTitle.textContent = `${greeting}, welcome back.`;
    el.welcomeDate.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    }).format(now);
    el.welcomeToolCount.textContent = String(toolsData.length);
    el.welcomeFavoriteCount.textContent = String(state.favorites.length);

    const recentlyAdded = tagged
      .filter((tool) => {
        const addedAt = Date.parse(`${tool.added || ''}T00:00:00Z`);
        return Number.isFinite(addedAt) && addedAt <= now.getTime();
      })
      .sort((a, b) => Date.parse(`${b.added}T00:00:00Z`) - Date.parse(`${a.added}T00:00:00Z`))
      .slice(0, 3);
    el.recentlyAddedTools.innerHTML = recentlyAdded.length
      ? recentlyAdded.map(miniToolTemplate).join('')
      : '<p class="uh-inline-empty">New tools will appear here when available.</p>';

    const recentTools = state.recents.slice(0, CONFIG.maxRecents)
      .map((id) => byId[id])
      .filter(Boolean);
    el.recentTools.innerHTML = recentTools.length
      ? recentTools.map(miniToolTemplate).join('')
      : '<p class="uh-inline-empty">Your recently opened tools will show up here.</p>';
  }

  function collectionCardTemplate(collection, { pinnedSection = false } = {}) {
    const collectionIndex = state.collections.findIndex((item) => item.id === collection.id);
    const pinnedIndex = state.pinnedCollections.indexOf(collection.id);
    const previewTools = collection.toolIds.slice(0, 4).map((id) => byId[id]).filter(Boolean);
    const preview = previewTools.length
      ? previewTools.map((tool) =>
        `<span class="uh-collection-icon" title="${escapeHtml(tool.title)}">${iconMarkup(tool.icon, 'h-4 w-4')}</span>`
      ).join('')
      : '<span class="uh-collection-no-preview">No tools yet</span>';
    const reorderActions = pinnedSection
      ? `
        <button type="button" class="uh-icon-button" data-action="move-pinned" data-id="${collection.id}" data-direction="-1" aria-label="Move ${escapeHtml(collection.name)} up" ${pinnedIndex <= 0 ? 'disabled' : ''}>${iconMarkup('chevron-up', 'h-4 w-4')}</button>
        <button type="button" class="uh-icon-button" data-action="move-pinned" data-id="${collection.id}" data-direction="1" aria-label="Move ${escapeHtml(collection.name)} down" ${pinnedIndex === state.pinnedCollections.length - 1 ? 'disabled' : ''}>${iconMarkup('chevron-down', 'h-4 w-4')}</button>
      `
      : `
        <button type="button" class="uh-icon-button" data-action="move-collection" data-id="${collection.id}" data-direction="-1" aria-label="Move ${escapeHtml(collection.name)} up" ${collectionIndex <= 0 ? 'disabled' : ''}>${iconMarkup('chevron-up', 'h-4 w-4')}</button>
        <button type="button" class="uh-icon-button" data-action="move-collection" data-id="${collection.id}" data-direction="1" aria-label="Move ${escapeHtml(collection.name)} down" ${collectionIndex === state.collections.length - 1 ? 'disabled' : ''}>${iconMarkup('chevron-down', 'h-4 w-4')}</button>
      `;
    const pinned = state.pinnedCollections.includes(collection.id);
    return `
      <article class="uh-collection-card">
        <div class="uh-collection-card-top">
          <div class="uh-collection-preview" aria-hidden="true">${preview}</div>
          <div class="uh-collection-reorder">${reorderActions}</div>
        </div>
        <h3>${escapeHtml(collection.name)}</h3>
        <p>${collection.toolIds.length} ${collection.toolIds.length === 1 ? 'tool' : 'tools'}</p>
        <div class="uh-collection-actions">
          <button type="button" class="uh-control-button uh-open-collection" data-action="open-collection" data-id="${collection.id}">Open</button>
          <button type="button" class="uh-icon-button" data-action="edit-collection" data-id="${collection.id}" aria-label="Edit ${escapeHtml(collection.name)}">${iconMarkup('pencil', 'h-4 w-4')}</button>
          ${pinnedSection
            ? `<button type="button" class="uh-icon-button" data-action="toggle-pin" data-id="${collection.id}" aria-label="Unpin ${escapeHtml(collection.name)}" title="Unpin collection">${iconMarkup('pin-off', 'h-4 w-4')}</button>`
            : `<button type="button" class="uh-icon-button" data-action="toggle-pin" data-id="${collection.id}" aria-label="${pinned ? 'Unpin' : 'Pin'} ${escapeHtml(collection.name)}" title="${pinned ? 'Unpin collection' : 'Pin to dashboard'}">${iconMarkup(pinned ? 'pin-off' : 'pin', 'h-4 w-4')}</button>`
          }
        </div>
      </article>
    `;
  }

  function renderCollections() {
    const active = state.collections.find((collection) => collection.id === state.activeCollectionId);
    if (state.activeCollectionId && !active) state.activeCollectionId = null;
    const viewingCollection = Boolean(active);
    el.collectionsSection.classList.toggle('hidden', viewingCollection);
    el.pinnedCollectionsSection.classList.toggle('hidden', viewingCollection || !state.pinnedCollections.length);
    el.toolsHeading.textContent = active ? active.name : 'All Tools';
    el.collectionBackBtn.classList.toggle('hidden', !active);

    el.collectionsGrid.innerHTML = state.collections.length
      ? state.collections.map((collection) => collectionCardTemplate(collection)).join('')
      : `
        <div class="uh-collection-empty">
          <p>You haven’t created any collections yet.</p>
          <button type="button" class="uh-control-button uh-primary-button" data-action="create-collection">Create collection</button>
        </div>
      `;
    const pinned = state.pinnedCollections
      .map((id) => state.collections.find((collection) => collection.id === id))
      .filter(Boolean);
    el.pinnedCollections.innerHTML = pinned
      .map((collection) => collectionCardTemplate(collection, { pinnedSection: true }))
      .join('');
  }

  function renderGrid() {
    const filtered = getFilteredTools();
    el.resultsCount.textContent = `${filtered.length} tool${filtered.length === 1 ? '' : 's'}`;
    el.grid.classList.toggle('is-list', state.view === 'list');
    el.gridViewBtn.setAttribute('aria-pressed', String(state.view === 'grid'));
    el.listViewBtn.setAttribute('aria-pressed', String(state.view === 'list'));
    el.sortSelect.value = state.sort;

    if (!el.dockSearchPanel.hidden) {
      el.grid.classList.add('hidden');
      el.emptyState.classList.add('hidden');
      renderDockSearchResults();
      return;
    }

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
    renderWelcomePanel();
    renderTabs();
    renderFooterCategories();
    renderCollections();
    renderFavorites();
    renderGrid();
    if (window.lucide) window.lucide.createIcons();
  }

  /* ----------------------------- Event delegation ------------------------------ */

  function handleGridClick(e) {
    const favBtn = e.target.closest('[data-action="favorite"]');
    const previewBtn = e.target.closest('[data-action="preview"]');
    const collectionBtn = e.target.closest('[data-action="add-to-collection"]');
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
    if (collectionBtn) {
      e.stopPropagation();
      openCollectionAssignment(collectionBtn.dataset.id);
      return;
    }
    if (card) {
      openTool(card.dataset.id);
    }
  }

  [el.grid, el.favoritesGrid].forEach((container) => {
    container.addEventListener('click', handleGridClick);
  });

  function handleDashboardAction(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === 'quick-open') return openTool(id);
    if (action === 'open-collection') return openCollection(id);
    if (action === 'edit-collection') return openCollectionEditor(id);
    if (action === 'toggle-pin') return toggleCollectionPin(id);
    if (action === 'move-collection') return moveCollection(id, Number(button.dataset.direction));
    if (action === 'move-pinned') return movePinnedCollection(id, Number(button.dataset.direction));
    if (action === 'create-collection') return openCollectionEditor();
  }

  [el.recentlyAddedTools, el.recentTools, el.collectionsGrid, el.pinnedCollections]
    .forEach((container) => container.addEventListener('click', handleDashboardAction));

  el.assignmentCreateCollectionBtn.addEventListener('click', () => {
    openCollectionEditor(null, state.pendingToolId, true);
  });

  el.dockActions.addEventListener('click', (e) => {
    const action = e.target.closest('[data-dock-action]');
    if (!action) return;
    if (action.dataset.dockAction === 'search') {
      if (!state.dockSearchOpen) openDockSearch();
      else closeDockSearch();
    }
  });
  el.closeDockSearch.addEventListener('click', () => closeDockSearch(true));
  el.dockResultsList.addEventListener('click', (e) => {
    const result = e.target.closest('[data-search-result]');
    if (result) openTool(result.dataset.searchResult);
  });
  el.dockResultsList.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      moveDockResultFocus(e.key === 'ArrowDown' ? 1 : -1);
    } else if (e.key === 'Enter') {
      const result = e.target.closest('[data-search-result]');
      if (result) {
        e.preventDefault();
        openTool(result.dataset.searchResult);
      }
    }
  });
  el.dockResultsList.addEventListener('focusin', (e) => {
    const result = e.target.closest('[data-search-result]');
    if (!result) return;
    state.searchResultIndex = Array.from(el.dockResultsList.querySelectorAll('[data-search-result]')).indexOf(result);
  });
  document.addEventListener('click', (e) => {
    const path = typeof e.composedPath === 'function' ? e.composedPath() : null;
    const clickedInsideDock = path
      ? path.includes(el.actionDock)
      : el.actionDock.contains(e.target);
    if (state.dockSearchOpen && !clickedInsideDock) closeDockSearch();
  });

  el.createCollectionBtn.addEventListener('click', () => openCollectionEditor());
  el.collectionBackBtn.addEventListener('click', () => {
    state.activeCollectionId = null;
    render();
  });
  el.gridViewBtn.addEventListener('click', () => {
    state.view = 'grid';
    saveJSON(CONFIG.storageKeys.dashboardView, state.view);
    render();
  });
  el.listViewBtn.addEventListener('click', () => {
    state.view = 'list';
    saveJSON(CONFIG.storageKeys.dashboardView, state.view);
    render();
  });
  el.sortSelect.addEventListener('change', () => {
    state.sort = el.sortSelect.value;
    saveJSON(CONFIG.storageKeys.dashboardSort, state.sort);
    render();
  });

  el.collectionForm.addEventListener('submit', saveCollection);
  el.collectionDeleteBtn.addEventListener('click', deleteCollection);
  [el.collectionCloseBtn, el.collectionCancelBtn].forEach((button) => {
    button.addEventListener('click', closeCollectionEditor);
  });
  el.collectionModal.addEventListener('click', (e) => {
    if (e.target === el.collectionModal || !el.collectionForm.contains(e.target)) {
      closeCollectionEditor();
    }
  });
  el.collectionModal.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeCollectionEditor();
  });
  el.previewOpenFull.addEventListener('click', () => {
    const id = state.previewToolId;
    if (!id) return;
    const previous = state.toolUsage[id] || { count: 0, lastOpened: 0 };
    state.toolUsage[id] = { count: previous.count + 1, lastOpened: Date.now() };
    saveJSON(CONFIG.storageKeys.toolUsage, state.toolUsage);
  });
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a.uh-tools-link');
    if (!link) return;
    const tool = tagged.find((item) => new URL(item.url, document.baseURI).href === link.href);
    if (tool) recordToolUse(tool.id);
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

  el.searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    el.clearSearch.classList.toggle('hidden', value.length === 0);
    state.query = value.trim();
    state.searchResultIndex = 0;
    if (el.dockSearchPanel.hidden) render();
    else renderDockSearchResults();
  });
  el.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && !el.dockResultsList.hidden) {
      e.preventDefault();
      moveDockResultFocus(1);
    } else if (e.key === 'ArrowUp' && !el.dockResultsList.hidden) {
      e.preventDefault();
      moveDockResultFocus(-1);
    } else if (e.key === 'Enter' && !el.dockResultsList.hidden) {
      const result = el.dockResultsList.querySelectorAll('[data-search-result]')[state.searchResultIndex];
      if (result) {
        e.preventDefault();
        openTool(result.dataset.searchResult);
      }
    }
  });

  el.clearSearch.addEventListener('click', () => {
    el.searchInput.value = '';
    el.clearSearch.classList.add('hidden');
    state.query = '';
    state.searchResultIndex = 0;
    if (el.dockSearchPanel.hidden) render();
    else renderDockSearchResults();
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
    const target = e.target || document.activeElement;
    const isContentEditable = Boolean(target && (
      target.isContentEditable ||
      (typeof target.closest === 'function' && target.closest('[contenteditable]:not([contenteditable="false"])'))
    ));
    const targetTag = target ? target.tagName : '';
    const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA' ||
      targetTag === 'INPUT' || targetTag === 'TEXTAREA' || isContentEditable;

    // Escape closes whichever modal is open, or blurs the search field.
    if (e.key === 'Escape') {
      if (el.previewModal.classList.contains('is-open')) return closePreview();
      if (el.collectionModal.classList.contains('is-open')) {
        e.preventDefault();
        return closeCollectionEditor();
      }
      if (!el.dockSearchPanel.hidden) {
        e.preventDefault();
        return closeDockSearch(true);
      }
      if (document.activeElement === el.searchInput) el.searchInput.blur();
      return;
    }

    if (el.collectionModal.classList.contains('is-open') && e.key === 'Tab') {
      const focusable = Array.from(el.collectionModal.querySelectorAll(
        'button:not(:disabled), input:not(:disabled)'
      )).filter((item) => !item.hidden && !item.closest('.hidden'));
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const index = focusable.indexOf(document.activeElement);
      if (e.shiftKey && index <= 0) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      } else if (!e.shiftKey && index === focusable.length - 1) {
        e.preventDefault();
        focusable[0].focus();
      }
      return;
    }

    if (anyModalOpen()) return; // don't let grid shortcuts leak under a modal

    // Focus search with an unmodified "/" or Cmd/Ctrl+K.
    const isSlashSearchShortcut = e.key === '/' && !e.ctrlKey && !e.altKey && !e.metaKey && !isTyping;
    const isSearchShortcut = isSlashSearchShortcut ||
      (!isTyping && (e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k');
    if (isSearchShortcut) {
      e.preventDefault();
      openDockSearch();
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
    if (e.target.closest && e.target.closest('button, a, input, select, textarea')) return;
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
