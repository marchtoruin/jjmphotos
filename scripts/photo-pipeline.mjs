import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

export const TARGET_WIDTHS = [480, 768, 1200, 1800, 2400]
export const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.tif',
  '.tiff',
  '.avif',
])
export const PIPELINE_VERSION = 2
const CACHE_FILENAME = '.cache.json'
const ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/

export function defaultPhotoPaths(root = process.cwd()) {
  return {
    originalsRoot: path.join(root, 'photos/originals'),
    heroRoot: path.join(root, 'photos/hero'),
    metadataPath: path.join(root, 'photos/metadata.json'),
    outputRoot: path.join(root, 'public/images/generated'),
    generatedDataPath: path.join(root, 'src/data/photos.generated.ts'),
    legacyOutputRoot: path.join(root, 'public/images/portfolio'),
  }
}

export function stripOrderPrefix(filename) {
  const ext = path.extname(filename)
  const stem = path.basename(filename, ext)
  const match = stem.match(/^(\d+)\s*(?:[-_.)]\s*|\s+)(.+)$/)

  if (!match) {
    return {
      order: null,
      remainderStem: stem,
      remainderFilename: filename,
      ext,
    }
  }

  return {
    order: Number(match[1]),
    remainderStem: match[2],
    remainderFilename: `${match[2]}${ext}`,
    ext,
  }
}

function titleCaseWord(word) {
  if (/^\d+$/.test(word)) return word
  if (word.length <= 4 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function titleFromFilename(filename) {
  const { remainderStem } = stripOrderPrefix(filename)
  const spaced = remainderStem
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!spaced) return 'Untitled'
  return spaced.split(' ').map(titleCaseWord).join(' ')
}

export function slugFromFilename(filename) {
  const { remainderStem } = stripOrderPrefix(filename)
  const slug = remainderStem
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'photo'
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/')
}

function isImageFilename(filename) {
  return SUPPORTED_EXTENSIONS.has(path.extname(filename).toLowerCase())
}

async function walkImages(directory) {
  const found = []
  const entries = await readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      found.push(...(await walkImages(fullPath)))
      continue
    }
    if (entry.isFile() && isImageFilename(entry.name)) {
      found.push(fullPath)
    }
  }

  return found.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
}

export async function loadMetadata(metadataPath) {
  const metadata = JSON.parse(await readFile(metadataPath, 'utf8'))

  if (!Array.isArray(metadata.categories) || metadata.categories.length === 0) {
    throw new Error('photos/metadata.json must include a "categories" array.')
  }
  if (!metadata.photos || typeof metadata.photos !== 'object' || Array.isArray(metadata.photos)) {
    throw new Error('photos/metadata.json must include a "photos" object keyed by filename.')
  }

  const slugs = new Set()
  const folders = new Set()
  for (const category of metadata.categories) {
    if (!category.folder || !category.slug) {
      throw new Error('Each category in photos/metadata.json needs a folder and a slug.')
    }
    if (folders.has(category.folder)) {
      throw new Error(`Duplicate category folder "${category.folder}".`)
    }
    if (slugs.has(category.slug)) {
      throw new Error(`Duplicate category slug "${category.slug}".`)
    }
    folders.add(category.folder)
    slugs.add(category.slug)
  }

  return metadata
}

function lookupMetadata(photos, filename) {
  const { remainderFilename } = stripOrderPrefix(filename)
  const keys = remainderFilename === filename ? [filename] : [filename, remainderFilename]

  for (const key of keys) {
    if (photos[key]) return { key, entry: photos[key] }
  }

  return { key: remainderFilename, entry: null }
}

async function discoverOriginals(originalsRoot, categories) {
  const folderToSlug = new Map(categories.map((category) => [category.folder, category.slug]))
  const knownFolders = new Set(categories.map((category) => category.folder))
  const entries = []
  let directoryEntries

  try {
    directoryEntries = await readdir(originalsRoot, { withFileTypes: true })
  } catch {
    throw new Error(`Could not read ${originalsRoot}. Create the category folders first.`)
  }

  for (const entry of directoryEntries) {
    if (entry.name.startsWith('.')) continue

    const fullPath = path.join(originalsRoot, entry.name)

    if (entry.isFile()) {
      if (isImageFilename(entry.name)) {
        throw new Error(
          `Put "${entry.name}" inside a category folder: ${[...knownFolders].join(', ')}.`,
        )
      }
      continue
    }

    if (!entry.isDirectory()) continue

    const images = await walkImages(fullPath)
    if (!knownFolders.has(entry.name)) {
      if (images.length > 0) {
        throw new Error(
          `Unknown folder "${entry.name}". Use one of: ${[...knownFolders].join(', ')}.`,
        )
      }
      continue
    }

    for (const imagePath of images) {
      entries.push({
        absolutePath: imagePath,
        relativePath: toPosix(path.relative(originalsRoot, imagePath)),
        filename: path.basename(imagePath),
        folder: entry.name,
        primarySlug: folderToSlug.get(entry.name),
      })
    }
  }

  return entries
}

export async function discoverHeroImage(heroRoot) {
  let entries = []

  try {
    entries = await readdir(heroRoot, { withFileTypes: true })
  } catch {
    return null
  }

  const images = entries.filter((entry) => entry.isFile() && isImageFilename(entry.name) && !entry.name.startsWith('.'))
  if (images.length === 0) return null
  if (images.length > 1) {
    throw new Error('photos/hero/ should contain only one homepage still. Extra files were found.')
  }

  const filename = images[0].name
  return {
    id: 'hero-moss-portal',
    filename,
    absolutePath: path.join(heroRoot, filename),
    relativePath: toPosix(path.join('hero', filename)),
  }
}

function uniqueSlug(base, usedIds) {
  let candidate = base
  let suffix = 2
  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  return candidate
}

function compareFilenames(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

export function resolveCatalog({ originals, metadata }) {
  const allowedSlugs = new Set(metadata.categories.map((category) => category.slug))
  const usedIds = new Set()
  const usedBasenames = new Map()
  const matchedMetadataKeys = new Set()
  const records = []

  for (const original of originals) {
    const parsed = stripOrderPrefix(original.filename)
    const identity = parsed.remainderFilename.toLowerCase()

    if (usedBasenames.has(identity)) {
      throw new Error(
        `Two photographs share the name "${parsed.remainderFilename}": ${usedBasenames.get(identity)} and ${original.relativePath}. Rename one of them.`,
      )
    }
    usedBasenames.set(identity, original.relativePath)

    const { key, entry } = lookupMetadata(metadata.photos, original.filename)
    if (entry) matchedMetadataKeys.add(key)

    if (entry?.id) {
      if (!ID_PATTERN.test(entry.id)) {
        throw new Error(`${original.filename}: id "${entry.id}" must use lowercase letters, numbers, and hyphens.`)
      }
      if (usedIds.has(entry.id)) {
        throw new Error(`${original.filename}: duplicate photo id "${entry.id}".`)
      }
    }

    const id = entry?.id ?? uniqueSlug(slugFromFilename(original.filename), usedIds)
    usedIds.add(id)

    const title = entry?.title?.trim() || titleFromFilename(original.filename)
    const description = entry?.description?.trim() || title
    const primaryOrder = parsed.order ?? entry?.orderByGallery?.[original.primarySlug] ?? null

    const additionalGalleries = []
    if (Array.isArray(entry?.additionalGalleries)) {
      for (const placement of entry.additionalGalleries) {
        if (!allowedSlugs.has(placement.slug)) {
          throw new Error(`${original.filename}: unknown additional gallery "${placement.slug}".`)
        }
        if (placement.slug === original.primarySlug) {
          throw new Error(`${original.filename}: additional gallery "${placement.slug}" is already the folder category.`)
        }
        additionalGalleries.push({
          slug: placement.slug,
          order: Number.isFinite(placement.order) ? placement.order : null,
        })
      }
    }

    records.push({
      id,
      source: original.relativePath,
      absolutePath: original.absolutePath,
      filename: original.filename,
      title,
      description,
      ...(entry?.location ? { location: entry.location } : {}),
      ...(entry?.caption ? { caption: entry.caption } : {}),
      primarySlug: original.primarySlug,
      primaryOrder,
      additionalGalleries,
      ...(entry?.featuredOrder !== undefined ? { featuredOrder: entry.featuredOrder } : {}),
      ...(entry?.hero ? { hero: true } : {}),
      ...(entry?.portrait ? { portrait: true } : {}),
    })
  }

  const unusedMetadata = Object.keys(metadata.photos).filter((key) => !matchedMetadataKeys.has(key))
  assignGalleryOrders(records, allowedSlugs)

  return { records, unusedMetadata }
}

function assignGalleryOrders(records, allowedSlugs) {
  const byGallery = new Map()

  for (const record of records) {
    const placements = [
      { slug: record.primarySlug, order: record.primaryOrder },
      ...record.additionalGalleries,
    ]

    for (const placement of placements) {
      if (!allowedSlugs.has(placement.slug)) {
        throw new Error(`${record.filename}: unknown gallery "${placement.slug}".`)
      }
      if (!byGallery.has(placement.slug)) byGallery.set(placement.slug, [])
      byGallery.get(placement.slug).push({ record, placement })
    }
  }

  for (const [slug, members] of byGallery) {
    const explicit = members.filter(({ placement }) => Number.isFinite(placement.order))
    const implicit = members
      .filter(({ placement }) => !Number.isFinite(placement.order))
      .sort((a, b) => compareFilenames(a.record.filename, b.record.filename))
    const maxExplicit = explicit.reduce((max, { placement }) => Math.max(max, placement.order), 0)

    implicit.forEach((member, index) => {
      member.placement.order = maxExplicit + index + 1
    })

    const seen = new Set()
    members.sort((a, b) => {
      if (a.placement.order !== b.placement.order) return a.placement.order - b.placement.order
      return compareFilenames(a.record.filename, b.record.filename)
    })

    for (const { record, placement } of members) {
      if (seen.has(record.id)) {
        throw new Error(`${record.filename}: gallery "${slug}" is listed more than once.`)
      }
      seen.add(record.id)
      if (placement.slug === record.primarySlug) {
        record.primaryOrder = placement.order
      }
    }
  }

  for (const record of records) {
    record.galleries = [
      { slug: record.primarySlug, order: record.primaryOrder },
      ...record.additionalGalleries.map((placement) => ({
        slug: placement.slug,
        order: placement.order,
      })),
    ]
  }
}

function validateSelections(records) {
  const heroes = records.filter((photo) => photo.hero)
  const portraits = records.filter((photo) => photo.portrait)

  if (heroes.length !== 1) {
    throw new Error(
      `Exactly one photograph must be marked "hero": true in photos/metadata.json; found ${heroes.length}.`,
    )
  }
  if (portraits.length !== 1) {
    throw new Error(
      `Exactly one photograph must be marked "portrait": true in photos/metadata.json; found ${portraits.length}.`,
    )
  }
}

function configFingerprint() {
  return JSON.stringify({
    version: PIPELINE_VERSION,
    widths: TARGET_WIDTHS,
    format: 'webp',
    quality: { small: 80, large: 84, effort: 5 },
  })
}

function variantFilename(id, width) {
  return `${id}-${width}.webp`
}

function computeWidths(orientedWidth) {
  const largestWidth = Math.min(orientedWidth, TARGET_WIDTHS.at(-1))
  return [...new Set([
    ...TARGET_WIDTHS.filter((width) => width < largestWidth),
    largestWidth,
  ])].sort((a, b) => a - b)
}

async function readCache(outputRoot) {
  try {
    return JSON.parse(await readFile(path.join(outputRoot, CACHE_FILENAME), 'utf8'))
  } catch {
    return { config: null, photos: {} }
  }
}

function sourceFingerprint(fileStat, id) {
  return createHash('sha1')
    .update(`${id}:${fileStat.size}:${fileStat.mtimeMs}:${configFingerprint()}`)
    .digest('hex')
}

async function filesExist(outputRoot, filenames) {
  const results = await Promise.all(
    filenames.map(async (filename) => {
      try {
        await stat(path.join(outputRoot, filename))
        return true
      } catch {
        return false
      }
    }),
  )
  return results.every(Boolean)
}

async function encodeVariants(sourcePath, id, outputRoot, widths) {
  const image = sharp(sourcePath, { failOn: 'none' }).rotate()
  const metadata = await image.metadata()
  const oriented = metadata.autoOrient ?? metadata

  if (!oriented.width || !oriented.height) {
    throw new Error(`${id}: unable to read image dimensions.`)
  }

  const variants = []
  for (const width of widths ?? computeWidths(oriented.width)) {
    const filename = variantFilename(id, width)
    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: width <= 768 ? 80 : 84, effort: 5 })
      .toFile(path.join(outputRoot, filename))

    variants.push({
      width,
      src: `/images/generated/${filename}`,
    })
  }

  return {
    width: oriented.width,
    height: oriented.height,
    variants,
  }
}

async function reuseOrEncode(record, outputRoot, cache) {
  const fileStat = await stat(record.absolutePath)
  const fingerprint = sourceFingerprint(fileStat, record.id)
  const cached = cache.photos?.[record.id]
  const metadata = await sharp(record.absolutePath, { failOn: 'none' }).rotate().metadata()
  const oriented = metadata.autoOrient ?? metadata

  if (!oriented.width || !oriented.height) {
    throw new Error(`${record.filename}: unable to read image dimensions.`)
  }

  const widths = computeWidths(oriented.width)
  const filenames = widths.map((width) => variantFilename(record.id, width))
  const cacheMatches =
    cache.config === configFingerprint() &&
    cached?.fingerprint === fingerprint &&
    cached?.width === oriented.width &&
    cached?.height === oriented.height
  const outputsExist = await filesExist(outputRoot, filenames)

  if ((cacheMatches || outputsExist) && outputsExist) {
    if (cacheMatches || (cached?.fingerprint === fingerprint)) {
      return {
        reused: true,
        width: oriented.width,
        height: oriented.height,
        variants: widths.map((width) => ({
          width,
          src: `/images/generated/${variantFilename(record.id, width)}`,
        })),
        fingerprint,
      }
    }

    // Existing files cover the needed sizes and the source has not been re-encoded
    // under a different id. Reuse them when the source timestamp is not newer.
    const outputStats = await Promise.all(
      filenames.map((filename) => stat(path.join(outputRoot, filename))),
    )
    const newestSource = fileStat.mtimeMs
    if (outputStats.every((item) => item.mtimeMs >= newestSource)) {
      return {
        reused: true,
        width: oriented.width,
        height: oriented.height,
        variants: widths.map((width) => ({
          width,
          src: `/images/generated/${variantFilename(record.id, width)}`,
        })),
        fingerprint,
      }
    }
  }

  const encoded = await encodeVariants(record.absolutePath, record.id, outputRoot, widths)
  return { reused: false, ...encoded, fingerprint }
}

async function cleanupGenerated(outputRoot, keepFilenames) {
  const keep = new Set([CACHE_FILENAME, ...keepFilenames])
  let existing = []

  try {
    existing = await readdir(outputRoot)
  } catch {
    return []
  }

  const removed = []
  for (const filename of existing) {
    if (keep.has(filename)) continue
    await rm(path.join(outputRoot, filename), { force: true, recursive: true })
    removed.push(filename)
  }
  return removed
}

function toGeneratedPhoto(record, encoded) {
  const largest = encoded.variants.at(-1)
  return {
    id: record.id,
    source: record.source,
    title: record.title,
    description: record.description,
    ...(record.location ? { location: record.location } : {}),
    ...(record.caption ? { caption: record.caption } : {}),
    galleries: record.galleries,
    ...(record.featuredOrder !== undefined ? { featuredOrder: record.featuredOrder } : {}),
    ...(record.hero ? { hero: true } : {}),
    ...(record.portrait ? { portrait: true } : {}),
    width: encoded.width,
    height: encoded.height,
    aspectRatio: `${encoded.width}/${encoded.height}`,
    src: largest.src,
    thumbnailSrc: encoded.variants[0].src,
    srcSet: encoded.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', '),
  }
}

export async function buildPhotos(customPaths = {}) {
  const paths = { ...defaultPhotoPaths(), ...customPaths }
  const metadata = await loadMetadata(paths.metadataPath)
  const originals = await discoverOriginals(paths.originalsRoot, metadata.categories)
  const { records, unusedMetadata } = resolveCatalog({ originals, metadata })

  if (records.length === 0) {
    throw new Error('No photographs found in photos/originals category folders.')
  }

  validateSelections(records)

  if (paths.legacyOutputRoot) {
    await rm(paths.legacyOutputRoot, { recursive: true, force: true })
  }

  await mkdir(paths.outputRoot, { recursive: true })
  const cache = await readCache(paths.outputRoot)
  const nextCache = { config: configFingerprint(), photos: {} }
  const generatedPhotos = []
  const keepFilenames = []
  let reusedCount = 0

  for (const record of records) {
    const encoded = await reuseOrEncode(record, paths.outputRoot, cache)
    if (encoded.reused) reusedCount += 1

    for (const variant of encoded.variants) {
      keepFilenames.push(path.basename(variant.src))
    }

    nextCache.photos[record.id] = {
      fingerprint: encoded.fingerprint,
      width: encoded.width,
      height: encoded.height,
    }
    generatedPhotos.push(toGeneratedPhoto(record, encoded))
  }

  const heroImage = paths.heroRoot ? await discoverHeroImage(paths.heroRoot) : null
  let generatedHero = null
  if (heroImage) {
    const encoded = await reuseOrEncode(
      { id: heroImage.id, absolutePath: heroImage.absolutePath, filename: heroImage.filename },
      paths.outputRoot,
      cache,
    )
    if (encoded.reused) reusedCount += 1

    for (const variant of encoded.variants) {
      keepFilenames.push(path.basename(variant.src))
    }
    nextCache.photos[heroImage.id] = {
      fingerprint: encoded.fingerprint,
      width: encoded.width,
      height: encoded.height,
    }
    generatedHero = {
      id: heroImage.id,
      source: heroImage.relativePath,
      ...toGeneratedPhoto(
        {
          id: heroImage.id,
          source: heroImage.relativePath,
          title: 'Moss Portal',
          description: 'Moss-covered concrete passage hidden in autumn woodland',
          galleries: [],
        },
        encoded,
      ),
    }
  }

  const removed = await cleanupGenerated(paths.outputRoot, keepFilenames)
  await writeFile(
    path.join(paths.outputRoot, CACHE_FILENAME),
    `${JSON.stringify(nextCache, null, 2)}\n`,
  )

  const generatedSource = `// Generated by scripts/build-photos.mjs. Do not edit manually.
export const generatedPhotos = ${JSON.stringify(generatedPhotos, null, 2)} as const
export const generatedHero = ${JSON.stringify(generatedHero, null, 2)} as const
`
  await mkdir(path.dirname(paths.generatedDataPath), { recursive: true })
  const tempDataPath = `${paths.generatedDataPath}.tmp`
  await writeFile(tempDataPath, generatedSource)
  await writeFile(paths.generatedDataPath, generatedSource)
  await rm(tempDataPath, { force: true })

  return {
    photos: generatedPhotos,
    hero: generatedHero,
    unusedMetadata,
    reusedCount,
    encodedCount: generatedPhotos.length + (generatedHero ? 1 : 0) - reusedCount,
    removed,
  }
}
