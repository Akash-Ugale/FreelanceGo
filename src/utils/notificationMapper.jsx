export const getNotificationUI = (type, triggerUser) => {
  // Use firstName for display. Fallback to "FreelanceGo" for
  // isGeneral=true notifications where triggerUser is null
  const name = triggerUser?.username || "FreelanceGo";

  const map = {
    // Job & Bids
    JOB_CREATED:               { title: "Job posted",           sub: "Your job is now live" },
    JOB_UPDATED:               { title: "Job updated",          sub: "Your job listing was updated" },
    JOB_DELETED:               { title: "Job removed",          sub: "Your job has been deleted" },
    BID_RECEIVED:              { title: "New bid received",      sub: `${name} placed a bid on your job` },
    BID_ACCEPTED:              { title: "Bid accepted",          sub: `${name} accepted your bid` },
    BID_REJECTED:              { title: "Bid rejected",          sub: `${name} rejected your bid` },
    JOB_BID_WITHDRAWN:         { title: "Bid withdrawn",         sub: `${name} withdrew their bid` },

    // Milestones
    MILESTONE_CREATED:         { title: "Milestone created",    sub: `${name} created a new milestone` },
    MILESTONE_SUBMITTED:       { title: "Milestone submitted",  sub: `${name} submitted work for review` },
    MILESTONE_APPROVED:        { title: "Milestone approved",   sub: `${name} approved your milestone` },
    MILESTONE_REJECTED:        { title: "Milestone rejected",   sub: `${name} rejected your milestone` },
    MILESTONE_REVISION_REQUESTED: { title: "Revision requested", sub: `${name} requested changes to your work` },
    MILESTONE_MODIFIED:        { title: "Milestone updated",    sub: `${name} modified a milestone` },
    MILESTONE_DELETED:         { title: "Milestone removed",    sub: `${name} deleted a milestone` },
    MILESTONE_COMPLETED:       { title: "Milestone completed",  sub: "Milestone successfully completed" },

    // Payments
    MILESTONE_PAYMENT_INITIATED:  { title: "Payment initiated", sub: "Payment has been started for your milestone" },
    MILESTONE_PAYMENT_COMPLETED:  { title: "Payment received",  sub: "Payment has been released to your account" },
    MILESTONE_PAYMENT_FAILED:     { title: "Payment failed",    sub: "There was an issue processing your payment" },
    MILESTONE_REFUNDED:           { title: "Payment refunded",  sub: "A refund has been issued for your milestone" },

    // Messages
    MESSAGE_RECEIVED:          { title: "New message",          sub: `${name} sent you a message` },

    // Disputes
    MILESTONE_DISPUTE_CREATED:  { title: "Dispute raised",      sub: `${name} raised a dispute on a milestone` },
    MILESTONE_DISPUTE_RESOLVED: { title: "Dispute resolved",    sub: "Your milestone dispute has been resolved" },
  };

  return map[type] || { title: "New update", sub: "Check your dashboard for details" };
};