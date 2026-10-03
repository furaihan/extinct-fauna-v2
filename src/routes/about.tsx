import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar.tsx'
import { Badge } from '@/shared/ui/badge.tsx'
import { PageHero } from '@/shared/components/page-hero.tsx'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'Tentang — Extinct Fauna' }] }),
  component: AboutPage,
})

const MEMBERS = [
  { name: 'Muhammad Zhafar Al Fathi', role: 'Backend' },
  { name: 'Aric Yohanes', role: 'Frontend' },
  { name: 'Hamim Nur Khamid', role: 'Frontend' },
  { name: 'Nabella Ayu Giwanti', role: 'Frontend / UI-UX' },
  { name: 'Nur Azizah', role: 'Frontend / UI-UX' },
  { name: 'Unik Trisetyowati', role: 'Frontend / UI-UX' },
]

const PARAGRAPHS = [
  'Welcome to our page dedicated to raising awareness about endangered animals and the importance of their conservation. At Extinct Fauna, we believe that every creature on this planet plays a vital role in maintaining our ecosystems.',
  'Our mission is to educate and inspire individuals to protect these magnificent creatures.',
  'We are a passionate team of animal lovers and conservationists committed to preserving biodiversity. Through our efforts, we strive to provide a platform for knowledge-sharing and advocacy. Together, we can make a difference in safeguarding endangered species for future generations.',
  'Through our page, we showcase the incredible diversity of endangered animals. From majestic big cats to gentle giants, we shed light on their plight and the threats they face. Our aim is to foster understanding and empathy towards these animals and their role in maintaining the health of our planet.',
  'In addition to spreading awareness, we actively collaborate with local communities, researchers, and conservation organizations. We raise funds for habitat restoration, anti-poaching measures, and education programs. Together, we work towards a sustainable future where humans and endangered animals coexist harmoniously.',
]

function AboutPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Tentang Extinct Fauna"
        subtitle="Mengenal misi konservasi, nilai-nilai, dan tim di balik platform pelestarian satwa langka."
        bgImage="/homie.jpg"
      />

      <section className="page-wrap grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <div className="flex overflow-hidden rounded-2xl border bg-card shadow-sm sm:flex-row flex-col">
            <div className="flex items-center justify-center bg-primary p-6 text-center font-heading text-xl font-bold text-primary-foreground sm:w-1/3">
              Misi Kami
            </div>
            <div className="flex items-center p-6 text-muted-foreground leading-relaxed sm:w-2/3">
              Konservasi spesies terancam punah dan pelestarian ekosistem di seluruh dunia melalui edukasi dan kolaborasi global.
            </div>
          </div>
          <div className="flex flex-col gap-6 leading-relaxed text-muted-foreground text-base">
            {PARAGRAPHS.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside>
          <Card className="rounded-2xl border bg-card shadow-sm h-fit">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center">
                Tim Pengembang
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {MEMBERS.map((member) => (
                <div key={member.name} className="flex items-center gap-3.5 p-2 rounded-xl transition-colors hover:bg-muted/50">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {member.name
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part.charAt(0))
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-sm">{member.name}</p>
                    <Badge variant="secondary" className="mt-1 rounded-full text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  )
}
