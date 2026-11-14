/* Shared Utility Hub layout, theme initialization, and stylesheet loader. */
(function () {
  'use strict';

  var currentScript = document.currentScript;
  var scriptUrl = currentScript && currentScript.src
    ? currentScript.src
    : new URL('style.js', document.baseURI).href;
  var rootUrl = new URL('./', scriptUrl);
  var pageType = (currentScript && currentScript.getAttribute('data-uh-page-type')) ||
    (new URL(scriptUrl).pathname === new URL('style.js', document.baseURI).pathname &&
      document.body && document.body.querySelector('#tool-grid') ? 'dashboard' : 'tool');
  var configuredTitle = currentScript && currentScript.getAttribute('data-uh-title');
  var themeKey = 'utilityhub:theme';
  var themePreference = window.matchMedia('(prefers-color-scheme: light)');
  var stylesheetUrl = new URL('styles/shared.css', rootUrl).href;
  var initialized = false;

  function savedTheme() {
    try {
      var value = window.localStorage.getItem(themeKey);
      return value === 'light' || value === 'dark' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    var html = document.documentElement;
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
    html.style.colorScheme = theme;
  }

  function loadStylesheet() {
    if (!document.head) return;
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i += 1) {
      if (links[i].href === stylesheetUrl || links[i].hasAttribute('data-uh-shared-style')) return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetUrl;
    link.setAttribute('data-uh-shared-style', '');
    document.head.appendChild(link);
  }

  function hasTailwindStyles() {
    var styleElements = document.querySelectorAll('style');
    for (var i = 0; i < styleElements.length; i += 1) {
      if (styleElements[i].textContent.indexOf('--tw-border-spacing-x') !== -1) return true;
    }
    return false;
  }

  function loadTailwindFallbackNow() {
    if (!document.head || hasTailwindStyles()) return;
    var usesTailwind = document.querySelector('script[src*="cdn.tailwindcss.com"]');
    if (!usesTailwind) return;

    var fallbackUrl = new URL('styles/tailwind-fallback.css', rootUrl).href;
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i += 1) {
      if (links[i].href === fallbackUrl) return;
    }

    var fallback = document.createElement('link');
    fallback.rel = 'stylesheet';
    fallback.href = fallbackUrl;
    fallback.setAttribute('data-uh-tailwind-fallback', '');
    var sharedStylesheet = document.querySelector('link[data-uh-shared-style]');
    document.head.insertBefore(fallback, sharedStylesheet || null);
  }

  function loadTailwindFallback() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        window.setTimeout(loadTailwindFallbackNow, 0);
      }, { once: true });
      return;
    }
    loadTailwindFallbackNow();
  }

  function loadFonts() {
    if (!document.head || document.querySelector('link[href*="fonts.googleapis.com"]')) return;
    var fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(fonts);
  }

  function loadPwaUpdater() {
    if (pageType === 'dashboard') return;
    if (!document.head || document.querySelector('script[data-uh-pwa-updater]')) return;
    var updater = document.createElement('script');
    updater.src = new URL('pwa.js', rootUrl).href;
    updater.setAttribute('data-uh-pwa-updater', '');
    updater.async = true;
    document.head.appendChild(updater);
  }

  function getTitle(options) {
    if (options && options.title) return options.title;
    if (configuredTitle) return configuredTitle;
    var heading = document.querySelector('h1');
    if (heading && !heading.closest('.hub-hero')) return heading.textContent.trim();
    var title = document.title.split(/[—|]/)[0].trim();
    return title === 'Util-Hub' || title === 'Utility Hub' ? '' : title;
  }

  function createBrand(title) {
    var brand = document.createElement('a');
    brand.className = 'uh-layout-brand';
    brand.href = rootUrl.href + 'index.html';
    brand.setAttribute('aria-label', 'Utility Hub home');

    var logo = document.createElement('img');
    logo.className = 'uh-layout-logo';
    logo.src = new URL('images/UH.png', rootUrl).href;
    logo.alt = '';
    logo.width = 38;
    logo.height = 38;
    brand.appendChild(logo);

    var text = document.createElement('span');
    text.className = 'uh-layout-brand-text';
    var name = document.createElement('span');
    name.className = 'uh-layout-brand-name';
    name.textContent = 'Utility Hub';
    text.appendChild(name);

    if (title) {
      var divider = document.createElement('span');
      divider.className = 'uh-layout-crumb-divider';
      divider.setAttribute('aria-hidden', 'true');
      divider.textContent = '/';
      var current = document.createElement('span');
      current.className = 'uh-layout-current';
      current.textContent = title;
      text.appendChild(divider);
      text.appendChild(current);
    }
    brand.appendChild(text);
    return brand;
  }

  function createToolsMenu() {
    var wrapper = document.createElement('div');
    wrapper.className = 'uh-tools-menu';

    var trigger = document.createElement('button');
    trigger.className = 'uh-tools-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-controls', 'uh-tools-panel');
    trigger.textContent = 'Tools';
    var arrow = document.createElement('span');
    arrow.className = 'uh-tools-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '▾';
    trigger.appendChild(arrow);

    var panel = document.createElement('div');
    panel.id = 'uh-tools-panel';
    panel.className = 'uh-tools-panel';
    panel.hidden = true;
    panel.setAttribute('aria-label', 'Utility Hub tools by category');

    function close() {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function () {
      var opening = panel.hidden;
      panel.hidden = !opening;
      trigger.setAttribute('aria-expanded', String(opening));
      if (opening) {
        if (window.matchMedia('(max-width: 600px)').matches) {
          var header = wrapper.closest('header');
          var panelTop = Math.min(header ? header.getBoundingClientRect().bottom + 8 : 62, window.innerHeight - 80);
          panel.style.top = Math.max(8, panelTop) + 'px';
          panel.style.maxHeight = 'calc(100dvh - ' + (Math.max(8, panelTop) + 14) + 'px)';
        } else {
          panel.style.removeProperty('top');
          panel.style.removeProperty('max-height');
        }
        var firstLink = panel.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!wrapper.contains(event.target)) close();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        close();
        trigger.focus();
      }
    });
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) close();
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);
    return { element: wrapper, panel: panel };
  }

  function populateToolsMenu(panel, tools) {
    if (!panel || !Array.isArray(tools)) return;
    var categories = Object.create(null);
    var seenPaths = Object.create(null);
    tools.forEach(function (tool) {
      if (!tool || typeof tool.title !== 'string' || typeof tool.url !== 'string') return;
      if (seenPaths[tool.url]) return;
      seenPaths[tool.url] = true;
      var category = typeof tool.category === 'string' && tool.category.trim()
        ? tool.category.trim()
        : 'Other Tools';
      if (!categories[category]) categories[category] = [];
      categories[category].push(tool);
    });

    panel.textContent = '';
    Object.keys(categories).sort(function (a, b) { return a.localeCompare(b); }).forEach(function (category) {
      var group = document.createElement('section');
      group.className = 'uh-tools-category';
      var heading = document.createElement('h2');
      heading.className = 'uh-tools-category-title';
      heading.textContent = category;
      var count = document.createElement('span');
      count.className = 'uh-tools-count';
      count.textContent = String(categories[category].length);
      heading.appendChild(count);
      group.appendChild(heading);

      categories[category].slice().sort(function (a, b) {
        return a.title.localeCompare(b.title);
      }).forEach(function (tool) {
        var link = document.createElement('a');
        link.className = 'uh-tools-link';
        link.href = new URL(tool.url, rootUrl).href;
        link.textContent = tool.title;
        group.appendChild(link);
      });
      panel.appendChild(group);
    });
  }

  function loadRegistry(panel) {
    if (window.UtilityHub && Array.isArray(window.UtilityHub.tools)) {
      populateToolsMenu(panel, window.UtilityHub.tools);
      return;
    }
    var existing = document.querySelector('script[data-uh-registry]');
    if (existing) {
      existing.addEventListener('load', function () {
        populateToolsMenu(panel, window.UtilityHub && window.UtilityHub.tools);
      }, { once: true });
      return;
    }
    var registryScript = document.createElement('script');
    registryScript.type = 'module';
    registryScript.src = new URL('app.js', rootUrl).href;
    registryScript.setAttribute('data-uh-registry', '');
    registryScript.addEventListener('load', function () {
      populateToolsMenu(panel, window.UtilityHub && window.UtilityHub.tools);
    }, { once: true });
    registryScript.addEventListener('error', function () {
      console.error('Utility Hub: could not load the registered tools for navigation.');
    }, { once: true });
    document.head.appendChild(registryScript);
  }

  function addFooter(pageType) {
    var footer = document.querySelector('footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.className = 'uh-shared-footer';
      document.body.appendChild(footer);
    } else {
      footer.classList.add('uh-shared-footer');
    }
    var brand = footer.querySelector('.uh-footer-brand');
    if (!brand) {
      brand = document.createElement('a');
      brand.className = 'uh-footer-brand';
      brand.href = rootUrl.href + 'index.html';
      var logo = document.createElement('img');
      logo.src = new URL('images/UH.png', rootUrl).href;
      logo.alt = '';
      logo.width = 24;
      logo.height = 24;
      var label = document.createElement('span');
      label.textContent = 'Utility Hub';
      brand.appendChild(logo);
      brand.appendChild(label);
    }

    if (pageType === 'dashboard') {
      if (!brand.parentNode) footer.appendChild(brand);
      return;
    }

    var content = footer.querySelector('.uh-footer-content');
    if (!content) {
      content = document.createElement('div');
      content.className = 'uh-footer-content';
      Array.prototype.slice.call(footer.childNodes).forEach(function (node) {
        if (node !== brand) content.appendChild(node);
      });
    }
    footer.insertBefore(brand, footer.firstChild);
    if (content.childNodes.length && content.parentNode !== footer) footer.appendChild(content);
  }

  function initLayout(options) {
    if (!document.body) return;
    if (initialized || document.documentElement.dataset.uhLayoutInitialized === 'true') {
      if (options && options.title) {
        var currentTitle = document.querySelector('.uh-layout-current');
        if (currentTitle) {
          currentTitle.textContent = options.title;
        } else {
          var brandText = document.querySelector('.uh-layout-brand-text');
          if (brandText) {
            var divider = document.createElement('span');
            divider.className = 'uh-layout-crumb-divider';
            divider.setAttribute('aria-hidden', 'true');
            divider.textContent = '/';
            currentTitle = document.createElement('span');
            currentTitle.className = 'uh-layout-current';
            currentTitle.textContent = options.title;
            brandText.appendChild(divider);
            brandText.appendChild(currentTitle);
          }
        }
      }
      initialized = true;
      return;
    }
    initialized = true;
    var type = options && options.pageType ? options.pageType : pageType;
    var title = type === 'dashboard' ? '' : getTitle(options);
    document.body.classList.toggle('uh-tool', type !== 'dashboard');
    document.body.classList.toggle('uh-dashboard', type === 'dashboard');
    document.documentElement.dataset.uhLayoutInitialized = 'true';

    var header = document.querySelector('header');
    if (!header) {
      header = document.createElement('header');
      header.className = 'uh-layout-header';
      document.body.insertBefore(header, document.body.firstChild);
    } else {
      header.classList.add('uh-layout-header');
    }

    if (type === 'dashboard') {
      var headerRow = header.querySelector('.flex.items-center.justify-between') || header;
      var rightControls = headerRow.querySelector('.flex.items-center.gap-2');
      if (!header.querySelector('.uh-tools-menu')) {
        var menu = createToolsMenu();
        if (rightControls) rightControls.insertBefore(menu.element, rightControls.firstChild);
        else headerRow.appendChild(menu.element);
        loadRegistry(menu.panel);
      }
    } else if (!header.querySelector('.uh-layout-controls')) {
      var controls = document.createElement('div');
      controls.className = 'uh-layout-controls';
      controls.appendChild(createBrand(title));
      header.insertBefore(controls, header.firstChild);
    }

    addFooter(type);
  }

  applyTheme(savedTheme() || (themePreference.matches ? 'light' : 'dark'));
  loadTailwindFallback();
  loadStylesheet();
  loadFonts();
  loadPwaUpdater();

  window.UtilityHub = window.UtilityHub || {};
  window.UtilityHub.initLayout = initLayout;
  if (document.body) initLayout();
  else document.addEventListener('DOMContentLoaded', function () { initLayout(); }, { once: true });

  window.addEventListener('storage', function (event) {
    if (event.key === themeKey || event.key === null) {
      applyTheme(savedTheme() || (themePreference.matches ? 'light' : 'dark'));
    }
  });
  if (typeof themePreference.addEventListener === 'function') {
    themePreference.addEventListener('change', function () {
      if (!savedTheme()) applyTheme(themePreference.matches ? 'light' : 'dark');
    });
  }
})();
