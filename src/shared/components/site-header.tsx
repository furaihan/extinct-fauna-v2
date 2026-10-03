import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { LogOutIcon, MenuIcon, UserIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button.tsx'
import { Separator } from '@/shared/ui/separator.tsx'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu.tsx'
import { useSession } from '@/shared/hook/use-session.ts'
import { useLogout } from '@/modules/auth/components/use-logout.ts'
import { ThemeToggle } from '@/shared/components/theme-toggle.tsx'

const NAV_ITEMS = [
  { to: '/', label: 'Beranda' },
  { to: '/explore', label: 'Jelajahi' },
  { to: '/about', label: 'Tentang' },
] as const

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { logout, loggingOut } = useLogout()
  const isLoggedIn = session?.isAuthenticated ?? false
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="page-wrap flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <img src="/logo.svg" alt="Extinct Fauna" className="size-9" />
          <span className="font-heading text-lg font-bold tracking-tight">
            Extinct Fauna
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to))
            return (
              <Button
                key={item.to}
                variant={isActive ? 'secondary' : 'ghost'}
                className="rounded-full font-medium"
                render={<Link to={item.to} />}
                nativeButton={false}
              >
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="gap-2 font-semibold rounded-full">
                    <UserIcon data-icon="inline-start" />
                    {session?.user?.username ?? 'Akun'}
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52 rounded-2xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal text-muted-foreground">
                    Masuk sebagai <strong className="text-foreground">{session?.user?.username}</strong>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link to="/profile" />} className="rounded-xl">
                  <UserIcon />
                  Profil Saya
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={loggingOut}
                  onClick={() => void logout()}
                  className="rounded-xl"
                >
                  <LogOutIcon />
                  {loggingOut ? 'Keluar…' : 'Keluar'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                className="rounded-full"
                render={<Link to="/login" />}
                nativeButton={false}
              >
                Masuk
              </Button>
              <Button
                className="rounded-full font-bold"
                render={<Link to="/signup" />}
                nativeButton={false}
              >
                Daftar
              </Button>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                  aria-label="Buka menu"
                >
                  <MenuIcon />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72 sm:max-w-sm rounded-l-3xl">
              <SheetHeader>
                <SheetTitle className="font-heading text-left text-xl font-bold">Menu Navigasi</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-6">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.to}
                    variant="ghost"
                    className="justify-start rounded-xl text-base h-11"
                    render={<Link to={item.to} onClick={() => setMenuOpen(false)} />}
                    nativeButton={false}
                  >
                    {item.label}
                  </Button>
                ))}
                <Separator className="my-3" />
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start rounded-xl text-base h-11"
                      render={
                        <Link to="/profile" onClick={() => setMenuOpen(false)} />
                      }
                      nativeButton={false}
                    >
                      Profil Saya
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start rounded-xl text-base h-11 text-destructive"
                      disabled={loggingOut}
                      onClick={() => void logout()}
                    >
                      <LogOutIcon data-icon="inline-start" />
                      Keluar
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2.5 mt-2">
                    <Button
                      variant="outline"
                      className="w-full rounded-full h-11 font-semibold"
                      render={
                        <Link to="/login" onClick={() => setMenuOpen(false)} />
                      }
                      nativeButton={false}
                    >
                      Masuk
                    </Button>
                    <Button
                      className="w-full rounded-full h-11 font-bold"
                      render={
                        <Link to="/signup" onClick={() => setMenuOpen(false)} />
                      }
                      nativeButton={false}
                    >
                      Daftar
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
