"use client"
import { useState } from "react"
import ProfileHeader from "./components/profile-header"

import SocialLinksSection from "./components/social-links-section"
import PortfolioSection from "./components/portfolio-section"
import CertificationsSection from "./components/certifications-section"



const initialData = {
  name: "Tech Innovations Inc.",
  companyName: "Tech Innovations Inc.",
  bio: "We are a leading technology company focused on creating innovative solutions for businesses worldwide.",
  email: "john.smith@techinnovations.com",
  mobileNumber: "+1 (555) 987-6543",
  company_description:
    "We are a leading technology company focused on creating innovative solutions for businesses worldwide.",
  profileImage: "/company-profile.jpg",
  designation: "Technology Solutions",
  coverPhoto: "/corporate-cover.jpg",
}

export default function ClientProfile() {
  const [data, setData] = useState(initialData)
  const [isHeaderEditing, setIsHeaderEditing] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)

  const handleHeaderSave = (headerData) => {
    setData((prev) => ({ ...prev, ...headerData }))
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <ProfileHeader
        coverPhoto={data.coverPhoto}
        profileImage={data.profileImage}
        name={data.name}
        title={data.designation}
        designation={data.designation}
        location="New York, NY"
        rating={4.9}
        bio={data.bio}
        mobileNumber={data.mobileNumber}
        isEditing={isHeaderEditing}
        onEditToggle={() => setIsHeaderEditing(!isHeaderEditing)}
        isViewOnly={isViewOnly}
        onToggleViewOnly={() => setIsViewOnly(!isViewOnly)}
        onSave={handleHeaderSave}
      />

      {/* Social Links */}
      <SocialLinksSection />

      {/* Portfolio Section */}
      <PortfolioSection isFreelancer={false} />

      <CertificationsSection />

      
    </div>
  )
}
