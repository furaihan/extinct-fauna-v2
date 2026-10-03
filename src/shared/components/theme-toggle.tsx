import { MoonIcon, SunIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button.tsx'
import { useTheme } from '@/shared/hook/use-theme.ts'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Ganti tema"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {theme === 'dark' ? (
        <SunIcon className="size-4 text-amber-400" />
      ) : (
        <MoonIcon className="size-4 text-slate-700" />
      )}
    </Button>
  )
}
