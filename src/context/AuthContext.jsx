import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useState } from "react"
import React from 'react'

const AuthContext = createContext()
const REDIRECT_LINK = import.meta.env.VITE_REDIRECT_LINK;

export default function AuthContextProvider({children}) {
    const [userRole, setUserRole] = useState("freelancer")
     const [currentUser, setCurrentUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(true)
    const [authLoading, setAuthLoading] = useState(false)
  
    const loginRedirect = () => {
        window.location.href = ""
    }

    /* useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            setAuthLoading(false)
            setIsAuthenticated(false)
            return;
        }

        try {
            const decoded = jwtDecode(token)
            if (!decoded?.role) {
                return;
            }
            setUserRole(decoded.role)
        } catch (error) {
            console.log(error)
        } finally {
            setAuthLoading(false)
        }
    }, []) */

  return (
    <AuthContext.Provider value={{userRole, setUserRole, currentUser,setCurrentUser, setIsAuthenticated, authLoading, setAuthLoading}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

