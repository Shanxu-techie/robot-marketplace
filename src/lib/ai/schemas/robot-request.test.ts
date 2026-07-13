import { describe, expect, it } from 'vitest'
import { recommendationRequestSchema } from './robot-request'

const validRequest = {
  categoryId: 1,
  budget: 20000,
  environment: 'indoor',
  useCase: 'Automate warehouse package movement',
  payload: 'Up to 40 kg',
}

describe('recommendationRequestSchema', () => {
  describe('valid request', () => {
    it('accepts a valid recommendation request', () => {
      const result = recommendationRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })
  })

  describe('categoryId validation', () => {
    it('accepts the minimum valid categoryId', () => {
      const request = {
        ...validRequest,
        categoryId: 1,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('rejects zero categoryId', () => {
      const request = {
        ...validRequest,
        categoryId: 0,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects negative categoryId', () => {
      const request = {
        ...validRequest,
        categoryId: -1,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects decimal categoryId', () => {
      const request = {
        ...validRequest,
        categoryId: 1.5,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects invalid string categoryId', () => {
      const request = {
        ...validRequest,
        categoryId: 'abc123',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })
  })

  describe('budget validation', () => {
    const MAX_BUDGET = 100_000
    it('accepts the minimum valid budget', () => {
      const request = {
        ...validRequest,
        budget: 1,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('accepts the maximum allowed budget', () => {
      const request = {
        ...validRequest,
        budget: MAX_BUDGET,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('rejects zero budget', () => {
      const request = {
        ...validRequest,
        budget: 0,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects negative budget', () => {
      const request = {
        ...validRequest,
        budget: -1,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects budget above maximum', () => {
      const request = {
        ...validRequest,
        budget: MAX_BUDGET + 1,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })
  })

  describe('environment validation', () => {
    it('accepts indoor environment', () => {
      const request = {
        ...validRequest,
        environment: 'indoor',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('accepts outdoor environment', () => {
      const request = {
        ...validRequest,
        environment: 'outdoor',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('accepts both environment', () => {
      const request = {
        ...validRequest,
        environment: 'both',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('rejects unsupported environment values', () => {
      const request = {
        ...validRequest,
        environment: 'warehouse',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })
  })

  describe('useCase validation', () => {
    it('accepts useCase at 10 characters boundary', () => {
      const request = {
        ...validRequest,
        useCase: '0123456789',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('accepts useCase at maximum length boundary', () => {
      const request = {
        ...validRequest,
        useCase: '0123456789'.repeat(50),
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('rejects useCase below minimum length', () => {
      const request = {
        ...validRequest,
        useCase: '012345678',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects useCase above maximum length', () => {
      const request = {
        ...validRequest,
        useCase: '0123456789'.repeat(50) + '1',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects whitespace-only useCase after trimming', () => {
      const request = {
        ...validRequest,
        useCase: '  ',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })
  })

  describe('payload validation', () => {
    it('accepts omitted optional payload', () => {
      const request = {
        categoryId: validRequest.categoryId,
        budget: validRequest.budget,
        environment: validRequest.environment,
        useCase: validRequest.useCase,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('accepts payload at minimum length boundary', () => {
      const request = {
        ...validRequest,
        payload: '1',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('accepts payload at maximum length boundary', () => {
      const request = {
        ...validRequest,
        payload: '0123456789'.repeat(10),
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })

    it('rejects empty payload', () => {
      const request = {
        ...validRequest,
        payload: '',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects payload above maximum length', () => {
      const request = {
        ...validRequest,
        payload: '0123456789'.repeat(10) + '1',
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })
  })

  describe('required fields', () => {
    it('rejects missing required categoryId', () => {
      const request = {
        budget: validRequest.budget,
        environment: validRequest.environment,
        useCase: validRequest.useCase,
        payload: validRequest.payload,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects missing required budget', () => {
      const request = {
        categoryId: validRequest.categoryId,
        environment: validRequest.environment,
        useCase: validRequest.useCase,
        payload: validRequest.payload,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects missing required environment', () => {
      const request = {
        categoryId: validRequest.categoryId,
        budget: validRequest.budget,
        useCase: validRequest.useCase,
        payload: validRequest.payload,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })

    it('rejects missing required useCase', () => {
      const request = {
        categoryId: validRequest.categoryId,
        budget: validRequest.budget,
        environment: validRequest.environment,
        payload: validRequest.payload,
      }
      const result = recommendationRequestSchema.safeParse(request)
      expect(result.success).toBe(false)
    })
  })
})
