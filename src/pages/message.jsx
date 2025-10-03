"use client"

import MessagesContent from "@/components/dashboard/tabs/message-content"
import { useAuth } from "@/context/AuthContext"

export default function Messages() {
  const { userRole } = useAuth()

  return <MessagesContent userRole={userRole} />
}
