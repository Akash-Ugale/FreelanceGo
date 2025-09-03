import BidHistoryContent from "@/components/dashboard/tabs/bid-history-content"
import { useAuth } from "@/context/AuthContext"

export default function BidHistory() {
  const { userRole } = useAuth()

  return <BidHistoryContent userRole={userRole} />
}
