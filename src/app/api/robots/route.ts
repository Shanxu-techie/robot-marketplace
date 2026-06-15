import { robotsQuerySchema } from '@/lib/validators/robots'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRobots } from '@/db/queries/robots'

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

  try {
    const data = await getRobots(result.data)
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
