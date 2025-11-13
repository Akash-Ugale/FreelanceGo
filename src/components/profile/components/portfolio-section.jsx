"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, ExternalLink, Trash2, Upload } from "lucide-react"
import { useEffect } from "react";


// interface PortfolioItem {
//   id: string
//   title: string
//   description: string
//   image: string
//   tags: string[]
//   projectName?: string
//   duration?: string
//   budget?: string
// }

// interface PortfolioSectionProps {
//   portfolioItems?: PortfolioItem[]
//   isFreelancer?: boolean
// }

export default function PortfolioSection({ portfolioItems = [], isFreelancer = true,onSave }) {
  const [isManaging, setIsManaging] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [items, setItems] = useState(
    portfolioItems.length > 0
      ? portfolioItems
      : [
          {
            id: "1",
            title: "E-commerce Platform Redesign",
            description: "Modern platform redesign with improved UX",
            image: "/ecommerce-redesign.jpg",
            tags: ["React", "Next.js", "Tailwind CSS"],
            projectName: "E-commerce Platform Redesign",
            duration: "3 months",
            budget: "$5,000",
          },
          {
            id: "2",
            title: "Mobile App Development",
            description: "Cross-platform mobile application",
            image: "/mobile-app-showcase.png",
            tags: ["React Native", "TypeScript"],
            projectName: "Mobile App Development",
            duration: "4 months",
            budget: "$7,500",
          },
          {
            id: "3",
            title: "Dashboard Analytics Tool",
            description: "Real-time analytics dashboard",
            image: "/analytics-dashboard.png",
            tags: ["Data Visualization", "React"],
            projectName: "Dashboard Analytics Tool",
            duration: "2 months",
            budget: "$3,000",
          },
        ],
    )
    // Load saved portfolio items from localStorage when the component mounts
useEffect(() => {
  const savedItems = localStorage.getItem("portfolioItems");
  if (savedItems) {
    setItems(JSON.parse(savedItems));
  }
}, []);

// Automatically save whenever items change
useEffect(() => {
  localStorage.setItem("portfolioItems", JSON.stringify(items));
}, [items]);

  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image: "",
    tags: [],
    projectName: "",
    portfolioUrl:"",
  })

  const handleAddPortfolioItem = () => {
    if (newItem.title.trim()) {
      setItems([...items, { id: Date.now().toString(), ...newItem }])
      setNewItem({ title: "", description: "", image: "", tags: [], projectName: "", duration: "", budget: "" })
      setEditingId(null)
    }
  }

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleImageUpload = (e, itemId) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (itemId) {
          setItems(items.map((i) => (i.id === itemId ? { ...i, image: reader.result } : i)))
        } else {
          setNewItem({ ...newItem, image: reader.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const displayItems = isManaging ? items : items.slice(0, 3)

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl">Portfolio</CardTitle>
          <CardDescription>Showcase your previous work and projects</CardDescription>
        </div>
        <Button
  variant="outline"
  size="sm"
  onClick={() => {
    if (isManaging) {
      // Save to localStorage for backup
      localStorage.setItem("portfolioItems", JSON.stringify(items));

      // 🔥 Trigger backend API call through parent
      if (typeof onSave === "function") {
        onSave(items);
      }
    }
    setIsManaging(!isManaging);
  }}
  className="gap-2 bg-transparent"
>
  <Edit2 className="h-4 w-4" />
  {isManaging ? "Done" : "Manage"}
</Button>


        {/* <Button variant="outline" size="sm" onClick={() => setIsManaging(!isManaging)} className="gap-2 bg-transparent">
          <Edit2 className="h-4 w-4" />
          {isManaging ? "Done" : "Manage"}
        </Button> */}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Grid */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer rounded-lg overflow-hidden bg-secondary dark:bg-secondary/30 transition-all hover:shadow-lg hover:scale-105 border border-border"
              >
                <div className="relative h-40 overflow-hidden bg-muted group">
  <img
    src={item.image || "/placeholder.svg"}
    alt={item.title}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
    {item.portfolioUrl ? (
      <a
        href={item.portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button size="sm" variant="secondary" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          View
        </Button>
      </a>
    ) : (
      <Button size="sm" variant="secondary" disabled className="gap-2">
        <ExternalLink className="h-4 w-4" />
        View
      </Button>
    )}
  </div>
</div>

                {/* <div className="relative h-40 overflow-hidden bg-muted">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View
                    </Button>
                  </div>
                </div> */}
                <div className="p-4">
              <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{item.description}</p>

                  {item.portfolioUrl && (
                    <a
                      href={item.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View Project
                    </a>
                  )}

                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm mb-4">No portfolio items yet</p>
          </div>
        )}

        {isManaging && (
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Manage Portfolio Items</h3>

            {/* Existing Items Edit Section */}
            {items.length > 0 && (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="p-4 border border-border rounded-lg bg-secondary/20 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 space-y-2 w-full">
                        <Input
                          value={item.title}
                          onChange={(e) =>
                            setItems(items.map((i) => (i.id === item.id ? { ...i, title: e.target.value } : i)))
                          }
                          placeholder="Project Name"
                          className="text-sm h-8"
                        />
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            setItems(items.map((i) => (i.id === item.id ? { ...i, description: e.target.value } : i)))
                          }
                          placeholder="Description"
                          className="text-sm h-8"
                        />
                     <div>
                      <Input
                          type="url"
                          value={item.portfolioUrl || ""}
                          onChange={(e) =>
                            setItems(items.map((i) =>
                              i.id === item.id ? { ...i, portfolioUrl: e.target.value } : i
                            ))
                          }
                          placeholder="Enter your portfolio URL (e.g. https://github.com/username/project)"
                          className="text-sm h-8"
                        />

                    </div>


                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Image</label>
                          <label className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              asChild
                              className="gap-2 h-7 text-xs w-full justify-center bg-transparent"
                            >
                              <span>
                                <Upload className="h-3 w-3" />
                                {item.image ? "Change" : "Upload"} Image
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, item.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="gap-2 text-destructive hover:text-destructive h-8 mt-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Item Section */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3">Add New Portfolio Item</p>
              <div className="p-4 border border-border rounded-lg bg-secondary/20 space-y-3">
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Project Name"
                  className="text-sm h-8"
                />
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Description"
                  className="text-sm h-8"
                />
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Image</label>
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2 h-7 text-xs w-full justify-center bg-transparent"
                    >
                      <span>
                        <Upload className="h-3 w-3" />
                        {newItem.image ? "Change" : "Upload"} Image
                      </span>
                    </Button>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                  </label>
                </div>
                <Button size="sm" onClick={handleAddPortfolioItem} className="w-full gap-2 h-8 text-sm">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
