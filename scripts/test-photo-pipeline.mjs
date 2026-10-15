import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import sharp from 'sharp'
import {
  buildPhotos,
  slugFromFilename,
  stripOrderPrefix,
  titleFromFilename,
} from './photo-pipeline.mjs'

const categories = [
  { folder: 'Atmosphere', slug: 'atmosphere' },
  { folder: 'Japan', slug: 'japan' },
  { folder: 'People', slug: 'people-moments' },
  { folder: 'Puget Sound', slug: 'travel-landscape' },
]

async function writeJpeg(filePath, color = '#335577') {
  await mkdir(path.dirname(filePath), { recursive: true })
  await sharp({
    create: {
      width: 80,
      height: 60,
      channels: 3,
      background: color,
    },
  })
    .jpeg({ quality: 90 })
    .toFile(filePath)
}

async function createWorkspace() {
  const root = await mkdtemp(path.join(tmpdir(), 'jjm-photos-'))
  const originalsRoot = path.join(root, 'photos/originals')
  const metadataPath = path.join(root, 'photos/metadata.json')
  const outputRoot = path.join(root, 'public/images/generated')
  const generatedDataPath = path.join(root, 'src/data/photos.generated.ts')

  for (const category of categories) {
    await mkdir(path.join(originalsRoot, category.folder), { recursive: true })
  }

  await writeJpeg(path.join(originalsRoot, 'Puget Sound', 'harbor-hero.jpg'), '#102030')
  await writeJpeg(path.join(originalsRoot, 'People', 'mePhoto.jpg'), '#604020')

  const metadata = {
    version: 2,
    categories,
    photos: {
      'harbor-hero.jpg': {
        id: 'tl-hero',
        title: 'Last Light on the Sound',
        description: 'Harbor hero description',
        location: 'Puget Sound, Washington',
        orderByGallery: { 'travel-landscape': 12 },
        hero: true,
      },
      'mePhoto.jpg': {
        id: 'pm-01',
        title: 'Self Portrait',
        description: 'About page portrait',
        portrait: true,
      },
    },
  }

  await mkdir(path.dirname(metadataPath), { recursive: true })
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2))

  return {
    root,
    originalsRoot,
    metadataPath,
    outputRoot,
    generatedDataPath,
    metadata,
    async writeMetadata(next) {
      await writeFile(metadataPath, JSON.stringify(next, null, 2))
    },
    async build() {
      return buildPhotos({
        originalsRoot,
        heroRoot: path.join(root, 'photos/hero'),
        metadataPath,
        outputRoot,
        generatedDataPath,
        legacyOutputRoot: path.join(root, 'public/images/portfolio'),
      })
    },
  }
}

function parseGenerated(source) {
  const match = source.match(/export const generatedPhotos = ([\s\S]*?) as const/)
  if (!match) throw new Error('generatedPhotos export not found')
  return JSON.parse(match[1])
}

test('title and order helpers format filenames predictably', () => {
  assert.deepEqual(stripOrderPrefix('01 - rainy-street.jpg'), {
    order: 1,
    remainderStem: 'rainy-street',
    remainderFilename: 'rainy-street.jpg',
    ext: '.jpg',
  })
  assert.equal(titleFromFilename('01 - rainy-street.jpg'), 'Rainy Street')
  assert.equal(titleFromFilename('mePhoto.jpg'), 'Me Photo')
  assert.equal(titleFromFilename('IMG_8338.jpg'), 'IMG 8338')
  assert.equal(titleFromFilename('Harbor Afterglow.jpg'), 'Harbor Afterglow')
  assert.equal(slugFromFilename('01 - Rainy Street.jpg'), 'rainy-street')
})

test('folder workflow adds, preserves, moves, renames, and removes photographs', async (t) => {
  const workspace = await createWorkspace()
  t.after(() => rm(workspace.root, { recursive: true, force: true }))

  const first = await workspace.build()
  assert.equal(first.photos.length, 2)
  assert.equal(first.photos.find((photo) => photo.hero)?.title, 'Last Light on the Sound')
  assert.equal(first.photos.find((photo) => photo.portrait)?.id, 'pm-01')

  const heroBefore = await stat(path.join(workspace.originalsRoot, 'Puget Sound', 'harbor-hero.jpg'))

  await writeJpeg(path.join(workspace.originalsRoot, 'Atmosphere', '01 - rainy-street.jpg'), '#112233')
  await writeJpeg(path.join(workspace.originalsRoot, 'Japan', 'temple-gate.jpg'), '#334455')

  const added = await workspace.build()
  const rainy = added.photos.find((photo) => photo.source.includes('rainy-street'))
  const temple = added.photos.find((photo) => photo.source.includes('temple-gate'))
  const hero = added.photos.find((photo) => photo.id === 'tl-hero')

  assert.equal(rainy.title, 'Rainy Street')
  assert.equal(rainy.description, 'Rainy Street')
  assert.deepEqual(rainy.galleries, [{ slug: 'atmosphere', order: 1 }])
  assert.equal(temple.title, 'Temple Gate')
  assert.equal(temple.galleries[0].slug, 'japan')
  assert.equal(hero.title, 'Last Light on the Sound')
  assert.equal(hero.location, 'Puget Sound, Washington')
  assert.equal(hero.galleries[0].order, 12)

  const heroAfter = await stat(path.join(workspace.originalsRoot, 'Puget Sound', 'harbor-hero.jpg'))
  assert.equal(heroAfter.mtimeMs, heroBefore.mtimeMs)
  assert.equal(heroAfter.size, heroBefore.size)

  await rename(
    path.join(workspace.originalsRoot, 'Japan', 'temple-gate.jpg'),
    path.join(workspace.originalsRoot, 'Atmosphere', 'temple-gate.jpg'),
  )
  const moved = await workspace.build()
  const movedTemple = moved.photos.find((photo) => photo.source.includes('temple-gate'))
  assert.equal(movedTemple.galleries[0].slug, 'atmosphere')
  assert.ok(movedTemple.galleries[0].order > rainy.galleries[0].order)

  await rename(
    path.join(workspace.originalsRoot, 'Atmosphere', 'temple-gate.jpg'),
    path.join(workspace.originalsRoot, 'Atmosphere', 'lantern-walk.jpg'),
  )
  const renamed = await workspace.build()
  const lantern = renamed.photos.find((photo) => photo.source.includes('lantern-walk'))
  assert.equal(lantern.title, 'Lantern Walk')
  assert.equal(renamed.photos.some((photo) => photo.source.includes('temple-gate')), false)

  await rm(path.join(workspace.originalsRoot, 'Atmosphere', 'lantern-walk.jpg'))
  const removed = await workspace.build()
  assert.equal(removed.photos.some((photo) => photo.source.includes('lantern-walk')), false)
  assert.equal(removed.photos.some((photo) => photo.id === lantern.id), false)
  const leftover = removed.removed.filter((filename) => filename.startsWith(`${lantern.id}-`))
  assert.ok(leftover.length > 0)
})

test('metadata preserves custom fields and additional galleries', async (t) => {
  const workspace = await createWorkspace()
  t.after(() => rm(workspace.root, { recursive: true, force: true }))

  await writeJpeg(path.join(workspace.originalsRoot, 'Japan', 'IMG_8337-Edit.jpg'), '#0a0a0a')
  workspace.metadata.photos['IMG_8337-Edit.jpg'] = {
    id: 'jp-05',
    title: 'Akihabara in the Rain',
    description: 'Neon in the rain',
    location: 'Akihabara, Tokyo',
    orderByGallery: { japan: 1 },
    additionalGalleries: [{ slug: 'atmosphere', order: 106 }],
    featuredOrder: 5,
  }
  await workspace.writeMetadata(workspace.metadata)

  const result = await workspace.build()
  const photo = result.photos.find((item) => item.id === 'jp-05')
  assert.equal(photo.title, 'Akihabara in the Rain')
  assert.equal(photo.description, 'Neon in the rain')
  assert.deepEqual(photo.galleries, [
    { slug: 'japan', order: 1 },
    { slug: 'atmosphere', order: 106 },
  ])
  assert.equal(photo.featuredOrder, 5)
})

test('reuses unchanged generated files and never writes originals', async (t) => {
  const workspace = await createWorkspace()
  t.after(() => rm(workspace.root, { recursive: true, force: true }))

  const first = await workspace.build()
  assert.equal(first.encodedCount, 2)

  const generatedFile = path.join(workspace.outputRoot, 'tl-hero-80.webp')
  const before = await stat(generatedFile)
  const sourceBefore = await stat(path.join(workspace.originalsRoot, 'Puget Sound', 'harbor-hero.jpg'))

  const second = await workspace.build()
  assert.equal(second.reusedCount, 2)
  assert.equal(second.encodedCount, 0)

  const after = await stat(generatedFile)
  const sourceAfter = await stat(path.join(workspace.originalsRoot, 'Puget Sound', 'harbor-hero.jpg'))
  assert.equal(after.mtimeMs, before.mtimeMs)
  assert.equal(sourceAfter.mtimeMs, sourceBefore.mtimeMs)

  const generated = parseGenerated(await readFile(workspace.generatedDataPath, 'utf8'))
  assert.equal(generated[0].src.startsWith('/images/generated/'), true)
})

test('homepage hero crop is optimized without changing gallery originals', async (t) => {
  const workspace = await createWorkspace()
  t.after(() => rm(workspace.root, { recursive: true, force: true }))

  const galleryPath = path.join(workspace.originalsRoot, 'Puget Sound', 'harbor-hero.jpg')
  const before = await stat(galleryPath)
  await writeJpeg(path.join(workspace.root, 'photos/hero', 'moss-portal-16x9.jpg'), '#1a2a1a')

  const result = await workspace.build()
  assert.equal(result.hero?.id, 'hero-moss-portal')
  assert.equal(result.hero?.width / result.hero?.height, 80 / 60)
  assert.equal(result.photos.some((photo) => photo.id === 'hero-moss-portal'), false)
  assert.ok(result.hero.src.includes('hero-moss-portal'))

  const after = await stat(galleryPath)
  assert.equal(after.mtimeMs, before.mtimeMs)
  assert.equal(after.size, before.size)
})
