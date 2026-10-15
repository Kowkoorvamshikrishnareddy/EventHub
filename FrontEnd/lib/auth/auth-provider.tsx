 
"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react"
import { getCurrentUser } from "@/components/ApiServices/ApiServices"
import axios from "axios"
import type { Dispatch, SetStateAction } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
  auth: User | null
  user: User | null
  setAuth: Dispatch<SetStateAction<User | null>>
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:6000/api/v1";
  const localpath = `${API_BASE_URL}/user/getprofile`

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(localpath, { withCredentials: true, headers });
      if (response?.data?.statuscode == 201 || response?.data?.statuscode == 200) {
        const userData = response?.data?.data;
        setAuth(userData);
        if (userData?.role && typeof document !== "undefined") {
          document.cookie = `role=${userData.role}; path=/; max-age=86400; SameSite=Lax`;
        }
        if (userData?.membershipType && typeof document !== "undefined") {
          document.cookie = `membershipType=${userData.membershipType}; path=/; max-age=86400; SameSite=Lax`;
        }
      } else {
        setAuth(null);
      }
    } catch (error: unknown) {
      console.warn("refreshUser error:", error);
      setAuth(null);
    } finally {
      setIsLoading(false);
    }
  }, [localpath]);

  useEffect(() => {
    const authUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (authUser) {
      refreshUser()
    } else {
      setIsLoading(false)
    }
  }, [refreshUser])

  return (
    <AuthContext.Provider value={{ auth, user: auth, setAuth, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
