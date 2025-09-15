"use client"

import EarningsContent from "@/components/dashboard/tabs/earnings-content"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Earnings() {
  const {userRole} = useAuth()

  return <EarningsContent userRole={userRole} />
}
