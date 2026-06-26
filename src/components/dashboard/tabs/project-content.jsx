import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Target,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Plus,
  FileText,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Lock,
  Loader2,
  Flag,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiClient } from "@/api/AxiosServiceApi";
import { RUPEE, userRoles } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext.jsx";
import { format, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Java enum mirrors — single source of truth for status strings
// ---------------------------------------------------------------------------

/** mirrors PaymentStatus.java */
const PaymentStatus = {
  NOT_PAID: "NOT_PAID",
  ESCROW_HELD: "ESCROW_HELD",
  RELEASED: "RELEASED",
  REFUNDED: "REFUNDED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

/** mirrors VerificationStatus.java */
const VerificationStatus = {
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED_BY_CLIENT: "APPROVED_BY_CLIENT",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
  VERIFIED: "VERIFIED",
};

/** mirrors MilestoneStatus.java */
const MilestoneStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  REVISION_REQUESTED: "REVISION_REQUESTED",
  APPROVED: "APPROVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

/** mirrors SubmissionStatus (inferred from API response) */
const SubmissionStatus = {
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

// ---------------------------------------------------------------------------
// Razorpay loader helper
// ---------------------------------------------------------------------------
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ---------------------------------------------------------------------------
// Helper: has the freelancer finalized the milestone sequence?
//
// The API response uses "last" (Java boolean getter strips "is" prefix in JSON
// serialization). We check both spellings defensively.
// ---------------------------------------------------------------------------
const sequenceIsPublished = (milestones) =>
  milestones.some((m) => m.last === true || m.isLast === true);

// ---------------------------------------------------------------------------
// Helper: has the client already approved the entire sequence?
//
// From the actual API response the approval signal lives on
// milestone.contract.verificationStatus ("APPROVED_BY_CLIENT"), NOT on
// milestone.verificationStatus (which is null until work is submitted/verified
// at the individual milestone level).
//
// A milestone is considered "sequence-approved" when:
//   - its contract-level verificationStatus is APPROVED_BY_CLIENT, OR
//   - its own verificationStatus is VERIFIED (fully done), OR
//   - its own status is COMPLETED.
// ---------------------------------------------------------------------------
const getMilestoneContractVerification = (m) =>
  m.contract?.verificationStatus ?? null;

const sequenceIsApprovedByClient = (milestones) =>
  milestones.length > 0 &&
  milestones.every(
    (m) =>
      getMilestoneContractVerification(m) ===
        VerificationStatus.APPROVED_BY_CLIENT ||
      m.status === MilestoneStatus.COMPLETED,
  );

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function ProjectsContent() {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  // ── projects ──────────────────────────────────────────────────────────────
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [isProjectsPaneCollapsed, setIsProjectsPaneCollapsed] = useState(false);

  // ── milestones ────────────────────────────────────────────────────────────
  const [milestones, setMilestones] = useState([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);

  // ── submission notes ──────────────────────────────────────────────────────
  const [submissionNotes, setSubmissionNotes] = useState({});

  // ── add milestone dialog ──────────────────────────────────────────────────
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    description: "",
    daysRequired: "",
    amount: "",
    isLast: false,
  });

  // ── submission ────────────────────────────────────────────────────────────
  const [uploadingMilestoneId, setUploadingMilestoneId] = useState(null);
  const [submissionTypes, setSubmissionTypes] = useState({});
  const [submissionUrls, setSubmissionUrls] = useState({});

  // ── payment dialog ────────────────────────────────────────────────────────
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedMilestoneForPayment, setSelectedMilestoneForPayment] =
    useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ── reject milestone feedback dialog (client → sequence rejection) ─────────
  const [isRejectSequenceOpen, setIsRejectSequenceOpen] = useState(false);
  // Per-milestone feedback map: { [milestoneId]: string }
  const [sequenceFeedbackMap, setSequenceFeedbackMap] = useState({});
  const [sequenceActionLoading, setSequenceActionLoading] = useState(false);

  // ── reject submission dialog ───────────────────────────────────────────────
  const [isRejectSubmissionOpen, setIsRejectSubmissionOpen] = useState(false);
  const [rejectingSubmissionMilestoneId, setRejectingSubmissionMilestoneId] =
    useState(null);
  const [submissionRemark, setSubmissionRemark] = useState("");

  // ── update milestone dialog ───────────────────────────────────────────────
  const [isUpdateMilestoneOpen, setIsUpdateMilestoneOpen] = useState(false);
  const [updatingMilestone, setUpdatingMilestone] = useState(null);
  const [updateMilestoneData, setUpdateMilestoneData] = useState({
    name: "",
    description: "",
    daysRequired: "",
    amount: "",
    isLast: false,
  });

  // =========================================================================
  // Fetch projects
  // =========================================================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const endpoint =
          userRole === userRoles.FREELANCER
            ? "/api/active-projects-for-freelancer"
            : "/api/dashboard/get-in-progress-post";
        const res = await apiClient.get(endpoint);
        const formatted = (res.data || []).map((p) => ({
          id: p.id,
          contractId: p.id,
          // Job fields live under p.job (JobDto)
          title: p.job?.jobTitle ?? "Untitled",
          description: p.job?.jobDescription ?? "",
          requiredSkills: p.job?.requiredSkills ?? [],
          experienceLevel: p.job?.experienceLevel ?? "",
          // Client is top-level on ContractDto; also nested inside job as clientDto
          client: {
            id: p.client?.id ?? p.job?.clientDto?.id ?? null,
            companyName:
              p.client?.companyName ??
              p.job?.clientDto?.companyName ??
              p.client?.userDto?.username ??
              "Client",
            name:
              p.client?.userDto?.username ??
              p.job?.clientDto?.userDto?.username ??
              p.client?.companyName ??
              "Client",
            email:
              p.client?.userDto?.email ??
              p.job?.clientDto?.userDto?.email ??
              "N/A",
            phone: p.client?.phone ?? p.job?.clientDto?.phone ?? "N/A",
            bio: p.client?.bio ?? p.job?.clientDto?.bio ?? "",
            imageData:
              p.client?.userDto?.imageData ??
              p.job?.clientDto?.userDto?.imageData ??
              null,
          },
          // Freelancer is top-level on ContractDto; also under acceptedBid.freelancerDto
          freelancer: {
            id: p.freelancer?.id ?? p.acceptedBid?.freelancerDto?.id ?? null,
            name:
              p.freelancer?.userDto?.username ??
              p.acceptedBid?.freelancerDto?.userDto?.username ??
              "Freelancer",
            email:
              p.freelancer?.userDto?.email ??
              p.acceptedBid?.freelancerDto?.userDto?.email ??
              "N/A",
            phone:
              p.freelancer?.phone ??
              p.acceptedBid?.freelancerDto?.phone ??
              "N/A",
            bio: p.freelancer?.bio ?? p.acceptedBid?.freelancerDto?.bio ?? "",
            imageData:
              p.freelancer?.userDto?.imageData ??
              p.acceptedBid?.freelancerDto?.userDto?.imageData ??
              null,
            designation:
              p.freelancer?.designation ??
              p.acceptedBid?.freelancerDto?.designation ??
              "",
            portfolioUrl:
              p.freelancer?.portfolioUrl ??
              p.acceptedBid?.freelancerDto?.portfolioUrl ??
              "",
            skills:
              p.freelancer?.skills ??
              p.acceptedBid?.freelancerDto?.skills ??
              [],
          },
          budget: p.job?.budget ?? 0,
          // Status comes from ContractDto.status; phase from job.phase
          status: p.job?.phase ?? p.status ?? "IN_PROGRESS",
          progress: typeof p.progress === "number" ? p.progress : 0,
          startDate: new Date(p.job?.projectStartTime),
          deadline: new Date(p.job?.projectEndTime),
          files: p.job?.file ? [p.job.file] : [],
          // Bid attachment lives on acceptedBid
          bidAttachment:
            p.acceptedBid?.attachmentPublicUrl ??
            p.proposal?.attachment ??
            null,
          clientAttachment: p.job?.file ?? null,
        }));
        setProjects(formatted);
        setSelectedProject((prev) => prev ?? formatted[0] ?? null);
      } catch (err) {
        console.error(err);
        setError("Failed to load project data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userRole]);

  // =========================================================================
  // Fetch milestones whenever a project is selected
  // =========================================================================
  const fetchMilestones = useCallback(async (contractId) => {
    if (!contractId) return;
    try {
      setLoadingMilestones(true);
      const res = await apiClient.get(`/api/get-milestone/${contractId}`);
      const sorted = (res.data || []).sort(
        (a, b) => (a.milestoneNumber ?? 0) - (b.milestoneNumber ?? 0),
      );
      setMilestones(sorted);
    } catch (err) {
      console.error("Error fetching milestones:", err);
      setMilestones([]);
    } finally {
      setLoadingMilestones(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProject?.contractId) {
      fetchMilestones(selectedProject.contractId);
    }
  }, [selectedProject, fetchMilestones]);

  // =========================================================================
  // Helpers
  // =========================================================================

  // A milestone is "done" when:
  //   - its own verificationStatus is VERIFIED (individual completion), OR
  //   - its own status is COMPLETED
  // Note: contract.verificationStatus = APPROVED_BY_CLIENT means the sequence
  // was approved but individual milestones haven't started yet — NOT "done".
  const isMilestoneDone = (m) => m.status === MilestoneStatus.COMPLETED;

  const calculateProgress = () => {
    if (!milestones?.length) return 0;
    const done = milestones.filter(isMilestoneDone).length;
    return Math.round((done / milestones.length) * 100);
  };

  const getRemainingDays = () => {
    if (!selectedProject) return 0;
    return differenceInDays(new Date(selectedProject.deadline), new Date());
  };

  const getUsedDays = (excludeId = null) => {
    if (!milestones) return 0;
    return milestones
      .filter((m) => m.id !== excludeId && !isMilestoneDone(m))
      .reduce((total, m) => total + (parseInt(m.daysRequired) || 0), 0);
  };

  const getUsedAmount = (excludeId = null) => {
    if (!milestones) return 0;
    return milestones
      .filter((m) => m.id !== excludeId)
      .reduce((total, m) => total + (parseFloat(m.amount) || 0), 0);
  };

  // After sequence approval, no new milestones may be added (locked forever).
  // Before that, cap at 3.
  const canAddMoreMilestones = () => {
    if (sequenceIsApprovedByClient(milestones)) return false;
    if (sequenceIsPublished(milestones)) return false; // last milestone already set
    return milestones.length < 3;
  };

  const getActiveMilestoneIndex = () => {
    for (let i = 0; i < milestones.length; i++) {
      if (!isMilestoneDone(milestones[i])) return i;
    }
    return milestones.length;
  };

  // ── badge helpers ──────────────────────────────────────────────────────────
  //
  // IMPORTANT: milestone.verificationStatus is only set at the individual
  // milestone work-review level (VERIFIED, CHANGES_REQUESTED, etc.).
  // When the client approves the whole sequence, the signal is on
  // milestone.contract.verificationStatus = "APPROVED_BY_CLIENT".
  // We read the effective verification status from both places.
  const getEffectiveVerificationStatus = (milestone) =>
    milestone.verificationStatus ?? getMilestoneContractVerification(milestone);

  const getMilestoneStatusColor = (milestone) => {
    if (!milestone) return "outline";

    const vs = getEffectiveVerificationStatus(milestone);

    if (
      vs === VerificationStatus.VERIFIED ||
      milestone.status === MilestoneStatus.COMPLETED
    )
      return "default";

    if (vs === VerificationStatus.CHANGES_REQUESTED) return "destructive";

    if (milestone.submission?.status === SubmissionStatus.REJECTED)
      return "destructive";

    if (
      milestone.status === MilestoneStatus.IN_PROGRESS ||
      milestone.status === MilestoneStatus.SUBMITTED
    )
      return "secondary";

    if (milestone.status === MilestoneStatus.REVISION_REQUESTED)
      return "destructive";

    if (vs === VerificationStatus.APPROVED_BY_CLIENT) return "default";

    return "outline";
  };

  const getMilestoneStatusText = (milestone) => {
    if (!milestone) return "PENDING";

    if (milestone.verificationStatus === VerificationStatus.VERIFIED)
      return "COMPLETED";
    if (milestone.verificationStatus === VerificationStatus.CHANGES_REQUESTED)
      return "CHANGES REQUESTED";

    if (
      milestone.verificationStatus === VerificationStatus.APPROVED_BY_CLIENT
    ) {
      if (milestone.paymentStatus === PaymentStatus.ESCROW_HELD)
        return "PAID – IN PROGRESS";
      if (
        milestone.paymentStatus === PaymentStatus.RELEASED ||
        milestone.paymentStatus === PaymentStatus.COMPLETED
      )
        return "PAYMENT RELEASED";
      return "APPROVED – AWAITING PAYMENT";
    }

    if (milestone.submission?.status === SubmissionStatus.PENDING_REVIEW)
      return "WORK SUBMITTED";
    if (milestone.submission?.status === SubmissionStatus.APPROVED)
      return "WORK ACCEPTED";
    if (milestone.submission?.status === SubmissionStatus.REJECTED)
      return "WORK REJECTED";

    return milestone.status || "PENDING";
  };

  // =========================================================================
  // Submission type helpers
  // =========================================================================
  const getSubmissionType = (milestoneId) =>
    submissionTypes[milestoneId] ?? "file";
  const setSubmissionType = (milestoneId, type) =>
    setSubmissionTypes((prev) => ({ ...prev, [milestoneId]: type }));

  const getSubmissionUrl = (milestoneId) => submissionUrls[milestoneId] ?? "";
  const setSubmissionUrl = (milestoneId, url) =>
    setSubmissionUrls((prev) => ({ ...prev, [milestoneId]: url }));

  // =========================================================================
  // Chat
  // =========================================================================
  const handleChatInitiation = async () => {
    try {
      const response = await apiClient.post(
        `/api/chat-history/create/${selectedProject.client.id}/${selectedProject.freelancer.id}`,
        {},
      );
      if (response.status === 200) navigate("/dashboard/messages");
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };

  // =========================================================================
  // ADD MILESTONE (Freelancer)
  // =========================================================================
  const handleAddMilestone = async () => {
    const { name, description, daysRequired, amount, isLast } = newMilestone;
    if (!name || !description || !daysRequired || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const days = parseInt(daysRequired);
    const amt = parseFloat(amount);
    const remainingDays = getRemainingDays();
    const usedDays = getUsedDays();
    const availableDays = remainingDays - usedDays;

    if (days <= 0) {
      alert("Days required must be greater than 0");
      return;
    }
    if (days > availableDays) {
      alert(
        `Cannot add milestone. Only ${availableDays} days available before deadline.`,
      );
      return;
    }
    if (amt <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const usedAmount = getUsedAmount();
    const remainingBudget = (selectedProject?.budget ?? 0) - usedAmount;
    if (amt > remainingBudget) {
      alert(
        `Amount exceeds remaining budget. You can allocate up to $${remainingBudget.toFixed(2)} more.`,
      );
      return;
    }

    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);

      const milestoneData = {
        title: name,
        description,
        amount: amt,
        dueDate: dueDate.toISOString(),
        status: MilestoneStatus.PENDING,
        paymentStatus: PaymentStatus.NOT_PAID,
        verificationStatus: VerificationStatus.PENDING_REVIEW,
        milestoneNumber: (milestones?.length || 0) + 1,
        daysRequired: days,
        createdAt: new Date().toISOString(),
        contract: { id: selectedProject.contractId },
        // NEW: isLast field propagated inside the milestone object
        isLast: isLast,
        last: isLast, // belt-and-suspenders for Java boolean getter naming
      };

      await apiClient.post(
        `/api/create-milestone?clientId=${selectedProject.client.id}&freelancerId=${selectedProject.freelancer.id}`,
        milestoneData,
      );

      await fetchMilestones(selectedProject.contractId);
      setNewMilestone({
        name: "",
        description: "",
        daysRequired: "",
        amount: "",
        isLast: false,
      });
      setIsAddMilestoneOpen(false);

      if (isLast) {
        alert(
          "Final milestone created! The entire milestone sequence is now visible to the client for review.",
        );
      } else {
        alert("Milestone created successfully! You can add more milestones.");
      }
    } catch (err) {
      console.error("Error adding milestone:", err);
      alert(err.response?.data?.message || "Failed to add milestone");
    }
  };

  // =========================================================================
  // UPDATE MILESTONE (Freelancer – after client CHANGES_REQUESTED)
  // =========================================================================
  const openUpdateMilestone = (milestone) => {
    setUpdatingMilestone(milestone);
    setUpdateMilestoneData({
      name: milestone.title ?? "",
      description: milestone.description ?? "",
      daysRequired: milestone.daysRequired?.toString() ?? "",
      amount: milestone.amount?.toString() ?? "",
      isLast: milestone.isLast ?? milestone.last ?? false,
    });
    setIsUpdateMilestoneOpen(true);
  };

  const handleUpdateMilestone = async () => {
    if (!updatingMilestone) return;
    const { name, description, daysRequired, amount, isLast } =
      updateMilestoneData;
    if (!name || !description || !daysRequired || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const days = parseInt(daysRequired);
    const amt = parseFloat(amount);
    const remainingDays = getRemainingDays();
    const usedDays = getUsedDays(updatingMilestone.id);
    const availableDays = remainingDays - usedDays;

    if (days <= 0) {
      alert("Days required must be greater than 0");
      return;
    }
    if (days > availableDays) {
      alert(`Only ${availableDays} days available.`);
      return;
    }
    if (amt <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const usedAmount = getUsedAmount(updatingMilestone.id);
    const remainingBudget = (selectedProject?.budget ?? 0) - usedAmount;
    if (amt > remainingBudget) {
      alert(
        `Amount exceeds remaining budget of $${remainingBudget.toFixed(2)}.`,
      );
      return;
    }

    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);

      const milestoneData = {
        id: updatingMilestone.id,
        milestoneNumber: updatingMilestone.milestoneNumber,
        title: name,
        description,
        amount: amt,
        daysRequired: days,
        dueDate: dueDate.toISOString(),
        status: MilestoneStatus.PENDING,
        paymentStatus:
          updatingMilestone.paymentStatus ?? PaymentStatus.NOT_PAID,
        verificationStatus: VerificationStatus.PENDING_REVIEW,
        contract: { id: selectedProject.contractId },
        // NEW: preserve / update isLast on the milestone object
        isLast: isLast,
        last: isLast,
      };

      await apiClient.post(
        `/api/update-milestone?freelancerId=${selectedProject.freelancer.id}`,
        milestoneData,
      );

      await fetchMilestones(selectedProject.contractId);
      setIsUpdateMilestoneOpen(false);
      setUpdatingMilestone(null);
      alert("Milestone updated successfully! Awaiting client re-review.");
    } catch (err) {
      console.error("Error updating milestone:", err);
      alert(err.response?.data?.message || "Failed to update milestone");
    }
  };

  // =========================================================================
  // CLIENT: APPROVE ENTIRE SEQUENCE
  // POST /milestone-sequence-approval  { contractId, clientId }
  // =========================================================================
  const handleApproveSequence = async () => {
    setSequenceActionLoading(true);
    try {
      await apiClient.post(
        `/api/milestone-sequence-approval?contractId=${selectedProject.contractId}&clientId=${selectedProject.client.id}`,
      );
      await fetchMilestones(selectedProject.contractId);
      alert(
        "Milestone sequence approved! You can now proceed to pay each milestone and the freelancer will start work.",
      );
    } catch (err) {
      console.error("Error approving sequence:", err);
      alert(
        err.response?.data?.message || "Failed to approve milestone sequence",
      );
    } finally {
      setSequenceActionLoading(false);
    }
  };

  // =========================================================================
  // CLIENT: REJECT SEQUENCE — open dialog to collect per-milestone feedback
  // =========================================================================
  const openRejectSequence = () => {
    // Pre-populate feedback map with empty strings for each milestone
    const map = {};
    milestones.forEach((m) => {
      map[m.id] = m.clientFeedback ?? "";
    });
    setSequenceFeedbackMap(map);
    setIsRejectSequenceOpen(true);
  };

  // POST /client-feedback  body: List<MilestoneDto> (each with clientFeedback)
  const handleRejectSequence = async () => {
    const hasAtLeastOneFeedback = Object.values(sequenceFeedbackMap).some(
      (fb) => fb.trim().length > 0,
    );
    if (!hasAtLeastOneFeedback) {
      alert(
        "Please provide feedback for at least one milestone before rejecting.",
      );
      return;
    }

    setSequenceActionLoading(true);
    try {
      // Build updated milestone list with feedback embedded
      const updatedMilestones = milestones.map((m) => ({
        ...m,
        clientFeedback: sequenceFeedbackMap[m.id] ?? "",
        verificationStatus: sequenceFeedbackMap[m.id]?.trim()
          ? VerificationStatus.CHANGES_REQUESTED
          : m.verificationStatus,
      }));

      await apiClient.post(
        `/api/client-feedback?clientId=${selectedProject.client.id}`,
        updatedMilestones,
      );

      await fetchMilestones(selectedProject.contractId);
      setIsRejectSequenceOpen(false);
      setSequenceFeedbackMap({});
      alert(
        "Feedback sent to the freelancer. They will update the milestones and resubmit for review.",
      );
    } catch (err) {
      console.error("Error rejecting sequence:", err);
      alert(err.response?.data?.message || "Failed to send feedback");
    } finally {
      setSequenceActionLoading(false);
    }
  };

  // =========================================================================
  // CLIENT: APPROVE INDIVIDUAL MILESTONE → open payment dialog
  // (used in execution phase only, after sequence approval)
  // =========================================================================
  const handleApproveAndPay = (milestone) => {
    setSelectedMilestoneForPayment(milestone);
    setIsPaymentDialogOpen(true);
  };

  // =========================================================================
  // CLIENT: PROCESS PAYMENT via Razorpay
  // =========================================================================
  const handleMilestonePayment = async () => {
    if (!selectedMilestoneForPayment) return;
    setPaymentLoading(true);

    try {
      const res = await apiClient.post(
        `/api/milestone-approval?milestoneId=${selectedMilestoneForPayment.id}&clientId=${selectedProject.client.id}`,
      );
      const paymentData = res.data;

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load Razorpay SDK. Please try again.");
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: paymentData.razorpayKey,
        amount: paymentData.amount * 100,
        currency: paymentData.currency || "INR",
        order_id: paymentData.orderId,
        name: "FreelanceGo",
        description: `Payment for: ${selectedMilestoneForPayment.title}`,
        handler: async function () {
          alert(
            "Payment successful! Freelancer has been notified and can now start work.",
          );
          setIsPaymentDialogOpen(false);
          setSelectedMilestoneForPayment(null);
          await fetchMilestones(selectedProject.contractId);
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
          },
        },
        prefill: {
          name: selectedProject?.client?.name ?? "",
          email: selectedProject?.client?.email ?? "",
        },
        theme: { color: "#6366f1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert(
          `Payment failed: ${response.error.description}. Please try again.`,
        );
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Error processing payment:", err);
      alert(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  // =========================================================================
  // FREELANCER: Submit work (file)
  // =========================================================================
  const handleFileUpload = async (milestoneId, file) => {
    if (!file) return;
    setUploadingMilestoneId(milestoneId);
    try {
      const formData = new FormData();
      const notes =
        submissionNotes[milestoneId] ||
        "Document submission for milestone review";

      const submissionData = {
        notes: notes,
        status: SubmissionStatus.PENDING_REVIEW,
      };

      formData.append(
        "submission",
        new Blob([JSON.stringify(submissionData)], {
          type: "application/json",
        }),
      );
      formData.append("file", file);

      const milestone = milestones.find((m) => m.id === milestoneId);
      const endpoint = milestone?.submission?.id
        ? `/api/update-submission?milestoneId=${milestoneId}&freelancerId=${selectedProject.freelancer.id}`
        : `/api/create-submission?milestoneId=${milestoneId}&freelancerId=${selectedProject.freelancer.id}`;

      await apiClient.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchMilestones(selectedProject.contractId);
      setSubmissionNotes((prev) => ({ ...prev, [milestoneId]: "" }));
      alert("Work submitted successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert(err.response?.data?.message || "Failed to upload work");
    } finally {
      setUploadingMilestoneId(null);
    }
  };

  // =========================================================================
  // FREELANCER: Submit work (URL)
  // =========================================================================
  const handleUrlSubmission = async (milestoneId) => {
    const url = getSubmissionUrl(milestoneId);
    if (!url.trim()) {
      alert("Please enter a valid URL");
      return;
    }
    setUploadingMilestoneId(milestoneId);
    try {
      const notes =
        submissionNotes[milestoneId] || "URL submission for milestone review";

      const submissionData = {
        fileUrl: url,
        notes: notes,
        status: SubmissionStatus.PENDING_REVIEW,
      };

      const milestone = milestones.find((m) => m.id === milestoneId);
      const endpoint = milestone?.submission?.id
        ? `/api/update-submission?milestoneId=${milestoneId}&freelancerId=${selectedProject.freelancer.id}`
        : `/api/create-submission?milestoneId=${milestoneId}&freelancerId=${selectedProject.freelancer.id}`;

      await apiClient.post(endpoint, submissionData);

      await fetchMilestones(selectedProject.contractId);
      setSubmissionUrl(milestoneId, "");
      setSubmissionNotes((prev) => ({ ...prev, [milestoneId]: "" }));
      alert("Work submitted successfully!");
    } catch (err) {
      console.error("Error submitting URL:", err);
      alert(err.response?.data?.message || "Failed to submit URL");
    } finally {
      setUploadingMilestoneId(null);
    }
  };

  // =========================================================================
  // CLIENT: Accept submission
  // =========================================================================
  const handleAcceptSubmission = async (milestoneId) => {
    try {
      const milestone = milestones.find((m) => m.id === milestoneId);
      if (!milestone?.submission?.id) {
        alert("No submission found for this milestone");
        return;
      }
      await apiClient.post(
        `/api/submission-approval?submissionId=${milestone.submission.id}&clientId=${selectedProject.client.id}`,
      );
      await fetchMilestones(selectedProject.contractId);
      alert("Submission accepted! Milestone marked as completed.");
    } catch (err) {
      console.error("Error accepting submission:", err);
      alert(err.response?.data?.message || "Failed to accept submission");
    }
  };

  // =========================================================================
  // CLIENT: Reject submission (open dialog)
  // =========================================================================
  const openRejectSubmission = (milestoneId) => {
    setRejectingSubmissionMilestoneId(milestoneId);
    setSubmissionRemark("");
    setIsRejectSubmissionOpen(true);
  };

  const handleRejectSubmission = async () => {
    if (!submissionRemark.trim()) {
      alert("Please provide feedback before rejecting.");
      return;
    }
    try {
      const milestone = milestones.find(
        (m) => m.id === rejectingSubmissionMilestoneId,
      );
      if (!milestone?.submission?.id) {
        alert("No submission found");
        return;
      }
      const submissionData = {
        id: milestone.submission.id,
        clientRemark: submissionRemark,
        status: SubmissionStatus.REJECTED,
      };
      await apiClient.post(
        `/api/client-remark?clientId=${selectedProject.client.id}`,
        submissionData,
      );
      await fetchMilestones(selectedProject.contractId);
      setIsRejectSubmissionOpen(false);
      setRejectingSubmissionMilestoneId(null);
      setSubmissionRemark("");
      alert("Submission rejected. Freelancer can resubmit their work.");
    } catch (err) {
      console.error("Error rejecting submission:", err);
      alert(err.response?.data?.message || "Failed to reject submission");
    }
  };

  // =========================================================================
  // Navigation helpers
  // =========================================================================
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setShowFullDesc(false);
    setShowMobileDetails(true);
  };

  const handleBackToList = () => setShowMobileDetails(false);

  // =========================================================================
  // Derived values
  // =========================================================================
  const currentProgress = calculateProgress();
  const activeMilestoneIndex = getActiveMilestoneIndex();

  // Key derived booleans used across render
  const published = sequenceIsPublished(milestones);
  const sequenceApproved = sequenceIsApprovedByClient(milestones);

  // =========================================================================
  // Loading / error / empty states
  // =========================================================================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-500" />
        <span className="text-lg">Fetching Projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground text-lg">
          No active projects found.
        </p>
      </div>
    );
  }

  // =========================================================================
  // CLIENT: Sequence Review Panel
  // Shown when: published && !sequenceApproved
  // Replaces the individual milestone action cards during review phase.
  // =========================================================================
  const renderClientSequenceReviewPanel = () => (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-900 dark:text-indigo-100 text-sm mb-1">
              Freelancer has finalized the milestone plan
            </p>
            <p className="text-xs text-indigo-800 dark:text-indigo-200">
              Review the complete milestone sequence below. You can approve the
              entire plan or request changes before any work begins.
            </p>
          </div>
        </div>
      </div>

      {/* Milestone cards — read-only summary */}
      <div className="space-y-3">
        {milestones.map((milestone, idx) => {
          const hasFeedback =
            milestone.verificationStatus ===
              VerificationStatus.CHANGES_REQUESTED && milestone.clientFeedback;

          return (
            <div
              key={milestone.id || idx}
              className="p-4 border rounded-lg bg-muted/30 space-y-2"
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <h4 className="font-medium text-sm">
                    {milestone.title || `Milestone ${idx + 1}`}
                  </h4>
                  {(milestone.isLast || milestone.last) && (
                    <Badge
                      variant="outline"
                      className="text-xs border-indigo-400 text-indigo-600"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      Final
                    </Badge>
                  )}
                  <Badge variant={getMilestoneStatusColor(milestone)}>
                    {getMilestoneStatusText(milestone)}
                  </Badge>
                </div>
                <div className="text-right text-sm font-bold">
                  ${milestone.amount?.toFixed(2) || "0.00"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {milestone.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {milestone.daysRequired || 0} days
                </span>
                {milestone.dueDate && (
                  <span>Due: {format(new Date(milestone.dueDate), "PP")}</span>
                )}
              </div>
              {/* Show previous feedback if any */}
              {hasFeedback && (
                <div className="p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded text-xs">
                  <span className="font-medium text-amber-900 dark:text-amber-100">
                    Your previous feedback:{" "}
                  </span>
                  <span className="text-amber-800 dark:text-amber-200">
                    {milestone.clientFeedback}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Budget summary */}
      <div className="p-3 border rounded-lg bg-background flex justify-between items-center text-sm">
        <span className="font-medium">Total milestone value</span>
        <span className="font-bold text-base">
          ${milestones.reduce((sum, m) => sum + (m.amount || 0), 0).toFixed(2)}{" "}
          <span className="text-muted-foreground font-normal text-xs">
            of ${selectedProject?.budget?.toLocaleString()} budget
          </span>
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <Button
          className="flex-1"
          onClick={handleApproveSequence}
          disabled={sequenceActionLoading}
        >
          {sequenceActionLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Approve Plan
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={openRejectSequence}
          disabled={sequenceActionLoading}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Request Changes
        </Button>
      </div>
    </div>
  );

  // =========================================================================
  // Milestone Card renderer (execution phase — unchanged behaviour)
  // =========================================================================
  const renderMilestoneCard = (milestone, idx) => {
    const isMilestoneVerified = isMilestoneDone(milestone);
    const isActiveMilestone = idx === activeMilestoneIndex;
    const isPastMilestone = idx < activeMilestoneIndex;
    const isFutureMilestone = idx > activeMilestoneIndex;

    const milestoneApprovedAndPaid =
      getEffectiveVerificationStatus(milestone) ===
        VerificationStatus.APPROVED_BY_CLIENT &&
      milestone.paymentStatus === PaymentStatus.ESCROW_HELD;

    const canSubmitWork =
      userRole === userRoles.FREELANCER &&
      isActiveMilestone &&
      milestoneApprovedAndPaid &&
      (!milestone.submission ||
        milestone.submission.status === SubmissionStatus.REJECTED ||
        milestone.verificationStatus !== VerificationStatus.VERIFIED);

    const hasSubmission = !!milestone.submission;
    const submissionPendingReview =
      hasSubmission &&
      milestone.submission.status === SubmissionStatus.PENDING_REVIEW;
    const submissionAccepted =
      hasSubmission &&
      milestone.submission.status === SubmissionStatus.APPROVED;
    const submissionRejected =
      hasSubmission &&
      milestone.submission.status === SubmissionStatus.REJECTED;

    // In execution phase, per-milestone payment action lives here
    const canClientPayMilestone =
      userRole === userRoles.CLIENT &&
      isActiveMilestone &&
      sequenceApproved &&
      getEffectiveVerificationStatus(milestone) ===
        VerificationStatus.APPROVED_BY_CLIENT &&
      milestone.paymentStatus === PaymentStatus.NOT_PAID;

    const canClientReviewSubmission =
      userRole === userRoles.CLIENT &&
      isActiveMilestone &&
      submissionPendingReview;

    return (
      <div
        key={milestone.id || idx}
        className={`p-4 border rounded-lg space-y-3 transition-opacity ${
          isFutureMilestone ? "opacity-50" : "bg-muted/30"
        }`}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground">
                #{idx + 1}
              </span>
              <h4 className="font-medium">
                {milestone.title || `Milestone ${idx + 1}`}
              </h4>
              {(milestone.isLast || milestone.last) && (
                <Badge
                  variant="outline"
                  className="text-xs border-indigo-400 text-indigo-600"
                >
                  <Flag className="h-3 w-3 mr-1" />
                  Final
                </Badge>
              )}
              <Badge variant={getMilestoneStatusColor(milestone)}>
                {getMilestoneStatusText(milestone)}
              </Badge>
              {milestone.paymentStatus === PaymentStatus.ESCROW_HELD && (
                <Badge variant="default" className="bg-green-600">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ESCROW_HELD
                </Badge>
              )}
              {milestone.paymentStatus === PaymentStatus.RELEASED && (
                <Badge variant="default" className="bg-blue-600">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Released
                </Badge>
              )}
              {isFutureMilestone && (
                <Badge variant="outline" className="text-muted-foreground">
                  <Lock className="h-3 w-3 mr-1" />
                  Locked
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {milestone.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />$
                {milestone.amount?.toFixed(2) || "0.00"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {milestone.daysRequired || 0} days
              </span>
              {milestone.dueDate && (
                <span>Due: {format(new Date(milestone.dueDate), "PP")}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── FREELANCER ACTIONS ─────────────────────────────────────────── */}
        {userRole === userRoles.FREELANCER && isActiveMilestone && (
          <div className="space-y-2">
            {/* Awaiting sequence approval from client */}
            {published &&
              !sequenceApproved &&
              milestone.verificationStatus ===
                VerificationStatus.PENDING_REVIEW && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Awaiting client review of the full milestone plan.
                  </p>
                </div>
              )}

            {/* Client requested changes on sequence */}
            {milestone.verificationStatus ===
              VerificationStatus.CHANGES_REQUESTED && (
              <div className="space-y-2">
                {milestone.clientFeedback && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded text-sm">
                    <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                      Changes Requested:
                    </p>
                    <p className="text-amber-800 dark:text-amber-200">
                      {milestone.clientFeedback}
                    </p>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openUpdateMilestone(milestone)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Milestone
                </Button>
              </div>
            )}

            {/* Milestone approved but NOT paid yet (execution phase) */}
            {sequenceApproved &&
              milestone.verificationStatus ===
                VerificationStatus.APPROVED_BY_CLIENT &&
              milestone.paymentStatus !== PaymentStatus.ESCROW_HELD && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded">
                  <p className="text-sm text-yellow-900 dark:text-yellow-100">
                    Milestone plan approved! Waiting for client to process
                    payment.
                  </p>
                </div>
              )}

            {/* Milestone approved + paid – submit work */}
            {canSubmitWork && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Milestone approved and payment confirmed. Submit your work
                  below.
                </p>
                {submissionRejected && (
                  <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                    <p className="font-medium text-red-900 dark:text-red-100 text-sm mb-1">
                      Previous submission rejected – Client's feedback:
                    </p>
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      {milestone.submission?.clientRemark}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="text-xs">Submission Notes</Label>
                  <Textarea
                    placeholder="Add details about your work..."
                    value={submissionNotes[milestone.id] || ""}
                    onChange={(e) =>
                      setSubmissionNotes((prev) => ({
                        ...prev,
                        [milestone.id]: e.target.value,
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={
                      getSubmissionType(milestone.id) === "file"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSubmissionType(milestone.id, "file")}
                  >
                    File Upload
                  </Button>
                  <Button
                    variant={
                      getSubmissionType(milestone.id) === "url"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSubmissionType(milestone.id, "url")}
                  >
                    URL Submission
                  </Button>
                </div>

                {getSubmissionType(milestone.id) === "file" && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id={`file-${milestone.id}`}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(milestone.id, file);
                      }}
                      className="hidden"
                    />
                    <Label
                      htmlFor={`file-${milestone.id}`}
                      className="cursor-pointer flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                        disabled={uploadingMilestoneId === milestone.id}
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploadingMilestoneId === milestone.id
                            ? "Uploading..."
                            : submissionRejected
                              ? "Resubmit File"
                              : "Choose File"}
                        </span>
                      </Button>
                    </Label>
                  </div>
                )}

                {getSubmissionType(milestone.id) === "url" && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={getSubmissionUrl(milestone.id)}
                      onChange={(e) =>
                        setSubmissionUrl(milestone.id, e.target.value)
                      }
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUrlSubmission(milestone.id)}
                      disabled={uploadingMilestoneId === milestone.id}
                    >
                      {uploadingMilestoneId === milestone.id
                        ? "Submitting..."
                        : submissionRejected
                          ? "Resubmit"
                          : "Submit"}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Work submitted info */}
            {submissionPendingReview && (
              <div className="p-3 bg-background border rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Work submitted – Awaiting client review
                  </p>
                  <Clock className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
                {milestone.submission.fileUrl && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {milestone.submission.fileUrl.startsWith("http")
                      ? milestone.submission.fileUrl
                      : "File uploaded successfully"}
                  </p>
                )}
              </div>
            )}

            {/* Submission accepted */}
            {submissionAccepted && !isMilestoneVerified && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                <div className="flex items-center gap-2 text-sm text-green-900 dark:text-green-100">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Work accepted by client. Awaiting final payment release.
                  </span>
                </div>
              </div>
            )}

            {/* Milestone fully verified */}
            {isMilestoneVerified && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                <div className="flex items-center gap-2 text-sm text-green-900 dark:text-green-100">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Milestone completed and payment released!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Future milestone indicator – freelancer */}
        {userRole === userRoles.FREELANCER && isFutureMilestone && (
          <div className="p-2 border border-dashed rounded text-center">
            <p className="text-xs text-muted-foreground">
              This milestone will be unlocked after the previous one is
              completed.
            </p>
          </div>
        )}

        {/* ── CLIENT ACTIONS (execution phase only) ─────────────────────── */}
        {userRole === userRoles.CLIENT && sequenceApproved && (
          <div className="space-y-3">
            {/* Pay for this milestone (first action in execution phase) */}
            {canClientPayMilestone && (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleApproveAndPay(milestone)}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pay & Start Work
                </Button>
              </div>
            )}

            {/* Awaiting freelancer work after payment */}
            {isActiveMilestone &&
              milestone.verificationStatus ===
                VerificationStatus.APPROVED_BY_CLIENT &&
              milestone.paymentStatus === PaymentStatus.ESCROW_HELD &&
              !hasSubmission && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Payment confirmed. Waiting for freelancer to submit work.
                  </p>
                </div>
              )}

            {/* Review submission */}
            {canClientReviewSubmission && (
              <div className="space-y-3">
                <div className="p-3 bg-background border rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Work Submitted – Awaiting Your Review
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {milestone.submission.notes ||
                          "Review the submitted work"}
                      </p>
                    </div>
                    {milestone.submission.fileUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={milestone.submission.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          View Work
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1"
                    onClick={() => handleAcceptSubmission(milestone.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept & Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => openRejectSubmission(milestone.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Request Revision
                  </Button>
                </div>
              </div>
            )}

            {/* Milestone fully completed */}
            {isMilestoneVerified && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
                <div className="flex items-center gap-2 text-sm text-green-900 dark:text-green-100">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">
                    Milestone completed and payment released.
                  </span>
                </div>
              </div>
            )}

            {/* Future milestones – locked for client too */}
            {isFutureMilestone && (
              <div className="p-2 border border-dashed rounded text-center">
                <p className="text-xs text-muted-foreground">
                  Available after the previous milestone is completed.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // JSX
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Active Projects
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {userRole === userRoles.FREELANCER
            ? "Manage your ongoing freelance projects"
            : "Track and manage your hired projects"}
        </p>
      </div>

      <div className="flex gap-6 lg:flex-row flex-col">
        {/* ── Projects list pane ─────────────────────────────────────────── */}
        {isProjectsPaneCollapsed ? (
          <div className="hidden lg:flex items-start pt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsProjectsPaneCollapsed(false)}
              aria-label="Expand projects pane"
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Card
            className={`lg:w-80 lg:flex-shrink-0 ${showMobileDetails ? "hidden lg:block" : ""}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Projects</CardTitle>
                  <CardDescription>Your active projects</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden lg:flex h-8 w-8"
                  onClick={() => setIsProjectsPaneCollapsed(true)}
                  aria-label="Collapse projects pane"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectProject(project)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSelectProject(project)
                  }
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 truncate">
                    {userRole === userRoles.FREELANCER
                      ? project.client.name
                      : project.freelancer.name}
                  </p>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <Badge
                      variant={
                        project.status?.toLowerCase?.() === "completed"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                    <span className="text-muted-foreground font-medium">
                      {currentProgress}%
                    </span>
                  </div>
                  <Progress value={currentProgress} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ── Project detail pane ────────────────────────────────────────── */}
        <Card
          className={`flex-1 ${!showMobileDetails ? "hidden lg:block" : ""}`}
        >
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2 lg:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToList}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Projects
                  </Button>
                </div>
                <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
                  <h1>{selectedProject?.title}</h1>
                  <Badge
                    variant={
                      selectedProject?.status?.toLowerCase?.() === "completed"
                        ? "default"
                        : "secondary"
                    }
                    className="self-start"
                  >
                    {selectedProject?.status}
                  </Badge>
                </CardTitle>
                <div className="mt-1">
                  <p
                    className={`text-sm text-muted-foreground ${showFullDesc ? "" : "line-clamp-3"}`}
                  >
                    {selectedProject?.description}
                  </p>
                  {selectedProject?.description &&
                    selectedProject.description.length > 200 && (
                      <Button
                        aria-expanded={showFullDesc}
                        onClick={() => setShowFullDesc((s) => !s)}
                        variant="link"
                        className="p-0 text-sm h-auto"
                      >
                        {showFullDesc ? "Show less" : "Show more"}
                        {showFullDesc ? (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">
                  Milestones
                  {milestones?.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 h-5 min-w-5 px-1"
                    >
                      {milestones.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="escrow">Escrow</TabsTrigger>
              </TabsList>

              {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Progress card */}
                <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-primary/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Project Progress
                      </p>
                      <p className="text-3xl font-bold">{currentProgress}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        Milestones
                      </p>
                      <p className="text-2xl font-bold">
                        {milestones?.filter(isMilestoneDone).length || 0}
                        <span className="text-lg text-muted-foreground">
                          /{milestones?.length || 0}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Progress value={currentProgress} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {currentProgress === 100
                      ? "Project completed! 🎉"
                      : `${100 - currentProgress}% remaining to completion`}
                  </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 border p-3 rounded-md space-y-1">
                    <div className="text-sm font-medium">Budget</div>
                    <div className="text-lg font-bold">
                      ${selectedProject?.budget?.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-md space-y-1">
                    <div className="text-sm font-medium">Start Date</div>
                    <div className="text-lg font-bold">
                      {format(selectedProject?.startDate, "PP")}
                    </div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-md space-y-1">
                    <div className="text-sm font-medium">Deadline</div>
                    <div className="text-lg font-bold">
                      {format(selectedProject?.deadline, "PP")}
                    </div>
                  </div>
                  <div className="bg-muted/30 border p-3 rounded-md space-y-1">
                    <div className="text-sm font-medium">Days Remaining</div>
                    <div className="text-lg font-bold flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getRemainingDays()}
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Attachments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userRole === userRoles.FREELANCER &&
                      selectedProject?.clientAttachment && (
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">Client's Attachment</p>
                              <p className="text-sm text-muted-foreground">
                                Project requirements document
                              </p>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={selectedProject.clientAttachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    {userRole === userRoles.CLIENT &&
                      selectedProject?.bidAttachment && (
                        <div className="p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1">
                              <p className="font-medium">
                                Freelancer's Bid Attachment
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Proposal document
                              </p>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={selectedProject.bidAttachment}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Person details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {userRole === userRoles.FREELANCER
                        ? "Client"
                        : "Freelancer"}{" "}
                      Details
                    </h3>
                    <Button size="sm" onClick={handleChatInitiation}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Start Chat
                    </Button>
                  </div>

                  {userRole === userRoles.FREELANCER ? (
                    <div className="p-4 bg-muted/50 border rounded-lg flex gap-4">
                      <Avatar className="h-12 w-12">
                        {selectedProject?.client?.imageData ? (
                          <AvatarImage
                            src={`data:image/jpeg;base64,${selectedProject.client.imageData}`}
                          />
                        ) : (
                          <AvatarFallback>
                            {(selectedProject?.client?.name || "C").charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">
                          {selectedProject?.client?.companyName ||
                            selectedProject?.client?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedProject?.client?.email}
                        </div>
                        {selectedProject?.client?.phone && (
                          <div className="text-sm text-muted-foreground">
                            Phone: {selectedProject.client.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg flex gap-4 border bg-muted/50">
                      <Avatar className="h-12 w-12">
                        {selectedProject?.freelancer?.imageData ? (
                          <AvatarImage
                            src={`data:image/jpeg;base64,${selectedProject.freelancer.imageData}`}
                          />
                        ) : (
                          <AvatarFallback>
                            {(selectedProject?.freelancer?.name || "F").charAt(
                              0,
                            )}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">
                          {selectedProject?.freelancer?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedProject?.freelancer?.email}
                        </div>
                        {selectedProject?.freelancer?.designation && (
                          <div className="text-sm text-muted-foreground">
                            Role: {selectedProject.freelancer.designation}
                          </div>
                        )}
                        {selectedProject?.freelancer?.portfolioUrl && (
                          <div className="text-sm text-muted-foreground mt-1">
                            <Button
                              variant="link"
                              size="sm"
                              className="p-0 h-auto"
                              asChild
                            >
                              <a
                                href={selectedProject.freelancer.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <ExternalLink className="mr-1 h-4 w-4" />
                                Visit Portfolio
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ── MILESTONES TAB ───────────────────────────────────────── */}
              <TabsContent value="milestones" className="space-y-4 mt-6">
                <div className="space-y-4">
                  {/* Header + Add button */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Project Milestones
                    </h3>
                    {userRole === userRoles.FREELANCER &&
                      canAddMoreMilestones() && (
                        <Dialog
                          open={isAddMilestoneOpen}
                          onOpenChange={setIsAddMilestoneOpen}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Milestone
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Add New Milestone</DialogTitle>
                              <DialogDescription>
                                Create a milestone for this project. You can add
                                up to 3 milestones. Milestones remain hidden
                                from the client until you mark the final one.
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>
                                    Available days:{" "}
                                    {getRemainingDays() - getUsedDays()}{" "}
                                    &nbsp;|&nbsp; Remaining budget: $
                                    {(
                                      (selectedProject?.budget ?? 0) -
                                      getUsedAmount()
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="milestone-name">
                                  Milestone Name *
                                </Label>
                                <Input
                                  id="milestone-name"
                                  placeholder="e.g., Initial Design Phase"
                                  value={newMilestone.name}
                                  onChange={(e) =>
                                    setNewMilestone({
                                      ...newMilestone,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="milestone-description">
                                  Description *
                                </Label>
                                <Textarea
                                  id="milestone-description"
                                  placeholder="Describe what will be delivered in this milestone"
                                  value={newMilestone.description}
                                  onChange={(e) =>
                                    setNewMilestone({
                                      ...newMilestone,
                                      description: e.target.value,
                                    })
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="milestone-days">
                                    Days Required *
                                  </Label>
                                  <Input
                                    id="milestone-days"
                                    type="number"
                                    min="1"
                                    placeholder="Days needed"
                                    value={newMilestone.daysRequired}
                                    onChange={(e) =>
                                      setNewMilestone({
                                        ...newMilestone,
                                        daysRequired: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="milestone-amount">
                                    Amount ($) *
                                  </Label>
                                  <Input
                                    id="milestone-amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={newMilestone.amount}
                                    onChange={(e) =>
                                      setNewMilestone({
                                        ...newMilestone,
                                        amount: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              {/* NEW: isLast checkbox */}
                              <div className="flex items-start gap-3 p-3 border rounded-lg bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
                                <Checkbox
                                  id="is-last-milestone"
                                  checked={newMilestone.isLast}
                                  onCheckedChange={(checked) =>
                                    setNewMilestone({
                                      ...newMilestone,
                                      isLast: !!checked,
                                    })
                                  }
                                  className="mt-0.5"
                                />
                                <div className="space-y-1">
                                  <Label
                                    htmlFor="is-last-milestone"
                                    className="text-sm font-medium text-indigo-900 dark:text-indigo-100 cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Flag className="h-3.5 w-3.5" />
                                    This is the last milestone
                                  </Label>
                                  <p className="text-xs text-indigo-700 dark:text-indigo-300">
                                    Checking this will publish the entire
                                    milestone plan to the client for review. No
                                    new milestones can be added afterwards.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsAddMilestoneOpen(false);
                                  setNewMilestone({
                                    name: "",
                                    description: "",
                                    daysRequired: "",
                                    amount: "",
                                    isLast: false,
                                  });
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleAddMilestone}>
                                {newMilestone.isLast
                                  ? "Create & Publish Plan"
                                  : "Create Milestone"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                  </div>

                  {/* ── Freelancer guidelines banner ─────────────────────── */}
                  {userRole === userRoles.FREELANCER && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900 dark:text-blue-100">
                          <p className="font-medium mb-1">
                            Milestone Guidelines
                          </p>
                          <ul className="space-y-1 text-xs">
                            <li>
                              • Maximum 3 milestones – days and amounts must fit
                              within project limits
                            </li>
                            <li>
                              • Milestones are hidden from the client until you
                              mark the final milestone
                            </li>
                            <li>
                              • Once the final milestone is created, the entire
                              plan is sent to the client for review
                            </li>
                            <li>
                              • Client must approve the full plan before any
                              payment or work begins
                            </li>
                            <li>
                              • Milestones execute sequentially after plan
                              approval
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Freelancer: sequence published but not yet approved ─ */}
                  {userRole === userRoles.FREELANCER &&
                    published &&
                    !sequenceApproved &&
                    milestones.some(
                      (m) =>
                        m.verificationStatus !==
                        VerificationStatus.CHANGES_REQUESTED,
                    ) && (
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          <p className="text-sm text-indigo-900 dark:text-indigo-100">
                            Your milestone plan has been submitted to the client
                            for review.
                          </p>
                        </div>
                      </div>
                    )}

                  {/* ── Freelancer: sequence changes requested ─────────────── */}
                  {userRole === userRoles.FREELANCER &&
                    published &&
                    !sequenceApproved &&
                    milestones.some(
                      (m) =>
                        m.verificationStatus ===
                        VerificationStatus.CHANGES_REQUESTED,
                    ) && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <p className="text-sm text-amber-900 dark:text-amber-100">
                            The client has requested changes. Update the flagged
                            milestones below, then the plan will be resubmitted
                            automatically.
                          </p>
                        </div>
                      </div>
                    )}

                  {/* ── Freelancer: not yet published ─────────────────────── */}
                  {userRole === userRoles.FREELANCER && !published && (
                    <div className="p-3 bg-muted border border-dashed rounded-lg">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Milestones below are only visible to you. Mark the
                          last milestone to publish the plan to the client.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ── Client guidelines banner ──────────────────────────── */}
                  {userRole === userRoles.CLIENT && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="flex gap-2">
                        <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-purple-900 dark:text-purple-100">
                          <p className="font-medium mb-1">
                            Milestone Review Process
                          </p>
                          <ul className="space-y-1 text-xs">
                            <li>
                              • The freelancer plans the full milestone sequence
                              before you can review it
                            </li>
                            <li>
                              • Once the plan is ready, review and approve the
                              entire sequence or request changes
                            </li>
                            <li>
                              • After approval, pay each milestone in advance –
                              funds are held in escrow
                            </li>
                            <li>
                              • Review submitted work and release payment upon
                              acceptance
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Client: milestone not published yet ───────────────── */}
                  {userRole === userRoles.CLIENT && !published && (
                    <div className="text-center py-12 text-muted-foreground">
                      <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">
                        Milestone plan not ready yet
                      </p>
                      <p className="text-sm mt-1">
                        The freelancer is still planning the milestones. You
                        will be able to review them once the plan is finalized.
                      </p>
                    </div>
                  )}

                  {/* Main milestone content */}
                  {loadingMilestones ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                      <p className="mt-2">Loading milestones...</p>
                    </div>
                  ) : milestones?.length > 0 ? (
                    <div className="space-y-3">
                      {/* FREELANCER: always see their own milestones */}
                      {userRole === userRoles.FREELANCER &&
                        milestones.map((milestone, idx) =>
                          renderMilestoneCard(milestone, idx),
                        )}

                      {/* CLIENT: sequence review panel (published, not yet approved) */}
                      {userRole === userRoles.CLIENT &&
                        published &&
                        !sequenceApproved &&
                        renderClientSequenceReviewPanel()}

                      {/* CLIENT: execution phase (sequence already approved) */}
                      {userRole === userRoles.CLIENT &&
                        sequenceApproved &&
                        milestones.map((milestone, idx) =>
                          renderMilestoneCard(milestone, idx),
                        )}
                    </div>
                  ) : (
                    userRole === userRoles.FREELANCER && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No milestones defined yet</p>
                        <p className="text-sm mt-1">
                          Create milestones to track your project progress
                        </p>
                      </div>
                    )
                  )}
                </div>
              </TabsContent>

              {/* ── ESCROW TAB ───────────────────────────────────────────── */}
              <TabsContent value="escrow" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Escrow Management</h3>
                  <div className="grid gap-4">
                    <div className="p-6 border rounded-lg bg-muted/30">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b">
                          <span className="text-sm font-medium">
                            Total Budget
                          </span>
                          <span className="text-2xl font-bold">
                            ${selectedProject?.budget?.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Funds in Escrow
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            $
                            {milestones
                              ?.filter(
                                (m) =>
                                  m.paymentStatus === PaymentStatus.ESCROW_HELD,
                              )
                              .reduce((sum, m) => sum + (m.amount || 0), 0)
                              ?.toLocaleString() || "0"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Released to Freelancer
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            $
                            {milestones
                              ?.filter(
                                (m) =>
                                  m.paymentStatus === PaymentStatus.RELEASED ||
                                  m.paymentStatus === PaymentStatus.COMPLETED,
                              )
                              .reduce((sum, m) => sum + (m.amount || 0), 0)
                              ?.toLocaleString() || "0"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Completed &amp; Paid Out
                          </span>
                          <span className="text-xl font-bold text-purple-600">
                            $
                            {milestones
                              ?.filter(
                                (m) =>
                                  m.verificationStatus ===
                                  VerificationStatus.VERIFIED,
                              )
                              .reduce((sum, m) => sum + (m.amount || 0), 0)
                              ?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {milestones?.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">
                          Milestone Breakdown
                        </h4>
                        {milestones.map((milestone, idx) => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-3 border rounded bg-background"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium flex items-center gap-1.5">
                                {milestone.title || `Milestone ${idx + 1}`}
                                {(milestone.isLast || milestone.last) && (
                                  <Flag className="h-3 w-3 text-indigo-500" />
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {getMilestoneStatusText(milestone)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold">
                                ${milestone.amount?.toFixed(2) || "0.00"}
                              </p>
                              <Badge
                                variant={
                                  milestone.paymentStatus ===
                                    PaymentStatus.ESCROW_HELD ||
                                  milestone.paymentStatus ===
                                    PaymentStatus.RELEASED ||
                                  milestone.paymentStatus ===
                                    PaymentStatus.COMPLETED
                                    ? "default"
                                    : "outline"
                                }
                                className="text-xs"
                              >
                                {milestone.paymentStatus ===
                                PaymentStatus.ESCROW_HELD
                                  ? "In Escrow"
                                  : milestone.paymentStatus ===
                                        PaymentStatus.RELEASED ||
                                      milestone.paymentStatus ===
                                        PaymentStatus.COMPLETED
                                    ? "Released"
                                    : "Pending"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No milestone payments yet</p>
                        <p className="text-sm mt-1">
                          Funds are securely held until milestone completion
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          DIALOGS
      ════════════════════════════════════════════════════════════════════ */}

      {/* ── Payment Dialog ─────────────────────────────────────────────── */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Milestone Payment</DialogTitle>
            <DialogDescription>
              Pay for this milestone to allow the freelancer to start work.
              Payment is handled securely via Razorpay.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Milestone:</span>
                <span className="text-sm">
                  {selectedMilestoneForPayment?.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Amount:</span>
                <span className="text-lg font-bold">
                  ${selectedMilestoneForPayment?.amount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Days Required:</span>
                <span className="text-sm">
                  {selectedMilestoneForPayment?.daysRequired} days
                </span>
              </div>
              {selectedMilestoneForPayment?.dueDate && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Due Date:</span>
                  <span className="text-sm">
                    {format(
                      new Date(selectedMilestoneForPayment.dueDate),
                      "PP",
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Clicking "Pay Now" will open the Razorpay
                payment gateway. Funds will be held in escrow until you approve
                the freelancer's submitted work.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsPaymentDialogOpen(false);
                setSelectedMilestoneForPayment(null);
              }}
              disabled={paymentLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMilestonePayment}
              size="sm"
              disabled={paymentLoading}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              {paymentLoading ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Sequence Dialog (client → per-milestone feedback) ──── */}
      <Dialog
        open={isRejectSequenceOpen}
        onOpenChange={setIsRejectSequenceOpen}
      >
        <DialogContent className="sm:max-w-[540px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Changes to Milestone Plan</DialogTitle>
            <DialogDescription>
              Provide feedback for the milestones that need changes. At least
              one milestone must have feedback before submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className="space-y-2 p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <p className="text-sm font-medium">
                    {milestone.title || `Milestone ${idx + 1}`}
                  </p>
                  <span className="text-xs text-muted-foreground ml-auto">
                    ${milestone.amount?.toFixed(2)}
                  </span>
                </div>
                <Textarea
                  placeholder={`Feedback for milestone ${idx + 1} (leave blank if no changes needed)`}
                  value={sequenceFeedbackMap[milestone.id] ?? ""}
                  onChange={(e) =>
                    setSequenceFeedbackMap((prev) => ({
                      ...prev,
                      [milestone.id]: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRejectSequenceOpen(false);
                setSequenceFeedbackMap({});
              }}
              disabled={sequenceActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectSequence}
              disabled={sequenceActionLoading}
            >
              {sequenceActionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Submission Dialog ───────────────────────────────────── */}
      <Dialog
        open={isRejectSubmissionOpen}
        onOpenChange={setIsRejectSubmissionOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Revision</DialogTitle>
            <DialogDescription>
              Explain what needs to be revised in the submitted work.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="submission-remark">Feedback *</Label>
            <Textarea
              id="submission-remark"
              placeholder="Describe what needs to be changed..."
              value={submissionRemark}
              onChange={(e) => setSubmissionRemark(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsRejectSubmissionOpen(false);
                setSubmissionRemark("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRejectSubmission}
            >
              Request Revision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Update Milestone Dialog ────────────────────────────────────── */}
      <Dialog
        open={isUpdateMilestoneOpen}
        onOpenChange={setIsUpdateMilestoneOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Milestone</DialogTitle>
            <DialogDescription>
              Update the milestone details based on client feedback.
              <div className="mt-2 flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Available days:{" "}
                  {getRemainingDays() - getUsedDays(updatingMilestone?.id)}{" "}
                  &nbsp;|&nbsp; Remaining budget: $
                  {(
                    (selectedProject?.budget ?? 0) -
                    getUsedAmount(updatingMilestone?.id)
                  ).toFixed(2)}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Milestone Name *</Label>
              <Input
                placeholder="e.g., Initial Design Phase"
                value={updateMilestoneData.name}
                onChange={(e) =>
                  setUpdateMilestoneData({
                    ...updateMilestoneData,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe what will be delivered"
                value={updateMilestoneData.description}
                onChange={(e) =>
                  setUpdateMilestoneData({
                    ...updateMilestoneData,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Days Required *</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Days needed"
                  value={updateMilestoneData.daysRequired}
                  onChange={(e) =>
                    setUpdateMilestoneData({
                      ...updateMilestoneData,
                      daysRequired: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Amount ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={updateMilestoneData.amount}
                  onChange={(e) =>
                    setUpdateMilestoneData({
                      ...updateMilestoneData,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* NEW: isLast checkbox in update dialog */}
            <div className="flex items-start gap-3 p-3 border rounded-lg bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800">
              <Checkbox
                id="update-is-last-milestone"
                checked={updateMilestoneData.isLast}
                onCheckedChange={(checked) =>
                  setUpdateMilestoneData({
                    ...updateMilestoneData,
                    isLast: !!checked,
                  })
                }
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="update-is-last-milestone"
                  className="text-sm font-medium text-indigo-900 dark:text-indigo-100 cursor-pointer flex items-center gap-1.5"
                >
                  <Flag className="h-3.5 w-3.5" />
                  This is the last milestone
                </Label>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Marks this milestone as final, publishing the full plan to the
                  client once submitted.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateMilestoneOpen(false);
                setUpdatingMilestone(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMilestone}>Update Milestone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
