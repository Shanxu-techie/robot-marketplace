export const E2E_FIXTURES = {
  robots: {
    slugs: [
      'astralift-x200',
      'cleanbot-a7',
      'mediassist-r5',
      'servemate-s2',
    ] as const,
  },

  inquiries: {
    userA: {
      companyNames: [
        'Al Noor Logistics',
        'Pearl Continental Hotel',
      ],
    },
    userB: {
      companyNames: [
        'CityCare Hospital',
        'QuickServe Restaurants',
      ],
    },
  },
}