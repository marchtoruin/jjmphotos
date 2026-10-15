# How to manage photographs

You manage the site by moving files in `photos/originals/`. You do not need to edit React code, resize images, or type JSON for everyday changes.

Each folder is a gallery:

- `Atmosphere`
- `Japan`
- `People`
- `Puget Sound`
- `Architecture & Spaces` (ready for new work)
- `Fine Art & Personal Work` (ready for new work)

Original files stay untouched. The build only reads them and creates web-sized copies in `public/images/generated/`.

## Preview your changes

From the project folder:

```bash
npm run dev
```

That one command prepares the photographs and opens the local site. To make a production build instead:

```bash
npm run build
```

## Add a photograph

1. Open `photos/originals/`.
2. Drag the file into the gallery folder you want.
3. Run `npm run dev` or `npm run build`.

The new photograph appears in that gallery. The displayed title comes from the filename.

Supported files: `.jpg`, `.jpeg`, `.png`, `.webp`, `.tif`, `.tiff`, and `.avif`.

## Rename a photograph

Rename the file. The next build uses the new filename as the title.

`rainy-street.jpg` becomes **Rainy Street**.  
`Harbor Afterglow.jpg` stays **Harbor Afterglow**.

If you rename a photograph that already has a custom title, that custom title is no longer used unless you also rename its entry in `metadata.json`.

## Reorder photographs

Add a number to the start of the filename:

```text
01 - Rainy Street.jpg
02 - Temple Gate.jpg
```

Lower numbers appear first. The number is not shown in the title.

Photographs without a number keep their current order, or appear at the end if they are new.

## Move a photograph

Drag it from one gallery folder into another. The next build shows it in the new gallery.

## Remove a photograph

Delete the file from its folder. The next build removes it from the website and deletes its generated web copies. The original is only deleted if you delete it.

## Homepage hero, featured photos, and the About portrait

These special placements live in `photos/metadata.json`. Find the filename and add or change:

```json
"BK7A0636.jpg": {
  "hero": true
}
```

```json
"BK7A0602.jpg": {
  "featuredOrder": 1
}
```

```json
"mePhoto.jpg": {
  "portrait": true
}
```

Exactly one photograph must be the hero, and exactly one must be the portrait.

`metadata.json` also stores the current custom titles, alt text, locations, and gallery order so existing photographs stay as they are. New photographs do not need an entry.

## Optional details

You only need `metadata.json` when you want something the filename cannot do:

- A custom title that does not match the filename
- Alt text (`description`)
- A location line under the title
- Showing one photograph in a second gallery
- Featured, hero, or portrait selections

Example:

```json
"rainy-street.jpg": {
  "title": "Rain Over Akihabara",
  "description": "A figure with an umbrella on a wet Tokyo street",
  "location": "Tokyo, Japan",
  "additionalGalleries": [{ "slug": "atmosphere", "order": 40 }]
}
```

## Generated files

`npm run photos:build` (also run by `dev` and `build`):

- Reads the folder layout
- Leaves original files alone
- Creates responsive WebP files at 480, 768, 1200, 1800, and 2400 px where the original is large enough
- Reuses generated files when a photograph has not changed
- Removes leftover generated files for photographs you deleted or renamed
- Writes `src/data/photos.generated.ts` for the website

You can delete everything in `public/images/generated/` at any time. The next build recreates what the site needs.
