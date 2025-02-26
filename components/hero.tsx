"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-[url('/iphone-16.jpg')] bg-cover bg-center bg-no-repeat opacity-10"
      />
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl"
          >
            GreenPlace
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-muted-foreground"
          >
            Experimente la última tecnología de Apple con orientación experta y un servicio premium. Visítanos en Córdoba y 
            descubre por qué GreenPlace es tu mejor opción en productos Apple.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Button size="lg" className="animate-shimmer">
              Compra ahora
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

