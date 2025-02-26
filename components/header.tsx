"use client"

import { ShoppingCart, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { SearchCommand } from "@/components/search-command"
import { ProductNav } from "@/components/product-nav"
import { MobileNav } from "@/components/mobile-nav"
import { useState } from "react"

export function Header() {
  // Estado para controlar la visibilidad del campo de búsqueda en móviles
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  // Función para alternar la visibilidad de la barra de búsqueda
  const toggleSearchVisibility = () => setIsSearchVisible(!isSearchVisible)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
            GreenPlace
          </Link>
          <div className="hidden md:flex">
            <ProductNav />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          {/* Botón de lupa visible solo en móviles */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearchVisibility}
            className="md:hidden relative"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>

          {/* Para pantallas grandes, se mantiene la barra de búsqueda visible */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <SearchCommand />
          </div>

          {/* Mostrar el campo de búsqueda debajo del header en móviles */}
          {isSearchVisible && (
            <div className="absolute top-16 left-0 w-full md:hidden">
              <SearchCommand />
            </div>
          )}

          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs font-bold">0</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
