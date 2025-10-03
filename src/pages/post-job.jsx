"use client"

import PostJobContent from "@/components/dashboard/tabs/post-job-content"
import { useAuth } from "@/context/AuthContext"

export default function PostJob() {
  const { userRole } = useAuth()

  return <PostJobContent userRole={userRole} />
}
