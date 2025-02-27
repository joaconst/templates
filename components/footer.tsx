import { Instagram, MapPin, MessageSquare  } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">GreenPlace</h3>
            <p className="text-sm text-muted-foreground">Tu tienda premium de productos Apple en Córdoba, Argentina.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ubicación</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Colon y Cañada
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://wa.me/5493512362632?text=Hola%20GreenPlace,%20me%20gustaría%20hacer%20una%20consulta."
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/greenplace/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

