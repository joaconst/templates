"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { getCategories, searchProducts } from "@/lib/data"
import { Product } from "@/lib/types"

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categories, setCategories] = React.useState<Array<{id: number, name: string}>>([])
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories()
      setCategories(cats)
    }
    loadCategories()
  }, [])

  React.useEffect(() => {
    const search = async () => {
      setLoading(true)
      const results = await searchProducts(searchQuery)
      setFilteredProducts(results)
      setLoading(false)
    }

    const debounce = setTimeout(() => {
      search()
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = (value: string) => {
    setOpen(false)
    if (value.startsWith("category:")) {
      const categoryId = value.replace("category:", "")
      router.push(`/products?categories=${categoryId}`)
    } else {
      router.push(`/products?search=${encodeURIComponent(value)}`)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full max-w-sm flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground rounded-md border bg-background shadow-sm transition-colors dark:hover:bg-accent hover:bg-accent/50 hover:text-accent-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Buscar productos...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search products..." 
          value={searchQuery} 
          onValueChange={setSearchQuery} 
        />
        <CommandList>
          {loading && <CommandEmpty>Searching...</CommandEmpty>}
          {!loading && filteredProducts.length === 0 && searchQuery.length > 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {filteredProducts.length > 0 && (
            <CommandGroup heading="Products">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.modelo}
                  onSelect={handleSelect}
                  className="flex items-center gap-2"
                >
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.modelo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.precio_usd.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!searchQuery && (
            <CommandGroup heading="Categories">
              {categories.map((category) => (
                <CommandItem 
                  key={category.id} 
                  value={`category:${category.id}`} 
                  onSelect={handleSelect}
                >
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}