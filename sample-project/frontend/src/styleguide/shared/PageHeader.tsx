interface PageHeaderProps {
  title: string
  description: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <h1 className="text-3xl font-bold text-text-base">{title}</h1>
      <p className="mt-2 text-text-muted">{description}</p>
    </div>
  )
}
