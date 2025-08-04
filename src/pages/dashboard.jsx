import DashboardContent from "@/components/dashboard/dashboard-content"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardSidebarMobile from "@/components/dashboard/dashboard-sidebar-mobile"
import FullscreenLoader from "@/components/FullScreenLoader"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { useState } from "react"

export default function Dashboard() {
  const [userRole, setUserRole] = useState("client")
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  
  return (
    <div className="min-h-screen bg-background">
      <FullscreenLoader show={false} />
      {/* Dashboard Header */}
      <div>
        <DashboardHeader userRole={userRole} onRoleChange={setUserRole} />
      </div>

      {/* Layout Content */}
      <div className="flex">
        <DashboardSidebar userRole={userRole} />
        <DashboardSidebarMobile
          isOpen={mobileSidebarOpen}
          setIsOpen={setMobileSidebarOpen}
          userRole={userRole}
          freelancerItems={freelancerItems}
          clientItems={clientItems}
        />
        <main className="flex-1 p-4 md:p-6">
          <DashboardContent userRole={userRole} />
        </main>
      </div>
    </div>
  )
}
