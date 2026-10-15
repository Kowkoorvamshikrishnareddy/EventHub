import type { Metadata } from "next"
import CategoryHeader from "@/components/events/CategoryHeader"
import CategoryEvents from "@/components/events/CategoryEvents"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return {
    title: `${categoryName} Events | EventHub`,
    description: `Browse all ${slug} events on EventHub`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <CategoryHeader slug={slug} />
      <CategoryEvents slug={slug} />
    </div>
  )
}
