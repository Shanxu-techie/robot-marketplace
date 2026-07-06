import { test, expect, Page } from '@playwright/test'
import { loginAs } from './helpers/auth'
import { E2E_FIXTURES } from './fixtures/e2e-fixtures'

test.describe.configure({ mode: 'serial' })

const inquiryItem = (page: Page, name: string) =>
  page.locator('[data-testid="inquiry-item"]', {
    hasText: name,
  })

test('user A sees only their own inquiries on the dashboard', async ({
  page,
}) => {
  const userAEmail = process.env.E2E_USER_A_EMAIL
  if (!userAEmail) throw new Error('E2E_USER_A_EMAIL is not set')

  await loginAs(page, { email: userAEmail })
  await page.goto('/dashboard')

  for (const companyName of E2E_FIXTURES.inquiries.userA.companyNames) {
    await expect(inquiryItem(page, companyName)).toBeVisible()
  }

  for (const companyName of E2E_FIXTURES.inquiries.userB.companyNames) {
    await expect(inquiryItem(page, companyName)).toHaveCount(0)
  }
})

test('User B sees only their own inquiries', async ({ page }) => {
  const userBEmail = process.env.E2E_USER_B_EMAIL
  if (!userBEmail) throw new Error('E2E_USER_B_EMAIL is not set')

  await loginAs(page, { email: userBEmail })
  await page.goto('/dashboard')

  for (const companyName of E2E_FIXTURES.inquiries.userB.companyNames) {
    await expect(inquiryItem(page, companyName)).toBeVisible()
  }

  for (const companyName of E2E_FIXTURES.inquiries.userA.companyNames) {
    await expect(inquiryItem(page, companyName)).toHaveCount(0)
  }
})
