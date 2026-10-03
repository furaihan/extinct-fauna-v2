import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { LoginForm } from '@/modules/auth/components/login-form.tsx'
import { redirectIfAuthenticated } from '@/modules/auth/server/guards.ts'

interface LoginSearch {
  redirect?: string
}

export const Route = createFileRoute('/login')({
  beforeLoad: redirectIfAuthenticated,
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    const raw = typeof search.redirect === 'string' ? search.redirect : undefined
    // Sanitize redirect: must start with single '/' and not '//' to prevent open redirect
    if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
      return { redirect: raw }
    }
    return {}
  },
  head: () => ({ meta: [{ title: 'Masuk — Extinct Fauna' }] }),
  component: LoginPage,
})

function LoginPage() {
  const { redirect } = Route.useSearch()

  return (
    <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-md rounded-2xl border bg-card shadow-lg p-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-heading text-2xl font-bold tracking-tight">Masuk</CardTitle>
          <CardDescription>
            Masuk untuk mengikuti kuis dan mengelola profil konservasimu.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <LoginForm redirectTo={redirect} />
          <p className="text-center text-sm text-muted-foreground pt-2 border-t">
            Belum punya akun?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
