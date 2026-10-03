import { Link } from '@tanstack/react-router'
import { Separator } from '@/shared/ui/separator.tsx'

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-card border-t text-muted-foreground">
      <div className="page-wrap flex flex-col items-center gap-6 py-10 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Extinct Fauna" className="size-8" />
          <span className="font-heading font-bold text-foreground">
            Extinct Fauna
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-foreground transition-colors">
            Beranda
          </Link>
          <Link to="/explore" className="hover:text-foreground transition-colors">
            Jelajahi
          </Link>
          <Link to="/about" className="hover:text-foreground transition-colors">
            Tentang
          </Link>
        </nav>
      </div>
      <Separator />
      <div className="page-wrap py-5 text-center text-xs text-muted-foreground">
        &copy; Kelompok 8 21-IF-08. All rights reserved.
      </div>
    </footer>
  )
}
