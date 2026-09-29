import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm'
import { newId } from '@/lib/id.lib.ts'
import type { Account } from './account.entity.ts'
import type { Quiz } from '@/modules/quiz/db/quiz.entity.ts'

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn('uuid')
  user_id: string = newId()

  @Column('uuid', { name: 'account_id' })
  account_id!: string

  @Column('varchar', { length: 255, nullable: true, unique: true })
  username!: string | null

  @Column('varchar', { length: 255, nullable: true })
  first_name!: string | null

  @Column('varchar', { length: 255, nullable: true })
  last_name!: string | null

  @Column('text', { nullable: true })
  bio!: string | null

  @Column('varchar', { length: 255, nullable: true })
  address!: string | null

  @Column('varchar', { length: 255, nullable: true })
  phone!: string | null

  @ManyToOne('Account', 'User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account!: Account

  @OneToMany('Quiz', 'user')
  quizzes!: Quiz[]
}
