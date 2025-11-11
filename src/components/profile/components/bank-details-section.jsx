"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, X } from "lucide-react"



export default function BankDetailsSection({ accountNumber = "", ifscCode = "", onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    accountNumber,
    ifscCode,
  })

  const handleSave = () => {
    onSave?.(formData)
    setIsEditing(false)
  }

  const maskAccountNumber = (num) => {
    if (!num) return ""
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
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2 h-8">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Account Number</label>
              <Input
                type="password"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Enter account number"
                className="text-xs h-9"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">IFSC Code</label>
              <Input
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                placeholder="Enter IFSC code"
                className="text-xs h-9"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2 h-8">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 h-8">
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3 border border-border rounded-md bg-secondary/30">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Account Number</p>
              <p className="text-sm font-semibold text-foreground">{maskAccountNumber(accountNumber)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">IFSC Code</p>
              <p className="text-sm font-semibold text-foreground">{ifscCode || "Not provided"}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
