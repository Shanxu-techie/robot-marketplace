import CtaBanner from '@/components/cta-banner'
import FeaturedRobots from '@/components/featured-robots'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import Navbar from '@/components/navbar'
import Trust from '@/components/trust'
import TwoPaths from '@/components/two-paths'

export default function Home() {
  return (
    <div className="pt-16">
      <Navbar />
      <Hero />
      <TwoPaths />
      <Trust />
      <FeaturedRobots />
      <HowItWorks />
      <CtaBanner />
    </div>
  )
}
