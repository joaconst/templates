"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/types"
import { motion } from "framer-motion"
import { useState } from "react"

export function ProductDetails({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        Ver más info
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">  
          <DialogHeader>
            <DialogTitle>{product.modelo}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sección de imagen */}
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <motion.img
                src="/placeholder.svg"
                alt={product.modelo}
                className="h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </div>

            {/* Detalles técnicos */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                  Categoría: {product.category_name}
                </Badge>
                {product.condicion_id && (
                  <Badge variant={product.condicion_id === 1 ? "default" : "secondary"}>
                    {product.condicion_id === 1 ? 'Nuevo' : 'Usado'}
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center gap-4">
                <PriceDisplay 
                  usd={product.precio_usd} 
                  ars={product.precio_ars} 
                />
                <Button 
                  variant="default" 
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => console.log('Añadir al carrito', product.id)} // Aquí tu lógica
                >
                  Añadir al carrito
                </Button>
              </div>

              <div className="space-y-2">
                {product.capacidad && (
                  <DetailItem label="Capacidad" value={product.capacidad} />
                )}

                {product.bateria && (
                  <DetailItem label="Batería" value={`${product.bateria}%`} />
                )}

                {product.codigo && (
                  <DetailItem label="Código" value={product.codigo} />
                )}

                {product.color && (
                  <DetailItem label="Color" value={product.color} />
                )}
              </div>

              {product.cuotas && (
                <Installments cuotas={product.cuotas} />
              )}

              {product.info && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Información adicional</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {product.info}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Componentes auxiliares (mantenemos los mismos con mejoras de estilo)
const PriceDisplay = ({ usd, ars }: { usd: number; ars?: number }) => (
  <div className="bg-muted p-4 rounded-lg flex-grow">
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">USD ${usd.toLocaleString('es-AR')}</span>
      {ars && (
        <span className="text-sm text-muted-foreground">
          (ARS ${ars.toLocaleString('es-AR')})
        </span>
      )}
    </div>
  </div>
)

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
)

const Installments = ({ cuotas }: { cuotas?: Product['cuotas'] }) => {
  if (!cuotas) return null
    
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-sm font-medium mb-2">Plan de cuotas</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(cuotas).map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="text-muted-foreground">
              {key.replace('cuotas_', '')}x:
            </span>
            <span className="ml-2 font-medium">
              ${value.toLocaleString('es-AR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}