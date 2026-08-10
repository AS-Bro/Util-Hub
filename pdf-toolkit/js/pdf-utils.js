/* ============================================================
   PDF Toolkit — pdf-utils.js
   Shared PDF helpers on top of pdf.js (rendering/reading) and
   pdf-lib (creating/mutating). Requires vendor/pdf.min.js,
   vendor/pdf-lib.min.js, vendor/jszip.min.js to be loaded first.
   ============================================================ */
(function (global) {
  'use strict';

  // Resolve the worker path relative to THIS script's own location,
  // so it works correctly no matter how deep the calling page is nested.
  const thisScript = document.currentScript;
  const jsBase = thisScript.src.substring(0, thisScript.src.lastIndexOf('/'));
  if (global.pdfjsLib) {
    global.pdfjsLib.GlobalWorkerOptions.workerSrc = jsBase + '/vendor/pdf.worker.min.js';
  }

  const PDFLib = global.PDFLib;
  const pdfjsLib = global.pdfjsLib;
  const JSZip = global.JSZip;

  /** Load a pdf.js document (for rendering/reading) from an ArrayBuffer. */
  async function loadPdfJs(arrayBuffer, password) {
    const params = { data: arrayBuffer.slice(0) };
    if (password) params.password = password;
    const task = pdfjsLib.getDocument(params);
    return task.promise;
  }

  /** Load a pdf-lib document (for mutating/saving) from an ArrayBuffer. */
  async function loadPdfLib(arrayBuffer, opts) {
    return PDFLib.PDFDocument.load(arrayBuffer, Object.assign({ ignoreEncryption: true }, opts || {}));
  }

  /** Render a single page to a canvas element at the given scale. Returns the canvas. */
  async function renderPageToCanvas(pdfjsDoc, pageNumber, scale) {
    const page = await pdfjsDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: scale || 1 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
  }

  /** Render a thumbnail canvas capped to maxWidth px wide. */
  async function renderThumbnail(pdfjsDoc, pageNumber, maxWidth) {
    const page = await pdfjsDoc.getPage(pageNumber);
    const base = page.getViewport({ scale: 1 });
    const scale = (maxWidth || 150) / base.width;
    return renderPageToCanvas(pdfjsDoc, pageNumber, scale);
  }

  function bytesToBlob(bytes, mime) {
    return new Blob([bytes], { type: mime || 'application/pdf' });
  }

  async function zipFiles(files) {
    // files: [{name, data(Blob|Uint8Array|ArrayBuffer)}]
    const zip = new JSZip();
    files.forEach(f => zip.file(f.name, f.data));
    return zip.generateAsync({ type: 'blob' });
  }

  /** Gather human-facing info about a PDF (page count, size, dims, metadata, encryption, version). */
  async function getPdfInfo(arrayBuffer, filename, password) {
    const info = {
      filename: filename || 'document.pdf',
      fileSize: arrayBuffer.byteLength,
      encrypted: false,
      pageCount: 0,
      pdfVersion: 'Unknown',
      pages: [],
      metadata: {}
    };

    // Detect version from header bytes "%PDF-x.y"
    try {
      const head = new TextDecoder('latin1').decode(new Uint8Array(arrayBuffer.slice(0, 16)));
      const m = head.match(/%PDF-(\d\.\d)/);
      if (m) info.pdfVersion = m[1];
    } catch (e) { /* ignore */ }

    let pdfjsDoc;
    try {
      pdfjsDoc = await loadPdfJs(arrayBuffer, password);
    } catch (e) {
      if (e && e.name === 'PasswordException') {
        info.encrypted = true;
        info.needsPassword = true;
        return info;
      }
      throw e;
    }

    info.pageCount = pdfjsDoc.numPages;
    const meta = await pdfjsDoc.getMetadata().catch(() => null);
    if (meta && meta.info) {
      info.metadata = {
        title: meta.info.Title || '',
        author: meta.info.Author || '',
        subject: meta.info.Subject || '',
        keywords: meta.info.Keywords || '',
        creator: meta.info.Creator || '',
        producer: meta.info.Producer || '',
        creationDate: meta.info.CreationDate || '',
        modDate: meta.info.ModDate || '',
        pdfFormatVersion: meta.info.PDFFormatVersion || info.pdfVersion
      };
      info.encrypted = !!meta.info.IsEncrypted || info.encrypted;
    }

    const firstPage = await pdfjsDoc.getPage(1);
    const vp = firstPage.getViewport({ scale: 1 });
    info.pageWidthPt = vp.width;
    info.pageHeightPt = vp.height;

    for (let i = 1; i <= pdfjsDoc.numPages; i++) {
      const p = await pdfjsDoc.getPage(i);
      const v = p.getViewport({ scale: 1 });
      info.pages.push({ index: i, widthPt: v.width, heightPt: v.height, rotation: p.rotate || 0 });
    }

    return info;
  }

  function ptToIn(pt) { return (pt / 72).toFixed(2); }
  function ptToMm(pt) { return (pt * 0.352778).toFixed(1); }

  const PAGE_SIZES_PT = {
    A4: [595.28, 841.89],
    Letter: [612, 792],
    Legal: [612, 1008],
    A3: [841.89, 1190.55],
    A5: [419.53, 595.28],
    Tabloid: [792, 1224]
  };

  global.PDFUtils = {
    loadPdfJs, loadPdfLib, renderPageToCanvas, renderThumbnail,
    bytesToBlob, zipFiles, getPdfInfo, ptToIn, ptToMm, PAGE_SIZES_PT
  };
})(window);
