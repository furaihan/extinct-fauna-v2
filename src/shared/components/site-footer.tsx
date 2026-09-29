import { Link } from '@tanstack/react-router'
import { Separator } from '@/shared/ui/separator.tsx'

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-neutral-900 text-neutral-300">
      <div className="page-wrap flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Extinct Fauna" className="size-8" />
          <span className="font-heading font-semibold text-white">
            Extinct Fauna
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-wide">
          <Link to="/" className="text-neutral-300 hover:text-white">
            Home
          </Link>
          <Link to="/explore" className="text-neutral-300 hover:text-white">
            Explore
          </Link>
          <Link to="/about" className="text-neutral-300 hover:text-white">
            About
          </Link>
        </nav>
      </div>
      <Separator className="bg-white/10" />
      <div className="page-wrap py-4 text-center text-xs text-neutral-400">
        &copy; Kelompok 8 21-IF-08. All rights reserved.
      </div>
    </footer>
  )
}
