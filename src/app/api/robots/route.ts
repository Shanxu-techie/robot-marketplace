import { db } from '@/db'
import { robots, categories, vendors, robotImages } from '@/db/schema'
import { robotsQuerySchema } from '@/lib/validators/robots'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { RobotCard } from '@/types/robots'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const raw = {
    featured: searchParams.get('featured') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  }
  const result = robotsQuerySchema.safeParse(raw)
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Invalid query parameters',
        issues: z.treeifyError(result.error),
      },
      { status: 400 }
    )
  }
  const { featured, category, limit } = result.data

  const conditions = [eq(robots.isVisible, true)]
  if (typeof featured === 'boolean') {
    conditions.push(eq(robots.featured, featured))
  }
  if (category) {
    conditions.push(eq(categories.slug, category))
  }

  try {
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
      .limit(limit)

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
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch robots: ', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      }
    )
  }
}
