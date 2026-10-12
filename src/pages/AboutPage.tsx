import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { portraitPhotograph } from '../data/photography'
import { siteContent } from '../data/site'

export function AboutPage() {
  return (
    <>
      <Seo
        title="About — JJM Photography"
        description="About JJM Photography, an independent photographer based in Washington State and the Pacific Northwest."
      />
      <header className="page-shell pb-18 pt-40 md:pb-24 md:pt-52">
        <Reveal>
          <p className="eyebrow">About the photographer</p>
          <h1 className="mt-7 max-w-5xl font-serif text-[clamp(3.8rem,8vw,8rem)] leading-[0.9] tracking-[-0.035em]">
            {siteContent.about.heading}
          </h1>
        </Reveal>
      </header>

      <section className="page-shell pb-28 md:pb-40">
        <div className="grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="relative">
              <img
                src={portraitPhotograph.src}
                srcSet={portraitPhotograph.srcSet}
                sizes="(min-width: 768px) 42vw, 100vw"
                alt={portraitPhotograph.alt}
                width={portraitPhotograph.width}
                height={portraitPhotograph.height}
                style={{ aspectRatio: portraitPhotograph.aspectRatio }}
                className="w-full object-cover grayscale"
              />
              {portraitPhotograph.caption?.startsWith('Placeholder') && (
                <span className="placeholder-chip">Portrait placeholder</span>
              )}
            </div>
            {portraitPhotograph.caption?.startsWith('Placeholder') && (
              <p className="mt-3 text-sm text-mist">Replace with photographer portrait</p>
            )}
          </Reveal>

          <div className="md:col-span-6 md:col-start-7 md:pt-24">
            {siteContent.about.biography.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.08}>
                <p className="mb-8 font-serif text-2xl leading-[1.35] md:text-3xl">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal className="mt-14 border-t border-white/12 pt-9">
              <p className="eyebrow mb-5">Approach</p>
              <p className="max-w-xl text-[1.0625rem] leading-8 text-mist">{siteContent.about.philosophy}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.018]">
        <div className="page-shell py-20 md:py-32">
          <Reveal className="grid gap-10 md:grid-cols-12">
            <p className="eyebrow md:col-span-3">Areas of interest</p>
            <div className="md:col-span-8 md:col-start-5">
              {['Tourism & destination', 'Hospitality & interiors', 'Architecture & real estate', 'Editorial & documentary', 'Fine-art prints & licensing'].map(
                (service, index) => (
                  <div key={service} className="flex items-center justify-between border-t border-white/12 py-5 last:border-b">
                    <span className="font-serif text-2xl md:text-3xl">{service}</span>
                    <span className="text-[0.75rem] text-mist">0{index + 1}</span>
                  </div>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space page-shell">
        <Reveal className="text-center">
          <p className="eyebrow">Based in Washington · Available beyond</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.95]">
            Let’s make something with a lasting sense of place.
          </h2>
          <Link to="/contact" className="arrow-link mt-10">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
