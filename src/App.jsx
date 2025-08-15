import { createBrowserRouter, RouterProvider } from "react-router-dom"
import DashboardContent from "./components/dashboard/dashboard-content"
import JobPostsContent from "./components/dashboard/tabs/job-post-content"
import PostJobContent from "./components/dashboard/tabs/post-job-content"
import AboutUs from "./pages/about-us"
import Analytics from "./pages/analytics"
import BidHistory from "./pages/BidHistory"
import BrowseJobs from "./pages/BrowseJobs"
import CreateProfile from "./pages/create-profile"
import Dashboard from "./pages/dashboard"
import Earnings from "./pages/earnings"
import Home from "./pages/landingpage"
import Login from "./pages/login"
import Messages from "./pages/message"
import ProfileSetup from "./pages/profile-setup"
import Proposals from "./pages/Proposals"
import Register from "./pages/register"
import Reviews from "./pages/reviews"
import Projects from "./pages/ActiveProjects"
import AuthContextProvider from "./context/AuthContext"

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
      ],
    },
    { path: "/", element: <Home /> },
    { path: "/about-us", element: <AboutUs /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/create-profile", element: <CreateProfile /> },
    { path: "/profile-setup", element: <ProfileSetup /> },
  ])

  return <AuthContextProvider>
    <RouterProvider router={router} />
  </AuthContextProvider>;
}

export default App