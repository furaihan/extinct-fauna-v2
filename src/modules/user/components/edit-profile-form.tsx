import { useEffect, useState } from 'react'
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

const draftSchema = z.object({
  firstName: z.string().max(30, 'Maksimal 30 karakter.'),
  lastName: z.string().max(30, 'Maksimal 30 karakter.'),
  phone: z
    .string()
    .max(20)
    .refine(
      (v) => v === '' || /^(0|\+62)(\d{8,15})$/.test(v),
      'Nomor telepon tidak valid.',
    ),
  address: z.string().max(255, 'Maksimal 255 karakter.'),
  bio: z.string().max(1023, 'Maksimal 1023 karakter.'),
})

export function EditProfileForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: userKeys.profile,
    queryFn: () => getProfileFn(),
  })

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof draftSchema>) =>
      updateProfileFn({ data: values }),
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
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      bio: '',
    },
    validators: { onChange: draftSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
    },
  })

  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    if (initialized || !data?.profile) return
    form.reset({
      firstName: data.profile.firstName ?? '',
      lastName: data.profile.lastName ?? '',
      phone: data.profile.phone ?? '',
      address: data.profile.address ?? '',
      bio: data.profile.bio ?? '',
    })
    setInitialized(true)
  }, [data, form, initialized])

  if (isLoading) {
    return (
      <div className="page-wrap py-12">
        <Skeleton className="h-96 w-full rounded-4xl" />
      </div>
    )
  }

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
