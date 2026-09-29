import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { LoginForm } from '@/modules/auth/components/login-form.tsx'
import { redirectIfAuthenticated } from '@/modules/auth/server/guards.ts'

export const Route = createFileRoute('/login')({
  beforeLoad: redirectIfAuthenticated,
  head: () => ({ meta: [{ title: 'Login — Extinct Fauna' }] }),
  component: LoginPage,
})

function LoginPage() {
  return (
    <div
      className="flex min-h-[calc(100dvh-8rem)] items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: 'url(/bacround-signup.jpg)' }}
    >
      <Card className="w-full max-w-md bg-card/95 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Masuk untuk mengikuti kuis dan mengelola profilmu.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/signup" className="font-semibold">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
