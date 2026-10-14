# Photography workflow

All photography is controlled by two things:

- Untouched source files in `photos/originals/`
- One metadata file: `photos/manifest.json`

You never need to resize photographs or edit a React component.

## Add a photograph

1. Copy the original file into `photos/originals/`. You can use folders organized by shoot, year, or location.
2. Add one object to the `photos` array in `manifest.json`:

```json
{
  "id": "rainier-first-light",
  "source": "cascades/rainier-first-light.jpg",
  "title": "First Light",
  "description": "Mount Rainier emerging through morning cloud",
  "location": "Mount Rainier National Park, Washington",
  "galleries": [
    {
      "slug": "travel-landscape",
      "order": 40
    }
  ]
}
```

3. Run `npm run dev`. Responsive images are generated before the site opens.

The `id` must be unique and use lowercase letters, numbers, and hyphens. `description` is the accessible image description.

## Reorder or recategorize

Change `order` to change a photograph’s position. Lower numbers appear first.

Available gallery slugs:

- `travel-landscape`
- `japan`
- `atmosphere`
- `architecture-spaces`
- `fine-art`
- `people-moments`

One source can appear in multiple galleries:

```json
"galleries": [
  { "slug": "travel-landscape", "order": 8 },
  { "slug": "fine-art", "order": 3 }
]
```

No source file is duplicated.

## Homepage and About selections

- `"featuredOrder": 1` includes a photograph in the homepage selection. The four lowest numbers are shown.
- `"hero": true` makes it the homepage hero. Exactly one photograph must have this setting.
- `"portrait": true` makes it the About-page portrait. Exactly one photograph must have this setting.

## Remove a photograph

Delete its entry from `manifest.json`. Delete its source file too if you no longer want to retain it.

The next `npm run dev` or `npm run build` removes all obsolete generated versions automatically.

## Optional fields

- `location`: Location displayed beneath the photograph
- `caption`: Additional internal or display text
- `featuredOrder`: Homepage selection and order
- `hero`: Homepage hero selection
- `portrait`: About portrait selection

## Generated output

`npm run photos:build` can be run independently. It:

- Validates the manifest
- Preserves the source image’s orientation and aspect ratio
- Creates responsive WebP files at 480, 768, 1200, 1800, and 2400 px where applicable
- Creates thumbnail-sized variants
- Writes intrinsic dimensions and responsive `srcset` data for React
- Deletes stale generated files

Generated files are intentionally excluded from version control because local development and Netlify recreate them automatically. Original files are read only and are never overwritten.
