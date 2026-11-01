import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { Button } from '@/shared/ui/button.tsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { FieldGroup } from '@/shared/ui/field.tsx'
import { Skeleton } from '@/shared/ui/skeleton.tsx'
import { toast } from '@/shared/ui/toast.tsx'
import { useAppForm } from '@/shared/form/index.ts'
import { friendlyServerError } from '@/shared/lib/errors.ts'
import { getProfileFn, updateProfileFn } from '@/modules/user/server/user.functions.ts'
import { userKeys } from '@/modules/user/query-keys.ts'
import type { UserProfile } from '@/modules/user/types.ts'

const draftSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(30, 'Maksimal 30 karakter.')
    .refine((v) => v === '' || v.length >= 2, 'Minimal 2 karakter.'),
  lastName: z
    .string()
    .trim()
    .max(30, 'Maksimal 30 karakter.')
    .refine((v) => v === '' || v.length >= 2, 'Minimal 2 karakter.'),
  phone: z
    .string()
    .trim()
    .max(20)
    .refine(
      (v) => v === '' || /^(0|\+62)(\d{8,15})$/.test(v),
      'Nomor telepon tidak valid.',
    ),
  address: z
    .string()
    .trim()
    .max(255, 'Maksimal 255 karakter.')
    .refine((v) => v === '' || v.length >= 2, 'Minimal 2 karakter.'),
  bio: z
    .string()
    .trim()
    .max(1023, 'Maksimal 1023 karakter.')
    .refine((v) => v === '' || v.length >= 2, 'Minimal 2 karakter.'),
})

type DraftValues = z.infer<typeof draftSchema>

function toFormValues(profile: UserProfile): DraftValues {
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    phone: profile.phone ?? '',
    address: profile.address ?? '',
    bio: profile.bio ?? '',
  }
}

export function EditProfileForm() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: userKeys.profile,
    queryFn: () => getProfileFn(),
    // A stale cache entry would seed the form with outdated values.
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="page-wrap py-12">
        <Skeleton className="h-96 w-full rounded-4xl" />
      </div>
    )
  }

  // No data at all: either the request failed or the profile is missing.
  // A failed *background* refetch keeps the already-seeded form mounted.
  if (!data?.profile) {
    return (
      <div className="page-wrap flex justify-center py-10">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {isError ? 'Gagal memuat profil.' : 'Profil tidak ditemukan.'}
            </p>
            <Button
              type="button"
              variant="outline"
              className="font-bold"
              onClick={() => void refetch()}
            >
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Keyed so a different account never inherits stale draft state.
  return <EditProfileFields key={data.profile.userId} profile={data.profile} />
}

function EditProfileFields({ profile }: { profile: UserProfile }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Captured once at mount: a background refetch must not overwrite edits.
  const [initialValues] = useState<DraftValues>(() => toFormValues(profile))

  const mutation = useMutation({
    mutationFn: (values: DraftValues) => updateProfileFn({ data: values }),
    onSuccess: async () => {
      toast.add({ title: 'Profil tersimpan.', type: 'success' })
      await queryClient.invalidateQueries({ queryKey: userKeys.profile })
      await navigate({ to: '/profile' })
    },
    onError: (e) => {
      toast.add({
        title: friendlyServerError(e, 'Gagal menyimpan profil.'),
        type: 'error',
      })
    },
  })

  const form = useAppForm({
    defaultValues: initialValues,
    validators: { onChange: draftSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
    },
  })

  return (
    <div className="page-wrap flex justify-center py-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
          <CardDescription>
            Email tidak dapat diubah. Perbarui data lainnya di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <form.AppField name="firstName">
                  {(field) => (
                    <field.TextField
                      label="Nama Depan"
                      id="edit-first-name"
                      maxLength={30}
                    />
                  )}
                </form.AppField>
                <form.AppField name="lastName">
                  {(field) => (
                    <field.TextField
                      label="Nama Belakang"
                      id="edit-last-name"
                      maxLength={30}
                    />
                  )}
                </form.AppField>
              </div>
              <form.AppField name="address">
                {(field) => (
                  <field.TextField
                    label="Alamat"
                    id="edit-address"
                    maxLength={255}
                  />
                )}
              </form.AppField>
              <form.AppField name="phone">
                {(field) => (
                  <field.TextField
                    label="Nomor Telepon"
                    id="edit-phone"
                    type="tel"
                    maxLength={20}
                    placeholder="cth: 08123456789"
                  />
                )}
              </form.AppField>
              <form.AppField name="bio">
                {(field) => (
                  <field.TextareaField
                    label="Bio"
                    id="edit-bio"
                    maxLength={1023}
                    rows={4}
                    showCount
                  />
                )}
              </form.AppField>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 font-bold"
                  onClick={() => void navigate({ to: '/profile' })}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex-1 font-bold"
                >
                  {mutation.isPending ? 'MENYIMPAN…' : 'Simpan'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
