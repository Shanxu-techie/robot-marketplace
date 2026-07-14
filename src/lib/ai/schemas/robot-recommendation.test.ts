import { describe, expect, it } from 'vitest'
import {
  recommendationResponseSchema,
  recommendationSchema,
} from './robot-recommendation'

const validRecommendation = {
  robotId: 1,
  reason: "This robot closely matches the user's requirements.",
  matchScore: 85,
}
describe('recommendationSchema', () => {
  it('accepts a valid recommendation', () => {
    const result = recommendationSchema.safeParse(validRecommendation)
    expect(result.success).toBe(true)
  })
  it('rejects an invalid ID', () => {
    const recommendation = {
      ...validRecommendation,
      robotId: -1,
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
  it('rejects a decimal robot ID', () => {
    const recommendation = {
      ...validRecommendation,
      robotId: 1.5,
    }

    const result = recommendationSchema.safeParse(recommendation)

    expect(result.success).toBe(false)
  })
  it('rejects a robot ID of 0', () => {
    const recommendation = {
      ...validRecommendation,
      robotId: 0,
    }

    const result = recommendationSchema.safeParse(recommendation)

    expect(result.success).toBe(false)
  })
  it('rejects a string robot ID', () => {
    const recommendation = {
      ...validRecommendation,
      robotId: '1',
    }

    const result = recommendationSchema.safeParse(recommendation)

    expect(result.success).toBe(false)
  })
  it('rejects an empty reason', () => {
    const recommendation = {
      ...validRecommendation,
      reason: '',
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
  it('rejects a reason with less than 10 characters', () => {
    const recommendation = {
      ...validRecommendation,
      reason: '123456789',
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
  it('rejects a reason longer than 250 characters', () => {
    const recommendation = {
      ...validRecommendation,
      reason: '1234567890'.repeat(25) + '1',
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
  it('accepts a 10-character reason', () => {
    const recommendation = {
      ...validRecommendation,
      reason: '1234567890',
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(true)
  })
  it('accepts a 250-character reason', () => {
    const recommendation = {
      ...validRecommendation,
      reason: '1234567890'.repeat(25),
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(true)
  })
  it('rejects a score above 100', () => {
    const recommendation = {
      ...validRecommendation,
      matchScore: 101,
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
  it('accepts a score of 100', () => {
    const recommendation = {
      ...validRecommendation,
      matchScore: 100,
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(true)
  })
  it('rejects a score below 0', () => {
    const recommendation = {
      ...validRecommendation,
      matchScore: -1,
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
  it('accepts a score of 0', () => {
    const recommendation = {
      ...validRecommendation,
      matchScore: 0,
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(true)
  })
  it('rejects a decimal score', () => {
    const recommendation = {
      ...validRecommendation,
      matchScore: 56.7,
    }
    const result = recommendationSchema.safeParse(recommendation)
    expect(result.success).toBe(false)
  })
})
const validResponse = {
  recommendations: [validRecommendation],
}
describe('recommendationResponseSchema', () => {
  it('accepts a valid response', () => {
    const result = recommendationResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })
  it('rejects an empty recommendations array', () => {
    const response = {
      ...validResponse,
      recommendations: [],
    }
    const result = recommendationResponseSchema.safeParse(response)
    expect(result.success).toBe(false)
  })
  it('rejects more than three recommendations', () => {
    const response = {
      ...validResponse,
      recommendations: [
        validRecommendation,
        validRecommendation,
        validRecommendation,
        validRecommendation,
      ],
    }
    const result = recommendationResponseSchema.safeParse(response)
    expect(result.success).toBe(false)
  })
  it('accepts three recommendations', () => {
    const response = {
      ...validResponse,
      recommendations: [
        validRecommendation,
        validRecommendation,
        validRecommendation,
      ],
    }
    const result = recommendationResponseSchema.safeParse(response)
    expect(result.success).toBe(true)
  })
  it('rejects a response missing a required field', () => {
    const recommendation = {
      reason: validRecommendation.reason,
      matchScore: validRecommendation.matchScore,
    }
    const response = {
      ...validResponse,
      recommendations: [
        {
          ...recommendation,
        },
      ],
    }
    const result = recommendationResponseSchema.safeParse(response)
    expect(result.success).toBe(false)
  })
  it('rejects a response containing an invalid recommendation', () => {
    const response = {
      ...validResponse,
      recommendations: [
        {
          ...validRecommendation,
          robotId: -1,
        },
      ],
    }
    const result = recommendationResponseSchema.safeParse(response)
    expect(result.success).toBe(false)
  })
})
