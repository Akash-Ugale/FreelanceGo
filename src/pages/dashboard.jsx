import { apiClient } from "@/api/AxiosServiceApi"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar"
import FullscreenLoader from "@/components/FullScreenLoader"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Dashboard() {
  const { userRole, authLoading } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("/dashboard")
  const navigate = useNavigate()

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

  if (authLoading) {
    return <FullscreenLoader show={true} />
  }

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-background flex flex-col">
      {/* Dashboard Header */}
      <div>
        <DashboardHeader
          userRole={userRole}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      </div>

      {/* Layout Content */}
      <div className="relative flex-1 flex max-h-full overflow-y-auto">
        <DashboardSidebar
          userRole={userRole}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
        <main className="flex-1 h-fit p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
