import { z } from 'zod'

export const recommendationRequestSchema = z.object({
  categoryId: z.number().int().positive(),
  // Upper bound leaves room for premium or custom-configured robots beyond the current catalog max (~$35k)
  budget: z.number().positive().max(100_000),
  environment: z.enum(['indoor', 'outdoor', 'both']),
  useCase: z.string().trim().min(10).max(500),
  payload: z.string().trim().min(1).max(100).optional(),
})

export type RecommendationRequest = z.infer<typeof recommendationRequestSchema>
