import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { getDb } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) return null
  const db = getDb()
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1)

  return user[0] ?? null
}
