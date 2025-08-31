import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import SessionProvider from "@/components/providers/SessionProvider"
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar'
import Footer from '@/components/layout/Footer'

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "QioGems - Premium Jewelry Collection",
  description: "Discover exquisite jewelry pieces at QioGems. Premium quality diamonds, gemstones, and handcrafted designs.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-inter bg-cream-50 text-charcoal-900 antialiased`}
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <ConditionalNavbar />
              {children}
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
