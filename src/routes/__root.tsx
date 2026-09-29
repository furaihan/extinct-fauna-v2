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
      <div className="max-w-md">
        <div className="text-6xl">⚠️</div>
        <h1 className="mt-3 text-xl font-black">Terjadi Kesalahan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : 'Kesalahan sistem tidak terduga.'}
        </p>
        <Button
          className="mt-5 font-bold"
          render={<Link to="/" />}
          nativeButton={false}
        >
          KEMBALI KE BERANDA
        </Button>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-dvh w-full place-items-center bg-background p-6 text-center">
      <div className="max-w-md">
        <div className="text-6xl">🧭</div>
        <h1 className="mt-3 text-xl font-black">Halaman tidak ditemukan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alamat yang Anda buka tidak tersedia.
        </p>
        <Button
          className="mt-5 font-bold"
          render={<Link to="/" />}
          nativeButton={false}
        >
          KEMBALI KE BERANDA
        </Button>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="flex min-h-dvh flex-col bg-background">
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
