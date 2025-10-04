import { cn } from "@/lib/utils"
import { userRoles } from "@/utils/constants"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { Settings } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function DashboardSidebarContent({ userRole, activeItem, setActiveItem }) {
  const sidebarItems =
    userRole === userRoles.FREELANCER ? freelancerItems : clientItems

  const handleItemClick = (href) => {
    setActiveItem(href)
  }

  return (
    <div className="sticky top-0 flex flex-col h-full">
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {sidebarItems?.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => handleItemClick(item.href)}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                activeItem === item.href
                  ? "bg-primary text-white hover:shadow-md hover:bg-primary/80 hover:text-white"
                  : "text-muted-foreground"
              )}
            >
              <item.icon
                className="h-5 w-5 flex-shrink-0"
              />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t p-2">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </div>
  )
}
