"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, MessageSquare, Calendar, Award, TrendingUp } from "lucide-react"



const freelancerReviews = {
  averageRating: 4.8,
  totalReviews: 127,
  ratingDistribution: {
    5: 89,
    4: 28,
    3: 7,
    2: 2,
    1: 1,
  },
  reviews: [
    {
      id: 1,
      client: "TechCorp Inc.",
      project: "E-commerce Website Development",
      rating: 5,
      comment:
        "Sarah delivered exceptional work on our e-commerce platform. Her attention to detail and technical expertise exceeded our expectations. The project was completed on time and within budget. Highly recommended!",
      date: "2024-01-25",
      helpful: 12,
      skills: ["React", "Node.js", "E-commerce"],
    },
    {
      id: 2,
      client: "FitLife Startup",
      project: "Mobile App UI/UX Design",
      rating: 5,
      comment:
        "Outstanding design work! Sarah created beautiful, intuitive interfaces that our users love. Great communication throughout the project and delivered everything exactly as requested.",
      date: "2024-01-20",
      helpful: 8,
      skills: ["UI/UX Design", "Mobile Design", "Figma"],
    },
    {
      id: 3,
      client: "DevInsights Media",
      project: "Content Writing for Tech Blog",
      rating: 4,
      comment:
        "Good quality content with solid technical knowledge. Met all deadlines and was responsive to feedback. Would work with again.",
      date: "2024-01-18",
      helpful: 5,
      skills: ["Technical Writing", "Content Strategy"],
    },
  ],
}

const clientReviews = {
  averageRating: 4.6,
  totalReviews: 45,
  ratingDistribution: {
    5: 28,
    4: 12,
    3: 3,
    2: 1,
    1: 1,
  },
  reviews: [
    {
      id: 1,
      freelancer: "Sarah Johnson",
      project: "Full-Stack Web Development",
      rating: 5,
      comment:
        "TechCorp was an excellent client to work with. Clear requirements, prompt communication, and fair payment terms. They provided helpful feedback throughout the project.",
      date: "2024-01-25",
      helpful: 15,
      aspects: ["Communication", "Payment", "Project Clarity"],
    },
    {
      id: 2,
      freelancer: "Mike Chen",
      project: "Brand Identity Design",
      rating: 5,
      comment:
        "Great client! Very professional and understanding. Gave creative freedom while providing clear direction. Payments were always on time.",
      date: "2024-01-22",
      helpful: 9,
      aspects: ["Professionalism", "Creative Freedom", "Timely Payment"],
    },
    {
      id: 3,
      freelancer: "Emily Rodriguez",
      project: "Content Strategy",
      rating: 4,
      comment:
        "Good working relationship. Client was responsive and provided necessary resources. Minor delays in feedback but overall positive experience.",
      date: "2024-01-20",
      helpful: 6,
      aspects: ["Responsiveness", "Resource Provision"],
    },
  ],
}



export default function ReviewsContent({ userRole }) {
  const [activeTab, setActiveTab] = useState("received")
  const [replyText, setReplyText] = useState("")

  const data = userRole === "freelancer" ? freelancerReviews : clientReviews

  const renderStars = (rating, size) => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const getRatingPercentage = (rating) => {
    return Math.round((data.ratingDistribution[rating] / data.totalReviews) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {userRole === "freelancer"
            ? "See what clients are saying about your work"
            : "Reviews from freelancers you've worked with"}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{data.averageRating}</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                {renderStars(Math.round(data.averageRating))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{data.totalReviews}</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
                <div className="text-xs text-muted-foreground">
                  {userRole === "freelancer" ? "From clients" : "From freelancers"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{getRatingPercentage(5)}%</div>
                <div className="text-sm text-muted-foreground">5-Star Reviews</div>
                <div className="text-xs text-muted-foreground">
                  {data.ratingDistribution[5]} out of {data.totalReviews}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Rating Distribution</CardTitle>
          <CardDescription>Breakdown of your ratings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getRatingPercentage(rating)}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground w-16 text-right">
                  {data.ratingDistribution[rating]} ({getRatingPercentage(rating)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {userRole === "freelancer" ? "Client Reviews" : "Freelancer Reviews"}
          </CardTitle>
          <CardDescription>
            {userRole === "freelancer"
              ? "Reviews from clients you've worked with"
              : "Reviews from freelancers you've hired"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 mb-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${(userRole === "freelancer"
                          ? review.client
                          : review.freelancer
                        )
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}`}
                      />
                      <AvatarFallback>
                        {(userRole === "freelancer" ? review.client : review.freelancer)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{userRole === "freelancer" ? review.client : review.freelancer}</h4>
                      <p className="text-sm text-muted-foreground">{review.project}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(review.rating, "sm")}
                        <span className="text-sm text-muted-foreground">{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {review.date}
                  </div>
                </div>

                <p className="text-sm mb-4 leading-relaxed">{review.comment}</p>

                {/* Skills/Aspects Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(userRole === "freelancer" ? review.skills : review.aspects).map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Reply
                    </Button>
                  </div>
                  {review.rating === 5 && (
                    <Badge variant="default" className="text-xs">
                      <Award className="mr-1 h-3 w-3" />
                      Top Rated
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
