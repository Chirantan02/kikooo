import './globals.css'
import type { Metadata } from 'next'
import PageTransition from '@/components/PageTransition'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Khushi | Premium UI/UX Designer Portfolio',
  description: 'Premium UI/UX design portfolio showcasing innovative digital experiences and creative solutions by Khushi - UI/UX Designer specializing in user-centered design.',
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
