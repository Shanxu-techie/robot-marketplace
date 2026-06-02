export default function SectionHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="w-32 h-0.5 bg-accent mt-2"></div>
      {description && (
        <p className="text-muted-foreground mt-4 max-w-lg">
          {description}
        </p>
      )}
    </>
  )
}
