
import { useState } from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import BrowseJobsContent from "@/components/dashboard/tabs/browse-jobs-content"

export default function BrowseJobs() {
  const [userRole, setUserRole] = useState("freelancer") // ✅ fixed here

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <main className="flex-1 p-4 md:p-6">
          <BrowseJobsContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
