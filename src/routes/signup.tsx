import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { SignupForm } from '@/modules/auth/components/signup-form.tsx'
import { redirectIfAuthenticated } from '@/modules/auth/server/guards.ts'

export const Route = createFileRoute('/signup')({
  beforeLoad: redirectIfAuthenticated,
  head: () => ({ meta: [{ title: 'Daftar — Extinct Fauna' }] }),
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-md rounded-2xl border bg-card shadow-lg p-2">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-heading text-2xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
          <CardDescription>
            Daftarkan dirimu untuk mulai menjelajah dan bermain kuis satwa.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground pt-2 border-t">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
