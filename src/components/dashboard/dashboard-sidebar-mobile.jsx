import { useAuth } from "@/context/AuthContext"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import DashboardSidebarContent from "./dashboard-sidebar-content"

export default function DashboardSidebarMobile({
  isOpen,
  setIsOpen,
  freelancerItems,
  clientItems,
}) {
  const { userRole } = useAuth()
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dashboard</SheetTitle>
          <SheetDescription>
            <DashboardSidebarContent
              freelancerItems={freelancerItems}
              clientItems={clientItems}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
