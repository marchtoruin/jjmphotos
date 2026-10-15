import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import {
  activeCategories,
  featuredPhotographs,
  getPhotosByCategory,
  heroPhotograph,
} from '../data/photography'
import { siteContent } from '../data/site'

const featuredLayouts = [
  'md:col-span-12',
  'md:col-span-7',
  'md:col-span-5 md:mt-10',
  'md:col-span-5 md:col-start-2',
  'md:col-span-6 md:col-start-7 md:mt-6',
]

export function HomePage() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.4], ['0%', reduceMotion ? '0%' : '3%'])

  return (
    <>
      <Seo
        title="JJM Photography — Pacific Northwest Photographer"
        description="Cinematic landscape, atmospheric street, architecture, fine-art, and documentary photography from the Pacific Northwest."
      />

      <section className="relative min-h-svh overflow-hidden">
        <motion.img
          src={heroPhotograph.src}
          srcSet={heroPhotograph.srcSet}
          sizes="100vw"
          alt={heroPhotograph.alt}
          width={heroPhotograph.width}
          height={heroPhotograph.height}
          className="absolute inset-0 h-[104%] w-full object-cover"
          style={{ y: heroY }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/80" />
        <div className="absolute inset-x-0 bottom-0 page-shell pb-8 md:pb-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-between gap-8"
          >
            <div className="max-w-3xl">
              <p className="mb-3 text-[0.68rem] uppercase tracking-[0.28em] text-white/70">
                Washington
              </p>
              <h1 className="font-serif text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[0.92] tracking-[-0.03em] text-white">
                Places. Moments.
                <br />
                <span className="italic">Everything between.</span>
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                {heroPhotograph.title}
                {heroPhotograph.location ? ` · ${heroPhotograph.location}` : ''}
              </p>
            </div>
            <a
              href="#introduction"
              className="mb-1 hidden size-12 place-items-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-ink md:grid"
              aria-label="Continue to introduction"
            >
              <ArrowDown size={18} strokeWidth={1.3} />
            </a>
          </motion.div>
        </div>
      </section>

      <section id="introduction" className="section-space page-shell">
        <Reveal className="grid gap-8 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-3">Justin McClure</p>
          <div className="md:col-span-8 md:col-start-5">
            <p className="max-w-xl text-[1.05rem] leading-8 text-stone/90">
              {siteContent.home.introduction}
            </p>
            <Link to="/portfolio" className="arrow-link mt-7">
              The photographs <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-20 md:pb-28">
        <Reveal>
          <div className="mb-6 flex items-end justify-between border-b border-white/8 pb-3">
            <p className="eyebrow">Selected frames</p>
            <span className="hidden text-[0.68rem] uppercase tracking-[0.18em] text-mist sm:block">
              01—05
            </span>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-12 md:gap-x-4 md:gap-y-8">
          {featuredPhotographs.slice(0, 5).map((photo, index) => (
            <Reveal key={photo.id} className={featuredLayouts[index]} delay={index * 0.04}>
              <Link to={`/portfolio/${photo.category}`} className="group block">
                <div className="image-frame relative overflow-hidden" style={{ aspectRatio: photo.aspectRatio }}>
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                  />
                </div>
                <div className="photo-caption">
                  <span className="text-[0.88rem]">{photo.title}</span>
                  <span className="hidden text-[0.75rem] text-mist sm:block">{photo.location}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8">
        <div className="page-shell py-12 md:py-16">
          <Reveal>
            <p className="eyebrow mb-6">Collections</p>
          </Reveal>
          <div>
            {activeCategories.map((category, index) => {
              const photos = getPhotosByCategory(category.slug)
              const cover = photos[0]
              return (
                <Reveal key={category.slug}>
                  <Link to={`/portfolio/${category.slug}`} className="collection-row group">
                    <span className="plate">0{index + 1}</span>
                    <h3 className="font-serif text-2xl italic tracking-[-0.02em] md:text-[2rem]">
                      {category.name}
                    </h3>
                    <p className="text-sm leading-6 text-mist">{category.eyebrow}</p>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[0.7rem] text-mist md:static md:translate-y-0">
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
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-3">Correspondence</p>
          <div className="md:col-span-8 md:col-start-5">
            <p className="max-w-lg font-serif text-3xl leading-snug tracking-[-0.02em] md:text-4xl">
              If something stays with you, write.
            </p>
            <Link to="/contact" className="arrow-link mt-6">
              Contact <ArrowUpRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
