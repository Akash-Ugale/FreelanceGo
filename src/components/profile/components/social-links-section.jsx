"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, X, Check, Github, Linkedin, Globe } from "lucide-react"

export default function SocialLinksSection({ freelancerProfile, portfolioUrl, onSave }) {
  const [isEditing, setIsEditing] = useState(false)

  // States initialized with empty strings to prevent controlled vs uncontrolled warnings
  const [tempLinkedin, setTempLinkedin] = useState("")
  const [tempGithub, setTempGithub] = useState("")
  const [tempPortfolio, setTempPortfolio] = useState("")

  // Sync states when data updates
  useEffect(() => {
    setTempLinkedin(freelancerProfile?.linkedinUrl || "")
    setTempGithub(freelancerProfile?.githubUrl || "")
    setTempPortfolio(portfolioUrl || "")
  }, [freelancerProfile, portfolioUrl])

  const handleSave = () => {
    onSave({
      linkedinUrl: tempLinkedin,
      githubUrl: tempGithub,
      portfolioUrl: tempPortfolio,
    })
    setIsEditing(false)
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Professional Links</CardTitle>
          <CardDescription className="text-xs">Your social and personal portfolio links</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2 h-8">
            <Edit2 className="h-4 w-4" /> Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            {/* Portfolio URL Input */}
            <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
              <Input
                // FIX: Ensure value is never null
                value={tempPortfolio || ""}
                onChange={(e) => setTempPortfolio(e.target.value)}
                placeholder="Personal Portfolio URL (https://...)"
                className="flex-1 h-9 text-sm"
              />
            </div>

            {/* LinkedIn Input */}
            <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
                <Linkedin className="h-5 w-5 text-blue-600" />
              </div>
              <Input
                // FIX: Ensure value is never null
                value={tempLinkedin || ""}
                onChange={(e) => setTempLinkedin(e.target.value)}
                placeholder="LinkedIn Profile URL"
                className="flex-1 h-9 text-sm"
              />
            </div>

            {/* GitHub Input */}
            <div className="flex items-center gap-3">
              <div className="w-8 flex justify-center">
                <Github className="h-5 w-5 text-foreground" />
              </div>
              <Input
                // FIX: Ensure value is never null
                value={tempGithub || ""}
                onChange={(e) => setTempGithub(e.target.value)}
                placeholder="GitHub Profile URL"
                className="flex-1 h-9 text-sm"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-8">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-2 h-8">
                <Check className="h-4 w-4" /> Save Links
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {/* Display Links with fallback UI if empty */}
            {(!portfolioUrl && !freelancerProfile?.linkedinUrl && !freelancerProfile?.githubUrl) ? (
                <p className="text-xs text-muted-foreground italic">No professional links added yet.</p>
            ) : (
              <>
                {portfolioUrl && (
                  <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/50 border border-border rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                    <Globe className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-xs font-medium">Portfolio</span>
                  </a>
                )}

                {freelancerProfile?.linkedinUrl && (
                  <a href={freelancerProfile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/50 border border-border rounded-full hover:bg-blue-50 hover:border-blue-200 transition-all group">
                    <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-medium">LinkedIn</span>
                  </a>
                )}

                {freelancerProfile?.githubUrl && (
                  <a href={freelancerProfile.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/50 border border-border rounded-full hover:bg-secondary transition-all group">
                    <Github className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">GitHub</span>
                  </a>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}