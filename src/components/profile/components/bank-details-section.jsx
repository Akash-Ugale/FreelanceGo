"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, X, ShieldCheck, BadgeCheck, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function BankDetailsSection({
  accountNumber = "",
  ifscCode = "",
  accountHolderName = "",
  phoneNumber = "",
  userId,
  onSave,
}) {
  const isAlreadySetup = !!(accountHolderName || accountNumber || ifscCode)

  const [status, setStatus]               = useState(isAlreadySetup ? "active" : "not_set")
  const [isEditing, setIsEditing]         = useState(false)
  const [isSaving, setIsSaving]           = useState(false)
  const [showAccountNumber, setShowAccountNumber] = useState(false)  // ← new

  const [formData, setFormData] = useState({
    accountHolderName,
    accountNumber,
    ifscCode,
    phoneNumber,
  })

  const [savedData, setSavedData] = useState({
    accountHolderName,
    accountNumber,
    ifscCode,
    phoneNumber,
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
      await onSave?.({
        freelancerId:      String(userId),
        accountHolderName: formData.accountHolderName,
        accountNumber:     formData.accountNumber,
        ifscCode:          formData.ifscCode,
        phoneNumber:       formData.phoneNumber,
      })
      setSavedData({ ...formData })
      setStatus("active")
      setIsEditing(false)
    } catch {
      // toast handled in parent
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = () => {
    setFormData({ ...savedData })
    setShowAccountNumber(false)   // ← reset to hidden when opening edit
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({ ...savedData })
    setShowAccountNumber(false)   // ← reset on cancel too
    setIsEditing(false)
  }

  const maskAccount = (num) => {
    if (!num) return "—"
    return `${"•".repeat(Math.max(0, num.length - 4))}${num.slice(-4)}`
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Bank Details</CardTitle>
          <CardDescription className="text-xs">Secure payout information</CardDescription>
        </div>

        {status === "active" && !isEditing && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <BadgeCheck className="h-3.5 w-3.5" />
            Active
          </span>
        )}
      </CardHeader>

      <CardContent className="pb-4">

        {/* ── NOT SET UP YET ── */}
        {status === "not_set" && !isEditing && (
          <div className="flex flex-col items-center justify-center py-6 gap-3 border border-dashed border-border rounded-lg bg-secondary/20">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">No payout account set up</p>
              <p className="text-xs text-muted-foreground mt-0.5">Add your bank details to receive payments</p>
            </div>
            <Button size="sm" onClick={() => setIsEditing(true)} className="mt-1">
              Set Up Payout
            </Button>
          </div>
        )}

        {/* ── ACTIVE STATUS CARD ── */}
        {status === "active" && !isEditing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Payout account is active
                </p>
                <p className="text-xs text-muted-foreground">
                  You'll receive payments to the account below
                </p>
              </div>
            </div>

            <div className="space-y-2 p-3 border border-border rounded-md bg-secondary/30">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-muted-foreground">Account Holder</p>
                <p className="text-sm font-semibold">{savedData.accountHolderName || "—"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-muted-foreground">Account Number</p>
                <p className="text-sm font-semibold font-mono">{maskAccount(savedData.accountNumber)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-muted-foreground">IFSC Code</p>
                <p className="text-sm font-semibold font-mono">{savedData.ifscCode || "—"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-muted-foreground">Registered Phone</p>
                <p className="text-sm font-semibold">{savedData.phoneNumber || "—"}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-2 w-full bg-transparent"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Update Bank Details
            </Button>
          </div>
        )}

        {/* ── EDIT / SETUP FORM ── */}
        {isEditing && (
          <div className="space-y-3">
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

            {/* ── Account Number with eye toggle ── */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Account Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showAccountNumber ? "text" : "password"}
                  value={formData.accountNumber}
                  onChange={handleChange("accountNumber")}
                  placeholder="Enter account number"
                  className="text-xs h-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowAccountNumber((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAccountNumber
                    ? <EyeOff className="h-3.5 w-3.5" />
                    : <Eye className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
            </div>

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

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Registered Phone <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                placeholder="Enter phone number"
                className="text-xs h-9"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Pre-filled from your profile. You can use a different number for this payout account.
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="gap-2 h-8 bg-transparent"
                disabled={isSaving}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8"
                disabled={
                  isSaving ||
                  !formData.accountHolderName.trim() ||
                  !formData.accountNumber.trim() ||
                  !formData.ifscCode.trim() ||
                  !formData.phoneNumber.trim()
                }
              >
                {isSaving ? "Saving..." : "Save & Activate"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}