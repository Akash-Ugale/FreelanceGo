import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/api/AxiosServiceApi";
import { getNotificationUI } from "@/utils/notificationMapper";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/api/notifications", {
        params: { page: 0, size: 5 },
      });

      // Spring Data Page object puts the list in 'content'
      const page = res.data;
      const data = page.content || [];
      setNotifications(data);
      const unseenInPage = data.filter((n) => !n.seen && !n.general).length;
      const count = page.last ? unseenInPage : page.totalElements;
      setUnreadCount(count);
      return count;         
    } catch (err) {
      console.error(
        "Backend 500 Error - Check if Table exists or Token is valid:",
        err,
      );
      return 0;
    }
  };

  // 2. Mark notifications as seen
  const handleMarkAsSeen = async () => {
    try {
      // The controller returns .noContent().build(), so there is no JSON body to parse
      await apiClient.patch("/api/notifications/seen");
      setUnreadCount(0);
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          seen: n.general ? n.seen : true,
        })),
      );
    } catch (err) {
      console.error(
        "Network Error - Likely a CORS issue with PATCH method:",
        err,
      );
    }
  };

  // 3. Bridge function to handle dropdown open/close logic

const handleOpenChange = async (open) => {
  if (open) {
    const freshCount = await fetchNotifications();  // ← get count directly
    if (freshCount > 0) {                           // ← use freshCount, not state
      await handleMarkAsSeen();
    }
  }
};

  // 4. Initial fetch and polling every 30 seconds
  useEffect(() => {
    fetchNotifications();
    // const timer = setInterval(fetchNotifications, 30000);
    // return () => clearInterval(timer);
  }, []);

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-[#2D2D2D] hover:bg-[#3D3D3D] transition-colors"
        >
          <Bell className="h-5 w-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-[#1A1A1A] animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[350px] bg-[#1A1A1A] border border-white/10 text-white p-0 shadow-2xl rounded-xl"
      >
        <div className="p-4 flex justify-between items-center border-b border-white/5 bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white/60">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          <button
            className="text-xs text-gray-400 hover:text-white transition-colors"
            onClick={async (e) => {
              e.stopPropagation(); // Prevents dropdown from closing prematurely
              await handleMarkAsSeen();
            }}
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const ui = getNotificationUI(n.type, n.triggerUser);
              return (
                <div
                  key={n.id}
                  className={`p-4 flex items-start gap-3 border-b border-white/5 transition-colors ${!n.seen && !n.general ? "bg-[#253447]" : "bg-[#262626] hover:bg-[#2d2d2d]"}`}
                >
                  <div
                    className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${!n.seen && !n.general ? "bg-blue-500" : "bg-gray-600"}`}
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold leading-none">{ui.title}</p>
                    <p className="text-xs text-gray-400 leading-snug">
                      {ui.sub}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">
                      {n.createdAt
                        ? formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                          })
                        : "Just now"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              No new notifications
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
