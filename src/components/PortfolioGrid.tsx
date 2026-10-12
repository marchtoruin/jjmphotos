import { useState } from 'react'
import type { Photograph } from '../data/photography'
import { Lightbox } from './Lightbox'
import { Reveal } from './Reveal'

interface PortfolioGridProps {
  photos: Photograph[]
}

export function PortfolioGrid({ photos }: PortfolioGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo, index) => (
          <Reveal key={photo.id} className="photo-grid-item" delay={(index % 3) * 0.06}>
            <button
              type="button"
              className="group block w-full text-left"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open ${photo.title} in image viewer`}
            >
              <div
                className="image-frame relative overflow-hidden bg-white/4"
                style={{ aspectRatio: photo.aspectRatio }}
              >
                <img
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
              </div>
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
        onClose={() => setActiveIndex(null)}
        onChange={setActiveIndex}
      />
    </>
  )
}
