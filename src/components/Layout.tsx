import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
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
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/6 bg-ink/80 backdrop-blur-md">
        <div className="page-shell flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-baseline gap-2" aria-label="JJM Photography home">
            <span className="text-[0.78rem] tracking-[0.22em]">JJM</span>
            <span className="text-mist">/</span>
            <span className="hidden text-[0.62rem] uppercase tracking-[0.22em] text-mist transition-colors group-hover:text-stone sm:inline">
              Photographs
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
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
            className="grid size-10 place-items-center md:hidden"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            className="fixed inset-0 z-30 flex bg-ink px-6 pt-28 md:hidden"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink to={item.to} className="font-serif text-4xl">
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content">{children}</main>

      <footer className="border-t border-white/6 py-8">
        <div className="page-shell flex flex-col gap-5 text-[0.8rem] text-mist sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/" className="text-stone tracking-[0.16em]">JJM</Link>
            <p className="mt-1.5">Washington State</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={siteContent.contact.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-stone"
            >
              {siteContent.contact.instagramHandle}
            </a>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
