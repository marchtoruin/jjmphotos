import { generatedPhotos } from './photos.generated'

export type CategorySlug =
  | 'travel-landscape'
  | 'japan'
  | 'atmosphere'
  | 'architecture-spaces'
  | 'fine-art'
  | 'people-moments'

interface GalleryPlacement {
  slug: CategorySlug
  order: number
}

interface GeneratedPhoto {
  id: string
  source: string
  title: string
  description: string
  location?: string
  caption?: string
  galleries: GalleryPlacement[]
  featuredOrder?: number
  hero?: boolean
  portrait?: boolean
  width: number
  height: number
  aspectRatio: string
  src: string
  thumbnailSrc: string
  srcSet: string
}

export interface Photograph {
  id: string
  src: string
  thumbnailSrc: string
  srcSet: string
  title: string
  alt: string
  category: CategorySlug
  categories: CategorySlug[]
  location?: string
  caption?: string
  featured?: boolean
  featuredOrder?: number
  hero?: boolean
  portrait?: boolean
  order: number
  width: number
  height: number
  aspectRatio: string
}

export interface GalleryCategory {
  slug: CategorySlug
  name: string
  eyebrow: string
  description: string
}

export const categories: GalleryCategory[] = [
  {
    slug: 'travel-landscape',
    name: 'Travel & Landscape',
    eyebrow: 'Land, weather, distance',
    description:
      'Destinations, coastlines, and quiet encounters with the natural world—photographed with an eye for atmosphere and a sense of place.',
  },
  {
    slug: 'japan',
    name: 'Japan',
    eyebrow: 'Rain, neon, temples',
    description:
      'Wet streets, quiet temples, and late nights from a trip through Tokyo, Kyoto, and Atami.',
  },
  {
    slug: 'atmosphere',
    name: 'Atmosphere & After Dark',
    eyebrow: 'Color, shadow, chance',
    description:
      'Moody street observations, liminal spaces, glowing architecture, and cinematic fragments gathered from the everyday.',
  },
  {
    slug: 'architecture-spaces',
    name: 'Architecture & Spaces',
    eyebrow: 'Form, light, habitation',
    description:
      'A study of built environments, intimate interiors, and the geometry that shapes how we move through a place.',
  },
  {
    slug: 'fine-art',
    name: 'Fine Art & Personal Work',
    eyebrow: 'Studies and fragments',
    description:
      'Ongoing visual investigations into abstraction, stillness, texture, and the cinematic possibilities of the everyday.',
  },
  {
    slug: 'people-moments',
    name: 'People & Moments',
    eyebrow: 'Presence, gesture, story',
    description:
      'Unscripted moments and environmental portraits rooted in observation, connection, and honest human detail.',
  },
]

const generated = generatedPhotos as unknown as readonly GeneratedPhoto[]

const toPhotograph = (
  photo: GeneratedPhoto,
  placement: GalleryPlacement = photo.galleries[0],
): Photograph => ({
  id: photo.id,
  src: photo.src,
  thumbnailSrc: photo.thumbnailSrc,
  srcSet: photo.srcSet,
  title: photo.title,
  alt: photo.description,
  category: placement.slug,
  categories: photo.galleries.map((gallery) => gallery.slug),
  location: photo.location,
  caption: photo.caption,
  featured: photo.featuredOrder !== undefined,
  featuredOrder: photo.featuredOrder,
  hero: photo.hero,
  portrait: photo.portrait,
  order: placement.order,
  width: photo.width,
  height: photo.height,
  aspectRatio: photo.aspectRatio,
})

export const photographs = generated.map((photo) => toPhotograph(photo))

export const heroPhotograph =
  photographs.find((photo) => photo.hero) ?? photographs[0]

export const portraitPhotograph =
  photographs.find((photo) => photo.portrait) ?? photographs[0]

export const getCategory = (slug?: string) =>
  categories.find((category) => category.slug === slug)

export const getPhotoById = (id: string) =>
  photographs.find((photo) => photo.id === id)

export const getPhotosByCategory = (category: CategorySlug) =>
  generated
    .flatMap((photo) => {
      const placement = photo.galleries.find((gallery) => gallery.slug === category)
      return placement ? [toPhotograph(photo, placement)] : []
    })
    .sort((a, b) => a.order - b.order)

export const activeCategories = categories.filter(
  (category) => getPhotosByCategory(category.slug).length > 0,
)

export const featuredPhotographs = generated
  .filter((photo) => photo.featuredOrder !== undefined)
  .sort((a, b) => (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity))
  .map((photo) => toPhotograph(photo))
