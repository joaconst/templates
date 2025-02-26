"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getCategories } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { usePathname, useSearchParams } from "next/navigation"
import { ClearFiltersButton } from "./clear-filters-button"

type Category = {
  id: number
  name: string
}

export function MobileNav() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  // Obtenemos los parámetros de búsqueda una sola vez
  const currentSearch = searchParams.get('search') || undefined
  const currentCategories = searchParams.get('categories') || undefined
  const currentConditions = searchParams.get('conditions') || undefined

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData: Category[] = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) fetchCategories()
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <div className="flex flex-col gap-6 h-full">
          <h2 className="text-xl font-bold border-b pb-4">Productos</h2>

          <nav className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={{
                      pathname: '/products',
                      query: { categories: category.id }
                    }}
                    className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                  >
                    {category.name}
                  </Link>
                ))}

                <Link
                  href="/products"
                  className="block px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold mt-4"
                >
                  Ver todos los productos
                </Link>
              </div>
            )}
          </nav>

          <div className="border-t pt-4 space-y-2">
            <ClearFiltersButton searchParams={{
              search: currentSearch,
              categories: currentCategories,
              conditions: currentConditions
            }} />
            
            <Link href="/about" className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              Sobre nosotros
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              Contacto
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}