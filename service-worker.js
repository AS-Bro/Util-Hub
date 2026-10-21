'use strict';

self.addEventListener('install', function () {
  // Updates remain waiting until the user chooses to apply them.
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'UTILITY_HUB_SKIP_WAITING') {
    self.skipWaiting();
  }
});
