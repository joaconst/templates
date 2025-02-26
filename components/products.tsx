"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "999.999 ARS",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: "1.499.999 ARS",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "iPad Pro",
    price: "799.999 ARS",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Apple Watch Series 9",
    price: "399.999 ARS",
    image: "/placeholder.svg",
  },
]

export function Products() {
  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tighter mb-8">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.price}</p>
                <Button className="w-full mt-2">Añadir al carrito</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

