import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import {
  activeCategories,
  featuredPhotographs,
  getPhotosByCategory,
  heroPhotograph,
  type Photograph,
} from '../data/photography'
import { siteContent } from '../data/site'

function FeaturedStill({ photo, index }: { photo: Photograph; index: number }) {
  return (
    <Link to={`/portfolio/${photo.category}`} className="group block">
      <div className="image-frame relative overflow-hidden" style={{ aspectRatio: photo.aspectRatio }}>
        <img
          src={photo.src}
          srcSet={photo.srcSet}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
        />
      </div>
      <div className="photo-caption">
        <span>
          <span className="block text-[0.88rem]">{photo.title}</span>
          {photo.location && (
            <span className="mt-0.5 block text-[0.72rem] text-mist">{photo.location}</span>
          )}
        </span>
        <span className="plate">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </Link>
  )
}

export function HomePage() {
  const reduceMotion = useReducedMotion()
  const selected = featuredPhotographs.slice(0, 5)

  return (
    <>
      <Seo
        title="JJM Photography — Pacific Northwest Photographer"
        description="Cinematic landscape, atmospheric street, architecture, fine-art, and documentary photography from the Pacific Northwest."
      />

      <section className="hero-stage">
        <motion.div
          className="hero-frame"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={heroPhotograph.src}
            srcSet={heroPhotograph.srcSet}
            sizes="100vw"
            alt={heroPhotograph.alt}
            width={heroPhotograph.width}
            height={heroPhotograph.height}
            className="hero-image"
          />
          <p className="hero-identity">JJM / PHOTOGRAPHS</p>
          <p className="hero-index">STILL 01 · {heroPhotograph.title}</p>
        </motion.div>
      </section>

      <section id="introduction" className="section-space page-shell">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-start">
          <p className="eyebrow md:col-span-3 md:pt-1">File / Intro</p>
          <div className="md:col-span-7 md:col-start-5">
            <p className="max-w-xl text-[1.02rem] leading-8 text-stone/90">
              {siteContent.home.introduction}
            </p>
            <Link to="/portfolio" className="arrow-link mt-6">
              Enter the work <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-16 md:pb-24">
        <Reveal>
          <div className="mb-5 flex items-end justify-between border-b border-white/8 pb-2">
            <p className="eyebrow">Sel / 05</p>
            <span className="plate">Selected stills</span>
          </div>
        </Reveal>
        <div className="flex flex-col gap-5 md:gap-6">
          {selected[0] && (
            <Reveal>
              <FeaturedStill photo={selected[0]} index={0} />
            </Reveal>
          )}
          <div className="featured-pair">
            {selected[1] && (
              <Reveal>
                <FeaturedStill photo={selected[1]} index={1} />
              </Reveal>
            )}
            {selected[2] && (
              <Reveal delay={0.04}>
                <FeaturedStill photo={selected[2]} index={2} />
              </Reveal>
            )}
          </div>
          <div className="featured-pair">
            {selected[3] && (
              <Reveal>
                <FeaturedStill photo={selected[3]} index={3} />
              </Reveal>
            )}
            {selected[4] && (
              <Reveal delay={0.04}>
                <FeaturedStill photo={selected[4]} index={4} />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8">
        <div className="page-shell py-10 md:py-14">
          <Reveal>
            <p className="eyebrow mb-5">Index / Collections</p>
          </Reveal>
          <div>
            {activeCategories.map((category, index) => {
              const photos = getPhotosByCategory(category.slug)
              const cover = photos[0]
              return (
                <Reveal key={category.slug}>
                  <Link to={`/portfolio/${category.slug}`} className="collection-row group">
                    <span className="plate">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="font-serif text-[1.65rem] tracking-[-0.02em] md:text-[1.9rem]">
                      {category.name}
                    </h3>
                    <p className="text-sm leading-6 text-mist">{category.eyebrow}</p>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 plate md:static md:translate-y-0">
                      {String(photos.length).padStart(2, '0')}
                    </span>
                    <img
                      src={cover.thumbnailSrc}
                      srcSet={cover.srcSet}
                      sizes="180px"
                      alt=""
                      width={cover.width}
                      height={cover.height}
                      className="pointer-events-none absolute right-16 z-10 hidden h-28 w-40 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:block"
                    />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-space page-shell">
        <Reveal className="grid gap-5 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-3">Corr / 00</p>
          <div className="md:col-span-7 md:col-start-5">
            <p className="max-w-lg text-[1.15rem] leading-8 text-stone/90">
              If something stays with you, write.
            </p>
            <Link to="/contact" className="arrow-link mt-5">
              Contact <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
