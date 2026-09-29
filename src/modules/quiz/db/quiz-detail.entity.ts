import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { newId } from '@/lib/id.lib.ts'
import type { Quiz } from './quiz.entity.ts'
import type { Question } from './question.entity.ts'

export type SelectedOption = 'option_1' | 'option_2' | 'option_3' | 'timeout'

@Entity({ name: 'quiz_details' })
export class QuizDetail {
  @PrimaryColumn('uuid')
  detail_id: string = newId()

  @Column('uuid', { name: 'quiz_id' })
  quiz_id!: string

  @Column('uuid', { name: 'question_id' })
  question_id!: string

  @Column('enum', {
    enum: ['option_1', 'option_2', 'option_3', 'timeout'],
    name: 'selected_option',
    enumName: 'quiz_details_selected_option_enum',
  })
  selected_option!: SelectedOption

  @Column('int', { name: 'response_time', nullable: true })
  response_time!: number | null

  @Column('boolean', { name: 'is_correct', nullable: true })
  is_correct!: boolean | null

  @ManyToOne('Quiz', 'details', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id' })
  quiz!: Quiz

  @ManyToOne('Question', 'quizDetails', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Question
}
