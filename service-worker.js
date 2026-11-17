'use strict';

// Bump CACHE whenever any app-shell file or its caching behavior changes.
const CACHE = 'uh-v1';
const APP_SHELL = [
  'index.html',
  'app.js',
  'style.js',
  'pwa.js',
  'styles/shared.css',
  'styles/tailwind-fallback.css',
  'manifest.webmanifest',
  'images/UH.png',
  'images/UH_2.png',
  'images/icon-192.png',
  'images/icon-512.png',
  'images/icon-maskable-512.png',
  'images/apple-touch-icon.png',
  'privacy.html',
  'offline.html',
];

function cacheResponse(cache, request, response) {
  if (!response || (!response.ok && response.type !== 'opaque')) return Promise.resolve();
  return cache.put(request, response.clone()).catch(function (error) {
    console.warn('Utility Hub: could not cache a response.', error);
  });
}

function cacheFirst(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        return cacheResponse(cache, request, response).then(function () { return response; });
      });
    });
  });
}

function staleWhileRevalidate(request, event) {
  var cachePromise = caches.open(CACHE);
  var update = cachePromise.then(function (cache) {
    return fetch(request).then(function (response) {
      return cacheResponse(cache, request, response).then(function () { return response; });
    });
  });
  event.waitUntil(update.catch(function (error) {
    console.warn('Utility Hub: background asset update failed.', error);
  }));
  return cachePromise.then(function (cache) {
    return cache.match(request);
  }).then(function (cached) {
    return cached || update;
  });
}

function cachedNavigation(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request, { ignoreSearch: true }).then(function (cached) {
      if (cached) return cached;
      return cache.match(new URL('offline.html', self.registration.scope).href);
    });
  });
}

function networkFirstNavigation(request) {
  return fetch(request, { cache: 'no-store' }).then(function (response) {
    if (!response.ok) return response;
    return caches.open(CACHE).then(function (cache) {
      return cacheResponse(cache, request, response).then(function () { return response; });
    });
  }).catch(function () {
    return cachedNavigation(request).then(function (response) {
      return response || Response.error();
    });
  });
}

function isStaticAsset(request, url) {
  if (/^(script|style|font|image|worker|manifest)$/.test(request.destination)) return true;
  return /\.(?:avif|css|gif|ico|jpe?g|js|json|map|mjs|png|svg|webmanifest|webp|woff2?)$/i.test(url.pathname);
}

self.addEventListener('install', function (event) {
  var scope = self.registration.scope;
  var urls = APP_SHELL.map(function (path) { return new URL(path, scope).href; });
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(urls);
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (names) {
    return Promise.all(names.filter(function (name) {
      return (name.indexOf('uh-') === 0 || name.indexOf('utilityhub-') === 0) && name !== CACHE;
    }).map(function (name) {
      return caches.delete(name);
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'UTILITY_HUB_SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data && event.data.type === 'UTILITY_HUB_GET_CACHED_PAGES' && event.ports[0]) {
    event.waitUntil(caches.open(CACHE).then(function (cache) {
      return cache.keys().then(function (requests) {
        return requests.map(function (request) {
          var url = new URL(request.url);
          return url.origin === self.location.origin && /\.html$/i.test(url.pathname) &&
            !/\/(?:index|privacy|offline)\.html$/i.test(url.pathname)
            ? { href: url.href, name: url.pathname.split('/').pop().replace(/\.html$/i, '').replace(/[-_]+/g, ' ') }
            : null;
        }).filter(Boolean);
      });
    }).then(function (pages) {
      event.ports[0].postMessage({ pages: pages });
    }));
  }
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  var url = new URL(request.url);
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (url.origin !== self.location.origin) {
    if (/^(script|style|font)$/.test(request.destination)) {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  if (isStaticAsset(request, url)) {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
