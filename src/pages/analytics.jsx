"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import AnalyticsContent from "@/components/dashboard/tabs/analytics-content"
import { useAuth } from "@/context/AuthContext"

export default function Analytics() {
  const {userRole} = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole}/>
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <AnalyticsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
