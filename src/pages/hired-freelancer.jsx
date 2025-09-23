"use client"

import HiredFreelancersContent from "@/components/dashboard/tabs/hired-freelancer-content"
import { useState } from "react"

export default function HiredFreelancers() {
  const [userRole, setUserRole] = useState("client")

  return <HiredFreelancersContent userRole={userRole} />
}
