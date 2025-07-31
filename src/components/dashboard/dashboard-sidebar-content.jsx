import { cn } from "@/lib/utils"
import { Settings } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function DashboardSidebarContent({
  userRole,
  onItemClick,
  freelancerItems,
  clientItems,
}) {
  const [activeItem, setActiveItem] = useState("/dashboard")
  const sidebarItems = userRole === "freelancer" ? freelancerItems : clientItems

  const handleItemClick = (href) => {
    setActiveItem(href)
    if (onItemClick) onItemClick()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="font-semibold text-lg">
          {userRole === "freelancer" ? "Freelancer" : "Client"} Dashboard
        </h2>
        <p className="text-sm text-muted-foreground capitalize">
          {userRole} Navigation
        </p>
      </div>

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
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Settings</span>
        </div>
      </div>
    </div>
  )
}
