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
import { Edit2, Trash2, Plus, Award, Upload, Save } from "lucide-react";

export default function CertificationsSection({
  certifications = [],
  onSave,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedCertImage, setSelectedCertImage] = useState(null);
  const [newCert, setNewCert] = useState({
    certificateName: "",
    provider: "",
    file: null,
  });

  // Sync with backend data
  useEffect(() => {
    setItems(certifications);
  }, [certifications]);

  const handleUpdateLocalState = (id, field, value) => {
    setItems(items.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleFileChange = (e, certId) => {
    const file = e.target.files?.[0];
    if (file) {
      if (certId) {
        handleUpdateLocalState(certId, "file", file);
      } else {
        setNewCert({ ...newCert, file });
      }
    }
  };

  const handleCreateNew = () => {
    if (!newCert.certificateName.trim() || !newCert.provider.trim()) return;
    onSave({ ...newCert, id: `temp-${Date.now()}` });
    setNewCert({ certificateName: "", provider: "", file: null });
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Certifications</CardTitle>
          <CardDescription className="text-xs">Professional credentials</CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2 h-8"
        >
          <Edit2 className="h-4 w-4" />
          {isEditing ? "Done" : "Edit"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((cert) => (
            <div key={cert.id} className="p-3 border border-border rounded-md bg-secondary/30">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        // FIX: Added || "" to prevent Controlled Input warning
                        value={cert.certificateName || ""} 
                        onChange={(e) => handleUpdateLocalState(cert.id, "certificateName", e.target.value)}
                        placeholder="Name"
                        className="h-8 text-xs"
                      />
                      <Input
                        // FIX: Added || "" to prevent Controlled Input warning
                        value={cert.provider || ""} 
                        onChange={(e) => handleUpdateLocalState(cert.id, "provider", e.target.value)}
                        placeholder="Provider"
                        className="h-8 text-xs"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDelete(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-1">
                      <div className="flex items-center justify-center gap-2 h-8 border border-dashed border-border rounded text-xs hover:bg-secondary/50">
                        <Upload className="h-3 w-3" />
                        {cert.file ? cert.file.name : "Update Certificate Image"}
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, cert.id)} />
                    </label>
                    <Button size="sm" className="h-8" onClick={() => onSave(cert)}>
                      <Save className="h-3 w-3 mr-1" /> Update
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{cert.certificateName}</h3>
                    <p className="text-xs text-muted-foreground">{cert.provider}</p>
                  </div>
                  {/* FIX: Check both certificateUrl and imageUrl based on your JSON */}
                  {(cert.certificateUrl || cert.imageUrl) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCertImage(cert.certificateUrl || cert.imageUrl)}
                    >
                      <Award className="h-3 w-3 mr-1" /> View
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="pt-4 border-t border-border space-y-3">
            <p className="text-xs font-bold text-primary uppercase">Add New Certification</p>
            <div className="p-3 border border-primary/20 rounded-md bg-primary/5 space-y-2">
              <Input
                value={newCert.certificateName || ""}
                onChange={(e) => setNewCert({ ...newCert, certificateName: e.target.value })}
                placeholder="Certification Name"
                className="h-8 text-xs"
              />
              <Input
                value={newCert.provider || ""}
                onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                placeholder="Issuing Organization"
                className="h-8 text-xs"
              />
              <label className="cursor-pointer block">
                <div className="flex items-center justify-center gap-2 h-8 border border-dashed border-primary/30 rounded text-xs">
                  <Upload className="h-3 w-3" />
                  {newCert.file ? newCert.file.name : "Upload Image"}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e)} />
              </label>
              <Button size="sm" className="w-full h-8" onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-1" /> Add Certification
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Image Preview Modal */}
      {selectedCertImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCertImage(null)}>
          <img 
            src={selectedCertImage} 
            className="max-h-[90%] max-w-[90%] object-contain rounded-lg shadow-2xl bg-white" 
            alt="Certificate Preview"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </Card>
  );
}