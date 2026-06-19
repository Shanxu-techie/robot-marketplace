import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'
import { getRobots } from '@/db/queries/robots'
import { RobotCard } from '@/types/robots'

vi.mock('@/db/queries/robots', () => ({
  getRobots: vi.fn(),
}))

const mockData: RobotCard[] = [
  {
    id: 1,
    name: 'R2D2',
    slug: 'r2d2',
    shortDescription: 'Test robot',
    priceFrom: '1000',
    priceTo: '2000',
    keyMetric: 'Fast',
    featured: true,
    category: { id: 1, name: 'Industrial', slug: 'industrial' },
    vendor: { id: 1, name: 'Acme Robotics', logoUrl: null },
    primaryImage: null,
  },
]

describe('GET /api/robots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('returns data successfully (200)', async () => {
    vi.mocked(getRobots).mockResolvedValue(mockData)

    const req = new NextRequest('http://localhost:3000/api/robots')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toEqual(mockData)

    expect(getRobots).toHaveBeenCalled()
  })
  it('returns 400 for invalid query params', async () => {
    const req = new NextRequest('http://localhost:3000/api/robots?limit=abc')

    const res = await GET(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('Invalid query parameters')
    expect(vi.mocked(getRobots)).not.toHaveBeenCalled()
  })

  it('passes category to getRobots and returns 200', async () => {
    vi.mocked(getRobots).mockResolvedValue(mockData)
    const req = new NextRequest(
      'http://localhost:3000/api/robots?category=industrial'
    )

    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(getRobots).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'industrial',
      })
    )
  })

  it('returns 500 when database fails', async () => {
    vi.mocked(getRobots).mockRejectedValue(new Error('db failure'))
    const req = new NextRequest(
      'http://localhost:3000/api/robots?category=industrial'
    )
    const res = await GET(req)
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toEqual({
      error: 'Internal server error',
    })
  })
})
