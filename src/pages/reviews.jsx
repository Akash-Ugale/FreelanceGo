"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import ReviewsContent from "@/components/dashboard/tabs/reviews-content"
import { useAuth } from "@/context/AuthContext"

export default function Reviews() {
  const {userRole} = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole}  />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <ReviewsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
