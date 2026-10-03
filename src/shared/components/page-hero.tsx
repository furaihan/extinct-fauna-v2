import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: ReactNode
  bgImage?: string
  breadcrumb?: ReactNode
}

export function PageHero({ title, subtitle, bgImage = '/homie.jpg', breadcrumb }: Props) {
  return (
    <section className="relative flex min-h-[min(42svh,400px)] items-center justify-start overflow-hidden">
      <img
        src={bgImage}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="page-wrap relative z-10 flex w-full flex-col gap-3 py-16 text-white">
        {breadcrumb && <div className="text-sm text-white/80">{breadcrumb}</div>}
        <h1 className="font-heading text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-lg text-white/90 text-balance font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
