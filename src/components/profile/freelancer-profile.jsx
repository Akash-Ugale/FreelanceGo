"use client"
import { useState } from "react"
import ProfileHeader from "./components/profile-header"
import SocialLinksSection from "./components/social-links-section"
import PortfolioSection from "./components/portfolio-section"
import CertificationsSection from "./components/certifications-section"
import BankDetailsSection from "./components/bank-details-section"



const initialData = {
  name: "Sarah Johnson",
  bio: "Experienced web developer specializing in React and Next.js. Passionate about creating clean, scalable code.",
  mobileNumber: "+1 (555) 123-4567",
  accountNumber: "1234567890123456",
  ifscCode: "SBIN0001234",
  profileImage: "/professional-headshot.png",
  designation: "Full Stack Developer & Web Designer",
  coverPhoto: "/professional-cover-tech.jpg",
}

export default function FreelancerProfile() {
  const [data, setData] = useState(initialData)
  const [isHeaderEditing, setIsHeaderEditing] = useState(false)
  const [isViewOnly, setIsViewOnly] = useState(false)

  const handleHeaderSave = (headerData) => {
    setData((prev) => ({ ...prev, ...headerData }))
  }

  const handleBankDetailsSave = (bankData) => {
    setData((prev) => ({ ...prev, ...bankData }))
  }

  return (
    <div className="space-y-4">
      {/* ProfileHeader */}
      <ProfileHeader
        coverPhoto={data.coverPhoto}
        profileImage={data.profileImage}
        name={data.name}
        title={data.designation}
        designation={data.designation}
        location="San Francisco, CA"
        rating={4.8}
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
      <PortfolioSection isFreelancer={true} />

      {/* Certifications Section */}
      <CertificationsSection />

      {/* Bank Details Section */}
      <BankDetailsSection accountNumber={data.accountNumber} ifscCode={data.ifscCode} onSave={handleBankDetailsSave} />

      
    </div>
  )
}
