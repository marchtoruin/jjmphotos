import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Photograph } from '../data/photography'

interface LightboxProps {
  photos: Photograph[]
  activeIndex: number | null
  sharedPhotoId: string | null
  previewSrc: string | null
  onClose: () => void
  onChange: (index: number) => void
  onExited: () => void
}

export function Lightbox({
  photos,
  activeIndex,
  sharedPhotoId,
  previewSrc,
  onClose,
  onChange,
  onExited,
}: LightboxProps) {
  const dialog = useRef<HTMLDivElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const [fullImageLoaded, setFullImageLoaded] = useState<string | null>(null)
  const photo = activeIndex === null ? null : photos[activeIndex]
  const isOpen = photo !== null

  const previous = useCallback(() => {
    if (activeIndex !== null) onChange((activeIndex - 1 + photos.length) % photos.length)
  }, [activeIndex, onChange, photos.length])

  const next = useCallback(() => {
    if (activeIndex !== null) onChange((activeIndex + 1) % photos.length)
  }, [activeIndex, onChange, photos.length])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    closeButton.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousRootOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
      if (event.key === 'Tab') {
        const controls = dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, next, onClose, previous])

  useEffect(() => {
    setFullImageLoaded(null)
  }, [photo?.id])

  return (
    <AnimatePresence onExitComplete={onExited}>
      {photo && (
        <motion.div
          ref={dialog}
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
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={photo.id}
                layoutId={sharedPhotoId === photo.id ? `photo-${photo.id}` : undefined}
                className="relative max-h-full max-w-full overflow-hidden bg-[#111210]"
                style={{
                  aspectRatio: photo.aspectRatio,
                  width: `min(100%, calc((100vh - 10.5rem) * ${photo.width / photo.height}))`,
                }}
                initial={reduceMotion || sharedPhotoId === photo.id ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        layout: { type: 'spring', stiffness: 340, damping: 34 },
                        opacity: { duration: 0.22 },
                      }
                }
              >
                <img
                  src={previewSrc || photo.thumbnailSrc}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  className="absolute inset-0 h-full w-full select-none object-contain"
                  draggable={false}
                />
                <img
                  src={photo.src}
                  srcSet={photo.srcSet}
                  sizes="100vw"
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  onLoad={() => setFullImageLoaded(photo.id)}
                  className="absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-300"
                  style={{
                    opacity: fullImageLoaded === photo.id ? 1 : 0,
                    transitionDuration: reduceMotion ? '0ms' : undefined,
                  }}
                  draggable={false}
                />
              </motion.div>
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
