import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { siteContent } from '../data/site'

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact — JJM Photography"
        description="Get in touch with Justin about working together, prints, image licensing, or just to say hello."
      />
      <section className="page-shell pb-20 pt-28 md:pt-36">
        <div className="grid w-full gap-12 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 font-serif text-[clamp(2.6rem,6vw,4.4rem)] leading-[0.92] tracking-[-0.03em]">
              Say hello.
            </h1>
            <p className="mt-7 max-w-xl text-[1.05rem] leading-8 text-mist">
              Interested in working together, asking about a photograph, or just saying hello? Get in touch. I’m open to select commissions, collaborations, and inquiries about prints or image licensing.
            </p>
          </Reveal>

          <Reveal className="md:col-span-4 md:col-start-9">
            <div className="border-t border-white/10">
              <a
                href={`mailto:${siteContent.contact.email}`}
                className="group flex items-end justify-between border-b border-white/10 py-5"
              >
                <span>
                  <span className="plate">Email</span>
                  <span className="mt-1.5 block break-all">{siteContent.contact.email}</span>
                </span>
                <ArrowUpRight className="mb-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={16} />
              </a>
              <a
                href={siteContent.contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-end justify-between border-b border-white/10 py-5"
              >
                <span>
                  <span className="plate">Instagram</span>
                  <span className="mt-1.5 block">{siteContent.contact.instagramHandle}</span>
                </span>
                <ArrowUpRight className="mb-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={16} />
              </a>
            </div>
            <p className="mt-5 text-sm text-mist">Based in Washington State</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
