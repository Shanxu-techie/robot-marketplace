import Hero from '@/components/hero'
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
    </div>
  )
}
