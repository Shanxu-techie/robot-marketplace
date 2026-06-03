import SectionHeading from './section-heading'

export default function Trust() {
  return (
    <div className="container mx-auto px-8 py-8 w-full">
      <SectionHeading
        title="Trusted by Teams That Rely on Performance"
        description="From restaurants to manufacturing floors..."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="border border-border p-4 flex justify-center items-center flex-col gap-2">
          <h3 className="text-2xl font-bold">120+</h3>
          <p className="text-muted-foreground">Robots Deployed</p>
        </div>
        <div className="border border-border p-4 flex justify-center items-center flex-col gap-2">
          <h3 className="text-2xl font-bold">8+</h3>
          <p className="text-muted-foreground">Countries</p>
        </div>
        <div className="border border-border p-4 flex justify-center items-center flex-col gap-2">
          <h3 className="text-2xl font-bold">99.2%</h3>
          <p className="text-muted-foreground">Uptime</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1 border border-border min-h-48 flex flex-col px-4 py-8 justify-center items-center gap-2 relative mt-4">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-muted border border-border"></div>
          <p className="text-lg max-w-lg text-center line-clamp-3">
            The robot integrated into our workflow faster than expected, and we
            saw measurable efficiency gains within the first month. It’s now
            handling tasks we used to assign manually.
          </p>
          <p className="text-sm text-muted-foreground">
            Sarah Malik, Operations Manager
          </p>
        </div>
        <div className="flex-1 border border-border min-h-48 flex flex-col px-4 py-8 justify-center items-center gap-2 relative mt-4">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-muted border border-border"></div>
          <p className="text-lg max-w-lg text-center line-clamp-3">
            We introduced a service robot during peak hours and reduced staff
            workload without slowing service. It became part of our daily
            operations within weeks.
          </p>
          <p className="text-sm text-muted-foreground">
            Adeel Khan, Restaurant Owner
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto md:flex-wrap scrollbar-none gap-4 py-8">
        {/* we can add background colors to the chips */}
        <div className="shrink-0 rounded-4xl px-4 py-2 border border-border">
          Restaurants
        </div>
        <div className="shrink-0 rounded-4xl px-4 py-2 border border-border">
          Manufacturing
        </div>
        <div className="shrink-0 rounded-4xl px-4 py-2 border border-border">
          Offices
        </div>
        <div className="shrink-0 rounded-4xl px-4 py-2 border border-border">
          Hospitality
        </div>
        <div className="shrink-0 rounded-4xl px-4 py-2 border border-border">
          Warehousing
        </div>
        <div className="shrink-0 rounded-4xl px-4 py-2 border border-border">
          Healthcare
        </div>
      </div>
    </div>
  )
}
