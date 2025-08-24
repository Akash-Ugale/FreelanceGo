import { apiClient } from "@/api/AxiosServiceApi"
import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()
const REDIRECT_LINK = import.meta.env.VITE_REDIRECT_LINK

export default function AuthContextProvider({ children }) {
  const [userRole, setUserRole] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [token, setToken] = useState(null)

  const logoutUser = () => {
    localStorage.removeItem("token")
    setAuthLoading(false)
    setIsAuthenticated(false)
    setToken(null)
    setUserRole(null)
  }

  // return true = valid, false = invalid
  const isTokenValid = async (token) => {
    try {
      const response = await apiClient.get("/api/isAuthenticated", {
        headers: { Authorization: "Bearer " + token },
      })
      return response.status === 200
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setAuthLoading(false)
        setIsAuthenticated(false)
        return
      }

      try {
        const decoded = jwtDecode(token)

        // Expired token
        if (decoded?.exp < Date.now() / 1000) {
          logoutUser()
          return
        }

        // Role missing
        if (!decoded?.role) {
          logoutUser()
          return
        }

        // Validate with backend
        const valid = await isTokenValid(token)
        if (!valid) {
          logoutUser()
          return
        }

        // Success
        setUserRole(decoded.role)
        setIsAuthenticated(true)
        setToken(token)
      } catch (error) {
        console.error("Auth check failed:", error)
        logoutUser()
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        authLoading,
        setAuthLoading,
        logoutUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
