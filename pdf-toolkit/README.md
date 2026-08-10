# PDF Toolkit

A browser-based PDF toolkit with 27 fully-functional tools. Everything runs
**100% client-side** — no server, no uploads, no backend. Your files never
leave your device.

## Running it

Just open `index.html` in a browser. No build step, no server required —
though if your browser restricts local file access you can also serve the
folder with any static file server, e.g.:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## What's inside

- `index.html` — homepage linking to all 27 tools
- `tools/*.html` — one self-contained page per tool
- `css/style.css` — shared design system
- `js/common.js` — shared UI helpers (dropzones, downloads, status HUD)
- `js/pdf-utils.js` — shared PDF helpers (rendering, thumbnails, info)
- `js/vendor/` — vendored libraries, so the site works fully offline:
  - `pdf-lib.min.js` — [@cantoo/pdf-lib](https://github.com/cantoo-scribe/pdf-lib), a maintained pdf-lib fork with real AES/RC4 encryption support
  - `pdf.min.js` + `pdf.worker.min.js` — [PDF.js](https://mozilla.github.io/pdf.js/) for rendering/reading
  - `jszip.min.js` — [JSZip](https://stuk.github.io/jszip/) for multi-file ZIP downloads

## Tools (27)

**Organize:** Merge, Split, Rotate, Delete Pages, Reorder Pages, Extract Pages,
Duplicate Pages, Crop, Resize

**Convert:** Images → PDF, PDF → Images, PDF → Text, Text → PDF

**Optimize:** Compress, Grayscale, Flatten

**Security:** Password Protect, Unlock, Permissions

**Edit & Annotate:** Watermark, Page Numbers, Add Text, Add Image, Signature,
Annotate, Edit Metadata

**Info:** PDF Information

## Notable implementation details

- **Password Protect / Permissions** use a real PDF standard security handler
  (RC4 128-bit or AES-128/256 depending on PDF version) — genuine encryption,
  not a JS-only lock screen.
- **Unlock** independently verifies the password via PDF.js's password
  validation before decrypting — it will not silently "unlock" with a wrong
  password.
- **PDF → Text** extracts the PDF's real embedded text layer. It does not
  perform OCR, so scanned/image-only PDFs will return no text (stated in the
  tool itself).
- **Resize** uses `embedPage`/`drawPage` to re-scale the original vector
  content into a new page size, rather than rastering to an image — so text
  stays sharp and selectable.
- **Crop** sets the PDF's native `/CropBox` — non-destructive, standard PDF
  cropping rather than rasterizing.
- **Compress / Grayscale** do rasterize each page (this is inherent to
  re-encoding image data at a lower quality/resolution) — this is disclosed
  in-tool since it affects text selectability.
- **Flatten** offers both "Form Fields" (via AcroForm flattening, preserves
  vector quality) and "Full Rasterize" (guarantees everything becomes static
  pixels) modes, since pdf-lib can't generically flatten arbitrary annotation
  types.
- **Signature** is explicitly labeled as a visual stamp, not a certified
  digital signature, per PDF-signing standards.

## Browser support

Needs a reasonably modern browser (Canvas 2D, ES2017+, FileReader,
`<input type="color">`). Tested logic against Chrome/Edge/Firefox-class
engines.
