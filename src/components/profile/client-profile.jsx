"use client"
import { useState, useEffect } from "react"
import ProfileHeader from "./components/profile-header"
import SocialLinksSection from "./components/social-links-section"
import { apiClient } from "@/api/AxiosServiceApi"
export default function ClientProfile() {
  const [data, setData] = useState(null)
  const [activeProjects, setActiveProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isHeaderEditing, setIsHeaderEditing] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)

  // ✅ Fetch client profile and active projects from backend
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // 1️⃣ Fetch client profile
        const profileRes = await apiClient.get("/api/get-profile/6", {
          credentials: "include",
        })
        if (!profileRes.ok) throw new Error("Failed to fetch profile data")
        const profileData = await profileRes.json()
        setData(profileData)

        // 2️⃣ Fetch active projects
        const projectsRes = await fetch("/api/profile/update-section-three-for-client", {
          credentials: "include",
        })
        if (!projectsRes.ok) throw new Error("Failed to fetch active projects")
        const projectsData = await projectsRes.json()
        setActiveProjects(projectsData)
      } catch (error) {
        console.error("Error fetching client profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [])

  // ✅ Handle header update (Section One)
  const handleHeaderSave = async (headerData) => {
    try {
      const formData = new FormData()
      formData.append(
        "profile",
        new Blob([JSON.stringify(headerData)], { type: "application/json" })
      )
      if (headerData.profileImage) formData.append("profileImage", headerData.profileImage)
      if (headerData.coverPhoto) formData.append("coverPhoto", headerData.coverPhoto)

      const res = await fetch("/api/profile/update-client-profile", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to update profile header")
      const updatedData = await res.json()
      setData(updatedData)
    } catch (error) {
      console.error("Error updating client header:", error)
    }
  }

  // ✅ Handle social links update (Section Two)
  const handleSocialLinksSave = async (socialData) => {
    try {
      const res = await fetch("/api/profile/update-client-social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(socialData),
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to update social links")
      const updatedData = await res.json()
      setData((prev) => ({ ...prev, ...updatedData }))
    } catch (error) {
      console.error("Error updating social links:", error)
    }
  }

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>
  if (!data) return <p className="text-center text-red-500">No client data found.</p>

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader
        coverPhoto={data.coverPhoto}
        profileImage={data.profileImage}
        name={data.name || data.companyName}
        title={data.designation}
        designation={data.designation}
        location={data.location || "Not specified"}
        rating={data.rating || 4.9}
        bio={data.bio}
        mobileNumber={data.mobileNumber}
        isEditing={isHeaderEditing}
        onEditToggle={() => setIsHeaderEditing(!isHeaderEditing)}
        isViewOnly={isViewOnly}
        onToggleViewOnly={() => setIsViewOnly(!isViewOnly)}
        onSave={handleHeaderSave}
      />

      {/* Social Links Section */}
      <SocialLinksSection data={data} onSave={handleSocialLinksSave} />

      {/* Active Projects */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Active Projects</h2>
        {activeProjects.length > 0 ? (
          <ul className="space-y-2">
            {activeProjects.map((project, index) => (
              <li key={index} className="p-3 border rounded-md">
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No active projects found.</p>
        )}
      </div>
    </div>
  )
}
