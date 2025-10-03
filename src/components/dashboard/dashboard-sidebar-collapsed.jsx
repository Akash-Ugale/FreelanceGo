import { cn } from "@/lib/utils"
import { userRoles } from "@/utils/constants"
import { clientItems, freelancerItems } from "@/utils/sidebar-items"
import { Settings } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export default function DashboardSidebarContentCollapsed({ userRole }) {
  const [activeItem, setActiveItem] = useState("/dashboard")
  const sidebarItems =
    userRole === userRoles.FREELANCER ? freelancerItems : clientItems

  return (
    <div className="flex flex-col items-center space-y-1 w-full overflow-y-auto">
      {sidebarItems.map((item) => (
        <TooltipProvider key={item.href} delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-md bg-popover text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm",
                  activeItem === item.href
                    ? "bg-primary/30 text-primary hover:bg-primary/30 hover:text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="py-2 px-4 bg-popover backdrop-blur-2xl text-popover-foreground rounded-full border"
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <div>
        <Link
          to="/settings"
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-md bg-popover text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
          )}
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
