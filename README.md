# JJM Photography

A cinematic, editorial photography portfolio for [jjmphotos.com](https://jjmphotos.com). Built with React, TypeScript, Vite, Tailwind CSS, Motion, and Lucide.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local address printed by Vite. To test the production build:

```bash
npm run build
npm run preview
```

## Add or update photographs

Photography is managed entirely through `photos/`:

1. Place the untouched original in `photos/originals/`. Optional shoot folders are encouraged.
2. Add one entry to `photos/manifest.json`.
3. Run `npm run dev`.

That is all. The development and production build commands automatically generate responsive WebP sizes, dimensions, aspect ratios, and thumbnails. Never edit `public/images/generated/` or `src/data/photos.generated.ts`; both are recreated and obsolete files are removed on every build.

To remove a photograph, delete its manifest entry and its source file. To reorder it, change the `order` number in its gallery placement. To show one source photograph in multiple galleries, add another object to its `galleries` array. Use `featuredOrder` to select and arrange home-page images, `hero: true` for the home hero, and `portrait: true` for the About portrait.

See `photos/README.md` for a copyable manifest example and the complete field reference.

## Change gallery categories

Gallery names, routes, and descriptions are centralized in the `categories` array in `src/data/photography.ts`. `CategorySlug` lists the allowed category keys. If a slug changes, update its matching values on photographs and the static entries in `public/sitemap.xml`.

## Update text and contact details

Primary editable copy, the email placeholder, and Instagram details live in `src/data/site.ts`.

- The email address currently uses `hello@jjmphotos.com`; confirm or replace it before launch.
- Longer page-specific headlines live in `src/pages/`.
- Site-wide SEO defaults live in `index.html`; page titles and descriptions use the `Seo` component.
- The portrait placeholder is configured in `src/pages/AboutPage.tsx`.

The contact page intentionally uses direct email and Instagram links. It does not include a form that claims to submit without a backend.

## Image performance

Originals are never modified. The build pipeline reads them from `photos/originals/` and creates widths up to 2400 px in WebP format. The React site receives generated `srcset`, intrinsic dimensions, and original aspect ratios, preventing layout shift while letting each browser choose an appropriate file.

## Netlify deployment

The included `netlify.toml` configures:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback routing to `index.html`

Push changes to the repository’s `main` branch. With the GitHub repository connected to Netlify, the site will build and deploy automatically.

## Placeholder image credits

The initial demonstration images are downloaded from Unsplash and are **not** represented as JJM Photography work. They are labeled throughout the site and should be replaced before launch.
