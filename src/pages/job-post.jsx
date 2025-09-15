"use client"

import JobPostsContent from "@/components/dashboard/tabs/job-post-content"
import { useAuth } from "@/context/AuthContext"

export default function JobPosts() {
  const { userRole } = useAuth()
  return <JobPostsContent userRole={userRole} />
}
