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
  var installPromptEvent = null;
  var installButton = null;
  var iosInstallHint = null;
  var appInstalled = false;

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
    updateThemeColor(theme);
  }

  function ensureMeta(name, content) {
    if (!document.head) return null;
    var meta = document.head.querySelector('meta[name="' + name + '"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
    return meta;
  }

  function updateThemeColor(theme) {
    var meta = document.head && document.head.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#edf3f6' : '#091521';
  }

  function setupPwaMetadata() {
    if (!document.head) return;

    var manifest = document.head.querySelector('link[rel="manifest"]');
    if (!manifest) {
      manifest = document.createElement('link');
      manifest.rel = 'manifest';
      document.head.appendChild(manifest);
    }
    manifest.href = new URL('manifest.webmanifest', rootUrl).href;

    var appleIcon = document.head.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
      appleIcon = document.createElement('link');
      appleIcon.rel = 'apple-touch-icon';
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = new URL('images/apple-touch-icon.png', rootUrl).href;

    ensureMeta('apple-mobile-web-app-capable', 'yes');
    ensureMeta('apple-mobile-web-app-title', 'Util-Hub');
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
    ensureMeta('theme-color', '#091521');
    updateThemeColor(document.documentElement.classList.contains('light') ? 'light' : 'dark');

    if (typeof MutationObserver === 'function') {
      var themeObserver = new MutationObserver(function () {
        updateThemeColor(document.documentElement.classList.contains('light') ? 'light' : 'dark');
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
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

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;
  }

  function isIosSafari() {
    var userAgent = window.navigator.userAgent || '';
    var isIos = /iPad|iPhone|iPod/.test(userAgent) ||
      (/Macintosh/.test(userAgent) && window.navigator.maxTouchPoints > 1);
    return isIos && /Safari/.test(userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(userAgent);
  }

  function iosHintWasDismissed() {
    try {
      return window.localStorage.getItem('utilityhub:ios-install-hint-dismissed') === 'true';
    } catch (error) {
      return false;
    }
  }

  function updatePwaInstallUi() {
    var installed = appInstalled || isStandalone();
    if (installButton) installButton.hidden = installed || !installPromptEvent;
    if (iosInstallHint) {
      iosInstallHint.hidden = installed || !!installPromptEvent || !isIosSafari() || iosHintWasDismissed();
    }
  }

  function createPwaInstallButton() {
    if (installButton) return installButton;

    installButton = document.createElement('button');
    installButton.className = 'uh-pwa-install';
    installButton.type = 'button';
    installButton.textContent = 'Install app';
    installButton.setAttribute('aria-label', 'Install Utility Hub');
    installButton.hidden = true;
    installButton.addEventListener('click', function () {
      if (!installPromptEvent) return;

      var prompt = installPromptEvent;
      installPromptEvent = null;
      updatePwaInstallUi();
      try {
        prompt.prompt();
        Promise.resolve(prompt.userChoice).then(function (choice) {
          if (choice && choice.outcome === 'accepted') appInstalled = true;
          updatePwaInstallUi();
        }).catch(function (error) {
          console.warn('Utility Hub: install prompt failed.', error);
          updatePwaInstallUi();
        });
      } catch (error) {
        console.warn('Utility Hub: install prompt failed.', error);
        updatePwaInstallUi();
      }
    });
    return installButton;
  }

  function createIosInstallHint() {
    if (iosInstallHint) return iosInstallHint;

    iosInstallHint = document.createElement('div');
    iosInstallHint.className = 'uh-ios-install-hint';
    iosInstallHint.hidden = true;
    iosInstallHint.setAttribute('role', 'status');

    var text = document.createElement('span');
    text.textContent = 'Install Util-Hub: tap Share -> Add to Home Screen.';
    var dismiss = document.createElement('button');
    dismiss.className = 'uh-ios-install-dismiss';
    dismiss.type = 'button';
    dismiss.textContent = 'Dismiss';
    dismiss.setAttribute('aria-label', 'Dismiss Add to Home Screen instructions');
    dismiss.addEventListener('click', function () {
      try {
        window.localStorage.setItem('utilityhub:ios-install-hint-dismissed', 'true');
      } catch (error) {
        console.warn('Utility Hub: could not save the install hint preference.', error);
      }
      updatePwaInstallUi();
    });
    iosInstallHint.appendChild(text);
    iosInstallHint.appendChild(dismiss);
    return iosInstallHint;
  }

  function addPwaInstallControls(header, rightControls, layoutControls) {
    var button = createPwaInstallButton();
    var target = rightControls || layoutControls;
    if (target && button.parentNode !== target) target.appendChild(button);

    var hint = createIosInstallHint();
    if (hint.parentNode !== header) header.appendChild(hint);
    updatePwaInstallUi();
  }

  function addPwaStyles() {
    if (!document.head || document.querySelector('style[data-uh-pwa-styles]')) return;
    var style = document.createElement('style');
    style.setAttribute('data-uh-pwa-styles', '');
    style.textContent =
      '.uh-pwa-install,.uh-ios-install-dismiss{display:inline-flex;min-height:36px;align-items:center;justify-content:center;border:1px solid var(--uh-line-strong);border-radius:var(--uh-radius-sm);background:var(--uh-panel);padding:0 .7rem;color:var(--uh-text);font:500 .68rem var(--uh-font-mono);letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;cursor:pointer;transition:color var(--uh-transition),border-color var(--uh-transition)}' +
      '.uh-pwa-install:hover,.uh-ios-install-dismiss:hover{border-color:var(--uh-accent);color:var(--uh-accent)}' +
      '.uh-pwa-install[hidden],.uh-ios-install-hint[hidden]{display:none}' +
      '.uh-pwa-controls{display:flex;align-items:center;gap:.5rem}' +
      '.uh-ios-install-hint{display:flex;width:min(calc(100% - 2rem),1180px);box-sizing:border-box;align-items:center;justify-content:space-between;gap:.75rem;margin:0 auto .65rem;border:1px solid var(--uh-line);border-radius:var(--uh-radius-sm);background:var(--uh-panel);padding:.55rem .7rem;color:var(--uh-muted);font:500 .72rem/1.45 var(--uh-font-body)}' +
      '@media(max-width:480px){.uh-ios-install-hint{width:calc(100% - 1rem);font-size:.68rem}.uh-pwa-install{min-height:32px;padding:0 .5rem;font-size:.62rem}}';
    document.head.appendChild(style);
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

    var backdrop = document.createElement('button');
    backdrop.className = 'uh-tools-backdrop';
    backdrop.type = 'button';
    backdrop.hidden = true;
    backdrop.setAttribute('aria-label', 'Close tools menu');

    var panelHeader = document.createElement('div');
    panelHeader.className = 'uh-tools-panel-header';
    var handle = document.createElement('button');
    handle.className = 'uh-tools-sheet-handle';
    handle.type = 'button';
    handle.setAttribute('aria-label', 'Swipe down to close tools');
    var handleBar = document.createElement('span');
    handleBar.setAttribute('aria-hidden', 'true');
    handle.appendChild(handleBar);

    var search = document.createElement('input');
    search.className = 'uh-tools-search';
    search.type = 'search';
    search.placeholder = 'Search tools';
    search.setAttribute('aria-label', 'Search tools menu');
    panelHeader.appendChild(handle);
    panelHeader.appendChild(search);

    var bodyScrollState = null;
    var touchStartY = null;

    function isPhoneSheet() {
      return window.matchMedia('(max-width: 600px)').matches;
    }

    function setBodyScrollLocked(locked) {
      if (locked) {
        if (bodyScrollState) return;
        var body = document.body;
        var scrollY = window.scrollY || window.pageYOffset || 0;
        bodyScrollState = {
          scrollY: scrollY,
          overflow: body.style.overflow,
          position: body.style.position,
          top: body.style.top,
          width: body.style.width,
        };
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = -scrollY + 'px';
        body.style.width = '100%';
        body.classList.add('uh-tools-sheet-open');
        return;
      }
      if (!bodyScrollState) return;
      var state = bodyScrollState;
      bodyScrollState = null;
      document.body.classList.remove('uh-tools-sheet-open');
      document.body.style.overflow = state.overflow;
      document.body.style.position = state.position;
      document.body.style.top = state.top;
      document.body.style.width = state.width;
      window.scrollTo(0, state.scrollY);
    }

    function focusableElements() {
      return Array.prototype.slice.call(panel.querySelectorAll(
        'a[href]:not([hidden]), button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden]), select:not([disabled]):not([hidden]), textarea:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (element) {
        return element.getClientRects().length > 0;
      });
    }

    function filterTools() {
      var query = search.value.trim().toLocaleLowerCase();
      Array.prototype.forEach.call(panel.querySelectorAll('.uh-tools-category'), function (category) {
        var visibleLinks = 0;
        Array.prototype.forEach.call(category.querySelectorAll('.uh-tools-link'), function (link) {
          var title = link.querySelector('.uh-tools-link-title');
          var visible = !query || (title && title.textContent.toLocaleLowerCase().indexOf(query) !== -1);
          link.hidden = !visible;
          if (visible) visibleLinks += 1;
        });
        category.hidden = visibleLinks === 0;
      });
    }

    function open() {
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      if (isPhoneSheet()) {
        backdrop.hidden = false;
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        setBodyScrollLocked(true);
        window.requestAnimationFrame(function () {
          panel.classList.add('uh-tools-panel-open');
          search.focus();
        });
      } else {
        panel.removeAttribute('role');
        panel.removeAttribute('aria-modal');
        var firstLink = panel.querySelector('.uh-tools-link:not([hidden])');
        if (firstLink) firstLink.focus();
      }
    }

    function closePanel(restoreFocus) {
      if (panel.hidden) return;
      var animatedSheet = isPhoneSheet();
      panel.classList.remove('uh-tools-panel-open');
      backdrop.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      setBodyScrollLocked(false);
      search.value = '';
      filterTools();
      if (animatedSheet && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.setTimeout(function () {
          if (trigger.getAttribute('aria-expanded') === 'false') panel.hidden = true;
        }, 260);
      } else {
        panel.hidden = true;
      }
      if (restoreFocus !== false) trigger.focus();
    }

    trigger.addEventListener('click', function () {
      if (trigger.getAttribute('aria-expanded') !== 'true') open();
      else closePanel(true);
    });
    backdrop.addEventListener('click', function () { closePanel(true); });
    document.addEventListener('click', function (event) {
      if (!wrapper.contains(event.target)) closePanel(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        closePanel(true);
        return;
      }
      if (event.key === 'Tab' && !panel.hidden && isPhoneSheet()) {
        var focusable = focusableElements();
        if (!focusable.length) {
          event.preventDefault();
          search.focus();
          return;
        }
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    search.addEventListener('input', filterTools);
    handle.addEventListener('pointerdown', function (event) {
      touchStartY = event.clientY;
      if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener('pointerup', function (event) {
      if (touchStartY !== null && event.clientY - touchStartY > 40) closePanel(true);
      touchStartY = null;
    });
    handle.addEventListener('pointercancel', function () { touchStartY = null; });
    panel.addEventListener('click', function (event) {
      if (event.target.closest('a')) closePanel(true);
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(backdrop);
    wrapper.appendChild(panel);
    panel.appendChild(panelHeader);
    return { element: wrapper, panel: panel };
  }

  function populateToolsMenu(panel, tools) {
    if (!panel || !Array.isArray(tools)) return;
    function isNewTool(tool) {
      var addedAt = Date.parse(String(tool.added || '') + 'T00:00:00Z');
      var now = Date.now();
      return Number.isFinite(addedAt) && addedAt <= now && now - addedAt <= 30 * 24 * 60 * 60 * 1000;
    }

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

    Array.prototype.forEach.call(panel.querySelectorAll('.uh-tools-category'), function (category) {
      category.remove();
    });
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
        var title = document.createElement('span');
        title.className = 'uh-tools-link-title';
        title.textContent = tool.title;
        link.appendChild(title);
        var badgeType = isNewTool(tool) ? 'new' : (tool.popular === true ? 'popular' : '');
        if (badgeType) {
          var badge = document.createElement('span');
          badge.className = 'uh-badge uh-badge--' + badgeType;
          badge.textContent = badgeType === 'new' ? 'New' : 'Popular';
          link.appendChild(badge);
        }
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
    var isDashboard = pageType === 'dashboard';
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

    var content = footer.querySelector('.uh-footer-content');
    if (!content && isDashboard) {
      content = document.createElement('div');
      content.className = 'uh-footer-content';
      footer.appendChild(content);
    } else if (!content) {
      content = document.createElement('div');
      content.className = 'uh-footer-content';
      Array.prototype.slice.call(footer.childNodes).forEach(function (node) {
        if (node !== brand) content.appendChild(node);
      });
    }
    footer.insertBefore(brand, footer.firstChild);
    if (content.parentNode !== footer) footer.appendChild(content);

    if (!content.querySelector('.uh-footer-privacy')) {
      var privacy = document.createElement('div');
      privacy.className = 'uh-footer-privacy';

      var message = document.createElement('span');
      message.className = 'uh-footer-privacy-message';

      var lock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lock.setAttribute('class', 'uh-footer-lock');
      lock.setAttribute('viewBox', '0 0 24 24');
      lock.setAttribute('fill', 'none');
      lock.setAttribute('stroke', 'currentColor');
      lock.setAttribute('stroke-width', '1.8');
      lock.setAttribute('aria-hidden', 'true');
      var lockBody = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      lockBody.setAttribute('x', '4');
      lockBody.setAttribute('y', '10');
      lockBody.setAttribute('width', '16');
      lockBody.setAttribute('height', '11');
      lockBody.setAttribute('rx', '2');
      var lockShackle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      lockShackle.setAttribute('d', 'M8 10V7a4 4 0 0 1 8 0v3m-4 4v3');
      lock.appendChild(lockBody);
      lock.appendChild(lockShackle);

      var messageText = document.createElement('span');
      messageText.textContent = 'Files stay in your browser. Some tools send text or image URLs to remote hosts.';
      message.appendChild(lock);
      message.appendChild(messageText);

      var privacyLink = document.createElement('a');
      privacyLink.href = new URL('privacy.html', rootUrl).href;
      privacyLink.textContent = 'How it works';

      privacy.appendChild(message);
      privacy.appendChild(privacyLink);
      content.appendChild(privacy);
    }
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
    var dashboardRightControls = null;
    var layoutControls = null;
    if (!header) {
      header = document.createElement('header');
      header.className = 'uh-layout-header';
      document.body.insertBefore(header, document.body.firstChild);
    } else {
      header.classList.add('uh-layout-header');
    }

    if (type === 'dashboard') {
      var headerRow = header.querySelector('.flex.items-center.justify-between') || header;
      dashboardRightControls = headerRow.querySelector('.flex.items-center.gap-2');
      if (!header.querySelector('.uh-tools-menu')) {
        var menu = createToolsMenu();
        if (dashboardRightControls) dashboardRightControls.insertBefore(menu.element, dashboardRightControls.firstChild);
        else headerRow.appendChild(menu.element);
        loadRegistry(menu.panel);
      }
    } else if (!header.querySelector('.uh-layout-controls')) {
      var controls = document.createElement('div');
      controls.className = 'uh-layout-controls';
      controls.appendChild(createBrand(title));
      header.insertBefore(controls, header.firstChild);
    }

    layoutControls = header.querySelector('.uh-layout-controls');
    addPwaInstallControls(header, dashboardRightControls, layoutControls);
    addFooter(type);
  }

  setupPwaMetadata();
  addPwaStyles();
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

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installPromptEvent = event;
    updatePwaInstallUi();
  });
  window.addEventListener('appinstalled', function () {
    appInstalled = true;
    installPromptEvent = null;
    updatePwaInstallUi();
  });
})();
