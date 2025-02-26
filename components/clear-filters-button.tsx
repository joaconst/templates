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
  }
}) {
  const router = useRouter()
  const hasFilters = !!searchParams.search || !!searchParams.categories || !!searchParams.conditions

  const clearFilters = () => {
    router.push('/products', { scroll: false })
  }

  if (!hasFilters) return null

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