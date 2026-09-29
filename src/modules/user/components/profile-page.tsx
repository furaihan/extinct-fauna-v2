import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { LogOutIcon, PencilIcon, TrophyIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
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
        <Skeleton className="h-40 w-full rounded-4xl" />
        <Skeleton className="h-56 w-full rounded-4xl" />
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
    <div className="page-wrap flex flex-col gap-6 py-10">
      <Card className="overflow-hidden">
        <div className="bg-primary px-6 py-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <Avatar className="size-24">
              <AvatarFallback className="bg-primary-foreground/20 text-3xl font-black text-primary-foreground">
                {fullName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-black text-primary-foreground">
                {fullName}
              </h1>
              <p className="text-primary-foreground/80">
                {profile?.bio || 'Belum ada bio, yuk lengkapi di Edit Profile!'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="font-bold"
                render={<Link to="/profile/edit" />}
                nativeButton={false}
              >
                <PencilIcon data-icon="inline-start" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="font-bold"
                disabled={loggingOut}
                onClick={() => void logout()}
              >
                <LogOutIcon data-icon="inline-start" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Informasi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <InfoRow label="Username" value={profile?.username ?? '-'} />
            <InfoRow label="Email" value={profile?.email ?? '-'} />
            <InfoRow label="Telepon" value={profile?.phone ?? '-'} />
            <InfoRow label="Alamat" value={profile?.address ?? '-'} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Riwayat Kuis Terakhir</CardTitle>
            <Badge variant="secondary">
              <TrophyIcon />
              Highscore
            </Badge>
          </CardHeader>
          <CardContent>
            {quizzes.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada riwayat kuis. Ayo main kuis dulu!
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.quizId}
                    className="flex items-center justify-between rounded-xl border p-4"
                  >
                    <div>
                      <p className="font-semibold">
                        {quiz.animalName ?? 'Hewan'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(quiz.time).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <Badge className="text-sm">
                      Skor {quiz.score}/{5}
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
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="break-words">{value}</span>
    </div>
  )
}
