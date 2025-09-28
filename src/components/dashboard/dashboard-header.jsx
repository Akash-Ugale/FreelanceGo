import { apiClient } from "@/api/AxiosServiceApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { Bell, HelpCircle, LogOut, Menu, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FullScreenLoader from "../FullScreenLoader";
import DashboardSidebarContent from "./dashboard-sidebar-content";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { logoutUser, userRole, setUserId, authLoading, token } = useAuth();
  const navigate = useNavigate();

  const fetchProfileDetails = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/api/me");
      const { status, data } = response;
      setUserId(data?.id);
      console.log(response);
      if (status === 200) {
        setUserData(data);
        toast.success("Profile details fetched successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  return (
    <>
      <FullScreenLoader show={loading} />
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <DashboardSidebarContent
                  userRole={userRole}
                  onItemClick={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <a href="/dashboard" className="flex items-center">
              <span className="font-bold text-lg md:text-xl">FreelanceGo</span>
            </a>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 md:h-10 md:w-10"
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 md:h-10 md:w-10 rounded-full"
                >
                  <Avatar className="h-9 w-9 md:h-10 md:w-10">
                    <AvatarImage
                      src={`data:image/png;base64,${userData?.imageData}`}
                      alt="Profile"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="grid gap-2">
                      <p className="text-sm font-medium leading-none">
                        {userData?.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
