import { getDb } from '@/db'
import { RecommendationRequest } from '../schemas/robot-request'
import { robots, robotSpecifications } from '@/db/schema'
import { eq, and, asc, desc, sql, isNotNull } from 'drizzle-orm'

export type RecommendationCandidate = {
  id: number
  name: string
  priceFrom: number
  priceTo: number
  keyMetric: string | null
  useCase: string | null
  specifications: {
    label: string
    value: string
  }[]
}

export async function getRecommendationCandidates(
  request: RecommendationRequest
): Promise<RecommendationCandidate[]> {
  const db = getDb()

  const budgetDistance = sql`
  GREATEST(
    ${robots.priceFrom} - ${request.budget},
    ${request.budget} - ${robots.priceTo},
    0
  )
`

  const candidates = await db
    .select({
      id: robots.id,
      name: robots.name,
      priceFrom: robots.priceFrom,
      priceTo: robots.priceTo,
      keyMetric: robots.keyMetric,
      specifications: sql<{ label: string; value: string }[]>`COALESCE(
          json_agg(
            json_build_object('label', ${robotSpecifications.label}, 'value', ${robotSpecifications.value})
            ORDER BY ${robotSpecifications.sortOrder}
          ) FILTER (WHERE ${robotSpecifications.id} IS NOT NULL),
          '[]'
        )`,
    })
    .from(robots)
    .leftJoin(robotSpecifications, eq(robotSpecifications.robotId, robots.id))
    .where(
      and(
        eq(robots.isVisible, true),
        eq(robots.categoryId, request.categoryId),
        isNotNull(robots.priceFrom),
        isNotNull(robots.priceTo)
      )
    )
    .groupBy(
      robots.id,
      robots.name,
      robots.priceFrom,
      robots.priceTo,
      robots.keyMetric
    )
    .orderBy(asc(budgetDistance), desc(robots.featured), asc(robots.id))
    .limit(15)

  return candidates.map((candidate) => {
    // Coupled to the literal "Use Case" label — unenforced by schema.
    // See PROGRESS.md: specification_definitions normalization (deferred).
    const useCase =
      candidate.specifications.find((spec) => spec.label === 'Use Case')
        ?.value ?? null

    return {
      ...candidate,
      priceFrom: Number(candidate.priceFrom),
      priceTo: Number(candidate.priceTo),
      useCase,
    }
  })
}
