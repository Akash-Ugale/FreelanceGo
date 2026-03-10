"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileHeader from "./components/profile-header";
import SocialLinksSection from "./components/social-links-section";
import { apiClient } from "@/api/AxiosServiceApi";
import { toast } from "sonner";

export default function ClientProfile() {
  const { userId } = useAuth();
  const [data, setData] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      // ✅ Guard clause: Wait until userId is available from AuthContext
      if (!userId) return;

      try {
        setLoading(true);

        // 1️⃣ Fetch client profile (Matches @GetMapping("/get-profile/{id}"))
        const profileRes = await apiClient.get(`/api/get-profile/${userId}`, {
          withCredentials: true,
        });
        setData(profileRes.data);

        // 2️⃣ Fetch analytics/projects (Matches corrected @GetMapping("/profile/get-client-analytics/{userId}"))
        // We use the new userId variable path the backend dev fixed
        const projectsRes = await apiClient.get(`/api/profile/get-client-analytics/${userId}`, {
          withCredentials: true,
        });
        setActiveProjects(projectsRes.data);

      } catch (error) {
        console.error("Error fetching client profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [userId]);

  const handleHeaderSave = async (profileDto, profileImageFile, coverPhotoFile) => {
    try {
      const formData = new FormData();
      
      // We send the whole DTO as a Blob so the backend can parse it as @RequestPart("profile")
      formData.append(
        "profile",
        new Blob([JSON.stringify(profileDto)], { type: "application/json" })
      );
      
      if (profileImageFile) formData.append("profileImage", profileImageFile);
      if (coverPhotoFile) formData.append("coverPhoto", coverPhotoFile);

      const res = await apiClient.post("/api/profile/update-client-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setData(res.data); // Update state with the fresh object from backend
      setIsHeaderEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating client profile:", error);
      toast.error("Update failed. Please check your connection.");
    }
  };
  
  const handleSocialLinksSave = async (socialData) => {
  try {
    // Construct the payload to match ProfileDto
    const payload = {
      ...data,
      clientProfile: {
        ...data.clientProfile,
        linkedinUrl: socialData.linkedinUrl,
        githubUrl: socialData.githubUrl,
      },
      client: {
        ...data.client,
        companyUrl: socialData.portfolioUrl, // Mapping "portfolioUrl" from UI to "companyUrl" for backend
      }
    };

    const res = await apiClient.post("/api/profile/update-client-social-links", payload, {
      withCredentials: true,
    });
    
    setData(res.data);
    toast.success("Links updated!");
  } catch (error) {
    console.error("Error updating social links:", error);
    toast.error("Failed to update links");
  }
};

  if (loading) return <p className="text-center py-10 text-gray-500">Loading profile...</p>;
  if (!data) return <p className="text-center py-10 text-red-500">No client data found.</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <ProfileHeader
        originalData={data}
        coverPhoto={data.clientProfile?.bannerUrl}
        profileImage={data.clientProfile?.profileImageUrl}
        // Accessing username via userDto as per your backend JSON structure
        name={data.userDto?.username || data.client?.companyName}
        designation={data.client?.designation || "Client"}
        location={data.clientProfile?.location }
        rating={data.clientProfile?.rating || 0}
        bio={data.client?.bio}
        mobileNumber={data.client?.phone}
        isEditing={isHeaderEditing}
        onEditToggle={() => setIsHeaderEditing(!isHeaderEditing)}
        isViewOnly={isViewOnly}
        onToggleViewOnly={() => setIsViewOnly(!isViewOnly)}
        onSave={handleHeaderSave}
      />

      <SocialLinksSection 
  freelancerProfile={data.clientProfile} // Reusing the prop name, but passing client data
  portfolioUrl={data.client?.companyUrl} // Clients use companyUrl
  onSave={handleSocialLinksSave} 
/>

      {/* Updated Active Projects Section */}
<div className="p-6 border border-gray-800 rounded-xl shadow-sm bg-[#0f172a]"> 
  <h2 className="text-xl font-bold mb-4 text-white">Active Projects</h2>
  
  {activeProjects && activeProjects.length > 0 ? (
    <ul className="grid gap-4">
      {activeProjects.map((project) => (
        <li key={project.id} className="p-4 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors bg-[#1e293b]">
          <h3 className="font-semibold text-lg text-white">{project.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{project.description}</p>
          {project.budget && (
            <span className="text-xs font-bold text-green-400 mt-2 block">
              Budget: ${project.budget}
            </span>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-center py-6 bg-[#1e293b] rounded-lg">
      <p className="text-sm text-gray-400">No active projects found.</p>
    </div>
  )}
</div>
    </div>
  );
}