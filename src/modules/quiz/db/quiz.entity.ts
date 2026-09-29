import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { newId } from '@/lib/id.lib.ts'
import type { User } from '@/modules/auth/db/user.entity.ts'
import type { Animal } from '@/modules/animal/db/animal.entity.ts'
import type { QuizDetail } from './quiz-detail.entity.ts'

@Entity({ name: 'quizzes' })
export class Quiz {
  @PrimaryColumn('uuid')
  quiz_id: string = newId()

  @Column('uuid', { name: 'user_id' })
  user_id!: string

  @Column('int', { name: 'animal_id' })
  animal_id!: number

  @Column('int', { default: 0 })
  score!: number

  @Column('timestamp', { default: () => 'now()' })
  time!: Date

  @ManyToOne('User', 'quizzes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @ManyToOne('Animal', 'quizzes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animal_id' })
  animal!: Animal

  @OneToMany('QuizDetail', 'quiz')
  details!: QuizDetail[]
}
