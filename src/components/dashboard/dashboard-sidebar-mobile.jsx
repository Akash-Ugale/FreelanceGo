import { cn } from "@/lib/utils"
import { Dialog, Transition, TransitionChild } from "@headlessui/react"
import { X } from "lucide-react"
import { Fragment } from "react"
import DashboardSidebarContent from "./dashboard-sidebar-content"

export default function DashboardSidebarMobile({
  isOpen,
  setIsOpen,
  userRole,
  freelancerItems,
  clientItems,
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 md:hidden" onClose={setIsOpen}>
        <TransitionChild
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel
              className={cn(
                "relative w-64 bg-background shadow-xl h-full flex flex-col"
              )}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-50 text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>

              {/* Sidebar Content */}
              <DashboardSidebarContent
                userRole={userRole}
                freelancerItems={freelancerItems}
                clientItems={clientItems}
                onItemClick={() => setIsOpen(false)}
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
