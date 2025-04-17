import './globals.css'
import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Chirantan Bhardwaj | Portfolio',
  description: 'Personal Portfolio of Chirantan Bhardwaj - Designer, Developer, and Creative Professional',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black scroll-smooth">
      <body className="min-h-screen bg-black text-white overflow-y-auto overflow-x-hidden">
        <PageTransition>
          {children}
        </PageTransition>
        <Analytics />
      </body>
    </html>
  )
}
