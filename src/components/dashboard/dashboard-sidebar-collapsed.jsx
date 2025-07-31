import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export default function DashboardSidebarContentCollapsed({
  userRole,
  freelancerItems,
  clientItems,
}) {
  const sidebarItems = userRole === "freelancer" ? freelancerItems : clientItems

  return (
    <div className="flex flex-col items-center space-y-4">
      {sidebarItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          )}
        >
          <item.icon className="h-5 w-5" />
        </Link>
      ))}
    </div>
  )
}
