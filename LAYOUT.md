# Shared Utility Hub layout

The shared header, category menu, theme initialization, and footer are provided by `style.js` and `styles/shared.css`. The dashboard and tool pages use the same layout code; the dashboard retains its existing search, category filters, theme switch, and footer details. Homepage search is hosted in the bottom floating action dock, and tool-to-collection assignments update the existing `utilityhub:collections` data.

The homepage dashboard enhancements are implemented in the existing `app.js` registry/render flow. Grid/list and sort preferences, custom collections, pinned collection order, and per-tool usage live in `localStorage` under `utilityhub:dashboard-view`, `utilityhub:dashboard-sort`, `utilityhub:collections`, `utilityhub:pinned-collections`, and `utilityhub:tool-usage`. Favorites and recent history continue using their existing keys. Collection members are tool IDs from `toolsData`; do not maintain a second tool registry.

`styles/tailwind-fallback.css` is a local compiled snapshot of the utility classes currently used across the project. The loader uses it only when a page includes the Tailwind CDN but its generated stylesheet is unavailable. When adding new Tailwind utility classes, update this fallback stylesheet as part of the change; existing shared `uh-` classes need no separate registration.

## Register a tool

Add the tool once to the `toolsData` array in `app.js`, following the existing object format:

```js
{
  id: 'image-resizer',
  title: 'Image Resizer',
  description: 'Resize an image in your browser.',
  category: 'Design',
  url: 'tools/image-resizer.html',
  icon: 'image',
}
```

Use a unique `id`, the page's actual title, an existing category (or a new category), and a project-root-relative URL. `app.js` publishes this same registry as `window.UtilityHub.tools`; the dashboard uses it for its existing tool cards, while the shared Tools menu groups and links the registered items automatically. A missing/blank category is grouped as “Other Tools.” The menu deduplicates repeated paths.

## Include the shared layout on a tool page

Load `style.js` once in the page head using a path relative to the tool HTML file:

```html
<!-- tools/image-resizer.html -->
<script src="../style.js" data-uh-page-type="tool" data-uh-title="Image Resizer"></script>
```

For a page under `pdf-toolkit/tools/`, use `../../style.js`. The title attribute is optional when the page already has a suitable `<h1>`. The loader resolves CSS, the registry, the PWA updater, the dashboard URL, and the logo from its own root-relative script location, regardless of page depth.

The loader automatically initializes the header and footer. A page can also call `window.UtilityHub.initLayout({ title: 'Image Resizer', pageType: 'tool' })`; initialization is idempotent. Existing footer contents are preserved and receive the shared branded treatment. Pages without a footer receive the common branded footer.

## Theme behavior

The shared loader applies the existing `utilityhub:theme` preference (`dark` or `light`), falling back to the operating-system preference. Tool pages inherit the chosen theme without a theme toggle; the dashboard's existing toggle remains the only theme control and continues writing the same preference.

## Footer reuse

Do not copy shared footer markup into new tools. The loader reuses and styles existing page footer content, or adds the common Utility Hub footer when none exists. Keep any page-specific credits, privacy statements, copyright notices, or links inside that page's existing `<footer>`.
