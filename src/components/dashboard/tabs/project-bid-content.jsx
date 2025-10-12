"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  ArrowLeft,
  Star,
  MapPin,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Briefcase,
  Award,
  FileText,
  User,
  ThumbsUp,
  ThumbsDown,
  Send,
  DollarSign,
} from "lucide-react";
import { RUPEE } from "@/utils/constants";

// Mock data for project details and bids
const projectData = {
  job_001: {
    title: "Full-Stack React Developer for E-commerce Platform",
    description:
      "We're looking for an experienced full-stack developer to build a modern e-commerce platform with React, Node.js, and PostgreSQL. The project includes user authentication, payment integration, inventory management, and admin dashboard.",
    budget: { type: "fixed", amount: 5000, range: { min: 4000, max: 6000 } },
    timeline: "8-10 weeks",
    skills: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Stripe API",
      "TypeScript",
      "AWS",
    ],
    bids: [
      {
        id: 1,
        freelancer: {
          name: "Sarah Johnson",
          avatar: "/placeholder.svg?height=60&width=60&text=SJ",
          title: "Senior Full-Stack Developer",
          rating: 4.9,
          reviewsCount: 127,
          completedJobs: 89,
          location: "New York, NY",
          verified: true,
          hourlyRate: "$85-120",
        },
        proposal: {
          bidAmount: 4200,
          timeline: "8 weeks",
          coverLetter:
            "I'm excited about this e-commerce project and believe I'm the perfect fit for your needs. With over 8 years of experience in full-stack development, I've successfully built and deployed 15+ e-commerce platforms using React, Node.js, and modern payment integrations.\n\nWhat sets me apart:\n• Deep expertise in React ecosystem (Redux, Next.js, TypeScript)\n• Extensive experience with payment gateways (Stripe, PayPal, Square)\n• Strong background in database optimization and security\n• Track record of delivering projects on time and within budget\n\nI'd love to discuss your specific requirements and share examples of similar projects I've completed. Looking forward to collaborating with you!",
          skills: [
            "React",
            "Node.js",
            "PostgreSQL",
            "Stripe API",
            "TypeScript",
            "AWS",
          ],
          attachments: ["portfolio.pdf", "previous_ecommerce_work.pdf"],
          submittedAt: "2024-01-25T10:30:00Z",
          status: "new",
        },
      },
      {
        id: 2,
        freelancer: {
          name: "Alex Chen",
          avatar: "/placeholder.svg?height=60&width=60&text=AC",
          title: "Full-Stack JavaScript Developer",
          rating: 4.7,
          reviewsCount: 89,
          completedJobs: 67,
          location: "Seattle, WA",
          verified: true,
          hourlyRate: "$70-95",
        },
        proposal: {
          bidAmount: 3800,
          timeline: "9 weeks",
          coverLetter:
            "Hello! I'm a passionate full-stack developer with 6+ years of experience building scalable web applications. I've worked on several e-commerce projects and understand the complexities involved in creating a robust platform.\n\nMy expertise includes:\n• Modern React development with hooks and context\n• Node.js backend development with Express\n• Database design and optimization (PostgreSQL, MongoDB)\n• Payment gateway integration (Stripe, PayPal)\n• AWS deployment and DevOps\n\nI'm committed to delivering high-quality code with comprehensive testing and documentation. I'd be happy to discuss your project requirements in detail.",
          skills: [
            "React",
            "Node.js",
            "Express",
            "PostgreSQL",
            "Stripe",
            "AWS",
            "Docker",
          ],
          attachments: ["portfolio_showcase.pdf"],
          submittedAt: "2024-01-25T14:15:00Z",
          status: "shortlisted",
        },
      },
      {
        id: 3,
        freelancer: {
          name: "Maria Rodriguez",
          avatar: "/placeholder.svg?height=60&width=60&text=MR",
          title: "React & Node.js Specialist",
          rating: 4.8,
          reviewsCount: 156,
          completedJobs: 134,
          location: "Remote",
          verified: true,
          hourlyRate: "$75-110",
        },
        proposal: {
          bidAmount: 4500,
          timeline: "7 weeks",
          coverLetter:
            "I'm excited to help you build this e-commerce platform! With over 7 years of experience in full-stack development, I specialize in creating performant, scalable web applications using modern technologies.\n\nKey highlights of my approach:\n• Component-based architecture with React and TypeScript\n• Secure backend APIs with Node.js and Express\n• Optimized database queries and caching strategies\n• Comprehensive testing (unit, integration, e2e)\n• CI/CD pipeline setup for smooth deployments\n\nI've successfully delivered 20+ e-commerce projects with features like multi-vendor support, advanced search, and analytics dashboards. Let's discuss how I can bring your vision to life!",
          skills: [
            "React",
            "TypeScript",
            "Node.js",
            "PostgreSQL",
            "Redis",
            "AWS",
            "Jest",
          ],
          attachments: ["ecommerce_case_studies.pdf", "technical_approach.pdf"],
          submittedAt: "2024-01-24T16:45:00Z",
          status: "interviewed",
        },
      },
    ],
  },
};

export default function ProjectBidsContent({ projectId }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedBid, setSelectedBid] = useState(null);
  const [showHireDialog, setShowHireDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [hireMessage, setHireMessage] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  const project = projectData[projectId];

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The project you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const filteredBids = project.bids.filter((bid) => {
    const matchesSearch =
      bid.freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.freelancer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.proposal.coverLetter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || bid.proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedBids = [...filteredBids].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.proposal.submittedAt).getTime() -
          new Date(a.proposal.submittedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.proposal.submittedAt).getTime() -
          new Date(b.proposal.submittedAt).getTime()
        );
      case "lowest-bid":
        return a.proposal.bidAmount - b.proposal.bidAmount;
      case "highest-bid":
        return b.proposal.bidAmount - a.proposal.bidAmount;
      case "highest-rated":
        return b.freelancer.rating - a.freelancer.rating;
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "secondary";
      case "shortlisted":
        return "outline";
      case "interviewed":
        return "default";
      case "hired":
        return "default";
      case "declined":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <Eye className="h-4 w-4" />;
      case "shortlisted":
        return <Star className="h-4 w-4" />;
      case "interviewed":
        return <MessageSquare className="h-4 w-4" />;
      case "hired":
        return <CheckCircle className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getBidStats = () => {
    const total = project.bids.length;
    const avgBid =
      project.bids.reduce((sum, bid) => sum + bid.proposal.bidAmount, 0) /
      total;
    const lowestBid = Math.min(
      ...project.bids.map((bid) => bid.proposal.bidAmount)
    );
    const highestBid = Math.max(
      ...project.bids.map((bid) => bid.proposal.bidAmount)
    );

    return { total, avgBid: Math.round(avgBid), lowestBid, highestBid };
  };

  const stats = getBidStats();

  const handleHire = (bid) => {
    setSelectedBid(bid);
    setShowHireDialog(true);
  };

  const handleDecline = (bid) => {
    setSelectedBid(bid);
    setShowDeclineDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBudget = (budget) => {
    if (budget.type === "hourly") {
      return `${RUPEE}${budget.amount}/hr`;
    }
    return `${RUPEE}${budget.amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        {/* <Button variant="outline" size="sm" onClick={() => navigate()} className="bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button> */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/proposals-review")}
          className="bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {project.title}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Review {project.bids.length} proposals for this project
          </p>
        </div>
      </div>

      {/* Project Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatBudget(project.budget)}
              </div>
              <div className="text-sm text-muted-foreground">
                Project Budget
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{project.timeline}</div>
              <div className="text-sm text-muted-foreground">Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{project.bids.length}</div>
              <div className="text-sm text-muted-foreground">
                Total Proposals
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{project.skills.length}</div>
              <div className="text-sm text-muted-foreground">
                Required Skills
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bid Statistics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bids</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Received proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Bid</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />{" "}
            {/* Optional: keep icon, or replace with RUPEE icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {RUPEE}
              {stats.avgBid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Average proposal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Bid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" /> {/* Optional */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {RUPEE}
              {stats.lowestBid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Most competitive</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Bid</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" /> {/* Optional */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {RUPEE}
              {stats.highestBid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Premium option</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by freelancer name, title, or proposal content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="lowest-bid">Lowest Bid</SelectItem>
            <SelectItem value="highest-bid">Highest Bid</SelectItem>
            <SelectItem value="highest-rated">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bids List */}
      <div className="space-y-6">
        {sortedBids.map((bid) => (
          <Card key={bid.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Bid Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={bid.freelancer.avatar || "/placeholder.svg"}
                        alt={bid.freelancer.name}
                      />
                      <AvatarFallback>
                        {bid.freelancer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-lg">
                          {bid.freelancer.name}
                        </h4>
                        {bid.freelancer.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Award className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {bid.freelancer.title}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{bid.freelancer.rating}</span>
                          <span>({bid.freelancer.reviewsCount})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{bid.freelancer.completedJobs} jobs</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{bid.freelancer.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge
                      variant={getStatusColor(bid.proposal.status)}
                      className="flex items-center space-x-1"
                    >
                      {getStatusIcon(bid.proposal.status)}
                      <span className="capitalize">{bid.proposal.status}</span>
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(bid.proposal.submittedAt)}
                    </div>
                  </div>
                </div>

                {/* Proposal Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {RUPEE}
                      {bid.proposal.bidAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Proposed Amount
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bid.proposal.timeline}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Timeline
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {bid.freelancer.hourlyRate}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Hourly Rate
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="space-y-3">
                  <h5 className="font-semibold">Cover Letter</h5>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-line">
                      {bid.proposal.coverLetter}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h5 className="font-semibold">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {bid.proposal.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                {bid.proposal.attachments.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="font-semibold">Attachments</h5>
                    <div className="flex flex-wrap gap-2">
                      {bid.proposal.attachments.map((attachment, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {attachment}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {bid.proposal.status === "new" ||
                    bid.proposal.status === "shortlisted" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDecline(bid)}
                          className="bg-transparent"
                        >
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                        <Button size="sm" onClick={() => handleHire(bid)}>
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Hire Freelancer
                        </Button>
                      </>
                    ) : (
                      <Badge
                        variant={getStatusColor(bid.proposal.status)}
                        className="capitalize"
                      >
                        {bid.proposal.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedBids.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No proposals found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or wait for more freelancers to
            submit proposals.
          </p>
        </div>
      )}

      {/* Hire Dialog */}
      <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hire {selectedBid?.freelancer.name}</DialogTitle>
            <DialogDescription>
              Send a hiring message to start working with this freelancer on "
              {project.title}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Message to Freelancer
              </label>
              <Textarea
                placeholder="Welcome to the team! I'm excited to work with you on this project..."
                value={hireMessage}
                onChange={(e) => setHireMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowHireDialog(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={() => setShowHireDialog(false)}>
                <Send className="mr-2 h-4 w-4" />
                Send Hire Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Decline Proposal</DialogTitle>
            <DialogDescription>
              Let {selectedBid?.freelancer.name} know why their proposal wasn't
              selected (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reason for Declining (Optional)
              </label>
              <Textarea
                placeholder="Thank you for your proposal. While your skills are impressive, we've decided to go with another candidate..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeclineDialog(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeclineDialog(false)}
              >
                Decline Proposal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
