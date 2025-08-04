"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import ProposalsContent from "@/components/dashboard/tabs/proposals-content"

export default function Proposals() {
  const [userRole, setUserRole] = useState("freelancer") // no type annotation here

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <ProposalsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
