"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import EarningsContent from "@/components/dashboard/tabs/earnings-content"

export default function Earnings() {
  const [userRole, setUserRole] = useState("freelancer")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <EarningsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
