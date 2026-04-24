'use client'

import { Mail, MapPin } from 'lucide-react'

// WhatsApp SVG icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export function Footer() {
  const getWhatsAppUrl = (phone: string, message?: string) => {
    const baseUrl = `https://wa.me/54${phone}`
    return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl
  }

  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-5">
        {/* Contact Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-3 text-sm">
          <a
            href={getWhatsAppUrl('2994516661', 'Hola, quiero hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Oficina 2994516661</span>
          </a>

          <a
            href={getWhatsAppUrl('2995047661', 'Hola, quiero hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>PAS Juan Carlos 2995047661</span>
          </a>

          <a
            href="https://maps.google.com/?q=Belgrano+3585+Neuquen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>Belgrano 3585</span>
          </a>

          <a
            href="mailto:atoval21@yahoo.com"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>atoval21@yahoo.com</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-slate-700 pt-3 space-y-1">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Toval Seguros</p>
          <p className="text-slate-600 text-[10px]">
            Creado por{' '}
            <span className="text-slate-400">Julian Perez</span>
            {' · '}
            <a
              href="mailto:mordecaaii@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              mordecaaii@gmail.com
            </a>
            {' · '}
            <a
              href={`https://wa.me/542994194401?text=${encodeURIComponent('Hola me gustan los sistemas y páginas que haces!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              2994194401
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}