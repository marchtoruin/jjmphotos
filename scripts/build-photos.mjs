import { buildPhotos, defaultPhotoPaths } from './photo-pipeline.mjs'

const result = await buildPhotos(defaultPhotoPaths())

if (result.unusedMetadata.length > 0) {
  console.warn(
    `Unused metadata entries (file not found): ${result.unusedMetadata.join(', ')}`,
  )
}

console.log(
  `Generated ${result.photos.length} photographs (${result.reusedCount} reused, ${result.encodedCount} encoded).`,
)
if (result.removed.length > 0) {
  console.log(`Removed ${result.removed.length} obsolete generated files.`)
}
