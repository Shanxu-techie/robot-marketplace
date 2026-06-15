export type RobotCard = {
  id: number
  name: string
  slug: string
  shortDescription: string | null
  priceFrom: string | null
  priceTo: string | null
  keyMetric: string | null
  featured: boolean

  category: {
    id: number
    name: string
    slug: string
  }

  vendor: {
    id: number
    name: string
    logoUrl: string | null
  }

  primaryImage: {
    imageUrl: string
    altText: string | null
  } | null
}
