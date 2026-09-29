import { useState } from 'react'
import { Link } from '@tanstack/react-router'
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

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/about', label: 'About' },
] as const

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { logout, loggingOut } = useLogout()
  const isLoggedIn = session?.isAuthenticated ?? false

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="page-wrap flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Extinct Fauna" className="size-9" />
          <span className="font-heading text-lg font-bold tracking-tight">
            Extinct Fauna
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.to}
              variant="ghost"
              render={<Link to={item.to} />}
              nativeButton={false}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" className="gap-2 font-semibold">
                    <UserIcon data-icon="inline-start" />
                    {session?.user?.username ?? 'Akun'}
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {session?.user?.username ?? 'Pengguna'}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link to="/profile" />}>
                  <UserIcon />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={loggingOut}
                  onClick={() => void logout()}
                >
                  <LogOutIcon />
                  {loggingOut ? 'Keluar…' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                render={<Link to="/login" />}
                nativeButton={false}
              >
                Login
              </Button>
              <Button render={<Link to="/signup" />} nativeButton={false}>
                Sign Up
              </Button>
            </div>
          )}

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Buka menu"
                >
                  <MenuIcon />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.to}
                    variant="ghost"
                    className="justify-start"
                    render={<Link to={item.to} onClick={() => setMenuOpen(false)} />}
                    nativeButton={false}
                  >
                    {item.label}
                  </Button>
                ))}
                <Separator className="my-2" />
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      render={
                        <Link to="/profile" onClick={() => setMenuOpen(false)} />
                      }
                      nativeButton={false}
                    >
                      Profil
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-destructive"
                      disabled={loggingOut}
                      onClick={() => void logout()}
                    >
                      <LogOutIcon data-icon="inline-start" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      render={
                        <Link to="/login" onClick={() => setMenuOpen(false)} />
                      }
                      nativeButton={false}
                    >
                      Login
                    </Button>
                    <Button
                      render={
                        <Link to="/signup" onClick={() => setMenuOpen(false)} />
                      }
                      nativeButton={false}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
