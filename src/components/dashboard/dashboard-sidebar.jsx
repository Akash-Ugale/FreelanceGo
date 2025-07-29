import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import DashboardSidebarContent from "./dashboard-sidebar-content"

export default function DashboardSidebar({ userRole }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    
    
    <div
      className={cn(
        "relative hidden md:flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Sidebar Content */}
      {!collapsed && <DashboardSidebarContent userRole={userRole} />}

      {/* Collapsed State */}
      {collapsed && (
        <div className="flex flex-col items-center py-6 space-y-4">
          {/* Collapsed navigation items would go here */}
        </div>
      )}
    </div>
  )
}
