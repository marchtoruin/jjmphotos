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

  return (
    <>
      <Seo
        title={`${category.name} — JJM Photography`}
        description={category.description}
      />
      <header className="page-shell pb-18 pt-36 md:pb-24 md:pt-48">
        <Reveal>
          <Link to="/portfolio" className="arrow-link mb-12">
            <ArrowLeft size={16} /> All collections
          </Link>
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="eyebrow">{category.eyebrow}</p>
              <h1 className="mt-5 font-serif text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.84] tracking-[-0.04em]">
                {category.name}
              </h1>
            </div>
            <p className="max-w-lg text-[0.95rem] leading-7 text-mist md:col-span-4">{category.description}</p>
          </div>
        </Reveal>
      </header>

      <section className="page-shell pb-28 md:pb-40">
        <PortfolioGrid photos={photos} />
      </section>
    </>
  )
}
