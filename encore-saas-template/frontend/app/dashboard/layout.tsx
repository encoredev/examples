"use client"

import { useFirebase } from "@/app/lib/firebase/FirebaseProvider"
import { redirect } from "next/navigation"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useFirebase()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <main className="container py-24">
        {children}
      </main>
    </div>
  )
} 