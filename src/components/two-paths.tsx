import Link from 'next/link'
import { Button } from './ui/button'
import SectionHeading from './section-heading'

export default function TwoPaths() {
  return (
    <div className="container mx-auto px-8 py-8 w-full">
      <SectionHeading title="Your Path to Robotics" />
      <div className="flex flex-col md:flex-row my-8">
        <div className="flex-1 border border-border min-h-64 flex flex-col p-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Buy Ready Robots
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg my-4">
            Explore production-ready robots designed for real-world tasks.
            Compare models, review specifications, and deploy immediately. Thus,
            no custom build required.
          </p>
          <Link href="/marketplace" className="mt-auto">
            <Button variant="outline">Explore Robots</Button>
          </Link>
        </div>
        <div className="flex-1 border border-accent min-h-64 flex flex-col p-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Build a Custom Robot
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg my-4">
            Work with our engineers to design a robot tailored to your exact
            requirements: from capabilities and hardware to deployment in your
            environment.
          </p>
          <Link href="/customize" className="mt-auto">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start Custom Build
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
