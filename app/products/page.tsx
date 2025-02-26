import { ProductFilters } from "@/components/product-filters"
import { Header } from "@/components/header"
import { ProductGrid } from "@/components/product-grid"
import { getProducts, getCategories, getConditions } from "@/lib/data"
import type { Product } from "@/lib/types"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { 
    search?: string | string[]
    categories?: string | string[]
    conditions?: string | string[]
    types?: string | string[]
  }
}) {
  // Convertir parámetros a formato seguro
  const search = Array.isArray(searchParams.search) 
    ? searchParams.search[0] 
    : searchParams.search || ""
  
  const categories = Array.isArray(searchParams.categories)
    ? searchParams.categories
    : searchParams.categories?.split(',') || []
  
  const conditions = Array.isArray(searchParams.conditions)
    ? searchParams.conditions
    : searchParams.conditions?.split(',') || []

  // Obtener datos en paralelo
  const [productsData, categoriesData, conditionsData] = await Promise.all([
    getProducts({
      search,
      categories: categories.map(Number).filter(n => !isNaN(n)),
      conditions: conditions.map(Number).filter(n => !isNaN(n)),
      types: Array.isArray(searchParams.types) // Corrección aplicada aquí
        ? searchParams.types 
        : searchParams.types?.split(',') || []
    }),
    getCategories(),
    getConditions()
  ])

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <ProductFilters
              categories={categoriesData}
              conditions={conditionsData}
            />
          </div>
          <div className="md:col-span-3">
            <ProductGrid 
              key={`${search}-${categories}-${conditions}`}
              products={productsData.products || []}
              searchParams={searchParams}
              categories={categoriesData}
              conditions={conditionsData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}