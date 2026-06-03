export type Robot = {
  id: string
  name: string
  category: string
  oneLiner: string
  standout: string
  price: string
  imageUrl: string
  slug: string
}

export const robots: Robot[] = [
  {
    id: 'rbt-001',
    slug: 'astra-lift-x200',
    name: 'AstraLift X200',
    category: 'Warehousing & Logistics',
    oneLiner: 'High-throughput autonomous lifting for warehouse floors',
    standout: '120 picks/hour',
    price: 'From $18,000',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'rbt-002',
    slug: 'medi-assist-r5',
    name: 'MediAssist R5',
    category: 'Healthcare',
    oneLiner: 'Autonomous delivery robot for hospitals and clinics',
    standout: '99.2% delivery accuracy',
    price: 'From $12,500',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'rbt-003',
    slug: 'clean-bot-a7',
    name: 'CleanBot A7',
    category: 'Hospitality',
    oneLiner: 'AI-powered floor cleaning for hotels and large spaces',
    standout: '3,000 sq ft/hour coverage',
    price: 'From $6,800',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'rbt-004',
    slug: 'serve-mate-s2',
    name: 'ServeMate S2',
    category: 'Restaurants',
    oneLiner: 'Smart food delivery robot for high-traffic dining areas',
    standout: 'Carries up to 40 kg per trip',
    price: 'From $9,200',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'rbt-005',
    slug: 'inspectra-d4',
    name: 'Inspectra D4',
    category: 'Manufacturing',
    oneLiner: 'Precision inspection robot for quality control lines',
    standout: 'Detects defects at 0.02 mm accuracy',
    price: 'From $22,000',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'rbt-006',
    slug: 'patrol-eye-p9',
    name: 'PatrolEye P9',
    category: 'Security & Surveillance',
    oneLiner: 'Autonomous patrol robot with real-time threat detection',
    standout: '360° AI vision monitoring',
    price: 'From $15,500',
    imageUrl: '/placeholder.svg',
  },
]
