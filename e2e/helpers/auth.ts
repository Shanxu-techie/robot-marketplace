import { Page } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'

export async function loginAs(
  page: Page,
  user: {
    email: string
  }
) {
  await page.goto('/')

  await clerk.signIn({
    page,
    emailAddress: user.email,
  })
}
