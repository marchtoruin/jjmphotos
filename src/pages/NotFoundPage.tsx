import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found — JJM Photography" description="The requested page could not be found." />
      <section className="page-shell flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center text-center">
        <p className="eyebrow">404 · Frame not found</p>
        <h1 className="mt-6 font-serif text-[clamp(5rem,18vw,13rem)] leading-none">Out of frame.</h1>
        <p className="mt-7 max-w-md text-mist">The page you’re looking for may have moved, or perhaps it was never here.</p>
        <Link to="/" className="arrow-link mt-10"><ArrowLeft size={16} /> Return home</Link>
      </section>
    </>
  )
}
