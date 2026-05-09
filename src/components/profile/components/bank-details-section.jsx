"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, X } from "lucide-react"

// PayoutSetupRequest fields:
//   freelancerId        → passed as prop (userId from AuthContext)
//   accountHolderName   → ✅ new field
//   accountNumber       → ✅ existing
//   ifscCode            → ✅ existing
//   bankName            → optional (not shown in UI but sent if needed)
//   accountType         → optional

export default function BankDetailsSection({
  accountNumber = "",
  ifscCode = "",
  accountHolderName = "",
  userId,        // freelancerId for PayoutSetupRequest
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving]   = useState(false)
  const [formData, setFormData]   = useState({
    accountHolderName,
    accountNumber,
    ifscCode,
  })

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "ifscCode" ? e.target.value.toUpperCase() : e.target.value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      // POST /api/freelancer/payout/setup
      // Body: PayoutSetupRequest { freelancerId, accountHolderName, accountNumber, ifscCode }
      await onSave?.({
        freelancerId:      String(userId),
        accountHolderName: formData.accountHolderName,
        accountNumber:     formData.accountNumber,
        ifscCode:          formData.ifscCode,
      })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const maskAccountNumber = (num) => {
    if (!num) return "Not provided"
    return `****${num.slice(-4)}`
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Bank Details</CardTitle>
          <CardDescription className="text-xs">Secure payment information</CardDescription>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2 h-8"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        {isEditing ? (
          <div className="space-y-3">

            {/* accountHolderName — NEW field from PayoutSetupRequest */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.accountHolderName}
                onChange={handleChange("accountHolderName")}
                placeholder="Enter account holder name"
                className="text-xs h-9"
              />
            </div>

            {/* accountNumber */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                value={formData.accountNumber}
                onChange={handleChange("accountNumber")}
                placeholder="Enter account number"
                className="text-xs h-9"
              />
            </div>

            {/* ifscCode */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                IFSC Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.ifscCode}
                onChange={handleChange("ifscCode")}
                placeholder="e.g. SBIN0001234"
                className="text-xs h-9"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="gap-2 h-8"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="gap-2 h-8"
                disabled={
                  isSaving ||
                  !formData.accountHolderName ||
                  !formData.accountNumber ||
                  !formData.ifscCode
                }
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3 border border-border rounded-md bg-secondary/30">
            {/* accountHolderName */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Account Holder Name</p>
              <p className="text-sm font-semibold text-foreground">
                {accountHolderName || formData.accountHolderName || "Not provided"}
              </p>
            </div>
            {/* accountNumber — masked */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">Account Number</p>
              <p className="text-sm font-semibold text-foreground">
                {maskAccountNumber(accountNumber || formData.accountNumber)}
              </p>
            </div>
            {/* ifscCode */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">IFSC Code</p>
              <p className="text-sm font-semibold text-foreground">
                {ifscCode || formData.ifscCode || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}