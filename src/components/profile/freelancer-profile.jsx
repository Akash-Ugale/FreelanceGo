"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "./components/profile-header";
import SocialLinksSection from "./components/social-links-section";
import PortfolioSection from "./components/portfolio-section";
import CertificationsSection from "./components/certifications-section";
import BankDetailsSection from "./components/bank-details-section";
import { apiClient } from "@/api/AxiosServiceApi";

export default function FreelancerProfile() {

  const {userId} = useAuth()
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // ✅ Fetch freelancer profile on mount (runtime)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
      console.warn("❌ No userId found. Cannot fetch profile.");
      return;
    }
      try {
        console.log("Logged in userId:",userId);
        console.log("User Id",userId, typeof userId);
        // Use token-based or session-based authentication — no hardcoded userId
        const response = await apiClient.get(`/api/get-profile/${userId}`, {
 
          withCredentials: true, // ensures cookies (if Spring Security uses JWT/session)
        });
        setData(response.data);
        if (response.data.freelancerProfile) {
    setCoverPhoto(response.data.freelancerProfile.bannerUrl);
    setProfilePhoto(response.data.freelancerProfile.imageUrl);
  }

      } catch (error) {
        console.error("Error fetching freelancer profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // ✅ Update profile header (Section 1)
// Update profile header (Section 1)
const handleHeaderSave = async (profileDto, profileImageFile, coverPhotoFile) => {
  console.log("handleHeaderSave called:", { profileDto, profileImageFile, coverPhotoFile });

  try {
    const formData = new FormData();

    // Append JSON as Blob
    formData.append("profile", new Blob([JSON.stringify(profileDto)], { type: "application/json" }));

    // Append files if uploaded
    if (profileImageFile) formData.append("profileImage", profileImageFile);
    if (coverPhotoFile) formData.append("coverPhoto", coverPhotoFile);

    // Debug: log FormData entries
    for (const pair of formData.entries()) {
      console.log("FormData:", pair[0], pair[1]);
    }

    const response = await apiClient.post(
      "/api/profile/update-freelancer-profile",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    console.log("Header updated successfully:", response.data);

    // Merge updated data
    setData((prev) => ({ ...prev, ...response.data }));

  } catch (error) {
    console.error("Error updating header section:", error);
  }
};


  // ✅ Update social links (Section 2)
  const handleSocialLinksSave = async (socialData) => {
    if (!data || !data.user || !data.user.id) {
      console.error("❌ User ID not found in profile data.");
      return;
    }

    try {
      const payload = {
        user: { id: data.user.id }, // ✅ dynamically fetched from runtime data
        socialLinks: socialData, // ✅ your social links array
      };

      console.log("🔹 Sending social links payload:", payload);

      const response = await apiClient.post(
        "/api/profile/update-freelancer-social-links",
        payload,
        { withCredentials: true }
      );

      console.log("✅ Social links updated successfully:", response.data);

      setData((prev) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error("❌ Error updating social links:", error);
    }
  };

  // // ✅ Update portfolio (Section 3)
  // const handlePortfolioSave = async (portfolioData, imageFile, portfolioFile) => {
  //   try {
  //     const formData = new FormData()
  //     formData.append("profile", new Blob([JSON.stringify(portfolioData)], { type: "application/json" }))
  //     if (imageFile) formData.append("portfolio-section", imageFile)
  //     if (portfolioFile) formData.append("portfolio-section", portfolioFile)

  //     const response = await apiClient.post("/api/profile/update-freelancer-portfolio", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       withCredentials: true,
  //     })

  //     setData((prev) => ({ ...prev, ...response.data }))
  //   } catch (error) {
  //     console.error("Error updating portfolio section:", error)
  //   }
  // }

  const handlePortfolioSave = async (portfolioItems) => {
    console.log("Saving portfolio:", portfolioItems);

    try {
      const res = await apiClient.post(
        "https://freelancegobackend.onrender.com/api/profile/update-freelancer-portfolio",
        { portfolioItems },
        { withCredentials: true }
      );

      console.log("Portfolio updated:", res.data);
      toast.success("Portfolio updated successfully!");
    } catch (err) {
      console.error("Error updating portfolio:", err);
      toast.error("Failed to update portfolio!");
    }
  };

  // certification section
  const handleCertificationsSave = async (certData) => {
    try {
      for (const cert of certData.certifications) {
        const formData = new FormData();

        // Add main profile JSON for this certification
        formData.append(
          "profile",
          new Blob([JSON.stringify(certData)], { type: "application/json" })
        );

        // ✅ Add certificate file if uploaded
        if (cert.file) {
          formData.append("certification-section", cert.file);
        }

        // Call backend once per certification
        const response = await apiClient.post(
          "/api/profile/update-freelancer-certification",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        console.log("Uploaded certification:", response.data);
        setData((prev) => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error("Error updating certifications section:", error);
    }
  };

  // ✅ Update bank details (Optional extra section)
  const handleBankDetailsSave = (bankData) => {
    setData((prev) => ({ ...prev, ...bankData }));
  };

  if (loading) return <p>Loading profile...</p>;
  if (!data) return <p>No profile data found.</p>;

  // Before the return statement, define the nested data source:
  const profileDetails = data.freelancerProfile || {};

  return (
    <div className="space-y-4">
      {/* ProfileHeader */}
      <ProfileHeader
        originalData={data}
        coverPhoto={profileDetails.bannerUrl}
        profileImage={data.user?.imageData}
        //profileImage={data.profileImage}
        //profileImage = {data.user.imageData}
        name={data.user.username}
        //title={data.designation}
        designation={data.freelancer?.designation}
        location={profileDetails.location || "Unknown"}
        rating={profileDetails.rating || 0}
        bio={data.freelancer?.bio}
        mobileNumber={data.freelancer?.phone}
        isEditing={isHeaderEditing}
        onEditToggle={() => setIsHeaderEditing(!isHeaderEditing)}
        isViewOnly={isViewOnly}
        onToggleViewOnly={() => setIsViewOnly(!isViewOnly)}
        onSave={handleHeaderSave}
      />

      {/* Social Links */}
      <SocialLinksSection
        socialLinks={data.socialLinks || []}
        onSave={handleSocialLinksSave}
      />

      {/* Portfolio Section */}
      <PortfolioSection
        // isFreelancer={true}
        //portfolio={data.portfolio || []}
        portfolioItems={data.portfolioItems || []}
        onSave={handlePortfolioSave}
      />

      <CertificationsSection
        certifications={data.freelancerCertificationDetails || []}
        userId={data.user.id} // ✅ Pass it here
        onSave={handleCertificationsSave}
      />

      {/* Bank Details Section */}
      <BankDetailsSection
        accountNumber={data.accountNumber}
        ifscCode={data.ifscCode}
        onSave={handleBankDetailsSave}
      />
    </div>
  );
}
