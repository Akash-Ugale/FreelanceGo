"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, X, Trash2, Plus } from "lucide-react"
import { Github, Linkedin, Twitter, Globe } from "lucide-react"

// interface SocialLink {
//   id: string
//   platform: string
//   url: string
// }

// interface SocialLinksSectionProps {
//   socialLinks?: SocialLink[]
// }

const PLATFORM_ICONS = {
  github: <Github className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  twitter: <Twitter className="h-4 w-4" />,
  portfolio: <Globe className="h-4 w-4" />,
}

export default function SocialLinksSection({ socialLinks = [] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [links, setLinks] = useState(
    socialLinks.length > 0
      ? socialLinks
      : [
          { id: "1", platform: "linkedin", url: "https://linkedin.com/in/johndoe" },
          { id: "2", platform: "github", url: "https://github.com/johndoe" },
          { id: "3", platform: "portfolio", url: "https://johndoe.com" },
        ],
  )
  const [newLink, setNewLink] = useState({ platform: "github", url: "" })

  const handleAddLink = () => {
    if (newLink.url.trim()) {
      setLinks([...links, { id: Date.now().toString(), ...newLink }])
      setNewLink({ platform: "github", url: "" })
    }
  }

  const handleRemoveLink = (id) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Social Links & Handles</CardTitle>
          <CardDescription>Connect your professional profiles</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="flex items-center gap-2">
                <select
                  value={link.platform}
                  onChange={(e) =>
                    setLinks(links.map((l) => (l.id === link.id ? { ...l, platform: e.target.value } : l)))
                  }
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950 text-sm"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="portfolio">Portfolio</option>
                </select>
                <Input
                  value={link.url}
                  onChange={(e) => setLinks(links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(link.id)} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Add New Link */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <p className="text-sm font-medium">Add New Link</p>
              <div className="flex items-center gap-2">
                <select
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950 text-sm"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="portfolio">Portfolio</option>
                </select>
                <Input
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button size="sm" onClick={handleAddLink} className="gap-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                <X className="h-4 w-4" />
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                {PLATFORM_ICONS[link.platform] || <Globe className="h-4 w-4" />}
                <span className="text-sm capitalize">{link.platform}</span>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
