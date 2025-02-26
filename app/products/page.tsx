import { Suspense } from "react"; // Importar Suspense
import { ProductFilters } from "@/components/product-filters";
import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { getProducts, getCategories, getConditions } from "@/lib/data";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: {
    search?: string | string[];
    categories?: string | string[];
    conditions?: string | string[];
    types?: string | string[];
    sort?: string; // Nuevo parámetro para el ordenamiento
  };
}) {
  // Convertir parámetros a formato seguro
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search || "";

  const categories = Array.isArray(searchParams.categories)
    ? searchParams.categories.map(Number).filter((n) => !isNaN(n))
    : searchParams.categories?.split(",").map(Number).filter((n) => !isNaN(n)) || [];

  const conditions = Array.isArray(searchParams.conditions)
    ? searchParams.conditions.map(Number).filter((n) => !isNaN(n))
    : searchParams.conditions?.split(",").map(Number).filter((n) => !isNaN(n)) || [];

  const allowedTypes = ["new", "used", "other"] as const;
  const types = (Array.isArray(searchParams.types)
    ? searchParams.types
    : searchParams.types?.split(",") || []
  ).filter((t): t is "new" | "used" | "other" => allowedTypes.includes(t as any));

  // Obtener datos en paralelo
  const [productsData, categoriesData, conditionsData] = await Promise.all([
    getProducts({
      search,
      categories,
      conditions,
      types,
    }),
    getCategories(),
    getConditions(),
  ]);

  // Ordenar los productos según el parámetro `sort`
  let sortedProducts = [...(productsData.products || [])];
  const sortBy = searchParams.sort;

  if (sortBy === "price_desc") {
    sortedProducts.sort((a, b) => b.precio_usd - a.precio_usd); // Mayor a menor
  } else if (sortBy === "price_asc") {
    sortedProducts.sort((a, b) => a.precio_usd - b.precio_usd); // Menor a mayor
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            {/* Envolver ProductFilters con Suspense */}
            <Suspense fallback={<div>Loading Filters...</div>}>
              <ProductFilters
                categories={categoriesData}
                conditions={conditionsData}
              />
            </Suspense>
          </div>
          <div className="md:col-span-3">
            <ProductGrid
              key={`${search}-${categories}-${conditions}-${sortBy}`} // Incluir sortBy en la key
              products={sortedProducts} // Pasar los productos ordenados
              searchParams={searchParams}
              categories={categoriesData}
              conditions={conditionsData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
