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
      if (!userId) return;
      try {
        setLoading(true);
        const profileRes = await apiClient.get(`/api/get-profile/${userId}`, {
          withCredentials: true,
        });
        setData(profileRes.data);

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

      setData(res.data);
      setIsHeaderEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating client profile:", error);
      toast.error("Update failed. Please check your connection.");
    }
  };

  const handleSocialLinksSave = async (socialData) => {
    try {
      const payload = {
        ...data,
        clientProfile: {
          ...data.clientProfile,
          linkedinUrl: socialData.linkedinUrl,
          githubUrl: socialData.githubUrl,
        },
        client: {
          ...data.client,
          companyUrl: socialData.portfolioUrl,
        },
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

  const phaseConfig = {
    IN_PROGRESS: { label: "In Progress", class: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
    COMPLETED:   { label: "Completed",   class: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
    PENDING:     { label: "Pending",     class: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
    CANCELLED:   { label: "Cancelled",   class: "bg-red-500/10 text-red-400 border border-red-500/20" },
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-4">
      <ProfileHeader
        originalData={data}
        coverPhoto={data.clientProfile?.bannerUrl}
        profileImage={data.clientProfile?.profileImageUrl}
        name={data.client?.companyName || data.userDto?.username || ""}
        designation={data.client?.designation || "Client"}
        location={data.clientProfile?.location}
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
        freelancerProfile={data.clientProfile}
        portfolioUrl={data.client?.companyUrl}
        onSave={handleSocialLinksSave}
      />

      {/* ── Active Projects — matches Card style of SocialLinksSection ── */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header — same pattern as CardHeader */}
        <div className="flex flex-row items-center justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Active Projects</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Projects you have posted</p>
          </div>
          {activeProjects.length > 0 && (
            <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              {activeProjects.length} {activeProjects.length === 1 ? "Project" : "Projects"}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-5 space-y-3">
          {activeProjects.length > 0 ? (
            activeProjects.map((project) => {
              const phase = phaseConfig[project.phase] ?? {
                label: project.phase ?? "Unknown",
                class: "bg-secondary text-muted-foreground border border-border",
              };

              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  {/* Left — title + budget */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {project.jobTitle}
                    </p>
                    <p className="text-xs font-medium text-emerald-500 mt-0.5">
                      ₹{project.budget?.toLocaleString("en-IN") ?? "—"}
                    </p>
                  </div>

                  {/* Right — phase badge */}
                  <span className={`ml-4 flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${phase.class}`}>
                    {phase.label}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 rounded-lg border border-dashed border-border bg-secondary/20">
              <p className="text-sm text-muted-foreground">No active projects yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}