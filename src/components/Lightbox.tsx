import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { Photograph } from '../data/photography'

interface LightboxProps {
  photos: Photograph[]
  activeIndex: number | null
  onClose: () => void
  onChange: (index: number) => void
}

export function Lightbox({ photos, activeIndex, onClose, onChange }: LightboxProps) {
  const closeButton = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const photo = activeIndex === null ? null : photos[activeIndex]

  const previous = () => {
    if (activeIndex !== null) onChange((activeIndex - 1 + photos.length) % photos.length)
  }

  const next = () => {
    if (activeIndex !== null) onChange((activeIndex + 1) % photos.length)
  }

  useEffect(() => {
    if (!photo) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  })

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-[#090a09]/98"
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${photo.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
        >
          <div className="flex h-18 items-center justify-between px-5 md:px-8">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-mist">
              {(activeIndex ?? 0) + 1} / {photos.length}
            </p>
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full border border-white/15 transition-colors hover:bg-white hover:text-ink"
              aria-label="Close image viewer"
            >
              <X size={19} strokeWidth={1.4} />
            </button>
          </div>

          <motion.div
            className="relative flex min-h-0 flex-1 items-center justify-center px-5 md:px-20"
            drag={reduceMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x > 70) previous()
              if (info.offset.x < -70) next()
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.id}
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="100vw"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="max-h-full max-w-full select-none object-contain"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                draggable={false}
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={previous}
              className="lightbox-arrow left-3 md:left-6"
              aria-label="Previous photograph"
            >
              <ArrowLeft size={20} strokeWidth={1.4} />
            </button>
            <button
              type="button"
              onClick={next}
              className="lightbox-arrow right-3 md:right-6"
              aria-label="Next photograph"
            >
              <ArrowRight size={20} strokeWidth={1.4} />
            </button>
          </motion.div>

          <div className="flex min-h-24 items-start justify-between gap-5 px-5 py-5 md:px-8">
            <div>
              <h2 className="text-base text-stone">{photo.title}</h2>
              {photo.location && <p className="mt-1 text-sm text-mist">{photo.location}</p>}
            </div>
            {photo.caption?.startsWith('Placeholder') && (
              <p className="max-w-sm text-right text-[0.7rem] uppercase tracking-[0.16em] text-mist">
                Demonstration image
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
