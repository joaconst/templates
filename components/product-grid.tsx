"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { ProductDetails } from "./product-detail";
import { ClearFiltersButton } from "./clear-filters-button";
import { useState, useEffect } from "react";

export function ProductGrid({
  products,
  searchParams,
  categories = [],
  conditions = [],
}: {
  products: Product[];
  searchParams: {
    search?: string | string[];
    categories?: string | string[];
    conditions?: string | string[];
  };
  categories?: Array<{ id: number; name: string }>;
  conditions?: Array<{ id: number; name: string }>;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar el desplazamiento
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0] || ""
    : searchParams.search || "";

  const selectedCategories = Array.isArray(searchParams.categories)
    ? searchParams.categories.map(Number)
    : searchParams.categories?.split(",").map(Number) || [];

  const selectedConditions = Array.isArray(searchParams.conditions)
    ? searchParams.conditions.map(Number)
    : searchParams.conditions?.split(",").map(Number) || [];

  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      product.modelo.toLowerCase().includes(searchLower) ||
      (product.info?.toLowerCase().includes(searchLower) ?? false);

    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.includes(product.categoria_id);

    const matchesCondition = selectedConditions.length === 0 ||
      (product.condicion_id ? selectedConditions.includes(product.condicion_id) : true);

    return matchesSearch && matchesCategory && matchesCondition;
  });

  const activeCategories = selectedCategories
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter((name): name is string => !!name);

  const activeConditions = selectedConditions
    .map((id) => conditions.find((c) => c.id === id)?.name)
    .filter((name): name is string => !!name);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Productos</h2>
          <p className="text-muted-foreground">{filteredProducts.length} resultados encontrados</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap gap-2 flex-1">
            {activeCategories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
            {activeConditions.map((condition) => (
              <Badge key={condition} variant="secondary">
                {condition}
              </Badge>
            ))}
            {search && <Badge variant="secondary">Buscar: {search}</Badge>}
          </div>

          {/* Botón para móvil */}
          <div className="sm:hidden w-full">
            <ClearFiltersButton searchParams={searchParams} />
          </div>
        </div>

        {/* Botón para desktop */}
        <div className="hidden sm:block">
          <ClearFiltersButton searchParams={searchParams} />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No se encontraron productos.</p>
          <ClearFiltersButton searchParams={searchParams} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-background rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.imagen_url || "/placeholder.svg"}
                  alt={product.modelo}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  priority={index < 4} // Prioriza las primeras 4 imágenes (above the fold)
                  loading={index >= 4 ? "lazy" : "eager"} // Lazy loading para imágenes below the fold
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"; // Mostrar placeholder si hay un error
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
                  {product.condicion_id && (
                    <Badge
                      variant={product.condicion_id === 1 ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {product.condicion_id === 1 ? "Nuevo" : "Usado"}
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

                {product.type === "used" && product.cuotas && (
                  <div className="mt-2 p-3 bg-muted text-muted-foreground rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Cuotas sin interés:</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {Object.entries(product.cuotas).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          {key.replace("cuotas_", "")}x: ${value.toLocaleString("es-AR")}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Botón para subir arriba */}
      {isScrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg transition-all hover:bg-accent focus:outline-none"
        >
          ↑
        </button>
      )}
    </div>
  );
}