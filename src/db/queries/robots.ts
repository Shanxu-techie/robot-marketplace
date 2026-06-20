import { RobotsQuery } from '@/lib/validators/robots'
import { RobotCard } from '@/types/robots'
import { and, eq } from 'drizzle-orm'
import { robots, categories, vendors, robotImages } from '@/db/schema'
import { getDb } from '@/db'

export async function getRobots(params: RobotsQuery): Promise<RobotCard[]> {
  const conditions = [eq(robots.isVisible, true)]
  if (typeof params.featured === 'boolean') {
    conditions.push(eq(robots.featured, params.featured))
  }
  if (params.category) {
    conditions.push(eq(categories.slug, params.category))
  }
  const db = getDb()
  const rows = await db
    .select({
      id: robots.id,
      name: robots.name,
      slug: robots.slug,
      shortDescription: robots.shortDescription,
      priceFrom: robots.priceFrom,
      priceTo: robots.priceTo,
      keyMetric: robots.keyMetric,
      featured: robots.featured,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
      vendor: {
        id: vendors.id,
        name: vendors.name,
        logoUrl: vendors.logoUrl,
      },
      primaryImage: {
        imageUrl: robotImages.imageUrl,
        altText: robotImages.altText,
      },
    })
    .from(robots)
    .innerJoin(categories, eq(robots.categoryId, categories.id))
    .innerJoin(vendors, eq(robots.vendorId, vendors.id))
    .leftJoin(
      robotImages,
      and(eq(robotImages.robotId, robots.id), eq(robotImages.sortOrder, 1))
    )
    .where(and(...conditions))
    .limit(params.limit)

  const data: RobotCard[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.shortDescription,
    priceFrom: row.priceFrom,
    priceTo: row.priceTo,
    keyMetric: row.keyMetric,
    featured: row.featured,
    category: row.category,
    vendor: row.vendor,
    primaryImage: row.primaryImage?.imageUrl
      ? {
          imageUrl: row.primaryImage.imageUrl,
          altText: row.primaryImage.altText,
        }
      : null,
  }))
  return data
}
