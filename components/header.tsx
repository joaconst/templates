"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { SearchCommand } from "@/components/search-command"
import { ProductNav } from "@/components/product-nav"
import { MobileNav } from "@/components/mobile-nav"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            GreenPlace
          </Link>
          <div className="hidden md:flex">
            <ProductNav />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="flex-1 max-w-sm">
            <SearchCommand />
          </div>
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

