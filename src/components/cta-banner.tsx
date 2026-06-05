import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'

export default function CtaBanner() {
  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container mx-auto p-8 flex flex-col justify-center items-center">
        <h2 className='text-4xl font-bold tracking-tight mb-2'>Ready to automate your operations?</h2>
        <p>
          Speak with our robotics specialists and find the right solution for
          your business.
        </p>
        <Button variant="ctaOutline" className='mt-8'>Request a Consultation <ArrowRight /></Button>
      </div>
    </div>
  )
}
