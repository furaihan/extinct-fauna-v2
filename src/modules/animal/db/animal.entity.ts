import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import type { Description } from './description.entity.ts'
import type { Question } from '@/modules/quiz/db/question.entity.ts'
import type { Quiz } from '@/modules/quiz/db/quiz.entity.ts'

export type AnimalType = 'unique' | 'extinct' | 'rare'
export type AnimalEnvironment =
  | 'ampibian'
  | 'aquatic'
  | 'desert'
  | 'forest'
  | 'grassland'
  | 'mountain'
  | 'polar'
  | 'savanna'
  | 'tundra'
  | 'other'
export type AnimalOrigin =
  | 'africa'
  | 'asia'
  | 'australia'
  | 'europe'
  | 'north america'
  | 'south america'
  | 'other'
export type AnimalOrder =
  | 'carnivore'
  | 'herbivore'
  | 'omnivore'
  | 'insectivore'
  | 'other'

@Entity({ name: 'animals' })
export class Animal {
  @PrimaryGeneratedColumn({ type: 'int', name: 'animal_id' })
  animal_id!: number

  @Column('varchar', { length: 255, name: 'animal_name' })
  animal_name!: string

  @Column('enum', {
    enum: ['unique', 'extinct', 'rare'],
    name: 'animal_type',
    enumName: 'animals_animal_type_enum',
  })
  animal_type!: AnimalType

  @Column('enum', {
    enum: [
      'ampibian',
      'aquatic',
      'desert',
      'forest',
      'grassland',
      'mountain',
      'polar',
      'savanna',
      'tundra',
      'other',
    ],
    name: 'animal_environment',
    enumName: 'animals_animal_environment_enum',
  })
  animal_environment!: AnimalEnvironment

  @Column('enum', {
    enum: [
      'africa',
      'asia',
      'australia',
      'europe',
      'north america',
      'south america',
      'other',
    ],
    name: 'animal_origin',
    enumName: 'animals_animal_origin_enum',
  })
  animal_origin!: AnimalOrigin

  @Column('varchar', { length: 255, name: 'latin_name', default: '' })
  latin_name!: string

  @Column('varchar', { length: 255, name: 'family_name', default: '' })
  family_name!: string

  @Column('enum', {
    enum: ['carnivore', 'herbivore', 'omnivore', 'insectivore', 'other'],
    name: 'order_name',
    enumName: 'animals_order_name_enum',
    nullable: true,
  })
  order_name!: AnimalOrder | null

  @OneToOne('Description', 'animal')
  description!: Description

  @OneToMany('Question', 'animal')
  questions!: Question[]

  @OneToMany('Quiz', 'animal')
  quizzes!: Quiz[]
}
