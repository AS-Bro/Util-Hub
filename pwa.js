/* Shared Utility Hub service-worker update notification. */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator) || window.location.protocol === 'file:') return;
  if (window.__utilityHubPwaInitialized) return;
  window.__utilityHubPwaInitialized = true;

  var serviceWorkerUrl = new URL('service-worker.js', document.currentScript.src);
  var stylesheetUrl = new URL('styles/shared.css', serviceWorkerUrl).href;
  var serviceWorkerScope = new URL('./', serviceWorkerUrl).pathname;
  var cachePrefix = 'utilityhub-';
  var currentCache = 'utilityhub-app-v1';
  var registration = null;
  var waitingWorker = null;
  var updateInProgress = false;
  var updateControllerConfirmed = false;
  var reloadStarted = false;
  var activationTimer = null;
  var notification;
  var message;
  var errorMessage;
  var updateButton;

  function loadSharedStylesheet() {
    if (document.querySelector('link[data-uh-shared-style]')) return;
    var existing = Array.prototype.find.call(
      document.querySelectorAll('link[rel="stylesheet"]'),
      function (link) { return link.href === stylesheetUrl; }
    );
    if (existing) {
      existing.setAttribute('data-uh-shared-style', '');
      return;
    }

    var stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = stylesheetUrl;
    stylesheet.setAttribute('data-uh-shared-style', '');
    document.head.appendChild(stylesheet);
  }

  function createNotification() {
    if (notification || !document.body) return;

    notification = document.createElement('section');
    notification.className = 'uh-update-notice';
    notification.hidden = true;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');

    message = document.createElement('span');
    message.className = 'uh-update-message';
    message.textContent = 'A new version is available.';

    errorMessage = document.createElement('span');
    errorMessage.className = 'uh-update-error';
    errorMessage.setAttribute('role', 'alert');
    errorMessage.hidden = true;

    updateButton = document.createElement('button');
    updateButton.className = 'uh-update-button';
    updateButton.type = 'button';
    updateButton.textContent = 'Update now';
    updateButton.addEventListener('click', startUpdate);

    notification.appendChild(message);
    notification.appendChild(errorMessage);
    notification.appendChild(updateButton);
    document.body.appendChild(notification);
  }

  function showUpdate(worker) {
    if (!worker || reloadStarted) return;
    waitingWorker = worker;
    createNotification();
    if (notification) notification.hidden = false;
    if (updateButton) updateButton.disabled = false;
  }

  function showError(error) {
    if (!notification) createNotification();
    if (!notification) return;

    errorMessage.textContent = error || 'The update could not be completed. Please try again.';
    errorMessage.hidden = false;
    notification.hidden = false;
    updateButton.disabled = false;
    updateButton.textContent = 'Retry update';
    updateInProgress = false;
    window.clearTimeout(activationTimer);
  }

  function hideNotification() {
    if (notification) notification.hidden = true;
  }

  function clearOutdatedCaches() {
    if (!('caches' in window)) return Promise.resolve();

    return window.caches.keys().then(function (names) {
      var outdated = names.filter(function (name) {
        return name.indexOf(cachePrefix) === 0 && name !== currentCache;
      });
      return Promise.all(outdated.map(function (name) {
        return window.caches.delete(name).then(function (deleted) {
          if (!deleted) throw new Error('Could not remove an outdated application cache.');
        });
      }));
    });
  }

  function reloadAfterUpdate() {
    if (!updateInProgress || reloadStarted) return;
    var controller = navigator.serviceWorker.controller;
    if (!controller || (registration && registration.active && controller.scriptURL !== registration.active.scriptURL)) return;

    window.clearTimeout(activationTimer);
    clearOutdatedCaches().then(function () {
      if (reloadStarted) return;
      reloadStarted = true;
      updateInProgress = false;
      hideNotification();
      window.location.reload();
    }).catch(function (error) {
      console.error('Utility Hub: failed to clear outdated application caches.', error);
      showError('The new version is active, but cleanup failed. Retry to finish the update.');
    });
  }

  function startUpdate() {
    if (reloadStarted || updateButton.disabled) return;

    errorMessage.hidden = true;
    updateButton.disabled = true;
    updateButton.textContent = 'Updating…';
    updateInProgress = true;

    var controller = navigator.serviceWorker.controller;
    if (updateControllerConfirmed && registration && registration.active && controller &&
      registration.active.scriptURL === controller.scriptURL) {
      reloadAfterUpdate();
      return;
    }

    var worker = waitingWorker || (registration && registration.waiting);
    if (worker) {
      waitingWorker = worker;
      try {
        worker.postMessage({ type: 'UTILITY_HUB_SKIP_WAITING' });
      } catch (error) {
        console.error('Utility Hub: could not activate the waiting service worker.', error);
        showError('Could not activate the update. Please retry.');
        return;
      }
    } else if (registration) {
      registration.update().then(function () {
        if (registration.waiting) {
          waitingWorker = registration.waiting;
          try {
            waitingWorker.postMessage({ type: 'UTILITY_HUB_SKIP_WAITING' });
          } catch (error) {
            console.error('Utility Hub: could not activate the waiting service worker.', error);
            showError('Could not activate the update. Please retry.');
          }
          return;
        }
        showError('No waiting update was found. Please retry in a moment.');
      }).catch(function (error) {
        console.error('Utility Hub: update check failed.', error);
        showError('Could not check for the update. Check your connection and retry.');
      });
    } else {
      showError('The service worker is not ready. Please reload and retry.');
      return;
    }

    activationTimer = window.setTimeout(function () {
      showError('The update is taking too long to activate. Please retry.');
    }, 15000);
  }

  function observeRegistration(swRegistration) {
    registration = swRegistration;
    if (registration.waiting && navigator.serviceWorker.controller) {
      showUpdate(registration.waiting);
    }

    registration.addEventListener('updatefound', function () {
      var installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', function () {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdate(registration.waiting || installingWorker);
        }
      });
    });

    registration.update().then(function () {
      if (registration.waiting && navigator.serviceWorker.controller) {
        showUpdate(registration.waiting);
      }
    }).catch(function (error) {
      console.warn('Utility Hub: update check failed.', error);
    });
  }

  function registerServiceWorker() {
    if (!document.body) return;
    loadSharedStylesheet();
    createNotification();
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!updateInProgress) return;
      updateControllerConfirmed = true;
      reloadAfterUpdate();
    });

    navigator.serviceWorker.register(serviceWorkerUrl.href, {
      scope: serviceWorkerScope,
      updateViaCache: 'none',
    }).then(observeRegistration).catch(function (error) {
      console.warn('Utility Hub: service worker registration failed.', error);
    });
  }

  if (document.body) {
    registerServiceWorker();
  } else {
    document.addEventListener('DOMContentLoaded', registerServiceWorker, { once: true });
  }
})();
