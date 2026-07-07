import { getDb } from '@/db'
import { inquiries } from '@/db/schema'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { desc, eq } from 'drizzle-orm'

async function fetchInquiries(userId: string) {
  return getDb()
    .select()
    .from(inquiries)
    .where(eq(inquiries.userId, userId))
    .orderBy(desc(inquiries.createdAt))
    .limit(5)
}

export default async function Dashboard() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/sign-in')
  }
  const userInquiries = await fetchInquiries(user.id)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Recent Inquiries</h2>
      {userInquiries.length === 0 ? (
        <p className="text-gray-500">No recent inquiries.</p>
      ) : (
        <ul className="space-y-2">
          {userInquiries.map((userInquiry) => (
            <li
              key={userInquiry.id}
              data-testid="inquiry-item"
              className="border-b pb-2"
            >
              <p className="font-medium">{userInquiry.companyName}</p>
              <p className="text-sm text-gray-500">{userInquiry.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
