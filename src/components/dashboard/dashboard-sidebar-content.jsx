import { cn } from "@/lib/utils"
import { userRoles } from "@/utils/constants"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { Settings } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function DashboardSidebarContent({ userRole }) {
  const [activeItem, setActiveItem] = useState("/dashboard")
  const sidebarItems =
    userRole === userRoles.FREELANCER ? freelancerItems : clientItems

  const handleItemClick = (href) => {
    setActiveItem(href)
  }

  return (
    <div className="sticky top-0 flex flex-col h-full">
      {/* Header */}
      {/* <div className="p-6 border-b">
        <h2 className="font-semibold text-lg">
          {userRole === userRoles.FREELANCER ? "Freelancer" : "Client"}{" "}
          Dashboard
        </h2>
      </div> */}

      {/* Navigation Items */}
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
                  ? "bg-primary/30 text-primary hover:bg-primary/30 hover:text-primary"
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
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </div>
  )
}
