import { robots } from '@/data/robots'
import RobotCard from './robot-card'
import SectionHeading from './section-heading'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
export default function FeaturedRobots() {
  return (
    <div className="container mx-auto p-8">
      <SectionHeading title="Featured Robots" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {robots.map((robot) => (
          <RobotCard key={robot.id} {...robot} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link href="/marketplace">
          <Button variant="outline">
            View All Robots <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  )
}
