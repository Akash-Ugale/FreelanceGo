import { apiClient } from "@/api/AxiosServiceApi";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { string } from "yup";

const AuthContext = createContext(undefined);

export default function AuthContextProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const interceptorId = useRef(null);

  const applyInterceptors = (passedToken) => {
    if (interceptorId.current) {
      apiClient.interceptors.request.eject(interceptorId.current);
    }
    interceptorId.current = apiClient.interceptors.request.use((config) => {
      config.headers.Authorization = "Bearer " + passedToken;
      return config;
    });
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null);
    setUserRole(null);
    setAuthLoading(false);
  };

  const isTokenValid = async (token) => {
    try {
      const response = await apiClient.get("/api/isAuthenticated", {
        headers: { Authorization: "Bearer " + token },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setAuthLoading(true);
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded?.exp < Date.now() / 1000 || !decoded?.role) {
          logoutUser();
          return;
        }

        const valid = await isTokenValid(token);
        if (!valid) {
          logoutUser();
          return;
        }

        setUserRole(decoded.role);
        setIsAuthenticated(true);
        setToken(token);
        applyInterceptors(token);
      } catch (error) {
        console.error("Auth check failed:", error);
        logoutUser();
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []); // ✅ runs once only

  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        authLoading,
        setAuthLoading,
        logoutUser,
        token,
        setToken,
        userId,
        setUserId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
