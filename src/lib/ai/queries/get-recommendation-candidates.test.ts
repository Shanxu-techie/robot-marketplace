import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { inArray } from 'drizzle-orm'
import { getDb } from '@/db'
import { categories, vendors, robots, robotSpecifications } from '@/db/schema'
import { getRecommendationCandidates } from './get-recommendation-candidates'

let categoryId: number
let vendorId: number
let robotIds: number[] = []

describe('getRecommendationCandidates', () => {
  beforeAll(async () => {
    const db = getDb()

    const [category] = await db
      .insert(categories)
      .values({
        name: 'Test Category',
        slug: 'test-category',
      })
      .returning()

    categoryId = category.id

    const [vendor] = await db
      .insert(vendors)
      .values({
        name: 'Test Vendor',
        email: 'test-vendor@example.com',
        website: 'https://test-vendor.com',
      })
      .returning()

    vendorId = vendor.id

    const insertedRobots = await db
      .insert(robots)
      .values([
        {
          name: 'Inside Budget Robot',
          slug: 'inside-budget-test',
          vendorId,
          categoryId,
          priceFrom: '10000',
          priceTo: '20000',
          featured: false,
          isVisible: true,
        },
        {
          name: 'Outside Budget Robot',
          slug: 'outside-budget-test',
          vendorId,
          categoryId,
          priceFrom: '25000',
          priceTo: '30000',
          featured: false,
          isVisible: true,
        },
        {
          name: 'No Price Robot',
          slug: 'no-price-test',
          vendorId,
          categoryId,
          priceFrom: null,
          priceTo: null,
          featured: true,
          isVisible: true,
        },
        {
          name: 'No Specs Robot',
          slug: 'no-specs-test',
          vendorId,
          categoryId,
          priceFrom: '5000',
          priceTo: '7000',
          featured: false,
          isVisible: true,
        },

        {
          name: 'Featured Tie Robot',
          slug: 'featured-tie-test',
          vendorId,
          categoryId,
          priceFrom: '14000',
          priceTo: '16000',
          featured: true,
          isVisible: true,
        },
        {
          name: 'Non Featured Tie Robot',
          slug: 'non-featured-tie-test',
          vendorId,
          categoryId,
          priceFrom: '14000',
          priceTo: '16000',
          featured: false,
          isVisible: true,
        },

        ...Array.from({ length: 13 }).map((_, index) => ({
          name: `Limit Test Robot ${index}`,
          slug: `limit-test-${index}`,
          vendorId,
          categoryId,
          priceFrom: '10000',
          priceTo: '20000',
          featured: false,
          isVisible: true,
        })),
      ])
      .returning()

    robotIds = insertedRobots.map((robot) => robot.id)

    await db.insert(robotSpecifications).values({
      robotId: robotIds[0],
      label: 'Use Case',
      value: 'Warehouse automation',
    })
  })

  afterAll(async () => {
    const db = getDb()

    await db
      .delete(robotSpecifications)
      .where(inArray(robotSpecifications.robotId, robotIds))

    await db.delete(robots).where(inArray(robots.id, robotIds))

    await db.delete(vendors).where(inArray(vendors.id, [vendorId]))

    await db.delete(categories).where(inArray(categories.id, [categoryId]))
  })

  describe('budget distance ranking', () => {
    let localCategoryId: number
    let localRobotIds: number[] = []

    beforeAll(async () => {
      const db = getDb()
      const [category] = await db
        .insert(categories)
        .values({
          name: 'Budget Ranking Test Category',
          slug: 'budget-ranking-test-category',
        })
        .returning()

      localCategoryId = category.id
      const insertedRobots = await db
        .insert(robots)
        .values([
          {
            name: 'Budget Ranking Winner',
            slug: 'budget-ranking-winner',
            vendorId,
            categoryId: localCategoryId,
            priceFrom: '10000',
            priceTo: '20000',
            featured: false,
            isVisible: true,
          },
          {
            name: 'Budget Ranking Loser',
            slug: 'budget-ranking-loser',
            vendorId,
            categoryId: localCategoryId,
            priceFrom: '30000',
            priceTo: '40000',
            featured: false,
            isVisible: true,
          },
        ])
        .returning()

      localRobotIds = insertedRobots.map((robot) => robot.id)
    })

    afterAll(async () => {
      const db = getDb()

      await db.delete(robots).where(inArray(robots.id, localRobotIds))

      await db
        .delete(categories)
        .where(inArray(categories.id, [localCategoryId]))
    })

    it('ranks robots by budget distance', async () => {
      const candidates = await getRecommendationCandidates({
        categoryId: localCategoryId,
        budget: 15000,
        environment: 'indoor',
        useCase: 'Warehouse automation testing',
        payload: '100 kg',
      })

      expect(candidates[0].name).toBe('Budget Ranking Winner')
    })
  })

  describe('deterministic tie breaking', () => {
    let localCategoryId: number
    let localRobotIds: number[] = []

    beforeAll(async () => {
      const db = getDb()

      const [category] = await db
        .insert(categories)
        .values({
          name: 'ID Tie Break Test Category',
          slug: 'id-tie-break-test-category',
        })
        .returning()

      localCategoryId = category.id

      const insertedRobots = await db
        .insert(robots)
        .values([
          {
            name: 'Lower ID Robot',
            slug: 'lower-id-robot',
            vendorId,
            categoryId: localCategoryId,
            priceFrom: '10000',
            priceTo: '20000',
            featured: false,
            isVisible: true,
          },
          {
            name: 'Higher ID Robot',
            slug: 'higher-id-robot',
            vendorId,
            categoryId: localCategoryId,
            priceFrom: '10000',
            priceTo: '20000',
            featured: false,
            isVisible: true,
          },
        ])
        .returning()

      localRobotIds = insertedRobots.map((robot) => robot.id)
    })

    afterAll(async () => {
      const db = getDb()

      await db.delete(robots).where(inArray(robots.id, localRobotIds))

      await db
        .delete(categories)
        .where(inArray(categories.id, [localCategoryId]))
    })

    it('breaks remaining ties by robot id', async () => {
      const candidates = await getRecommendationCandidates({
        categoryId: localCategoryId,
        budget: 15000,
        environment: 'indoor',
        useCase: 'Testing deterministic tie breaking',
      })

      expect(candidates).toHaveLength(2)

      expect(candidates[0].id).toBeLessThan(candidates[1].id)
      expect(candidates[0].name).toBe('Lower ID Robot')
      expect(candidates[1].name).toBe('Higher ID Robot')
    })
  })

  it('filters robots with missing prices', async () => {
    const candidates = await getRecommendationCandidates({
      categoryId,
      budget: 15000,
      environment: 'indoor',
      useCase: 'Warehouse automation testing',
    })

    expect(candidates.some((robot) => robot.name === 'No Price Robot')).toBe(
      false
    )
  })

  it('returns null useCase and empty specifications when robot has no specs', async () => {
    const candidates = await getRecommendationCandidates({
      categoryId,
      budget: 6000,
      environment: 'indoor',
      useCase: 'Testing robots without specifications',
    })

    const robot = candidates.find(
      (candidate) => candidate.name === 'No Specs Robot'
    )

    expect(robot?.useCase).toBe(null)
    expect(robot?.specifications).toEqual([])
  })

  it('caps candidates at 15 results', async () => {
    const candidates = await getRecommendationCandidates({
      categoryId,
      budget: 15000,
      environment: 'indoor',
      useCase: 'Testing candidate limits',
    })

    expect(candidates.length).toBe(15)
  })

  it('ranks featured robots first when budget distance is equal', async () => {
    const candidates = await getRecommendationCandidates({
      categoryId,
      budget: 15000,
      environment: 'indoor',
      useCase: 'Testing featured ordering',
    })

    const featuredIndex = candidates.findIndex(
      (robot) => robot.name === 'Featured Tie Robot'
    )

    const nonFeaturedIndex = candidates.findIndex(
      (robot) => robot.name === 'Non Featured Tie Robot'
    )

    expect(featuredIndex).toBeGreaterThanOrEqual(0)
    expect(nonFeaturedIndex).toBeGreaterThanOrEqual(0)

    expect(featuredIndex).toBeLessThan(nonFeaturedIndex)
  })
})
