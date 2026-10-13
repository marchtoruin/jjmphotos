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
        description="Justin is a photographer based in Washington State, photographing landscapes, urban scenes, and personal studies."
      />
      <header className="page-shell pb-18 pt-40 md:pb-24 md:pt-52">
        <Reveal>
          <p className="eyebrow">About</p>
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
            </div>
          </Reveal>

          <div className="md:col-span-6 md:col-start-7 md:pt-24">
            {siteContent.about.biography.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.08}>
                <p className="mb-8 font-serif text-2xl leading-[1.35] md:text-3xl">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space page-shell">
        <Reveal className="text-center">
          <p className="eyebrow">Based in Washington State</p>
          <h2 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.95]">
            Feel free to say hello.
          </h2>
          <Link to="/contact" className="arrow-link mt-10">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </section>
    </>
  )
}
