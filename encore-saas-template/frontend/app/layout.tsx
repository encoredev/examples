import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FirebaseProvider } from "@/app/lib/firebase/FirebaseProvider"
import { Toaster } from "@/components/ui/sonner"
import { Navigation } from "@/components/navigation"
import TanstackQueryProvider from "./lib/TanstackQueryProvider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EncoreKit",
  description: "Your SaaS starter kit built with Encore",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} min-h-screen bg-[#EBEBDF] antialiased overflow-x-hidden`}>
        <TanstackQueryProvider>
          <FirebaseProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navigation />
              <div className="flex-1">
                {children}
              </div>
            </div>
            <Toaster />
          </FirebaseProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
