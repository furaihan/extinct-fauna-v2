export const animalKeys = {
  all: ['animals'] as const,
  list: (filters: { type?: string; region?: string; environment?: string }) =>
    ['animals', 'list', filters] as const,
  detail: (animalId: number) => ['animals', 'detail', animalId] as const,
  random: (count: number) => ['animals', 'random', count] as const,
}
