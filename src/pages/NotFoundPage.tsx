import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found — JJM Photography" description="The requested page could not be found." />
      <section className="page-shell flex min-h-[calc(100svh-5rem)] flex-col justify-center py-24">
        <p className="eyebrow">404 · Out of frame</p>
        <h1 className="mt-4 font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] tracking-[-0.03em]">
          This page isn’t here.
        </h1>
        <p className="mt-5 max-w-md text-mist">It may have moved, or perhaps it was never in the sequence.</p>
        <Link to="/" className="arrow-link mt-8"><ArrowLeft size={15} /> Return home</Link>
      </section>
    </>
  )
}
