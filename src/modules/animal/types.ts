export interface AnimalListItem {
  animal_id: number
  animal_name: string
  image: string | null
}

export interface AnimalDetail {
  animal_id: number
  animal_name: string
  latin_name: string
  family_name: string
  order_name: string | null
  image: string | null
  description: string | null
  title: string | null
}

export interface RandomAnimalFact {
  animal_id: number
  animal_name: string
  image: string | null
  fun_fact: string | null
}
