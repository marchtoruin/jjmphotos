import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import {
  categories,
  featuredPhotographs,
  getPhotosByCategory,
  heroPhotograph,
} from '../data/photography'
import { siteContent } from '../data/site'

export function HomePage() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.45], ['0%', reduceMotion ? '0%' : '8%'])

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
          className="absolute inset-0 h-[108%] w-full object-cover"
          style={{ y: heroY }}
          initial={reduceMotion ? false : { scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/75" />
        <div className="absolute inset-x-0 bottom-0 page-shell pb-10 md:pb-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-end justify-between"
          >
            <div>
              <p className="mb-4 text-[0.7rem] uppercase tracking-[0.3em] text-white/80">
                Pacific Northwest · Washington
              </p>
              <h1 className="max-w-4xl font-serif text-[clamp(3.3rem,8vw,8rem)] leading-[0.86] tracking-[-0.035em] text-white">
                Places. Moments.
                <br />
                <span className="italic">Everything between.</span>
              </h1>
            </div>
            <a
              href="#introduction"
              className="mb-1 hidden size-14 place-items-center rounded-full border border-white/35 text-white transition-colors hover:bg-white hover:text-ink md:grid"
              aria-label="Continue to introduction"
            >
              <ArrowDown size={20} strokeWidth={1.3} />
            </a>
          </motion.div>
        </div>
      </section>

      <section id="introduction" className="section-space page-shell">
        <Reveal className="grid gap-12 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-3">Independent photography</p>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="font-serif text-[clamp(2.5rem,5.3vw,5.8rem)] leading-[0.98] tracking-[-0.025em]">
              Images rooted in atmosphere, observation, and a sense of place.
            </h2>
            <div className="mt-10 flex flex-col gap-8 border-t border-white/12 pt-7 sm:flex-row sm:items-start sm:justify-between">
              <p className="max-w-lg text-base leading-7 text-mist">{siteContent.home.introduction}</p>
              <Link to="/portfolio" className="arrow-link shrink-0">
                Explore all work <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell pb-28 md:pb-40">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">Selected photographs</p>
              <h2 className="mt-4 font-serif text-4xl md:text-6xl">Recent frames</h2>
            </div>
            <span className="hidden text-[0.8rem] text-mist sm:block">A curated edit · 01—04</span>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-12 md:gap-y-20">
          {featuredPhotographs.slice(0, 4).map((photo, index) => (
            <Reveal
              key={photo.id}
              className={
                index === 0
                  ? 'md:col-span-7'
                  : index === 1
                    ? 'md:col-span-4 md:col-start-9 md:mt-32'
                    : index === 2
                      ? 'md:col-span-4 md:col-start-2'
                      : 'md:col-span-6 md:col-start-7 md:mt-20'
              }
            >
              <Link to={`/portfolio/${photo.category}`} className="group block">
                <div className="relative overflow-hidden bg-white/4" style={{ aspectRatio: photo.aspectRatio }}>
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(min-width: 1024px) 55vw, (min-width: 640px) 50vw, 100vw"
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                  {photo.caption?.startsWith('Placeholder') && (
                    <span className="placeholder-chip">Placeholder</span>
                  )}
                </div>
                <div className="mt-3 flex flex-col gap-1 text-[0.9375rem] sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span>{photo.title}</span>
                  <span className="text-sm text-mist sm:max-w-[48%] sm:text-right">{photo.location}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10">
        <div className="page-shell py-20 md:py-32">
          <Reveal>
            <p className="eyebrow mb-12">Explore by collection</p>
          </Reveal>
          <div>
            {categories.map((category, index) => {
              const cover = getPhotosByCategory(category.slug)[0]
              return (
                <Reveal key={category.slug}>
                  <Link
                    to={`/portfolio/${category.slug}`}
                    className="category-row group relative grid items-center gap-4 border-t border-white/12 py-7 pr-10 last:border-b md:grid-cols-12 md:py-10 md:pr-0"
                  >
                    <span className="text-[0.75rem] text-mist md:col-span-1">0{index + 1}</span>
                    <h3 className="font-serif text-3xl transition-transform duration-500 group-hover:translate-x-2 md:col-span-6 md:text-5xl">
                      {category.name}
                    </h3>
                    <p className="max-w-sm text-[0.9375rem] leading-6 text-mist md:col-span-4">{category.eyebrow}</p>
                    <ArrowUpRight className="absolute right-0 top-8 md:static md:justify-self-end" size={21} strokeWidth={1.3} />
                    <img
                      src={cover.thumbnailSrc}
                      srcSet={cover.srcSet}
                      sizes="224px"
                      alt=""
                      width={cover.width}
                      height={cover.height}
                      className="pointer-events-none absolute right-14 z-10 hidden h-40 w-56 -translate-y-1/2 rotate-2 object-cover opacity-0 transition-all duration-500 group-hover:-translate-y-[55%] group-hover:opacity-100 lg:block"
                    />
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-space page-shell">
        <Reveal className="grid gap-10 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-3">Commissioned work</p>
          <div className="md:col-span-8 md:col-start-5">
            <h2 className="font-serif text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.95]">
              Have a place or story worth seeing differently?
            </h2>
            <Link to="/contact" className="arrow-link mt-10">
              Start a conversation <ArrowUpRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
