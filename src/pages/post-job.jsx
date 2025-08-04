"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import PostJobContent from "@/components/dashboard/tabs/post-job-content"

export default function PostJob() {
  const [userRole, setUserRole] = useState("client")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <PostJobContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
