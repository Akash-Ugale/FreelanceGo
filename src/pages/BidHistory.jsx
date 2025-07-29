// Freelancer bid history
"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import BidHistoryContent from "@/components/dashboard/bid-history-content"

export default function BidHistory() {
  const [userRole, setUserRole] = useState("freelancer")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <BidHistoryContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
