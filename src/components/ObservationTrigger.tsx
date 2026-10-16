import { Camera } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function ObservationTrigger() {
  const { pathname } = useLocation()

  if (pathname === '/challenges') return null

  return (
    <Link to="/challenges" className="observation-trigger" aria-label="Open the observation engine">
      <Camera size={18} strokeWidth={1.35} />
    </Link>
  )
}
