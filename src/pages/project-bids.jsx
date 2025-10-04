"use client"

import { useState } from "react"
import { useParams } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import ProjectBidsContent from "@/components/dashboard/tabs/project-bid-content"

export default function ProjectBids() {
  const [userRole, setUserRole] = useState("client")
  const params = useParams()
  const projectId = params.projectId

return (
    <main className="p-4 md:p-6">
      <ProjectBidsContent projectId={projectId} />
    </main>
  )

}
