"use client";

import React from "react";
import { useState,useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Upload,
  MapPin,
  Star,
  X,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProfileHeader({
  originalData,
  coverPhoto = "/professional-cover.jpg",
  profileImage,
  name,
  title,
  designation = "",
  location,
  rating = 4.8,
  bio,
  mobileNumber = "",
  isEditing,
  onEditToggle,
  isViewOnly = false,
  onToggleViewOnly,
  onCoverPhotoChange,
  onProfileImageChange,
  onSave,
}) {
  const [tempCoverPhoto, setTempCoverPhoto] = useState(coverPhoto);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);
  const [tempName, setTempName] = useState(name);
  const [tempDesignation, setTempDesignation] = useState(designation || title);
  const [tempBio, setTempBio] = useState(bio);
  const [tempMobileNumber, setTempMobileNumber] = useState(mobileNumber);

    // Sync coverPhoto prop on refresh
  useEffect(() => {
    if (coverPhoto) setTempCoverPhoto(coverPhoto);
  }, [coverPhoto]);

  
  useEffect(() => {
  if (originalData?.user?.imageData) {
    const imgUrl = `data:image/jpeg;base64,${originalData.user.imageData}`;
    setTempProfileImage(imgUrl);
  }
}, [originalData]);


  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // onCoverPhotoChange?.(file);
      // 1. save the actual file object to be sent to the backend
      setCoverPhotoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setTempCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      //onProfileImageChange?.(file);
      // Save the actual file object
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("handleSave called", {
      tempName,
      tempDesignation,
      tempBio,
      tempMobileNumber,
      tempCoverPhoto,
      tempProfileImage,
      coverPhotoFile,
      profileImageFile,
    }); // <-- Add this

    // const coverPhoto = tempCoverPhoto;
    // const profileImage = tempProfileImage;
    // Pass the actual File object if it was uploaded, otherwise pass null/undefined
    const coverPhotoToSave = coverPhotoFile;
    const profileImageToSave = profileImageFile; // Assuming you do the same for profileImage

    originalData.user.username = tempName;
    originalData.freelancer.designation = tempDesignation;
    originalData.freelancer.bio = tempBio;
    originalData.freelancer.phone = tempMobileNumber;

    const profileDto = {
      id: originalData.id,
      user: originalData.user,
      client: originalData.client,
      freelancer: originalData.freelancer,
    };
    console.log("profile DTO:", profileDto);

    onSave?.(profileDto, profileImageToSave, coverPhotoToSave);

    // Reset file state after successful save attempt
    setCoverPhotoFile(null);
    setProfileImageFile(null);
    onEditToggle();
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md border border-border mb-4">
      {/* Cover Photo Section */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          src={tempCoverPhoto || "/placeholder.svg"}
          alt="Cover photo"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 right-3 flex gap-2">
          {onToggleViewOnly && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onToggleViewOnly}
              className="gap-2 flex items-center backdrop-blur-sm bg-background/80 hover:bg-background"
            >
              {isViewOnly ? (
                <>
                  <Eye className="h-4 w-4" />
                  View Only
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  Editing
                </>
              )}
            </Button>
          )}
          {isEditing && (
          <div>
  <input
    type="file"
    accept="image/*"
    id="coverUploadInput"
    onChange={handleCoverPhotoUpload}
    className="hidden"
  />

  <Button
    variant="secondary"
    size="sm"
    onClick={() => document.getElementById("coverUploadInput").click()}
    className="gap-2 flex items-center backdrop-blur-sm bg-background/80 hover:bg-background"
  >
    <Upload className="h-4 w-4" />
    Change Cover
  </Button>
</div>

          )}
        </div>
      </div>

      {/* Profile Info Section - Compact Layout */}
      <div className="px-6 py-4">
        <div className="flex gap-4 mb-4">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-28 w-28 border-4 border-card shadow-md bg-card -mt-20">
              <AvatarImage src={tempProfileImage || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {name && typeof name === "string" && name.length > 0
                  ? name.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              // <label className="absolute bottom-0 right-0 cursor-pointer">
              //   <Button size="sm" className="rounded-full h-8 w-8 p-0">
              //     <Upload className="h-3 w-3" />
              //   </Button>
              //   <input
              //     type="file"
              //     accept="image/*"
              //     onChange={handleProfileImageUpload}
              //     className="hidden"
              //   />
              // </label>
              <div className="absolute bottom-0 right-0">
                <input
                  type="file"
                  accept="image/*"
                  id="profileUploadInput"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                
                <Button
                  size="sm"
                  className="rounded-full h-8 w-8 p-0"
                  onClick={() => document.getElementById("profileUploadInput").click()}
                >
                  <Upload className="h-3 w-3" />
                </Button>
              </div>

            )}
          </div>

          {/* Name, Title, and Action Buttons */}
          <div className="flex-1 flex flex-col justify-between">
            {isEditing ? (
              <div className="space-y-2 flex-1">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Your name"
                  className="font-bold text-lg h-8"
                />
                <Input
                  value={tempDesignation}
                  onChange={(e) => setTempDesignation(e.target.value)}
                  placeholder="Designation/Title"
                  className="text-sm h-8"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-foreground">{name}</h1>
                <p className="text-base font-medium text-primary">
                  {designation || title}
                </p>
              </div>
            )}

            {/* Rating and Location */}
            <div className="flex items-center gap-4 text-sm">
              {location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(rating)
                          ? "fill-accent text-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-foreground">
                  {rating?.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Edit/Save Button */}
          {!isViewOnly && (
            <div className="flex flex-col gap-1">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} className="gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onEditToggle}
                    className="gap-1.5 bg-transparent"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEditToggle}
                  className="gap-1.5 bg-transparent"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Info
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Bio and Mobile Number - Compact */}
        {isEditing ? (
          <div className="space-y-2 border-t border-border pt-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Bio
              </label>
              <Textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Your bio"
                rows={2}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Mobile Number
              </label>
              <Input
                value={tempMobileNumber}
                onChange={(e) => setTempMobileNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="text-sm h-8"
              />
            </div>
          </div>
        ) : (
          <div className="border-t border-border pt-3 space-y-1.5 text-sm">
            <p className="text-foreground/80 leading-snug">{bio}</p>
            {mobileNumber && (
              <p className="text-muted-foreground">
                <span className="font-medium">Mobile:</span> {mobileNumber}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
