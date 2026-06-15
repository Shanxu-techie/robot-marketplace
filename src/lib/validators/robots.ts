import { z } from 'zod'

export const robotsQuerySchema = z.object({
  featured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  category: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export type RobotsQuery = z.infer<typeof robotsQuerySchema>