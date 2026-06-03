import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { Robot } from '@/data/robots'
import Image from 'next/image'
import Link from 'next/link'

export default function RobotCard({
  name,
  category,
  oneLiner,
  standout,
  price,
  imageUrl,
  slug
}: Robot) {
  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt={name}
        width={400}
        height={225}
        className="w-full object-cover"
      />

      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-primary">{category}</p>
            <h3 className="text-3xl font-bold">{name}</h3>
            <p>{oneLiner}</p>
          </div>
        </div>

        <div className="border-t border-muted pt-4 mt-4">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">KEY METRIC</p>
              <p className="font-bold text-primary">{standout}</p>
            </div>
            <div className="lg:text-end">
              <p className="text-sm text-muted-foreground">ENTRY</p>
              <p className="text-lg font-bold whitespace-nowrap">{price}</p>
            </div>
          </div>
        </div>
        <Link href={`/marketplace/${slug}`}>
          <Button variant="outline" className="w-full text-primary mt-4">
            View Details <ArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  )
}
