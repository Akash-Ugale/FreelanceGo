import { useState } from 'react'
import './App.css'
import AboutUs from './pages/about-us'
import Login from './pages/login'
import Register from './pages/register'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/landingpage'
import Dashboard from './pages/dashboard'
import BidHistoryContent from './components/dashboard/bid-history-content'
import BidHistory from './pages/BidHistory'


function App() {
  const router = createBrowserRouter([
    
    {
      path: "/dashboard/bid-history",
      element: <BidHistory/>  
    },
    {
      path: "/dashboard",
      element: <Dashboard/>  
    },
    {
      path: "/",
      element: <Home/>  
    },
    {
      path: "/about-us",
      element: <AboutUs/>  
    },
    {
    path: "/login",
    element: <Login />
  }, 
  {
    path:"/register",
    element:<Register/>
  }
  ])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
