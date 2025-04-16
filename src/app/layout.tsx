import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Personal Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black scroll-smooth">
      <body className="min-h-screen bg-black text-white overflow-y-auto overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}

