import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { activeCategories, getPhotosByCategory } from '../data/photography'

export function PortfolioPage() {
  return (
    <>
      <Seo
        title="Portfolio — JJM Photography"
        description="Explore landscape, atmospheric street, architecture, fine-art, and documentary photography by JJM Photography."
      />
      <header className="page-shell pb-8 pt-28 md:pb-10 md:pt-36">
        <Reveal>
          <p className="eyebrow">The work</p>
          <div className="mt-5 grid gap-6 md:grid-cols-12 md:items-end">
            <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.035em] md:col-span-6">
              Portfolio
            </h1>
            <p className="max-w-md text-[0.95rem] leading-7 text-mist md:col-span-5 md:col-start-8">
              Collections of land, weather, city light, and the people found between.
            </p>
          </div>
        </Reveal>
      </header>

      <div className="page-shell pb-20 md:pb-28">
        {activeCategories.map((category, index) => {
          const photos = getPhotosByCategory(category.slug)
          const cover = photos[0]
          return (
            <Reveal key={category.slug} className="border-t border-white/8 py-7 md:py-8">
              <Link
                to={`/portfolio/${category.slug}`}
                className="group grid gap-5 md:grid-cols-12 md:items-center"
              >
                <div className="image-frame overflow-hidden md:col-span-5">
                  <img
                    src={cover.src}
                    srcSet={cover.srcSet}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    alt={cover.alt}
                    width={cover.width}
                    height={cover.height}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    style={{ aspectRatio: cover.aspectRatio }}
                    className="w-full object-cover transition-opacity duration-500 group-hover:opacity-90"
                  />
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <span className="plate">0{index + 1} · {category.eyebrow}</span>
                  <h2 className="mt-3 font-serif text-3xl italic leading-none tracking-[-0.02em] md:text-5xl">
                    {category.name}
                  </h2>
                  <p className="mt-4 max-w-lg text-[0.92rem] leading-7 text-mist">{category.description}</p>
                  <span className="arrow-link mt-5">
                    {String(photos.length).padStart(2, '0')} photographs
                  </span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </>
  )
}
