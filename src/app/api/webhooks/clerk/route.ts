import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { users } from '@/db/schema'
import { getDb } from '@/db'

type ClerkWebhookPayload = {
  type: string
  data: {
    id: string
    primary_email_address_id?: string
    email_addresses?: Array<{
      id: string
      email_address?: string
    }>
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    const svixId = req.headers.get('svix-id')
    const svixTimestamp = req.headers.get('svix-timestamp')
    const svixSignature = req.headers.get('svix-signature')

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing Svix headers')
      return NextResponse.json(
        { error: 'Missing required webhook headers' },
        { status: 400 }
      )
    }

    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
      console.error('CLERK_WEBHOOK_SECRET is not set')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    let payload: ClerkWebhookPayload
    try {
      const wh = new Webhook(secret)
      payload = wh.verify(rawBody, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookPayload
    } catch (verifyError) {
      console.error('Signature verification failed:', verifyError)
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    const { type, data } = payload

    if (type !== 'user.created') {
      return NextResponse.json({ received: true }, { status: 200 })
    }

    try {
      const {
        id: clerkUserId,
        email_addresses,
        primary_email_address_id,
      } = data

      const primaryEmailObj = email_addresses?.find(
        (email) => email.id === primary_email_address_id
      )
      const primaryEmail = primaryEmailObj?.email_address

      if (!primaryEmail) {
        console.error('User has no primary email:', clerkUserId)
        return NextResponse.json(
          { error: 'User data missing email' },
          { status: 400 }
        )
      }

      await getDb()
        .insert(users)
        .values({
          clerkUserId,
          email: primaryEmail,
        })
        .onConflictDoNothing({ target: users.clerkUserId })

      console.log(`User created successfully: ${clerkUserId}`)
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (dbError: unknown) {
      console.error('Database error while creating user:', dbError)
      return NextResponse.json(
        { error: 'Failed to process user creation' },
        { status: 500 }
      )
    }
  } catch (unexpectedError) {
    console.error('Unexpected webhook error:', unexpectedError)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
