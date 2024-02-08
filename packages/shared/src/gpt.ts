export type GptModel =
  | 'gpt-4-1106-preview'
  | 'gpt-4-vision-preview'
  | 'gpt-4'
  | 'gpt-4-32k'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-3.5-turbo-1106'

export const MAX_TOKENS_BY_MODEL: Record<GptModel, number> = {
  'gpt-3.5-turbo-1106': 16_385,
  'gpt-3.5-turbo-16k': 16_385,
  'gpt-3.5-turbo': 4_096,
  'gpt-4-1106-preview': 128_000,
  'gpt-4-32k': 32_768,
  'gpt-4-vision-preview': 128_000,
  'gpt-4': 8192,
}
