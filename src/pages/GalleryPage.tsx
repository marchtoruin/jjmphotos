import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PortfolioGrid } from '../components/PortfolioGrid'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { getCategory, getPhotosByCategory } from '../data/photography'

export function GalleryPage() {
  const { categorySlug } = useParams()
  const category = getCategory(categorySlug)

  if (!category) return <Navigate to="/404" replace />

  const photos = getPhotosByCategory(category.slug)

  if (photos.length === 0) return <Navigate to="/portfolio" replace />

  return (
    <>
      <Seo
        title={`${category.name} — JJM Photography`}
        description={category.description}
      />
      <header className="page-shell pb-6 pt-28 md:pb-8 md:pt-36">
        <Reveal>
          <Link to="/portfolio" className="arrow-link mb-7">
            <ArrowLeft size={15} /> All collections
          </Link>
          <div className="grid gap-4 border-b border-white/8 pb-5 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="eyebrow">{category.eyebrow}</p>
              <h1 className="mt-3 font-serif text-[clamp(2.4rem,5.4vw,4.1rem)] leading-[0.94] tracking-[-0.025em]">
                {category.name}
              </h1>
            </div>
            <p className="max-w-md text-[0.9rem] leading-6 text-mist md:col-span-5">
              {category.description}
              <span className="mt-2 block text-[0.7rem] uppercase tracking-[0.16em]">
                {String(photos.length).padStart(2, '0')} photographs
              </span>
            </p>
          </div>
        </Reveal>
      </header>

      <section className="page-shell pb-20 md:pb-28">
        <PortfolioGrid photos={photos} />
      </section>
    </>
  )
}
