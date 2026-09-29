import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { SignupForm } from '@/modules/auth/components/signup-form.tsx'
import { redirectIfAuthenticated } from '@/modules/auth/server/guards.ts'

export const Route = createFileRoute('/signup')({
  beforeLoad: redirectIfAuthenticated,
  head: () => ({ meta: [{ title: 'Sign Up — Extinct Fauna' }] }),
  component: SignupPage,
})

function SignupPage() {
  return (
    <div
      className="flex min-h-[calc(100dvh-8rem)] items-center justify-center bg-cover bg-center px-4 py-12"
      style={{ backgroundImage: 'url(/bacround-signup.jpg)' }}
    >
      <Card className="w-full max-w-md bg-card/95 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Buat akun untuk mulai menjelajah dan bermain kuis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
