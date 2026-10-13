import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import type { Photograph } from '../data/photography'
import { Lightbox } from './Lightbox'
import { Reveal } from './Reveal'

interface PortfolioGridProps {
  photos: Photograph[]
}

export function PortfolioGrid({ photos }: PortfolioGridProps) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [sharedPhotoId, setSharedPhotoId] = useState<string | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const triggerButtons = useRef(new Map<string, HTMLButtonElement>())
  const thumbnailImages = useRef(new Map<string, HTMLImageElement>())
  const openingTrigger = useRef<HTMLButtonElement | null>(null)

  const openPhoto = (index: number) => {
    const photo = photos[index]
    openingTrigger.current = triggerButtons.current.get(photo.id) ?? null
    setPreviewSrc(thumbnailImages.current.get(photo.id)?.currentSrc || photo.thumbnailSrc)
    setSharedPhotoId(photo.id)
    setActiveIndex(index)
  }

  const changePhoto = (index: number) => {
    const photo = photos[index]
    setSharedPhotoId(null)
    setPreviewSrc(thumbnailImages.current.get(photo.id)?.currentSrc || photo.thumbnailSrc)
    setActiveIndex(index)
  }

  const closeLightbox = () => {
    const photo = activeIndex === null ? null : photos[activeIndex]
    const trigger = photo ? triggerButtons.current.get(photo.id) : null
    const bounds = trigger?.getBoundingClientRect()
    const canReturnToThumbnail =
      photo?.id === sharedPhotoId &&
      trigger?.isConnected &&
      bounds !== undefined &&
      bounds.bottom > 0 &&
      bounds.top < window.innerHeight &&
      bounds.right > 0 &&
      bounds.left < window.innerWidth

    if (!canReturnToThumbnail) setSharedPhotoId(null)
    setActiveIndex(null)
  }

  return (
    <LayoutGroup id="portfolio-lightbox">
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <Reveal key={photo.id} className="photo-grid-item" delay={(index % 3) * 0.06}>
            <button
              ref={(element) => {
                if (element) triggerButtons.current.set(photo.id, element)
                else triggerButtons.current.delete(photo.id)
              }}
              type="button"
              className="group block w-full text-left"
              onClick={() => openPhoto(index)}
              aria-label={`Open ${photo.title} in image viewer`}
            >
              <motion.div
                layoutId={sharedPhotoId === photo.id ? `photo-${photo.id}` : undefined}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 340, damping: 34 }
                }
                className="image-frame relative overflow-hidden bg-white/4"
                style={{ aspectRatio: photo.aspectRatio }}
              >
                <img
                  ref={(element) => {
                    if (element) thumbnailImages.current.set(photo.id, element)
                    else thumbnailImages.current.delete(photo.id)
                  }}
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw"
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                {photo.caption?.startsWith('Placeholder') && (
                  <span className="placeholder-chip">Placeholder</span>
                )}
                <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
              </motion.div>
              <span className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="text-[0.9375rem] text-stone">{photo.title}</span>
                {photo.location && (
                  <span className="text-sm leading-5 text-mist sm:max-w-[48%] sm:text-right">
                    {photo.location}
                  </span>
                )}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox
        photos={photos}
        activeIndex={activeIndex}
        sharedPhotoId={sharedPhotoId}
        previewSrc={previewSrc}
        onClose={closeLightbox}
        onChange={changePhoto}
        onExited={() => {
          setSharedPhotoId(null)
          setPreviewSrc(null)
          openingTrigger.current?.focus({ preventScroll: true })
          openingTrigger.current = null
        }}
      />
    </LayoutGroup>
  )
}
