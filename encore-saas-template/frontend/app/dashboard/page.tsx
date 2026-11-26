"use client"

import ActivityListAdminWrapper from "@/components/activity/ActivityList"
import { SubscriptionStatusCard } from "@/components/dashboard/SubscriptionStatusCard"
import { UserProfileCard } from "@/components/user/UserProfileCard"
import { useFirebase } from "@/app/lib/firebase/FirebaseProvider"
import { redirect } from "next/navigation"
import { useUser } from "@/app/lib/hooks"

export default function DashboardPage() {
  const { user, token, isAdmin } = useFirebase()
  const { userData } = useUser(token)

  if (!user) {
    redirect("/login")
  }
  return (
    <div className="space-y-8 mx-4 pb-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-black">
          Welcome back, {userData?.display_name} {isAdmin ? "(Admin)" : ""}
        </h1>
        <p className="text-zinc-600 mt-1">
          Here&apos;s what&apos;s happening with your account
        </p>
      </div>

      {/* Subscription Status Card */}
      <SubscriptionStatusCard />

      {/* User Profile Card */}
      <UserProfileCard/>

      {/* Activity List */}
      <ActivityListAdminWrapper />
    </div>
  )
} 