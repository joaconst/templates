"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export function ClearFiltersButton({
  searchParams
}: {
  searchParams: {
    search?: string | string[]
    categories?: string | string[]
    conditions?: string | string[]
    sort?: string | string[]
  }
}) {
  const router = useRouter()
  
  // Calcular cantidad de filtros activos
  const totalFilters = 
    (searchParams.search ? 1 : 0) +
    (searchParams.categories?.length ? 1 : 0) +
    (searchParams.conditions?.length ? 1 : 0) +
    (searchParams.sort ? 1 : 0)

  const clearFilters = () => {
    router.push('/products', { scroll: false })
  }

  if (totalFilters < 2) return null // Solo mostrar si hay 2+ filtros

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={clearFilters}
      className="hover:bg-destructive/10 hover:text-destructive"
    >
      <X className="h-4 w-4 mr-1" />
      Limpiar filtros
    </Button>
  )
}