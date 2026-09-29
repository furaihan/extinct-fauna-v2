import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm'
import { newId } from '@/lib/id.lib.ts'
import type { User } from './user.entity.ts'

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryColumn('uuid')
  account_id: string = newId()

  @Column('varchar', { length: 255, nullable: true, unique: true })
  email!: string | null

  @Column('varchar', { length: 255, nullable: true })
  password!: string | null

  @Column('timestamp', { name: 'created_at', default: () => 'now()' })
  created_at!: Date

  @OneToOne('User', 'account')
  User!: User
}
