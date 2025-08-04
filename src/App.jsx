import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AboutUs from "./pages/about-us"
import BidHistory from "./pages/BidHistory"
import Dashboard from "./pages/dashboard"
import Home from "./pages/landingpage"
import Login from "./pages/login"
import Register from "./pages/register"
import BrowseJobs from "./pages/BrowseJobs"
import Proposals from "./pages/Proposals"
import Reviews from "./pages/reviews"
import Earnings from "./pages/earnings"
import Messages from "./pages/message"
import Analytics from "./pages/analytics"
import Projects from "./pages/ActiveProjects"
import CreateProfile from "./pages/create-profile"
import ProfileSetup from "./pages/profile-setup"
import PostJobContent from "./components/dashboard/tabs/post-job-content"
import JobPostsContent from "./components/dashboard/tabs/job-post-content"

function App() {
  const router = createBrowserRouter([
    {
      path: "/dashboard/job-posts",
      element: <JobPostsContent/>,
    },
    {
      path: "/dashboard/post-job",
      element: <PostJobContent/>,
    },
    
      {
      path: "/dashboard/projects",
      element: <Projects/>,
    },
      {
      path: "/dashboard/analytics",
      element: <Analytics/>,
    },
     {
      path: "/dashboard/messages",
      element: <Messages/>,
    },
    {
      path: "/dashboard/earnings",
      element: <Earnings/>,
    },
    {
      path: "/dashboard/reviews",
      element: <Reviews/>,
    },
      {
      path: "/dashboard/proposals",
      element: <Proposals/>,
    },
    {
      path: "/dashboard/browse-jobs",
      element: <BrowseJobs/>,
    },
    {
      path: "/dashboard/bid-history",
      element: <BidHistory />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about-us",
      element: <AboutUs />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
     {
      path: "/create-profile",
      element: <CreateProfile/>,
    },
     {
      path: "/profile-setup",
      element: <ProfileSetup />,
    },
  ])

  return <RouterProvider router={router} />
}

export default App
