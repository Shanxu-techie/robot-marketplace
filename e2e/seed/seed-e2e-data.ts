import { getDb } from '@/db'
import { inquiries, robots, users } from '@/db/schema'
import { inArray } from 'drizzle-orm'
import type { InferSelectModel } from 'drizzle-orm'
import { E2E_FIXTURES } from '../fixtures/e2e-fixtures'

type User = InferSelectModel<typeof users>

export async function seedE2EUsers() {
  const userAClerkId = process.env.E2E_USER_A_CLERK_ID
  if (!userAClerkId) {
    throw new Error('E2E_USER_A_CLERK_ID is not set in .env.local')
  }
  const userBClerkId = process.env.E2E_USER_B_CLERK_ID
  if (!userBClerkId) {
    throw new Error('E2E_USER_B_CLERK_ID is not set in .env.local')
  }
  const db = getDb()
  await db
    .insert(users)
    .values([
      {
        clerkUserId: userAClerkId,
        email: 'abc1@gmail.com',
        role: 'buyer',
      },
      {
        clerkUserId: userBClerkId,
        email: 'abc2@gmail.com',
        role: 'buyer',
      },
    ])
    .onConflictDoNothing({
      target: users.clerkUserId,
    })

  const seededUsers = await db
    .select()
    .from(users)
    .where(inArray(users.clerkUserId, [userAClerkId, userBClerkId]))
  console.log(`${seededUsers.length} users`)
  const usersByClerkId = new Map(
    seededUsers.map((user) => [user.clerkUserId, user])
  )
  const userA = usersByClerkId.get(userAClerkId)
  const userB = usersByClerkId.get(userBClerkId)
  if (!userA || !userB) {
    throw new Error('Failed to retrieve seeded E2E users')
  }
  return { userA, userB }
}

export async function seedE2EInquiries(userA: User, userB: User) {
  const db = getDb()
  await db
    .delete(inquiries)
    .where(inArray(inquiries.userId, [userA.id, userB.id]))

  const seededRobots = await db
    .select()
    .from(robots)
    .where(inArray(robots.slug, E2E_FIXTURES.robots.slugs))

  if (seededRobots.length !== E2E_FIXTURES.robots.slugs.length) {
    throw new Error(
      'Required robots not found. Run the development seed before running the E2E setup.'
    )
  }

  const robotMap = Object.fromEntries(
    seededRobots.map((robot) => [robot.slug, robot.id])
  )

  await db.insert(inquiries).values([
    {
      userId: userA.id,
      robotId: robotMap['astralift-x200'],
      companyName: E2E_FIXTURES.inquiries.userA.companyNames[0],
      contactName: 'Usman Tariq',
      email: 'operations@alnoorlogistics.com',
      phone: '+92-300-1234567',
      message:
        'We are interested in deploying AstraLift X200 in our warehouse for automation.',
      status: 'new',
    },
    {
      userId: userA.id,
      robotId: robotMap['cleanbot-a7'],
      companyName: E2E_FIXTURES.inquiries.userA.companyNames[1],
      contactName: 'Sana Malik',
      email: 'ops@pchotel.com',
      phone: '+92-21-111222333',
      message:
        'Interested in CleanBot A7 for floor maintenance in high-traffic areas.',
      status: 'contacted',
    },
    {
      userId: userB.id,
      robotId: robotMap['mediassist-r5'],
      companyName: E2E_FIXTURES.inquiries.userB.companyNames[0],
      contactName: 'Dr. Ayesha Khan',
      email: 'admin@citycare.pk',
      phone: '+92-321-9876543',
      message:
        'Looking for MediAssist R5 for internal hospital logistics improvement.',
      status: 'new',
    },
    {
      userId: userB.id,
      robotId: robotMap['servemate-s2'],
      companyName: E2E_FIXTURES.inquiries.userB.companyNames[1],
      contactName: 'Hassan Raza',
      email: 'hassan@quickserve.com',
      phone: '+92-301-5566778',
      message:
        'Interested in ServeMate S2 to improve food delivery during peak hours.',
      status: 'closed',
    },
  ])

  const seededInquiries = await db
    .select()
    .from(inquiries)
    .where(inArray(inquiries.userId, [userA.id, userB.id]))
  console.log(`${seededInquiries.length} inquiries`)
}
