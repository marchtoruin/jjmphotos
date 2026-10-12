import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Aperture, Menu, X } from 'lucide-react'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { siteContent } from '../data/site'

const navItems = [
  { label: 'Work', to: '/portfolio' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export function Layout({ children }: PropsWithChildren) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-ink text-stone">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/8 bg-ink/85 backdrop-blur-md">
        <div className="page-shell flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-baseline gap-3" aria-label="JJM Photography home">
            <span className="text-[1.05rem] font-medium tracking-[0.26em]">JJM</span>
            <span className="hidden text-[0.7rem] uppercase tracking-[0.3em] text-mist transition-colors group-hover:text-stone sm:inline">
              Photography
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="grid size-11 place-items-center md:hidden"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-30 flex bg-ink px-6 pt-32 md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <NavLink to={item.to} className="font-serif text-5xl">
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">{children}</main>

      <footer className="border-t border-white/10 py-11">
        <div className="page-shell flex flex-col gap-8 text-[0.9375rem] text-mist sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/" className="text-stone">JJM Photography</Link>
            <p className="mt-2">Pacific Northwest / Washington State</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={siteContent.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-stone"
            >
              <Aperture size={15} strokeWidth={1.5} />
              Instagram
            </a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
