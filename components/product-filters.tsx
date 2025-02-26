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

  useEffect(() => {
    // Sincronizar el estado de los filtros con los parámetros de búsqueda cuando se monta el componente.
    const categoriesFromUrl = searchParams.get('categories')?.split(',').map(Number) || [];
    const conditionsFromUrl = searchParams.get('conditions')?.split(',').map(Number) || [];

    setSelectedCategories(categoriesFromUrl);
    setSelectedConditions(conditionsFromUrl);
  }, [searchParams]); // Reaccionar cuando los parámetros de búsqueda cambian

  const updateFilter = (type: "categories" | "conditions", value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(params.get(type)?.split(',').map(Number) || []);

    current.has(value) ? current.delete(value) : current.add(value);

    current.size > 0
      ? params.set(type, Array.from(current).join(','))
      : params.delete(type);

    router.push(`/products?${params.toString()}`, { scroll: false });
    router.refresh();
  };

  return (
    <div className="w-full">
      {/* Botón móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4"
      >
        <span>Filtros</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Contenido de filtros */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:block md:w-64 space-y-6`}>
        {/* Sección de Categorías */}
        <FilterSection
          title="Categorías"
          items={categories}
          selectedIds={selectedCategories}
          onSelect={(id) => updateFilter("categories", id)}
        />

        {/* Sección de Condición */}
        <FilterSection
          title="Condición"
          items={conditions}
          selectedIds={selectedConditions}
          onSelect={(id) => updateFilter("conditions", id)}
        />
      </div>
    </div>
  );
}

// Componente reutilizable para secciones de filtro
const FilterSection = ({
  title,
  items,
  selectedIds,
  onSelect,
}: {
  title: string;
  items: Array<{ id: number; name: string }>;
  selectedIds: number[];
  onSelect: (id: number) => void;
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-3 px-2">{title}</h3>
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedIds.includes(item.id)
              ? "bg-[#8cea00] text-black"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  </div>
);
