import { apiClient } from "@/api/AxiosServiceApi"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import DashboardSidebarMobile from "@/components/dashboard/dashboard-sidebar-mobile"
import FullscreenLoader from "@/components/FullScreenLoader"
import { useAuth } from "@/context/AuthContext"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Dashboard() {
  const { userRole, authLoading } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const navigate = useNavigate()

  if (authLoading) {
    return <FullscreenLoader show={true} />
  }

  async function validateToken(token) {
    try {
      const response = await apiClient.get("/api/isAuthenticated", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      console.log(response)
      const { status } = response
      if (status !== 200) {
        localStorage.removeItem("token")
        navigate("/", { replace: true })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      validateToken(token)
    } else {
      navigate("/", { replace: true })
    }
  }, [])

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
          <Outlet />
        </main>
      </div>
    </div>
  )
}
