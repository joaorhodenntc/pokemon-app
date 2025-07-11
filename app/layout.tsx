import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pokédex - App Pokémon',
  description: 'Aplicativo para explorar informações sobre Pokémon',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
