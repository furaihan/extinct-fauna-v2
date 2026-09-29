import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Animal } from './animal.entity.ts'

@Entity({ name: 'descriptions' })
export class Description {
  @PrimaryGeneratedColumn({ type: 'int', name: 'description_id' })
  description_id!: number

  @Column('int', { name: 'animal_id' })
  animal_id!: number

  @Column('varchar', { length: 255, nullable: true })
  title!: string | null

  @Column('text', { nullable: true })
  description!: string | null

  @Column('varchar', { length: 255, nullable: true })
  image!: string | null

  @Column('text', { name: 'fun_fact', nullable: true })
  fun_fact!: string | null

  @OneToOne('Animal', 'description', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'animal_id' })
  animal!: Animal
}
