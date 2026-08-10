/* ============================================================
   PDF Toolkit — common.js
   Shared, dependency-free UI utilities used by every tool page.
   ============================================================ */
(function (global) {
  'use strict';

  function formatBytes(bytes) {
    if (bytes === 0 || bytes === undefined || bytes === null) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let val = bytes;
    while (val >= 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return `${val.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
  }

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function uid() {
    return 'id-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function sanitizeFilename(name) {
    return (name || 'output').replace(/[^a-z0-9_\-\.]/gi, '_');
  }

  function baseName(filename) {
    return (filename || 'file').replace(/\.[^/.]+$/, '');
  }

  /**
   * Wires up a drop-zone + hidden file input combo.
   * opts: { dropZone, input, accept, multiple, onFiles(fileList) }
   */
  function setupDropzone(opts) {
    const { dropZone, input, onFiles } = opts;
    if (!dropZone || !input) return;

    dropZone.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
      if (input.files && input.files.length) onFiles(Array.from(input.files));
    });

    ['dragenter', 'dragover'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('active');
      });
    });
    ['dragleave', 'drop'].forEach(evt => {
      dropZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('active');
      });
    });
    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (files && files.length) onFiles(Array.from(files));
    });
  }

  /**
   * Simple status HUD controller.
   * el: { hud, text, fill }
   */
  function StatusHud(hudEl, textEl, fillEl) {
    return {
      show(msg) {
        hudEl.classList.remove('hidden');
        textEl.textContent = msg || 'Processing...';
        fillEl.style.width = '4%';
      },
      set(msg, pct) {
        if (msg !== undefined) textEl.textContent = msg;
        if (pct !== undefined) fillEl.style.width = Math.max(0, Math.min(100, pct)) + '%';
      },
      done(msg) {
        textEl.textContent = msg || 'Done.';
        fillEl.style.width = '100%';
        setTimeout(() => hudEl.classList.add('hidden'), 900);
      },
      error(msg) {
        textEl.textContent = msg || 'Something went wrong.';
        textEl.style.color = 'var(--danger)';
      },
      hide() {
        hudEl.classList.add('hidden');
      }
    };
  }

  function showError(container, msg) {
    let box = container.querySelector('.js-error-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'error-box js-error-box';
      container.appendChild(box);
    }
    box.textContent = msg;
    box.classList.remove('hidden');
  }

  function clearError(container) {
    const box = container.querySelector('.js-error-box');
    if (box) box.classList.add('hidden');
  }

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(c => {
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  global.Toolkit = {
    formatBytes, escapeHtml, uid, readAsArrayBuffer, readAsDataURL,
    downloadBlob, sanitizeFilename, baseName, setupDropzone, StatusHud,
    showError, clearError, debounce, el
  };
})(window);
