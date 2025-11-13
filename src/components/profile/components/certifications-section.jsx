"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, X, Trash2, Plus, Award, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function CertificationsSection({ certifications = [],userId, onSave }) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCertImage, setSelectedCertImage] = useState(null)

  const [items, setItems] = useState(
    certifications.length > 0
      ? certifications
      : [
          {
            id: "1",
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
          },
          {
            id: "2",
            name: "Google Cloud Professional Cloud Architect",
            issuer: "Google Cloud",
          },
        ],
  )
  const [newCert, setNewCert] = useState({
    name: "",
    issuer: "",
    certificateImage: "",
  })

  const handleAddCertification = () => {
    if (newCert.name.trim() && newCert.issuer.trim()) {
      setItems([...items, { id: Date.now().toString(), ...newCert }])
      setNewCert({ name: "", issuer: "", certificateImage: "" })
    }
  }

  const handleRemoveCertification = (id) => {
    setItems(items.filter((cert) => cert.id !== id))
  }

const handleCertificateImageUpload = (e, certId) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (certId) {
        setItems(items.map((c) =>
          c.id === certId ? { ...c, certificateImage: reader.result, file } : c
        ));
      } else {
        setNewCert({ ...newCert, certificateImage: reader.result, file });
      }
    };
    reader.readAsDataURL(file);
  }
};


  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-lg">Certifications</CardTitle>
          <CardDescription className="text-xs">Professional credentials</CardDescription>
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
            {items.map((cert) => (
              <div key={cert.id} className="p-3 border border-border rounded-md space-y-2 bg-secondary/30">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={cert.name}
                      onChange={(e) =>
                        setItems(items.map((c) => (c.id === cert.id ? { ...c, name: e.target.value } : c)))
                      }
                      placeholder="Certification Name"
                      className="text-xs h-7"
                    />
                    <Input
                      value={cert.issuer}
                      onChange={(e) =>
                        setItems(items.map((c) => (c.id === cert.id ? { ...c, issuer: e.target.value } : c)))
                      }
                      placeholder="Issuing Organization"
                      className="text-xs h-7"
                    />
                    <div className="pt-1">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Certificate Image</label>
                      <div className="flex items-center gap-2">
                        {cert.certificateImage && (
                          <Avatar className="h-12 w-12 border border-border">
                            <AvatarImage src={cert.certificateImage || "/placeholder.svg"} />
                            <AvatarFallback>{cert.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <label className="cursor-pointer flex-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-2 h-7 text-xs w-full justify-center bg-transparent"
                          >
                            <span>
                              <Upload className="h-3 w-3" />
                              {cert.certificateImage ? "Change" : "Upload"} Image
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCertificateImageUpload(e, cert.id)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCertification(cert.id)}
                    className="gap-2 text-destructive hover:text-destructive h-7"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add New Certification */}
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs font-medium">Add New Certification</p>
              <div className="p-3 border border-border rounded-md space-y-2 bg-secondary/30">
                <Input
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  placeholder="Certification Name"
                  className="text-xs h-7"
                />
                <Input
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="Issuing Organization"
                  className="text-xs h-7"
                />
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Certificate Image</label>
                  <div className="flex items-center gap-2">
                    {newCert.certificateImage && (
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage src={newCert.certificateImage || "/placeholder.svg"} />
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                    )}
                    <label className="cursor-pointer flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 h-7 text-xs w-full justify-center bg-transparent"
                      >
                        <span>
                          <Upload className="h-3 w-3" />
                          {newCert.certificateImage ? "Change" : "Upload"} Image
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCertificateImageUpload(e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <Button size="sm" onClick={handleAddCertification} className="w-full gap-2 h-7 text-xs">
                  <Plus className="h-4 w-4" />
                  Add Certification
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
           <Button
              variant="outline"
              onClick={async () => {
                setIsEditing(false);
                console.log("Saving certifications:", items.map(i => ({
                  name: i.name,
                  issuer: i.issuer,
                  hasFile: !!i.file
                })));


                if (onSave) {
                  const profilePayload = {
                    user: { id: userId }, // ✅ Add the logged-in user's ID (or fetch dynamically)
                    certifications: items,
                  };
                  await onSave(profilePayload,items);
                }
              }}
              className="gap-2 h-8"
            >
              <X className="h-4 w-4" />
              Save & Done
            </Button>



            </div>
          </div>
        ) : (
          <div className="space-y-2">
          {items.length > 0 ? (
  items.map((cert) => (
    <div
      key={cert.id}
      className="p-3 border border-border rounded-md bg-secondary/30 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        {cert.certificateImage && (
          <Avatar className="h-16 w-16 border border-border flex-shrink-0">
            <AvatarImage src={cert.certificateImage || "/placeholder.svg"} />
            <AvatarFallback>{cert.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h3 className="font-semibold text-sm text-foreground">{cert.name}</h3>
          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
        </div>
      </div>

      {cert.certificateImage && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1"
          onClick={() => setSelectedCertImage(cert.certificateImage)}
        >
          <Award className="h-3 w-3" />
          View
        </Button>
      )}
    </div>
  ))
) : (
  <p className="text-xs text-muted-foreground text-center py-6">No certifications added yet</p>
)}


          </div>
        )}
      </CardContent>
      {selectedCertImage && (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={() => setSelectedCertImage(null)}
  >
    <img
      src={selectedCertImage}
      alt="Certificate Preview"
      className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
    />
  </div>
)}

    </Card>
  )
}
