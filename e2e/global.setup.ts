import { clerkSetup } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'
import { seedE2EInquiries, seedE2EUsers } from './seed/seed-e2e-data'

// Setup must be run serially, this is necessary if Playwright is configured to run fully parallel: https://playwright.dev/docs/test-parallel
setup.describe.configure({ mode: 'serial' })

setup('global setup', async ({}) => {
  await clerkSetup()
})

setup('seed e2e data', async ({}) => {
  const { userA, userB } = await seedE2EUsers()
  await seedE2EInquiries(userA, userB)
})
