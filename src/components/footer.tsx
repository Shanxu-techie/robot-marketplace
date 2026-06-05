import Link from 'next/link'

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse Robots', href: '/' },
      { label: 'Warehousing', href: '/' },
      { label: 'Manufacturing', href: '/' },
      { label: 'Healthcare', href: '/' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Ready-to-Deploy', href: '/' },
      { label: 'Custom Robots', href: '/' },
      { label: 'Integration Services', href: '/' },
      { label: 'Support & Maintenance', href: '/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'How It Works', href: '/' },
      { label: 'Buying Guide', href: '/' },
      { label: 'FAQ', href: '/' },
      { label: 'Case Studies', href: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/' },
      { label: 'Contact', href: '/' },
      { label: 'Become a Vendor', href: '/' },
    ],
  },
]

export default function Footer() {
  return (
    <div className="bg-muted mt-16 py-8">
      <div className="container mx-auto p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 border-b border-muted-foreground">
        <div className="col-span-2 md:row-span-2 lg:col-span-2">
          <div className="text-4xl font-bold tracking-tight text-primary">
            Logo
          </div>
          <p className="mt-4">
            RobotMarketplace Simplifying robotics procurement for modern
            businesses. Evaluate solutions, compare capabilities, and find the
            right automation partner with confidence.
          </p>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h3 className="text-primary font-bold mb-2">{section.title}</h3>
            {section.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mx-8 mt-8 p-4 backdrop-blur-md bg-muted-foreground/20 rounded-lg">
        <Link href="/" className="hover:text-accent">
          © 2026 RobotMarketplace. All rights reserved.
        </Link>
      </div>
    </div>
  )
}
