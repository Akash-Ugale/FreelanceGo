import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import DashboardContent from "./components/dashboard/dashboard-content";
import JobPostsContent from "./components/dashboard/tabs/job-post-content";
import PostJobContent from "./components/dashboard/tabs/post-job-content";
import AuthContextProvider from "./context/AuthContext";
import AboutUs from "./pages/about-us";
import Projects from "./pages/ActiveProjects";
import Analytics from "./pages/analytics";
import BidHistory from "./pages/BidHistory";
import BrowseJobs from "./pages/BrowseJobs";
import CreateProfile from "./pages/create-profile";
import Dashboard from "./pages/dashboard";
import Earnings from "./pages/earnings";
import Home from "./pages/landingpage";
import Login from "./pages/login";
import Messages from "./pages/message";
import ProfileSetup from "./pages/profile-setup";
import Proposals from "./pages/Proposals";
import Register from "./pages/register";
import Reviews from "./pages/reviews";
import ReviewProposals from "./pages/review-proposal";
import HiredFreelancers from "./pages/hired-freelancer";
import SubmitProposal from "./components/dashboard/submit-proposal";
import ProjectBids from "./pages/project-bids";
function App() {
  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { index: true, element: <DashboardContent /> },
        { path: "job-posts", element: <JobPostsContent /> },
        { path: "post-job", element: <PostJobContent /> },
        { path: "projects", element: <Projects /> },
        { path: "analytics", element: <Analytics /> },
        { path: "messages", element: <Messages /> },
        { path: "earnings", element: <Earnings /> },
        { path: "reviews", element: <Reviews /> },
        { path: "proposals", element: <Proposals /> },
        { path: "browse-jobs", element: <BrowseJobs /> },
        { path: "bid-history", element: <BidHistory /> },
        { path:"proposals-review",element:<ReviewProposals/>},
        { path:"hired-freelancer",element:<HiredFreelancers/>},
        { path: "submit-proposal", element: <SubmitProposal/>},
        {path:"project-bids/:projectId", element:<ProjectBids/>}

        

      ],
    },
    { path: "/", element: <Home /> },
    { path: "/about-us", element: <AboutUs /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/create-profile", element: <CreateProfile /> },
    { path: "/profile-setup", element: <ProfileSetup /> },
  ]);

  return (
    <AuthContextProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
