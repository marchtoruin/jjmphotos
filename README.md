# JJM Photography

A cinematic, editorial photography portfolio for [jjmphotos.com](https://jjmphotos.com). Built with React, TypeScript, Vite, Tailwind CSS, Motion, and Lucide.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

That is the everyday command: it prepares photographs and starts the local site. Open the address Vite prints.

To test the production build:

```bash
npm run build
npm run preview
```

## Add or update photographs

Photography is managed through folders in `photos/originals/`:

1. Open `photos/originals/`.
2. Drag photographs into `Atmosphere`, `Japan`, `People`, or `Puget Sound`.
3. Rename a file if you want a different title. Add `01 - ` at the start if you want to choose the order.
4. Run `npm run dev` or `npm run build`.

Removing or moving a file updates the galleries on the next build. You do not need to edit application code.

Existing custom titles, alt text, order, homepage selections, and the About portrait are stored in `photos/metadata.json`. New photographs do not need an entry there.

See `photos/README.md` for the complete beginner guide.

## Change gallery categories

Gallery names, routes, and descriptions live in the `categories` array in `src/data/photography.ts`. Folder-to-gallery mappings live in `photos/metadata.json`. If a slug changes, update both places and the matching URLs in `public/sitemap.xml`.

## Update text and contact details

Primary editable copy, the email, and Instagram details live in `src/data/site.ts`.

- The contact email is `justin.j.mcclure@hotmail.com`.
- Longer page-specific headlines live in `src/pages/`.
- Site-wide SEO defaults live in `index.html`; page titles and descriptions use the `Seo` component.
- The About portrait is the photograph marked `portrait: true` in `photos/metadata.json`.

The contact page uses direct email and Instagram links. It does not include a form.

## Image performance

Originals are never modified. The build reads them from `photos/originals/` and creates widths up to 2400 px in WebP format. Unchanged photographs reuse their generated files. The React site receives `srcset`, intrinsic dimensions, and original aspect ratios.

## Netlify deployment

The included `netlify.toml` configures:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback routing to `index.html`

Push changes to the repository’s `main` branch only after you are ready to publish. With the GitHub repository connected to Netlify, the site will build and deploy automatically.

Collections with no photographs are hidden automatically from the home and portfolio pages.
