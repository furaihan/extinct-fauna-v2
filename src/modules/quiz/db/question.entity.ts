import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { newId } from '@/lib/id.lib.ts'
import type { Animal } from '@/modules/animal/db/animal.entity.ts'
import type { QuizDetail } from './quiz-detail.entity.ts'

export type CorrectAnswer = 'option_1' | 'option_2' | 'option_3'

@Entity({ name: 'questions' })
export class Question {
  @PrimaryColumn('uuid')
  question_id: string = newId()

  @Column('int', { name: 'animal_id' })
  animal_id!: number

  @Column('text')
  question!: string

  @Column('varchar', { length: 2048, name: 'option_1' })
  option_1!: string

  @Column('varchar', { length: 2048, name: 'option_2' })
  option_2!: string

  @Column('varchar', { length: 2048, name: 'option_3' })
  option_3!: string

  @Column('enum', {
    enum: ['option_1', 'option_2', 'option_3'],
    name: 'correct_answer',
    enumName: 'questions_correct_answer_enum',
    nullable: true,
  })
  correct_answer!: CorrectAnswer | null

  @ManyToOne('Animal', 'questions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animal_id' })
  animal!: Animal

  @OneToMany('QuizDetail', 'question')
  quizDetails!: QuizDetail[]
}
