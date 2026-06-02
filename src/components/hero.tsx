import Link from 'next/link'
import { Button } from './ui/button'

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-8 px-8 py-8 md:py-12 lg:py-24">
      <div className="flex flex-1 flex-col gap-3 justify-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Your Robot. Your Rules.
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg">
          Intelligent robotics tailored to your ambitions. Deploy a precision
          pre-built model instantly, or collaborate with our engineers to design
          something entirely your own.
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <Link href="/customize">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Build Your Custom Robot
            </Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline">Browse Robots</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-1 flex-row">
        <div className="flex-1 border border-border min-h-64 flex items-center justify-center text-muted-foreground">
          CAD Blueprint
        </div>
        <div className="flex-1 border border-border min-h-64 flex items-center justify-center text-muted-foreground">
          Real Robot Photo
        </div>
      </div>
    </div>
  )
}
