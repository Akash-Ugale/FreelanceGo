"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import ProjectsContent from "@/components/dashboard/tabs/project-content"
import { useAuth } from "@/context/AuthContext"

export default function Projects() {
  const {userRole} = useAuth()

  return (
    
          <ProjectsContent userRole={userRole} />
      
  )
}
