"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import MessagesContent from "@/components/dashboard/tabs/message-content"

export default function Messages() {
  const [userRole, setUserRole] = useState("client")

  return (
    <MessagesContent userRole={userRole} />
  )
}
