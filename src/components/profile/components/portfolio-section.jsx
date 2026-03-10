"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, ExternalLink, Trash2, Upload, Save } from "lucide-react";

export default function PortfolioSection({
  portfolioItems = [],
  onSave,     // Hits create or update API
  onDelete,   // Hits delete API
  isSaving,   // Global saving state from parent
}) {
  const [isManaging, setIsManaging] = useState(false);
  const [items, setItems] = useState([]);
  
  // Local state for the "Add New" form
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    image: "",
    portfolioUrl: "",
  });

  // Keep internal items in sync with parent data (database source of truth)
  useEffect(() => {
    setItems(portfolioItems);
  }, [portfolioItems]);

  const handleLocalChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleImageUpload = (e, itemId) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (itemId) {
          handleLocalChange(itemId, "image", reader.result);
        } else {
          setNewItem({ ...newItem, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNew = () => {
    if (!newItem.title.trim()) return;
    // We pass a 'temp' ID so the parent logic knows this is a NEW item (id: null)
    onSave({ ...newItem, id: `temp-${Date.now()}` });
    setNewItem({ title: "", description: "", image: "", portfolioUrl: "" });
  };

  const displayItems = isManaging ? items : items.slice(0, 3);

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
          onClick={() => setIsManaging(!isManaging)}
          className="gap-2 bg-transparent"
        >
          <Edit2 className="h-4 w-4" />
          {isManaging ? "Done" : "Manage"}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Gallery View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-lg overflow-hidden bg-secondary/30 border border-border transition-all hover:shadow-lg"
            >
              <div className="relative h-40 bg-muted">
                <img
                  src={item.imageUrl || item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {item.portfolioUrl && (
                    <a href={item.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary" className="gap-2">
                        <ExternalLink className="h-4 w-4" /> View
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Management List */}
        {isManaging && (
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Manage Items</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 border border-border rounded-lg bg-secondary/20 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.title}
                      onChange={(e) => handleLocalChange(item.id, "title", e.target.value)}
                      placeholder="Project Name"
                      className="h-8"
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => handleLocalChange(item.id, "description", e.target.value)}
                      placeholder="Description"
                      className="h-8"
                    />
                    <Input
                      value={item.portfolioUrl || ""}
                      onChange={(e) => handleLocalChange(item.id, "portfolioUrl", e.target.value)}
                      placeholder="Project URL"
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 h-8" 
                        onClick={() => onSave(item)} 
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-2" /> Update
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive h-8" 
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-32 h-24 relative rounded border overflow-hidden">
                    <img src={item.image || "/placeholder.svg"} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                      <Upload className="h-4 w-4 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, item.id)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Section */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3 text-primary">Add New Project</p>
              <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-3">
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Project Name"
                />
                <Button size="sm" className="w-full" onClick={handleCreateNew} disabled={isSaving}>
                  <Plus className="h-4 w-4 mr-2" /> Add to Portfolio
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}