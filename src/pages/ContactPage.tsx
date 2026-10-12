import { Aperture, ArrowUpRight, Mail } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { siteContent } from '../data/site'

export function ContactPage() {
  return (
    <>
      <Seo
        title="Contact — JJM Photography"
        description="Contact JJM Photography for commissions, collaborations, licensing, and print inquiries."
      />
      <section className="page-shell flex min-h-[calc(100svh-5rem)] items-center pb-20 pt-36">
        <div className="grid w-full gap-16 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="eyebrow">Inquiries & collaborations</p>
            <h1 className="mt-7 font-serif text-[clamp(4.5rem,11vw,11rem)] leading-[0.78] tracking-[-0.045em]">
              Let’s talk.
            </h1>
            <p className="mt-12 max-w-2xl text-lg leading-8 text-mist">
              For commissions, destination work, architecture and hospitality projects, licensing, prints, or a thoughtful collaboration—send a note with a little about what you have in mind.
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
              Pacific Northwest / Washington State
              <br />
              Available for select work worldwide.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
