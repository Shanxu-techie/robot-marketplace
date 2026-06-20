import { getDb } from '@/db'
import type { InferInsertModel } from 'drizzle-orm'

import {
  categories,
  vendors,
  robots,
  robotImages,
  robotSpecifications,
  customRequests,
  inquiries,
  testimonials,
} from '@/db/schema'

async function main() {
    const db = getDb()
    await db.delete(robotImages)
    await db.delete(robotSpecifications)
    await db.delete(inquiries)
    await db.delete(customRequests)
    await db.delete(testimonials)
    await db.delete(robots)
    await db.delete(vendors)
    await db.delete(categories)

    const insertedCategories = await db
      .insert(categories)
      .values([
        {
          name: 'Warehousing & Logistics',
          slug: 'warehousing-logistics',
          description:
            'Explore warehouse and logistics robots for automated picking, packing, inventory management, material handling, and fulfillment center operations.',
        },
        {
          name: 'Healthcare',
          slug: 'healthcare',
          description:
            'Discover healthcare robots for hospitals, clinics, patient assistance, medication delivery, medical logistics, and healthcare automation.',
        },
        {
          name: 'Hospitality',
          slug: 'hospitality',
          description:
            'Browse hospitality robots for hotels, resorts, guest services, room delivery, concierge assistance, and customer experience enhancement.',
        },
        {
          name: 'Restaurants',
          slug: 'restaurants',
          description:
            'Find restaurant robots for food service, automated delivery, kitchen assistance, table service, and restaurant workflow automation.',
        },
        {
          name: 'Manufacturing',
          slug: 'manufacturing',
          description:
            'Compare industrial robots for manufacturing, assembly lines, quality inspection, production automation, and factory operations.',
        },
        {
          name: 'Security & Surveillance',
          slug: 'security-surveillance',
          description:
            'Explore security and surveillance robots for autonomous patrols, monitoring, threat detection, facility security, and remote inspection.',
        },
        {
          name: 'Offices',
          slug: 'offices',
          description:
            'Discover office robots for reception, workplace assistance, internal deliveries, visitor management, and office automation.',
        },
      ])
      .returning()

    console.log(`${insertedCategories.length} categories`)
    const categoryMap = Object.fromEntries(
      insertedCategories.map((c) => [c.slug, c.id])
    )
    
    const insertedVendors = await db
      .insert(vendors)
      .values([
        {
          name: 'RoboLogix Solutions',
          email: 'contact@robologix.com',
          website: 'https://robologix.com',
          phone: '+1-555-0101',
          logoUrl: 'https://placehold.co/400x400/png?text=RoboLogix',
          description:
            'Provider of warehouse automation, autonomous mobile robots, and fulfillment center solutions.',
        },
        {
          name: 'NextGen Robotics',
          email: 'info@nextgenrobotics.com',
          website: 'https://nextgenrobotics.com',
          phone: null,
          logoUrl: null,
          description: null,
        },
      ])
      .returning()
    console.log(`${insertedVendors.length} vendors`)
    const vendorMap = Object.fromEntries(
      insertedVendors.map((v) => [v.name, v.id])
    )
    const insertedRobots = await db
      .insert(robots)
      .values([
        {
          name: 'AstraLift X200',
          slug: 'astralift-x200',
          shortDescription:
            'High-throughput autonomous lifting for warehouse floors.',
          fullDescription:
            'AstraLift X200 automates material handling and inventory movement in modern warehouses and fulfillment centers.',
          featured: true,
          isVisible: true,
          keyMetric: '120 picks/hour',
          priceFrom: '18000',
          priceTo: '25000',
          categoryId: categoryMap['warehousing-logistics'],
          vendorId: vendorMap['RoboLogix Solutions'],
        },
        {
          name: 'MediAssist R5',
          slug: 'mediassist-r5',
          shortDescription:
            'Autonomous delivery robot for hospitals and clinics.',
          fullDescription:
            'MediAssist R5 transports medications and supplies across healthcare facilities with high accuracy.',
          featured: true,
          isVisible: true,
          keyMetric: '99.2% delivery accuracy',
          priceFrom: '12500',
          priceTo: '18000',
          categoryId: categoryMap.healthcare,
          vendorId: vendorMap['RoboLogix Solutions'],
        },
        {
          name: 'CleanBot A7',
          slug: 'cleanbot-a7',
          shortDescription:
            'AI-powered floor cleaning for hotels and large spaces.',
          fullDescription:
            'CleanBot A7 automates cleaning in hospitality environments using smart navigation and mapping.',
          featured: true,
          isVisible: true,
          keyMetric: '3,000 sq ft/hour coverage',
          priceFrom: '6800',
          priceTo: '9500',
          categoryId: categoryMap.hospitality,
          vendorId: vendorMap['NextGen Robotics'],
        },
        {
          name: 'ServeMate S2',
          slug: 'servemate-s2',
          shortDescription: 'Smart food delivery robot for restaurants.',
          fullDescription:
            'ServeMate S2 improves restaurant efficiency by delivering food and reducing staff workload.',
          featured: true,
          isVisible: true,
          keyMetric: 'Carries up to 40 kg per trip',
          priceFrom: '9200',
          priceTo: '14000',
          categoryId: categoryMap.restaurants,
          vendorId: vendorMap['NextGen Robotics'],
        },
        {
          name: 'Inspectra D4',
          slug: 'inspectra-d4',
          shortDescription:
            'Precision inspection robot for manufacturing quality control.',
          fullDescription:
            'Inspectra D4 detects microscopic defects and ensures consistent production quality.',
          featured: true,
          isVisible: true,
          keyMetric: 'Detects defects at 0.02 mm accuracy',
          priceFrom: '22000',
          priceTo: '35000',
          categoryId: categoryMap.manufacturing,
          vendorId: vendorMap['RoboLogix Solutions'],
        },
        {
          name: 'PatrolEye P9',
          slug: 'patroleye-p9',
          shortDescription:
            'Autonomous security patrol robot with AI surveillance.',
          fullDescription:
            'PatrolEye P9 provides real-time monitoring and threat detection in secure environments.',
          featured: true,
          isVisible: true,
          keyMetric: '360° AI vision monitoring',
          priceFrom: '15500',
          priceTo: '24000',
          categoryId: categoryMap['security-surveillance'],
          vendorId: vendorMap['RoboLogix Solutions'],
        },

        // Non-featured robots

        {
          name: 'OfficeGuide O1',
          slug: 'officeguide-o1',
          shortDescription:
            'Reception and visitor assistance robot for offices.',
          fullDescription:
            'OfficeGuide O1 handles greetings, directions, and visitor management in corporate environments.',
          featured: false,
          isVisible: true,
          keyMetric: '500+ visitor interactions daily',
          priceFrom: '4900',
          priceTo: '7900',
          categoryId: categoryMap.offices,
          vendorId: vendorMap['NextGen Robotics'],
        },
        {
          name: 'StockRunner M3',
          slug: 'stockrunner-m3',
          shortDescription:
            'Autonomous inventory transport robot for warehouses.',
          fullDescription:
            'StockRunner M3 automates material movement and improves warehouse efficiency.',
          featured: false,
          isVisible: true,
          keyMetric: '300 kg payload capacity',
          priceFrom: '11000',
          priceTo: '16000',
          categoryId: categoryMap['warehousing-logistics'],
          vendorId: vendorMap['RoboLogix Solutions'],
        },
      ])
      .returning()
    console.log(`${insertedRobots.length} robots`)
    const robotMap = Object.fromEntries(
      insertedRobots.map((r) => [r.slug, r.id])
    )

    const imageValues = [
      {
        imageUrl: 'https://placehold.co/800x600/png?text=AstraLift+Front',
        robotId: robotMap['astralift-x200'],
        altText: 'AstraLift X200 front view in warehouse environment',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=AstraLift+Side',
        robotId: robotMap['astralift-x200'],
        altText: 'AstraLift X200 side profile',
        sortOrder: 2,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=MediAssist+Hospital',
        robotId: robotMap['mediassist-r5'],
        altText: 'MediAssist R5 operating in hospital corridor',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=CleanBot+Cleaning',
        robotId: robotMap['cleanbot-a7'],
        altText: 'CleanBot A7 cleaning hotel lobby floor',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=ServeMate+Restaurant',
        robotId: robotMap['servemate-s2'],
        altText: 'ServeMate S2 delivering food in restaurant',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=Inspectra+QC',
        robotId: robotMap['inspectra-d4'],
        altText: 'Inspectra D4 inspecting manufacturing line',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=PatrolEye+Security',
        robotId: robotMap['patroleye-p9'],
        altText: 'PatrolEye P9 patrolling facility at night',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=OfficeGuide+Reception',
        robotId: robotMap['officeguide-o1'],
        altText: 'OfficeGuide O1 greeting office visitors',
        sortOrder: 1,
      },
      {
        imageUrl: 'https://placehold.co/800x600/png?text=StockRunner+Warehouse',
        robotId: robotMap['stockrunner-m3'],
        altText: 'StockRunner M3 transporting warehouse inventory',
        sortOrder: 1,
      },
    ]
    await db.insert(robotImages).values(imageValues)
    console.log(`${imageValues.length} robot images`)

    const specificationValues = [
      {
        robotId: robotMap['astralift-x200'],
        label: 'Throughput',
        value: '120 picks/hour',
        sortOrder: 1,
      },
      {
        robotId: robotMap['astralift-x200'],
        label: 'Load Capacity',
        value: 'Up to 150 kg',
        sortOrder: 2,
      },
      {
        robotId: robotMap['astralift-x200'],
        label: 'Navigation',
        value: 'Autonomous SLAM-based mapping',
        sortOrder: 3,
      },
      {
        robotId: robotMap['mediassist-r5'],
        label: 'Delivery Accuracy',
        value: '99.2%',
        sortOrder: 1,
      },
      {
        robotId: robotMap['mediassist-r5'],
        label: 'Use Case',
        value: 'Hospitals & clinics',
        sortOrder: 2,
      },
      {
        robotId: robotMap['mediassist-r5'],
        label: 'Payload',
        value: 'Up to 10 kg',
        sortOrder: 3,
      },
      {
        robotId: robotMap['cleanbot-a7'],
        label: 'Coverage',
        value: '3,000 sq ft/hour',
        sortOrder: 1,
      },
      {
        robotId: robotMap['cleanbot-a7'],
        label: 'Cleaning Mode',
        value: 'AI-powered autonomous floor mapping',
        sortOrder: 2,
      },
      {
        robotId: robotMap['servemate-s2'],
        label: 'Payload',
        value: 'Up to 40 kg',
        sortOrder: 1,
      },
      {
        robotId: robotMap['servemate-s2'],
        label: 'Use Case',
        value: 'Restaurants & dining halls',
        sortOrder: 2,
      },
      {
        robotId: robotMap['inspectra-d4'],
        label: 'Precision',
        value: '0.02 mm defect detection',
        sortOrder: 1,
      },
      {
        robotId: robotMap['inspectra-d4'],
        label: 'Industry',
        value: 'Manufacturing quality control',
        sortOrder: 2,
      },
      {
        robotId: robotMap['patroleye-p9'],
        label: 'Vision System',
        value: '360° AI surveillance',
        sortOrder: 1,
      },
      {
        robotId: robotMap['patroleye-p9'],
        label: 'Function',
        value: 'Autonomous security patrol',
        sortOrder: 2,
      },
      {
        robotId: robotMap['officeguide-o1'],
        label: 'Interactions',
        value: '500+ visitors/day',
        sortOrder: 1,
      },
      {
        robotId: robotMap['officeguide-o1'],
        label: 'Use Case',
        value: 'Office reception & guidance',
        sortOrder: 2,
      },
      {
        robotId: robotMap['stockrunner-m3'],
        label: 'Payload',
        value: '300 kg',
        sortOrder: 1,
      },
      {
        robotId: robotMap['stockrunner-m3'],
        label: 'Use Case',
        value: 'Warehouse inventory transport',
        sortOrder: 2,
      },
    ]
    await db.insert(robotSpecifications).values(specificationValues)
    console.log(`${specificationValues.length} robot specification values`)

    const inquiryValues: InferInsertModel<typeof inquiries>[] = [
      {
        robotId: robotMap['astralift-x200'],
        companyName: 'Al Noor Logistics',
        contactName: 'Usman Tariq',
        email: 'operations@alnoorlogistics.com',
        phone: '+92-300-1234567',
        message:
          'We are interested in deploying AstraLift X200 in our warehouse for automation.',
        status: 'new',
      },
      {
        robotId: robotMap['mediassist-r5'],
        companyName: 'CityCare Hospital',
        contactName: 'Dr. Ayesha Khan',
        email: 'admin@citycare.pk',
        phone: '+92-321-9876543',
        message:
          'Looking for MediAssist R5 for internal hospital logistics improvement.',
        status: 'contacted',
      },
      {
        robotId: robotMap['cleanbot-a7'],
        companyName: 'Pearl Continental Hotel',
        contactName: 'Sana Malik',
        email: 'ops@pchotel.com',
        phone: '+92-21-111222333',
        message:
          'Interested in CleanBot A7 for floor maintenance in high-traffic areas.',
        status: 'new',
      },
    ]
    await db.insert(inquiries).values(inquiryValues)
    console.log(`${inquiryValues.length} inquiry values`)

    const customRequestValues: InferInsertModel<typeof customRequests>[] = [
      {
        companyName: 'Indus Manufacturing Ltd',
        contactName: 'Bilal Ahmed',
        email: 'bilal@indusmfg.com',
        phone: '+92-333-1122334',
        industry: 'Manufacturing',
        budget: '20000-50000 USD',
        requirements:
          'We need a robotic arm system for automated assembly line inspection and part sorting.',
        status: 'reviewing',
      },
      {
        companyName: 'QuickServe Restaurants',
        contactName: 'Hassan Raza',
        email: 'hassan@quickserve.com',
        phone: '+92-301-5566778',
        industry: 'Hospitality',
        budget: '10000-15000 USD',
        requirements:
          'We want a custom food delivery robot optimized for tight restaurant spaces and peak-hour traffic.',
        status: 'proposal_sent',
      },
      {
        companyName: 'SecureZone Pakistan',
        contactName: 'Ali Raza',
        email: 'ali@securezone.com',
        phone: '+92-345-7788990',
        industry: 'Security',
        budget: '30000-60000 USD',
        requirements:
          'Need autonomous patrol robots with night vision and AI threat detection for large facilities.',
        status: 'new',
      },
    ]
    await db.insert(customRequests).values(customRequestValues)
    console.log(`${customRequestValues.length} custom request values`)

    const testimonialValues = [
      {
        companyName: 'Al Noor Logistics',
        contactName: 'Sarah Malik',
        contactTitle: 'Operations Manager',
        companyLogoUrl: 'https://placehold.co/200x200/png?text=Al+Noor',
        rating: 5,
        content:
          'The robot integrated into our workflow faster than expected, and we saw measurable efficiency gains within the first month. It’s now handling tasks we used to assign manually.',
        isVisible: true,
        sortOrder: 1,
      },
      {
        companyName: 'QuickServe Restaurants',
        contactName: 'Adeel Khan',
        contactTitle: 'Restaurant Owner',
        companyLogoUrl: 'https://placehold.co/200x200/png?text=QuickServe',
        rating: 5,
        content:
          'We introduced a service robot during peak hours and reduced staff workload without slowing service. It became part of our daily operations within weeks.',
        isVisible: true,
        sortOrder: 2,
      },
      {
        companyName: 'CityCare Hospital',
        contactName: 'Dr. Ayesha Khan',
        contactTitle: 'Hospital Administrator',
        companyLogoUrl: 'https://placehold.co/200x200/png?text=CityCare',
        rating: 5,
        content:
          'MediAssist significantly improved internal logistics and reduced delays in medication delivery between departments.',
        isVisible: true,
        sortOrder: 3,
      },
    ]
    await db.insert(testimonials).values(testimonialValues)
    console.log(`${testimonialValues.length} testimonial values`)
  
}

main()
  .then(() => {
    console.log('Seed Complete.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed Failed', err)
    process.exit(1)
  })
