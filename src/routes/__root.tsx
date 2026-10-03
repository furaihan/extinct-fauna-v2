import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { TriangleAlertIcon, CompassIcon } from 'lucide-react'
import { queryClient } from '@/shared/lib/query-client.ts'
import { Toaster } from '@/shared/ui/toast.tsx'
import { Button } from '@/shared/ui/button.tsx'
import { SiteHeader } from '@/shared/components/site-header.tsx'
import { SiteFooter } from '@/shared/components/site-footer.tsx'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: 'Extinct Fauna' },
      {
        name: 'description',
        content:
          'Jelajahi fauna langka dan punah di seluruh dunia, dan uji pengetahuanmu lewat kuis singkat.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RootError,
})

function RootError({ error }: ErrorComponentProps) {
  return (
    <div className="grid min-h-dvh w-full place-items-center bg-background p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlertIcon className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Terjadi Kesalahan</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error instanceof Error
            ? error.message
            : 'Kesalahan sistem tidak terduga.'}
        </p>
        <Button
          className="mt-2 font-bold rounded-full"
          render={<Link to="/" />}
          nativeButton={false}
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-dvh w-full place-items-center bg-background p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <CompassIcon className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Halaman tidak ditemukan</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
        </p>
        <Button
          className="mt-2 font-bold rounded-full"
          render={<Link to="/" />}
          nativeButton={false}
        >
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
