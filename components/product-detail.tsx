import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useState } from "react";
import Image from "next/image";

export function ProductDetails({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        Detalles
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[95dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{product.modelo}</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Sección de imagen con altura fija en móvil */}
            <div className="aspect-square sm:aspect-auto sm:h-full max-h-[400px]">
              <Image
                src={product.imagen_url || "/placeholder.svg"}
                alt={product.modelo}
                width={600}
                height={600}
                className="h-full w-full object-cover rounded-lg"
                priority
                onError={(e) => {
                  console.error("Error cargando imagen:", product.imagen_url);
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Contenedor de detalles con scroll en móvil */}
            <div className="space-y-4 overflow-y-auto max-h-[60vh] sm:max-h-none pb-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="text-sm">
                  Categoría: {product.category_name}
                </Badge>
                {product.condicion_id && (
                  <Badge variant={product.condicion_id === 1 ? "default" : "secondary"}>
                    {product.condicion_id === 1 ? 'Nuevo' : 'Usado'}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <PriceDisplay
                  usd={product.precio_usd}
                  ars={product.precio_ars}
                />
                <Button
                  variant="default"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Añadir al carrito
                </Button>
              </div>

              <div className="space-y-3">
                {product.capacidad && <DetailItem label="Capacidad" value={product.capacidad} />}
                {product.bateria && <DetailItem label="Batería" value={`${product.bateria}%`} />}
                {product.codigo && <DetailItem label="Código" value={product.codigo} />}
                {product.color && <DetailItem label="Color" value={product.color} />}
              </div>

              {product.cuotas && <Installments cuotas={product.cuotas} />}

              {product.info && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Información adicional</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {product.info}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Componentes auxiliares
const PriceDisplay = ({ usd, ars }: { usd: number; ars?: number }) => (
  <div className="bg-muted p-4 rounded-lg w-full">
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-2xl text-black font-bold">USD ${usd.toLocaleString('es-AR')}</span>
      {ars && (
        <span className="text-sm text-muted-foreground">
          (ARS ${ars.toLocaleString('es-AR')})
        </span>
      )}
    </div>
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

const Installments = ({ cuotas }: { cuotas?: Product['cuotas'] }) => {
  if (!cuotas) return null;

  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-md font-medium mb-2 text-black">
        Plan en cuotas
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(cuotas).map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {key.replace('cuotas_', '')}x:
            </span>
            <span className="ml-2 font-medium text-muted-foreground">
              ${value.toLocaleString('es-AR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};