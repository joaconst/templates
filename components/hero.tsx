"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-24 h-screen min-h-[600px]">
      {/* Video de fondo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 z-0"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/iphone-16.mov" type="video/mp4" />
          <source src="/iphone-16.webm" type="video/webm" />
          Tu navegador no soporta la reproducción de videos.
        </video>
      </motion.div>

      {/* Contenido */}
      <div className="container relative z-10 h-full flex items-center">
        <div className="max-w-xl backdrop-blur-[2px] bg-white/10 p-6 rounded-lg">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl drop-shadow-md text-secondary"
          >
            GreenPlace
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-muted text-lg md:text-xl"
          >
            Experimente la última tecnología de Apple con orientación experta y un servicio premium.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Link href="/products" passHref>
              <Button size="lg" className="animate-shimmer text-lg text-secondary">
                Compra ahora
              </Button>
            </Link>

            <a
              href={`https://wa.me/5493512362632?text=${encodeURIComponent("Hola GreenPlace, me gustaría hacer una consulta.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="ml-4 animate-shimmer text-lg text-secondary">
                Contactanos
              </Button>
            </a>

          </motion.div>
        </div>
      </div>
    </section>
  )
}