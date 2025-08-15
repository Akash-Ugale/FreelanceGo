import DashboardContent from "@/components/dashboard/dashboard-content"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardSidebarMobile from "@/components/dashboard/dashboard-sidebar-mobile"
import FullscreenLoader from "@/components/FullScreenLoader"
import { useAuth } from "@/context/AuthContext"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { useState } from "react"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
  const {userRole, authLoading} = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  
  if (authLoading) {
    return <FullscreenLoader show={true} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div>
        <DashboardHeader userRole={userRole} />
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
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
