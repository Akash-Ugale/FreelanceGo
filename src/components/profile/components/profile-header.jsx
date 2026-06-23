"use client";

import React from "react";
import { useState, useEffect } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { userRoles } from "@/utils/constants";

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
  isClientProfile = false,
}) {
  const { userRole } = useAuth();
  const isClient = isClientProfile;

  const [tempCoverPhoto, setTempCoverPhoto] = useState(coverPhoto);
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);

  // FIX: For clients, initialize from companyName. For freelancers, from username.
  const [tempName, setTempName] = useState(
    isClient
      ? (originalData?.client?.companyName || name || "")
      : (name || "")
  );

  const [tempDesignation, setTempDesignation] = useState(designation || title || "");
  const [tempBio, setTempBio] = useState(bio || "");
  const [tempMobileNumber, setTempMobileNumber] = useState(mobileNumber || "");

  const [tempLocation, setTempLocation] = useState(
    isClient
      ? (originalData?.clientProfile?.location ?? "")
      : (originalData?.freelancerProfile?.location ?? "")
  );

  // FIX: Sync ALL fields when originalData changes (after save/refresh)
  useEffect(() => {
    if (!originalData) return;

    if (isClient) {
      setTempName(originalData.client?.companyName || "");
      setTempBio(originalData.client?.bio || "");
      setTempMobileNumber(originalData.client?.phone || "");
      setTempLocation(originalData.clientProfile?.location || "");
      setTempDesignation(originalData.client?.designation || "Client");
    } else {
      setTempName(originalData.user?.username || originalData.userDto?.username || "");
      setTempBio(originalData.freelancer?.bio || "");
      setTempMobileNumber(originalData.freelancer?.phone || "");
      setTempLocation(originalData.freelancerProfile?.location || "");
      setTempDesignation(originalData.freelancer?.designation || "");
    }
  }, [originalData, isClient]);

  // Sync coverPhoto on refresh
  useEffect(() => {
    if (coverPhoto && !coverPhotoFile) {
      setTempCoverPhoto(coverPhoto);
    }
  }, [coverPhoto, coverPhotoFile]);

  // FIX: Handle both user and userDto for profile image (client vs freelancer response shape)
  useEffect(() => {
    const imageData =
      originalData?.user?.imageData || originalData?.userDto?.imageData;
    if (imageData) {
      setTempProfileImage(`data:image/jpeg;base64,${imageData}`);
    }
  }, [originalData]);

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setTempCoverPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setTempProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // FIX: use userDto key for clients, user key for freelancers
    const userKey = originalData.userDto ? "userDto" : "user";

    const updatedUser = {
      ...(originalData[userKey] || {}),
      // FIX: for clients, don't overwrite username with companyName
      username: isClient
        ? (originalData[userKey]?.username ?? null)
        : tempName,
    };

    let updatedFreelancer = { ...originalData.freelancer };
    let updatedFreelancerProfile = { ...(originalData.freelancerProfile || {}) };
    let updatedClient = { ...originalData.client };
    let updatedClientProfile = { ...(originalData.clientProfile || {}) };

    if (isClient) {
      updatedClient = {
        ...updatedClient,
        companyName: tempName,       // FIX: save to companyName, not username
        bio: tempBio,
        phone: tempMobileNumber,
      };
      updatedClientProfile.location = tempLocation;
    } else {
      updatedFreelancer = {
        ...updatedFreelancer,
        designation: tempDesignation,
        bio: tempBio,
        phone: tempMobileNumber,
      };
      updatedFreelancerProfile.location = tempLocation;
    }

    const profileDto = {
      id: originalData.id,
      [userKey]: updatedUser,
      client: updatedClient,
      freelancer: updatedFreelancer,
      freelancerProfile: updatedFreelancerProfile,
      clientProfile: updatedClientProfile,
    };

    onSave?.(profileDto, profileImageFile, coverPhotoFile);
    onEditToggle();
  };

  // FIX: resolve image data for both client (userDto) and freelancer (user)
  const profileImageSrc = (() => {
    const imageData =
      originalData?.user?.imageData || originalData?.userDto?.imageData;
    return (
      tempProfileImage ||
      profileImage ||
      (imageData ? `data:image/jpeg;base64,${imageData}` : "/placeholder.svg")
    );
  })();

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md border border-border mb-4">
      {/* Cover Photo */}
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
                <><Eye className="h-4 w-4" /> View Only</>
              ) : (
                <><EyeOff className="h-4 w-4" /> Editing</>
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

      {/* Profile Info */}
      <div className="px-6 py-4">
        <div className="flex gap-4 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-28 w-28 border-4 border-card shadow-md bg-card -mt-20">
              {/* FIX: use resolved profileImageSrc that handles both user/userDto */}
              <AvatarImage src={profileImageSrc} />
              <AvatarFallback className="text-lg">
                {/* FIX: use tempName (never null) instead of name prop */}
                {tempName?.length > 0 ? tempName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
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

          {/* Name / Title / Location */}
          <div className="flex-1 flex flex-col justify-between">
            {isEditing ? (
              <div className="space-y-2 flex-1">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder={isClient ? "Company Name" : "Your Name"}
                  className="font-bold text-lg h-8"
                />
                {/* Hide designation field for clients — they don't have one */}
                {!isClient && (
                  <Input
                    value={tempDesignation}
                    onChange={(e) => setTempDesignation(e.target.value)}
                    placeholder="Designation/Title"
                    className="text-sm h-8"
                  />
                )}
                <div className="relative">
                  <MapPin className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="Add location (e.g. New York, USA)"
                    className="text-sm h-8 pl-7 focus-visible:ring-primary"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {tempName || name}
                </h1>
                <p className="text-base font-medium text-primary">
                  {isClient ? "Client / Employer" : (tempDesignation || designation || title)}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {tempLocation || location || (
                      <span className="italic opacity-60">No location set</span>
                    )}
                  </div>
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
            )}
          </div>

          {/* Edit/Save/Cancel */}
          {!isViewOnly && (
            <div className="flex flex-col gap-1">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} className="gap-1.5">
                    <Save className="h-3.5 w-3.5" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onEditToggle}
                    className="gap-1.5 bg-transparent"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEditToggle}
                  className="gap-1.5 bg-transparent"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Info
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Bio and Mobile */}
        {isEditing ? (
          <div className="space-y-2 border-t border-border pt-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Bio</label>
              <Textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="Your bio"
                rows={2}
                className="text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Mobile Number</label>
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
            <p className="text-foreground/80 leading-snug">{tempBio || bio}</p>
            {(tempMobileNumber || mobileNumber) && (
              <p className="text-muted-foreground">
                <span className="font-medium">Mobile:</span> {tempMobileNumber || mobileNumber}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}