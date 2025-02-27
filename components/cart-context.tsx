"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/types"

type CartItem = {
  product: Product
  quantity: number
}

type CartContextType = {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
  
      // Si el producto es usado y ya existe en el carrito, no lo añade
      if (existing && product.type === "used") {
        return prev; // No añadir si ya está
      }
  
      return existing
        ? prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          // Si el producto es usado, solo permite la cantidad 1
          if (item.product.type === "used") {
            return { ...item, quantity: 1 }
          }
  
          return { ...item, quantity: Math.max(1, quantity) }
        }
        return item
      })
    )
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.precio_usd * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
