import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import DashboardSidebarContentCollapsed from "./dashboard-sidebar-collapsed"
import DashboardSidebarContent from "./dashboard-sidebar-content"

export default function DashboardSidebar() {
  const { userRole } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "sticky top-0 hidden md:flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-full top-2 z-10 h-6 w-6 rounded-l-none border bg-background shadow-none"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Sidebar Content */}
      {!collapsed && (
        <DashboardSidebarContent
          userRole={userRole}
          freelancerItems={freelancerItems}
          clientItems={clientItems}
        />
      )}

      {/* Collapsed State */}
      {collapsed && (
        <div className="flex flex-col items-center py-6 space-y-4">
          <DashboardSidebarContentCollapsed
            userRole={userRole}
            collapsed
            freelancerItems={freelancerItems}
            clientItems={clientItems}
          />
        </div>
      )}
    </div>
  )
}
