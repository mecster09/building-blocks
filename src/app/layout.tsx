'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { Providers } from '@/store/provider'
import { DataInitializer } from '@/components/DataInitializer'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="transition-colors duration-200">
        <Providers>
          <ThemeProvider>
            <DataInitializer />
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
