import { Aperture, ArrowUpRight, Mail } from 'lucide-react'
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
      <section className="page-shell flex min-h-[calc(100svh-5rem)] items-center pb-20 pt-36">
        <div className="grid w-full gap-16 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-7 font-serif text-[clamp(4.5rem,11vw,11rem)] leading-[0.78] tracking-[-0.045em]">
              Say hello.
            </h1>
            <p className="mt-12 max-w-2xl text-lg leading-8 text-mist">
              Interested in working together, asking about a photograph, or just saying hello? Get in touch. I’m open to select commissions, collaborations, and inquiries about prints or image licensing.
            </p>
          </Reveal>

          <Reveal className="md:col-span-4">
            <div className="border-t border-white/15">
              <a
                href={`mailto:${siteContent.contact.email}`}
                className="group flex items-center justify-between border-b border-white/15 py-6"
              >
                <span className="flex items-center gap-3">
                  <Mail size={17} strokeWidth={1.4} />
                  <span>
                    <span className="block text-[0.8rem] text-mist">Email</span>
                    <span className="mt-1 block break-all">{siteContent.contact.email}</span>
                  </span>
                </span>
                <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
              </a>
              <a
                href={siteContent.contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between border-b border-white/15 py-6"
              >
                <span className="flex items-center gap-3">
                  <Aperture size={17} strokeWidth={1.4} />
                  <span>
                    <span className="block text-[0.8rem] text-mist">Instagram</span>
                    <span className="mt-1 block">{siteContent.contact.instagramHandle}</span>
                  </span>
                </span>
                <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" size={18} />
              </a>
            </div>
            <p className="mt-6 text-sm leading-6 text-mist">
              Based in Washington State
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
