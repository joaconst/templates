"use client"

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import React from "react"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "iPhone",
    href: "/products?categories=1",
    description: "Experimente los últimos modelos de iPhone con potentes funciones.",
  },
  {
    title: "iPad",
    href: "/products?categories=4",
    description: "Tabletas versátiles para la creatividad y la productividad.",
  },
  {
    title: "Mac",
    href: "/products?categories=2",
    description: "Potentes ordenadores para uso profesional y personal.",
  },
  {
    title: "Watch",
    href: "/products?categories=3",
    description: "Monitoreo avanzado de salud y seguimiento de estado físico.",
  },
  {
    title: "AirPods",
    href: "/products?categories=5",
    description: "Audio inalámbrico con una calidad de sonido increíble.",
  },
]

export function ProductNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Productos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] dark:bg-white bg-background dark:text-black text-white">
              {components.map((component) => (
                <ListItem key={component.title} title={component.title} href={component.href}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/products" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors dark:hover:bg-accent hover:bg-accent/50 focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50">
              Todos los productos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors dark:hover:bg-accent hover:bg-accent/50 focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

