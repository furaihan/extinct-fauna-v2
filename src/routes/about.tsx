import { createFileRoute } from '@tanstack/react-router'
import { PhoneIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card.tsx'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar.tsx'
import { Badge } from '@/shared/ui/badge.tsx'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'About — Extinct Fauna' }] }),
  component: AboutPage,
})

const MEMBERS = [
  { name: 'Muhammad Zhafar Al Fathi', role: 'Backend', phone: '+62 895-1497-6015' },
  { name: 'Aric Yohanes', role: 'Frontend', phone: '+62 823-7955-2087' },
  { name: 'Hamim Nur Khamid', role: 'Frontend', phone: '+62 821-3325-6573' },
  { name: 'Nabella Ayu Giwanti', role: 'Frontend / UI-UX', phone: '+62 895-3846-48816' },
  { name: 'Nur Azizah', role: 'Frontend / UI-UX', phone: '+62 898-1063-020' },
  { name: 'Unik Trisetyowati', role: 'Frontend / UI-UX', phone: '+62 821-3400-3946' },
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
    <div>
      <section
        className="flex h-[60vh] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/homie.jpg)' }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center bg-black/50 px-4 text-center">
          <p className="font-heading text-5xl font-black text-white sm:text-6xl">
            About
          </p>
          <p className="mt-3 text-lg text-white/90 text-balance">
            Discover Our Values, Our Team and Our Accomplishments
          </p>
        </div>
      </section>

      <section className="page-wrap grid gap-10 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-8">
          <div className="grid overflow-hidden rounded-2xl border sm:grid-cols-[30%_1fr]">
            <div className="flex items-center justify-center bg-neutral-700 p-6 text-center font-heading text-xl font-bold text-white">
              Our Goal
            </div>
            <div className="flex items-center p-6 text-muted-foreground">
              is the conservation of endangered species and ecosystems on a
              global scale.
            </div>
          </div>
          <div className="flex flex-col gap-5 leading-relaxed text-muted-foreground">
            {PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <aside>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                Members of the Group
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {MEMBERS.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part.charAt(0))
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{member.name}</p>
                    <Badge variant="secondary" className="mt-0.5">
                      {member.role}
                    </Badge>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <PhoneIcon className="size-3" />
                      {member.phone}
                    </p>
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
