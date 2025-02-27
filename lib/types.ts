export type Product = {
  id: string | number
  type: 'new' | 'used' | 'other'
  categoria_id: number
  category_name: string
  condicion_id?: number
  modelo: string
  color: string
  precio_usd: number
  precio_ars?: number
  capacidad?: string
  bateria?: number
  codigo?: string
  cuotas?: {
    cuotas_3: number
    cuotas_6: number
    cuotas_9: number
    cuotas_12: number
  }
  info?: string
  imagen_url?: string   // Opción desde URL externa
  destacado?: boolean
}

export type ProductFilterParams = {
  categories?: number[]      // IDs 1-6
  conditions?: number[]      // 1 (nuevo) o 2 (usado)
  types?: ('new' | 'used' | 'other')[]
  search?: string
  destacado?: boolean
}