"use client"

import AnalyticsContent from "@/components/dashboard/tabs/analytics-content"
import { useAuth } from "@/context/AuthContext"

export default function Analytics() {
  const { userRole } = useAuth()

  return <AnalyticsContent userRole={userRole} />
}
