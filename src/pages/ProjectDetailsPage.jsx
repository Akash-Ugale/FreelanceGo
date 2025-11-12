"use client";

import { apiClient } from "@/api/AxiosServiceApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  Loader2,
  MapPin,
  Star,
  Users,
  ArrowLeft,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RUPEE } from "@/utils/constants";

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFullRequirements, setShowFullRequirements] = useState(false);

  const fetchProjectDetail = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(
        `/api/dashboard/get-post/${projectId}`,
      );
      setProject(response.data.job);
    } catch (error) {
      console.error("Error fetching project details:", error);
      setProject(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [projectId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBudget = (budget) => {
    if (typeof budget !== "number") {
      return "N/A";
    }
    return `${budget.toLocaleString()}`;
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";
    const weeks = Math.ceil(
      (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60 * 24 * 7),
    );
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  };

  const formatExperienceLevel = (level) => {
    if (!level) return "N/A";
    return level
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const handleDownloadFile = () => {
    if (project?.file) {
      window.open(project.file, "_blank");
    }
  };

  const handleBidNow = () => {
    navigate(`/dashboard/submit-proposal/${projectId}`);
  };

  const truncateText = (text, lines = 4) => {
    if (!text) return "";
    const words = text.split(" ");
    const approximateWordsPerLine = 15;
    const maxWords = lines * approximateWordsPerLine;

    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const shouldShowMoreButton = (text, lines = 4) => {
    if (!text) return false;
    const words = text.split(" ");
    const approximateWordsPerLine = 15;
    const maxWords = lines * approximateWordsPerLine;
    return words.length > maxWords;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-500" />
        <span className="text-lg">Loading project details...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Briefcase className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 text-sm"
        >
          {project.status}
        </Badge>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">
                  {project.jobTitle}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Posted: {formatDate(project.createdAt)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>ID: {project.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatBudget(project.budget)}
                  </div>
                  <div className="text-xs text-muted-foreground">Budget</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-xl font-bold text-purple-600">
                    {calculateDuration(
                      project.projectStartTime,
                      project.projectEndTime,
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Star className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {formatExperienceLevel(project.experienceLevel)}
                  </div>
                  <div className="text-xs text-muted-foreground">Level</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-xl font-bold text-orange-600">
                    {project.proposalsCount || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Proposals</div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Project Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {showFullDescription
                ? project.jobDescription
                : truncateText(project.jobDescription, 4)}
            </p>
            {shouldShowMoreButton(project.jobDescription, 4) && (
              <Button
                variant="link"
                className="mt-2 p-0 h-auto text-blue-600"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? (
                  <>
                    Show Less <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show More <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>

          {project.requirement && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <p className="text-muted-foreground leading-relaxed">
                {showFullRequirements
                  ? project.requirement
                  : truncateText(project.requirement, 4)}
              </p>
              {shouldShowMoreButton(project.requirement, 4) && (
                <Button
                  variant="link"
                  className="mt-2 p-0 h-auto text-blue-600"
                  onClick={() => setShowFullRequirements(!showFullRequirements)}
                >
                  {showFullRequirements ? (
                    <>
                      Show Less <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills?.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Project Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <div className="text-sm font-medium">Start Date</div>
                  <div className="text-muted-foreground">
                    {project.projectStartTime
                      ? formatDate(project.projectStartTime)
                      : "Not specified"}
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Calendar className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <div className="text-sm font-medium">End Date</div>
                  <div className="text-muted-foreground">
                    {project.projectEndTime
                      ? formatDate(project.projectEndTime)
                      : "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Client Information</h3>
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0">
                {project.clientDto?.userDto?.imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${project.clientDto.userDto.imageData}`}
                    alt={project.clientDto?.companyName || "Client"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {project.clientDto?.companyName?.charAt(0) ||
                      project.clientDto?.userDto?.username?.charAt(0) ||
                      "?"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-3">
                  {project.clientDto?.companyName ||
                    project.clientDto?.userDto?.username ||
                    "Unknown Client"}
                </h4>
                <div className="space-y-2">
                  {project.clientDto?.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{project.clientDto.phone}</span>
                    </div>
                  )}
                  {project.clientDto?.userDto?.email && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{project.clientDto.userDto.email}</span>
                    </div>
                  )}
                  {project.clientDto?.userDto?.phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{project.clientDto.userDto.phone}</span>
                    </div>
                  )}
                </div>
                {project.clientDto?.bio && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {project.clientDto.bio}
                  </p>
                )}
                {project.clientDto?.companyUrl && (
                  <div className="mt-3">
                    <a
                      href={project.clientDto.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Visit Company Website →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {project.file && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Attached Documents</h3>
              <Button
                variant="outline"
                onClick={handleDownloadFile}
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Project File
              </Button>
            </div>
          )}

          {project.phase && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Project Phase</h3>
              <Badge variant="secondary" className="text-sm">
                {project.phase}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/*<div className="flex justify-between items-center p-6 bg-muted/50 rounded-lg border">
        <div>
          <h3 className="text-lg font-semibold mb-1">
            Interested in this project?
          </h3>
          <p className="text-sm text-muted-foreground">
            {project.alreadyBid
              ? "You have already submitted a proposal for this project"
              : "Submit your proposal to get started"}
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleBidNow}
          disabled={project.alreadyBid || project.status !== "ACTIVE"}
        >
          {project.alreadyBid ? "Proposal Submitted" : "Submit Proposal"}
        </Button>
      </div>*/}
    </div>
  );
}
