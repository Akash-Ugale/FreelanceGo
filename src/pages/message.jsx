"use client";

import { useState } from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import MessagesContent from "@/components/dashboard/tabs/message-content";
import MessageContentDummy from "@/components/dashboard/messageContentDummy/MessageContentDummy";
import { useAuth } from "@/context/AuthContext";

export default function Messages() {
  const { userRole } = useAuth();

  return <MessagesContent userRole={userRole} />;
}
