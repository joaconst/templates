"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ProductFilters({
  categories = [],
  conditions = [],
}: {
  categories?: Array<{ id: number; name: string }>;
  conditions?: Array<{ id: number; name: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);

  // Estado para controlar qué secciones están abiertas
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sort: false,
    categories: false,
    conditions: false,
  });

  // Alternar la visibilidad de una sección
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const categoriesFromUrl = searchParams.get("categories")?.split(",").map(Number) || [];
    const conditionsFromUrl = searchParams.get("conditions")?.split(",").map(Number) || [];
    const sortFromUrl = searchParams.get("sort");

    setSelectedCategories(categoriesFromUrl);
    setSelectedConditions(conditionsFromUrl);
    setSortBy(sortFromUrl);
  }, [searchParams]);

  const updateFilter = (type: "categories" | "conditions", value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(params.get(type)?.split(",").map(Number) || []);

    current.has(value) ? current.delete(value) : current.add(value);

    if (current.size > 0) {
      params.set(type, Array.from(current).join(","));
    } else {
      params.delete(type);
    }

    updateUrl(params);
  };

  const updateSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === sortBy) {
      params.delete("sort");
      setSortBy(null);
    } else {
      params.set("sort", value);
      setSortBy(value);
    }

    updateUrl(params);
  };

  const updateUrl = (params: URLSearchParams) => {
    router.push(`/products?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  return (
    <div className="w-full md:sticky md:top-20 md:h-[calc(100vh-6rem)] md:overflow-y-auto">
      {/* Botón móvil para mostrar/ocultar todos los filtros */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex justify-between items-center p-4 bg-card dark:bg-card-foreground text-card-foreground dark:text-card rounded-lg mb-4"
      >
        <span>Filtros</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Contenido de filtros */}
      <div className={`${isOpen ? "block" : "hidden"} md:block md:w-64 space-y-6 pb-6`}>
        {/* Sección de ordenamiento */}
        <AccordionSection
          title="Ordenar por"
          isOpen={openSections.sort}
          onToggle={() => toggleSection("sort")}
        >
          <div className="space-y-1">
            <button
              onClick={() => updateSort("price_desc")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === "price_desc"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent/50 hover:text-foreground"
                }`}
            >
              Más caro primero
            </button>
            <button
              onClick={() => updateSort("price_asc")}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${sortBy === "price_asc"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent/50 hover:text-foreground"
                }`}
            >
              Más barato primero
            </button>
          </div>
        </AccordionSection>

        {/* Sección de categorías */}
        <AccordionSection
          title="Categorías"
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        >
          <FilterSection
            items={categories}
            selectedIds={selectedCategories}
            onSelect={(id) => updateFilter("categories", id)}
          />
        </AccordionSection>

        {/* Sección de condición */}
        <AccordionSection
          title="Condición"
          isOpen={openSections.conditions}
          onToggle={() => toggleSection("conditions")}
        >
          <FilterSection
            items={conditions}
            selectedIds={selectedConditions}
            onSelect={(id) => updateFilter("conditions", id)}
          />
        </AccordionSection>
      </div>
    </div>
  );
}

// Componente reutilizable para cada sección de filtro
const FilterSection = ({
  items,
  selectedIds,
  onSelect,
}: {
  items: Array<{ id: number; name: string }>;
  selectedIds: number[];
  onSelect: (id: number) => void;
}) => (
  <div className="space-y-1">
    {items.map((item) => (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${selectedIds.includes(item.id)
            ? "bg-primary text-primary-foreground"
            : "hover:bg-accent/50 hover:text-foreground"
          }`}
      >
        {item.name}
      </button>
    ))}
  </div>
);

// Componente de acordeón para las secciones
const AccordionSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="mb-4 last:mb-0">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-2 rounded-lg dark:hover:bg-accent hover:bg-accent/50 transition-colors"
    >
      <h3 className="text-lg font-semibold dark:text-dark">
        {title}
      </h3>
      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </button>
    <div className={`${isOpen ? "block" : "hidden"} mt-2`}>
      {children}
    </div>
  </div>
);