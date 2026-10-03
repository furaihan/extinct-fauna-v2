import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { LogOutIcon, PencilIcon, TrophyIcon, UserCheckIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { Separator } from '@/shared/ui/separator.tsx'
import { getProfileFn } from '@/modules/user/server/user.functions.ts'
import { userKeys } from '@/modules/user/query-keys.ts'
import { useLogout } from '@/modules/auth/components/use-logout.ts'

export function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: userKeys.profile,
    queryFn: () => getProfileFn(),
  })
  const { logout, loggingOut } = useLogout()

  if (isLoading) {
    return (
      <div className="page-wrap flex flex-col gap-6 py-12">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
    )
  }

  const profile = data?.profile
  const quizzes = data?.quizzes ?? []
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') ||
    profile?.username ||
    'Anonim'

  return (
    <div className="page-wrap flex flex-col gap-8 py-12">
      <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-primary px-8 py-10 text-primary-foreground">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <Avatar className="size-24 border-2 border-white/20">
              <AvatarFallback className="bg-white/15 text-3xl font-black text-primary-foreground">
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-black">
                  {fullName}
                </h1>
                <Badge variant="secondary" className="bg-white/20 text-primary-foreground border-0">
                  <UserCheckIcon className="size-3 mr-1" />
                  Aktif
                </Badge>
              </div>
              <p className="text-primary-foreground/90 max-w-xl text-sm">
                {profile?.bio || 'Belum ada bio. Lengkapi profilmu agar sobat fauna lainnya mengenalimu.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="secondary"
                className="font-bold rounded-full bg-white text-primary hover:bg-white/90"
                render={<Link to="/profile/edit" />}
                nativeButton={false}
              >
                <PencilIcon data-icon="inline-start" />
                Edit Profil
              </Button>
              <Button
                variant="outline"
                className="font-bold rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20"
                disabled={loggingOut}
                onClick={() => void logout()}
              >
                <LogOutIcon data-icon="inline-start" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="rounded-2xl border bg-card shadow-sm md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <InfoRow label="Username" value={profile?.username ?? '-'} />
            <Separator />
            <InfoRow label="Email" value={profile?.email ?? '-'} />
            <Separator />
            <InfoRow label="Nomor Telepon" value={profile?.phone ?? '-'} />
            <Separator />
            <InfoRow label="Alamat" value={profile?.address ?? '-'} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card shadow-sm md:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold">Riwayat Kuis Terakhir</CardTitle>
            <Badge variant="secondary" className="rounded-full">
              <TrophyIcon className="size-3.5 mr-1 text-amber-500" />
              Skor Terbaik
            </Badge>
          </CardHeader>
          <CardContent>
            {quizzes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Belum ada riwayat kuis yang diselesaikan.
                </p>
                <Button
                  size="sm"
                  className="rounded-full font-bold mt-2"
                  render={<Link to="/explore" />}
                  nativeButton={false}
                >
                  Mulai Kuis Pertama
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.quizId}
                    className="flex items-center justify-between rounded-xl border p-4 bg-muted/20 transition-colors hover:bg-muted/40"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm">
                        {quiz.animalName ?? 'Satwa'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quiz.time).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <Badge className="rounded-full px-3 py-1 text-xs font-bold">
                      Skor {quiz.score}/5
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="break-words font-medium">{value}</span>
    </div>
  )
}
