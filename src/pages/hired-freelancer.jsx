"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import HiredFreelancersContent from "@/components/dashboard/tabs/hired-freelancer-content"

export default function HiredFreelancers() {
  const [userRole, setUserRole] = useState("client")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <HiredFreelancersContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
