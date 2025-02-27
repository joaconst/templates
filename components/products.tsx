"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { getProducts } from "@/lib/data"
import { Badge } from "./ui/badge"
import { ProductDetails } from "./product-detail"

export function Products({ destacado = false }: { destacado?: boolean }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await getProducts({ destacado })
        if (result.error) throw new Error(result.error)
        
        setProducts(result.products)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar productos")
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [destacado])

  if (loading) return (
    <div className="text-center py-20 text-muted-foreground">
      Cargando productos...
    </div>
  )

  if (error) return (
    <div className="text-center py-20 text-destructive">
      Error: {error}
    </div>
  )

  return (
    <section className="py-20">
      <div className="container">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-primary">
            {destacado ? 'Productos Destacados' : 'Todos los Productos'}
          </h2>
          <p className="text-muted-foreground">{products.length} resultados encontrados</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={`${product.type}-${product.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-background rounded-lg p-4 shadow-sm dark:hover:shadow-md hover:shadow-lg transition-all"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.imagen_url || "/placeholder.svg"}
                  alt={product.modelo}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  priority={index < 4}
                  loading={index >= 4 ? "lazy" : "eager"}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{product.modelo}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category_name}
                      {product.capacidad && ` • ${product.capacidad}`}
                    </p>
                  </div>
                  {product.type === 'new' && product.condicion_id === 1 && (
                    <Badge variant="default" className="ml-2">
                      Nuevo
                    </Badge>
                  )}
                  {product.type === 'used' && product.condicion_id === 2 && (
                    <Badge variant="secondary" className="ml-2">
                      Usado
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">
                      USD ${product.precio_usd.toLocaleString("es-AR")}
                    </p>
                    {product.precio_ars && (
                      <p className="text-sm text-muted-foreground">
                        ARS ${product.precio_ars.toLocaleString("es-AR")}
                      </p>
                    )}
                  </div>
                  <ProductDetails product={product} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}