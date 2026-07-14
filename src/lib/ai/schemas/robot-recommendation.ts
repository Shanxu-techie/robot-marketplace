import { z } from 'zod'

export const recommendationSchema = z.object({
  robotId: z
    .number()
    .int()
    .positive()
    .describe(
      'The integer ID of one of the provided candidate robots. It must match the ID of a robot from the candidate list and must not be invented.'
    ),
  matchScore: z
    .int()
    .max(100)
    .min(0)
    .describe(
      "A score from 0 to 100 representing how well this robot matches the user's stated requirements. 100 is a perfect match and 0 is a poor match. Use the full range to meaningfully differentiate between candidates."
    ),
  reason: z
    .string()
    .max(250)
    .min(10)
    .describe(
      'A concise explanation of why this robot is a good match based only on the provided candidate information and the user’s stated requirements. Do not invent facts or include information that was not provided.'
    ),
})

export const recommendationResponseSchema = z
  .object({
    recommendations: z
      .array(recommendationSchema)
      .max(3)
      .min(1)
      .describe(
        'A ranked list of one to three recommended robots ordered from best match to lowest match.'
      ),
  })
  .refine(
    ({ recommendations }) => {
      const robotIds = recommendations.map(({ robotId }) => robotId)
      return robotIds.length === new Set(robotIds).size
    },
    {
      message: 'Recommendations must not contain duplicate robot IDs.',
      path: ['recommendations'],
    }
  )

export type RecommendationResponse = z.infer<
  typeof recommendationResponseSchema
>
export type Recommendation = z.infer<typeof recommendationSchema>
