"use client"

import PostJobContent from "@/components/dashboard/tabs/post-job-content"
import { useState } from "react"

export default function PostJob() {
  const [userRole, setUserRole] = useState("client")

  return <PostJobContent userRole={userRole} />
}
