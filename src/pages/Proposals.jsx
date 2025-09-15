"use client"

import ProposalsContent from "@/components/dashboard/tabs/proposals-content"
import { useAuth } from "@/context/AuthContext"

export default function Proposals() {
  const { userRole } = useAuth() // no type annotation here

  return <ProposalsContent userRole={userRole} />
}
