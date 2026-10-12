import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { Seo } from '../components/Seo'
import { categories, getPhotosByCategory } from '../data/photography'

export function PortfolioPage() {
  return (
    <>
      <Seo
        title="Portfolio — JJM Photography"
        description="Explore landscape, atmospheric street, architecture, fine-art, and documentary photography by JJM Photography."
      />
      <header className="page-shell pb-18 pt-40 md:pb-28 md:pt-52">
        <Reveal>
          <p className="eyebrow">Selected work · 2024—2026</p>
          <h1 className="mt-7 max-w-5xl font-serif text-[clamp(4.5rem,11vw,11rem)] leading-[0.8] tracking-[-0.045em]">
            Portfolio
          </h1>
          <p className="ml-auto mt-12 max-w-xl text-lg leading-8 text-mist">
            Five evolving collections exploring the natural world, city atmosphere, built space, personal studies, and the human moments found between.
          </p>
        </Reveal>
      </header>

      <div className="page-shell pb-28 md:pb-40">
        {categories.map((category, index) => {
          const cover = getPhotosByCategory(category.slug)[0]
          return (
            <Reveal key={category.slug} className="border-t border-white/12 py-10 md:py-16">
              <Link
                to={`/portfolio/${category.slug}`}
                className="group grid gap-8 md:grid-cols-12 md:items-center"
              >
                <div className="overflow-hidden bg-white/4 md:col-span-6">
                  <img
                    src={cover.src}
                    srcSet={cover.srcSet}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt={cover.alt}
                    width={cover.width}
                    height={cover.height}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <span className="eyebrow">0{index + 1} · {category.eyebrow}</span>
                  <h2 className="mt-5 font-serif text-4xl leading-none md:text-6xl">{category.name}</h2>
                  <p className="mt-6 max-w-lg text-[0.95rem] leading-7 text-mist">{category.description}</p>
                  <span className="arrow-link mt-8">
                    View collection <ArrowUpRight size={16} />
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
