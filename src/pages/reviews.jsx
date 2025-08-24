"use client"

import ReviewsContent from "@/components/dashboard/tabs/reviews-content"
import { useAuth } from "@/context/AuthContext"

export default function Reviews() {
  const { userRole } = useAuth()

  return <ReviewsContent userRole={userRole} />
}
