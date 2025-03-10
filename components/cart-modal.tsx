"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/components/cart-context"
import Image from "next/image"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface CartModalProps {
  trigger: React.ReactNode
}

export function CartModal({ trigger }: CartModalProps) {
  const { cartItems, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const exchangeRate = 1200
  const totalPriceARS = totalPrice * exchangeRate

  if (!isClient) {
    return null
  }

  // Función para generar mensaje de WhatsApp
  const handleWhatsApp = () => {
    const phoneNumber = "5493512362632"
    let message = "Hola GreenPlace, me gustaría comprar:\n"

    cartItems.forEach(({ product, quantity }) => {
      message += `- ${product.modelo} (${quantity} unidad${quantity > 1 ? "es" : ""})\n`
    })

    message += `\nTotal en USD: ${totalPrice.toLocaleString("es-AR")}\n`
    message += `Total en ARS: ${totalPriceARS.toLocaleString("es-AR")}`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
  }

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{trigger}</span>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Tu Carrito ({totalItems})</span>
              {totalItems > 0 && (
                <Button variant="link" size="sm" onClick={clearCart} className="text-destructive">
                  Vaciar carrito
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {cartItems.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Button onClick={() => setIsOpen(false)}>Seguir comprando</Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {cartItems.map(({ product, quantity }) => {
                  const priceARS = product.precio_usd * exchangeRate
                  return (
                    <div key={product.id} className="flex items-start gap-4 pb-4 border-b">
                      <Image
                        src={product.imagen_url || "/placeholder.svg"}
                        alt={product.modelo}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.modelo}</h3>
                        <p className="text-sm text-muted-foreground">
                          USD {product.precio_usd.toLocaleString("es-AR")}
                        </p>
                        <p className="text-xs text-gray-500">
                          ARS {priceARS.toLocaleString("es-AR")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {product.type !== "used" ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                disabled={quantity === 1}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <span>{quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </>
                          ) : (
                            <span>{quantity}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(product.id)}
                        className="text-muted-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center font-medium">
                  <span>Total en USD:</span>
                  <span>USD {totalPrice.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span>Total en ARS:</span>
                  <span>ARS {totalPriceARS.toLocaleString("es-AR")}</span>
                </div>
                <Button className="w-full" onClick={handleWhatsApp}>
                  Consultar por WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
