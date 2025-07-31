import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AboutUs from "./pages/about-us"
import BidHistory from "./pages/BidHistory"
import Dashboard from "./pages/dashboard"
import Home from "./pages/landingpage"
import Login from "./pages/login"
import Register from "./pages/register"

function App() {
  const router = createBrowserRouter([
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
  ])

  return <RouterProvider router={router} />
}

export default App
