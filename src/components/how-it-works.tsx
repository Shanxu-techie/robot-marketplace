import SectionHeading from './section-heading'

type Steps = {
  number: number
  title: string
  description: string
}

const steps: Steps[] = [
  {
    number: 1,
    title: 'Browse Robots',
    description: 'Explore ready-made robotic solutions for every industry.',
  },
  {
    number: 2,
    title: 'Buy or Customize',
    description:
      'Purchase an existing robot or request a custom-built solution.',
  },
  {
    number: 3,
    title: 'Configure & Order',
    description:
      'Select features, review specifications, and place your order.',
  },
  {
    number: 4,
    title: 'Deploy & Automate',
    description: 'Receive your robot and start streamlining operations.',
  },
]

export default function HowItWorks() {
  return (
    <div className="container mx-auto p-8">
      <SectionHeading title="How It Works" />
      <div className="relative bg-cover bg-center my-8 rounded-lg" style={{backgroundImage: 'url(https://placehold.co/1920x600/png)'}}>
        {/* <Image
          src="https://placehold.co/1920x600/png?text=How+It+Works+Image"
          alt="How It Works"
          width={1920}
          height={600}
          className="w-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-background/80 z-1 rounded-lg"></div>
        <div className="relative z-2 grid grid-cols-1 md:grid-cols-4 gap-6 py-8 px-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="h-full backdrop-blur-md p-8 flex flex-col gap-4 rounded-lg"
            >
              <p className="text-6xl font-bold text-primary" aria-hidden='true'>{step.number}</p>
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
