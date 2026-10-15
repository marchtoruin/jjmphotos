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
      <header className="page-shell pb-8 pt-28 md:pb-10 md:pt-36">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2.8rem,6.5vw,5rem)] leading-[0.94] tracking-[-0.03em]">
            {siteContent.about.heading}
          </h1>
        </Reveal>
      </header>

      <section className="page-shell pb-20 md:pb-28">
        <div className="grid gap-10 md:grid-cols-12 md:items-start">
          <Reveal className="md:col-span-5">
            <div className="image-frame overflow-hidden">
              <img
                src={portraitPhotograph.src}
                srcSet={portraitPhotograph.srcSet}
                sizes="(min-width: 768px) 42vw, 100vw"
                alt={portraitPhotograph.alt}
                width={portraitPhotograph.width}
                height={portraitPhotograph.height}
                style={{ aspectRatio: portraitPhotograph.aspectRatio }}
                className="w-full object-cover"
              />
            </div>
            {portraitPhotograph.title && (
              <p className="photo-caption">
                <span className="text-[0.85rem]">{portraitPhotograph.title}</span>
                {portraitPhotograph.location && (
                  <span className="text-[0.75rem] text-mist">{portraitPhotograph.location}</span>
                )}
              </p>
            )}
          </Reveal>

          <div className="md:col-span-6 md:col-start-7 md:pt-4">
            {siteContent.about.biography.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p className="mb-6 text-[1.05rem] leading-8 text-stone/90">{paragraph}</p>
              </Reveal>
            ))}
            <Reveal>
              <p className="eyebrow mt-10">Washington State</p>
              <Link to="/contact" className="arrow-link mt-5">
                Get in touch <ArrowUpRight size={15} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
