"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import ProjectsContent from "@/components/dashboard/tabs/project-content"

export default function Projects() {
  const [userRole, setUserRole] = useState("freelancer")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <ProjectsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
