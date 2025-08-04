"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import JobPostsContent from "@/components/dashboard/tabs/job-post-content"

export default function JobPosts() {
  const [userRole, setUserRole] = useState("client")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <JobPostsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
