import { describe, expect, it } from 'vitest'
import type { RecommendationRequest } from '../schemas/robot-request'
import type { RecommendationCandidate } from '../queries/get-recommendation-candidates'
import { buildRecommendationContext } from './build-recommendation-context'

describe('buildRecommendationContext', () => {
  it('serializes candidate IDs as numbers', () => {
    const request: RecommendationRequest = {
      categoryId: 1,
      budget: 5000,
      environment: 'indoor',
      useCase: 'Warehouse automation',
      payload: '10',
    }
    const candidates: RecommendationCandidate[] = [
      {
        id: 42,
        name: 'Robot Model A',
        priceFrom: 4000,
        priceTo: 6000,
        keyMetric: 'Efficiency',
        useCase: 'Warehouse automation',
        specifications: [
          {
            label: 'Payload Capacity',
            value: '10kg',
          },
        ],
      },
    ]
    const context = buildRecommendationContext(request, candidates)

    expect(context).toContain('"id":42')
    expect(context).not.toContain('"id":"42"')
  })
})
