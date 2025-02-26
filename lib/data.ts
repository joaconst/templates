import { supabase } from './supabase/client';
import { Product, ProductFilterParams } from './types';

const mapProduct = {
  new: (item: any) => ({
    id: item.id,
    type: 'new' as const,
    categoria_id: item.categoria_id,
    category_name: item.categorias?.name || 'iPhone',
    condicion_id: 1,
    modelo: item.modelo,
    capacidad: item.capacidad,
    color: item.color,
    precio_usd: item.precio_usd,
    precio_ars: item.precio_ars
  }),
  
  used: (item: any) => ({
    id: item.id,
    type: 'used' as const,
    categoria_id: item.categoria_id,
    category_name: item.categorias?.name || 'iPhone',
    condicion_id: 2,
    modelo: item.modelo,
    capacidad: item.capacidad,
    color: item.color,
    precio_usd: item.precio_usd,
    precio_ars: item.precio_ars,
    bateria: item.bateria,
    codigo: item.codigo,
    cuotas: {
      cuotas_3: item.cuotas_3,
      cuotas_6: item.cuotas_6,
      cuotas_9: item.cuotas_9,
      cuotas_12: item.cuotas_12
    }
  }),
  
  other: (item: any) => ({
    id: item.id,
    type: 'other' as const,
    categoria_id: item.categoria_id,
    category_name: item.categorias?.name || 'Otros',
    modelo: item.modelo,
    color: item.color,
    precio_usd: item.precio_usd,
    info: item.info,
    precio_ars: item.precio_ars || null
  })
};

export async function getProducts(filters?: ProductFilterParams) {
  try {
    const [nuevos, usados, varios] = await Promise.all([
      supabase.from('iphones_nuevos')
        .select('*, categorias:categoria_id(name)')
        .order('precio_usd', { ascending: true }),
      
      supabase.from('iphones_usados')
        .select('*, categorias:categoria_id(name)')
        .order('precio_usd', { ascending: true }),
      
      supabase.from('productos_varios')
        .select('*, categorias:categoria_id(name)')
        .order('precio_usd', { ascending: true })
    ]);

    const products: Product[] = [
      ...(nuevos.data || []).map(item => mapProduct.new(item)),
      ...(usados.data || []).map(item => mapProduct.used(item)),
      ...(varios.data || []).map(item => mapProduct.other(item))
    ];

    const filtered = products.filter(p => {
      const matchCategory = !filters?.categories?.length || 
        (filters.categories.includes(p.categoria_id));
      
      const matchCondition = !filters?.conditions?.length || 
        (p.condicion_id ? filters.conditions.includes(p.condicion_id) : false);
      
      const matchType = !filters?.types?.length || 
        (p.type ? filters.types.includes(p.type) : false);

      return matchCategory && matchCondition && matchType;
    });

    return { products: filtered, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { 
      products: [], 
      error: error instanceof Error ? error.message : "Error desconocido" 
    };
  }
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categorias')
    .select('id, name')
    .order('id');
  
  return error ? [] : data || [];
}

export async function getConditions() {
  const { data, error } = await supabase
    .from('condicion')
    .select('id, name')
    .order('id');

  return error ? [] : data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const [nuevos, usados, varios] = await Promise.all([
      supabase.from('iphones_nuevos')
        .select('*, categorias:categoria_id(name)')
        .or(`modelo.ilike.%${query}%,capacidad.ilike.%${query}%`),
      
      supabase.from('iphones_usados')
        .select('*, categorias:categoria_id(name)')
        .or(`modelo.ilike.%${query}%,capacidad.ilike.%${query}%,codigo.ilike.%${query}%`),
      
      supabase.from('productos_varios')
        .select('*, categorias:categoria_id(name)')
        .or(`modelo.ilike.%${query}%,info.ilike.%${query}%`)
    ]);

    return [
      ...(nuevos.data || []).map(mapProduct.new),
      ...(usados.data || []).map(mapProduct.used),
      ...(varios.data || []).map(mapProduct.other)
    ];
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
}