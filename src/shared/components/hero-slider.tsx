import { useEffect, useMemo, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/shared/ui/button.tsx'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/shared/ui/carousel.tsx'

const SLIDES = [
  {
    src: '/homie.jpg',
    caption: 'Hello, Welcome to My Jungle',
  },
  {
    src: '/berang-berang.jpg',
    caption: 'Meet Our Unique Animal',
  },
  {
    src: '/takahe.jpg',
    caption: 'Explore the Fauna around the World',
  },
]

export function HeroSlider() {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)

  const opts = useMemo(() => ({ align: 'start' as const, loop: true }), [])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on('select', onSelect).on('reInit', onSelect)
    const interval = setInterval(() => api.scrollNext(), 4500)
    return () => {
      clearInterval(interval)
      api.off('select', onSelect).off('reInit', onSelect)
    }
  }, [api])

  return (
    <section className="relative">
      <Carousel className="group" opts={opts} setApi={setApi}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.src} className="relative">
              <div className="relative h-[70vh] w-full">
                <img
                  src={slide.src}
                  alt={slide.caption}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  <h1 className="font-heading text-3xl font-black text-white text-balance sm:text-5xl">
                    {slide.caption}
                  </h1>
                  <p className="mt-3 max-w-xl text-white/85">
                    Kenali fauna langka dan punah di seluruh dunia, lalu uji
                    pengetahuanmu.
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Slide ${index + 1}`}
              aria-current={current === index}
              onClick={() => api?.scrollTo(index)}
              className={
                'h-1.5 rounded-full transition-all ' +
                (current === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50')
              }
            />
          ))}
        </div>
      </Carousel>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Gulir ke bawah"
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-white hover:bg-white/10 hover:text-white"
        onClick={() =>
          window.scrollTo({
            top: window.innerHeight * 0.85,
            behavior: 'smooth',
          })
        }
      >
        <ChevronDownIcon />
      </Button>
    </section>
  )
}
