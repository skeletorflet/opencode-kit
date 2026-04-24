import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import LicenseProvider from '@/components/LicenseProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Toval Seguros - Denuncia de Siniestros',
  description: 'Sistema moderno de denuncia de siniestros vehiculares con procesamiento inteligente de documentos',
  keywords: ['seguros', 'siniestros', 'denuncia', 'vehículos', 'argentina'],
  authors: [{ name: 'Toval Seguros' }],
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Toval Seguros - Denuncia de Siniestros',
    description: 'Sistema moderno de denuncia de siniestros vehiculares',
    url: 'https://tovalseguros.com.ar',
    siteName: 'Toval Seguros',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Toval Seguros - Denuncia de Siniestros',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LicenseProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
              {children}
            </div>
          </LicenseProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}