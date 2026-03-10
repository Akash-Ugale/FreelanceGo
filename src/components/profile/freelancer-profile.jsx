"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "./components/profile-header";
import SocialLinksSection from "./components/social-links-section";
import PortfolioSection from "./components/portfolio-section";
import CertificationsSection from "./components/certifications-section";
import BankDetailsSection from "./components/bank-details-section";
import { apiClient } from "@/api/AxiosServiceApi";
import { toast } from "sonner";

export default function FreelancerProfile() {
  const { userId } = useAuth();
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://freelancegobackend.onrender.com/${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const response = await apiClient.get(`/api/get-profile/${userId}`, {
          withCredentials: true,
        });
        setData(response.data);
        const profile = response.data.freelancerProfile;
        if (profile?.bannerUrl) setCoverPhoto(getFullUrl(profile.bannerUrl));
      } catch (error) {
        console.error("Error fetching freelancer profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleHeaderSave = async (profileDto, profileImageFile, coverPhotoFile) => {
    try {
      const formData = new FormData();
      formData.append("profile", new Blob([JSON.stringify(profileDto)], { type: "application/json" }));
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (coverPhotoFile) formData.append("coverPhoto", coverPhotoFile);

      const response = await apiClient.post("/api/profile/update-freelancer-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const updated = response.data.freelancerProfile;
      if (updated?.bannerUrl) setCoverPhoto(getFullUrl(updated.bannerUrl));
      setData((prev) => ({ ...prev, ...response.data }));
      toast.success("Header updated!");
    } catch (error) {
      console.error("Error updating header:", error);
      toast.error("Header update failed");
    }
  };

  const handleSocialLinksSave = async (updatedSocialFields) => {
    try {
      const payload = {
        ...data,
        freelancerProfile: {
          ...data?.freelancerProfile,
          linkedinUrl: updatedSocialFields.linkedinUrl,
          githubUrl: updatedSocialFields.githubUrl,
        },
        freelancer: {
          ...data?.freelancer,
          portfolioUrl: updatedSocialFields.portfolioUrl,
        }
      };
      const response = await apiClient.post("/api/profile/update-freelancer-social-links", payload, { withCredentials: true });
      setData(response.data);
      toast.success("Links updated!");
    } catch (error) {
      toast.error("Failed to update links.");
    }
  };

 // --- PORTFOLIO HANDLERS ---
const handlePortfolioSave = async (item) => {
  if (isSaving) return;
  try {
    setIsSaving(true);
    const formData = new FormData();
    
    // Construct DTO - if ID contains 'temp', it's a new item, so send null
    const portfolioDto = {
      id: item.id?.toString().includes('temp') ? null : item.id,
      title: item.title,
      description: item.description,
      portfolioUrl: item.portfolioUrl,
    };

    formData.append("portfolio", new Blob([JSON.stringify(portfolioDto)], { type: "application/json" }));

    // Only upload the image if it's a new local file (Data URL)
    if (item.image && item.image.startsWith('data:')) {
      const res = await fetch(item.image);
      const blob = await res.blob();
      formData.append("portfolio-image", blob, `project_${Date.now()}.png`);
    }

    // Determine URL based on presence of real ID
    const url = portfolioDto.id 
      ? "/api/profile/update-freelancer-portfolio" 
      : "/api/profile/create-freelancer-portfolio";

    const response = await apiClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    setData(response.data); // Refresh profile with server data
    toast.success(portfolioDto.id ? "Project updated!" : "Project created!");
  } catch (error) {
    toast.error("Error saving portfolio item");
  } finally {
    setIsSaving(false);
  }
};

const handlePortfolioDelete = async (id) => {
  if (id?.toString().includes('temp')) return; // Just a local UI item
  try {
    await apiClient.delete(`/api/profile/delete-freelancer-portfolio/${id}`, { withCredentials: true });
    // Manually filter out from state for immediate UI feedback
    setData(prev => ({
      ...prev,
      freelancerPortfolioDetails: prev.freelancerPortfolioDetails.filter(p => p.id !== id)
    }));
    toast.success("Project deleted");
  } catch (error) {
    toast.error("Failed to delete project");
  }
};

// --- CERTIFICATION HANDLERS ---
const handleCertificationsSave = async (cert) => {
  try {
    const formData = new FormData();
    const certDto = {
      id: cert.id?.toString().includes('temp') ? null : cert.id,
      certificateName: cert.certificateName,
      provider: cert.provider
    };

    formData.append("certificate", new Blob([JSON.stringify(certDto)], { type: "application/json" }));
    
    // --- ADDED/UPDATED LOGIC HERE ---
    if (cert.file) {
        // If it's a raw File object from the input
        formData.append("certification-image", cert.file);
    } else if (cert.certificateImage && cert.certificateImage.startsWith('data:')) {
        // If it's a base64 string from the preview (crucial for rendering)
        const res = await fetch(cert.certificateImage);
        const blob = await res.blob();
        formData.append("certification-image", blob, `cert_${Date.now()}.png`);
    }
    // --------------------------------

    const url = certDto.id 
      ? "/api/profile/update-freelancer-certification" 
      : "/api/profile/create-freelancer-certification";

    const response = await apiClient.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    
    setData(response.data);
    toast.success("Certification saved!");
  } catch (error) {
    console.error("Cert save error:", error);
    toast.error("Failed to save certification");
  }
};

const handleCertificationDelete = async (id) => {
  if (id?.toString().includes('temp')) return;
  try {
    await apiClient.delete(`/api/profile/delete-freelancer-certification/${id}`, { withCredentials: true });
    setData(prev => ({
      ...prev,
      freelancerCertificationDetails: prev.freelancerCertificationDetails.filter(c => c.id !== id)
    }));
    toast.success("Certification deleted");
  } catch (error) {
    toast.error("Failed to delete certification");
  }
};
  const handleBankDetailsSave = (bankData) => {
    setData((prev) => ({ ...prev, ...bankData }));
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!data) return <div className="p-8 text-center">No profile data found.</div>;

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-4">
      <ProfileHeader
        originalData={data}
        coverPhoto={coverPhoto}
        profileImage={profilePhoto}
        name={data.user.username}
        designation={data.freelancer?.designation}
        location={data.freelancerProfile?.location || ""}
        rating={data.freelancerProfile?.rating || 0}
        bio={data.freelancer?.bio}
        mobileNumber={data.freelancer?.phone}
        isEditing={isHeaderEditing}
        onEditToggle={() => setIsHeaderEditing(!isHeaderEditing)}
        isViewOnly={isViewOnly}
        onToggleViewOnly={() => setIsViewOnly(!isViewOnly)}
        onSave={handleHeaderSave}
      />

      <SocialLinksSection
        freelancerProfile={data.freelancerProfile}
        portfolioUrl={data?.freelancer?.portfolioUrl}
        onSave={handleSocialLinksSave}
      />

<PortfolioSection
  portfolioItems={data.freelancerPortfolioDetails || []} 
  onSave={handlePortfolioSave}
  onDelete={handlePortfolioDelete}
  isSaving={isSaving}
/>

<CertificationsSection
  certifications={data.freelancerCertificationDetails || []}
  onSave={handleCertificationsSave}
  onDelete={handleCertificationDelete}
  userId={data.user.id}
/>

      <BankDetailsSection
        accountNumber={data.accountNumber}
        ifscCode={data.ifscCode}
        onSave={handleBankDetailsSave}
      />
    </div>
  );
}