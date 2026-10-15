 
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
      setIsLoading(true)
      const response = await axios.get(localpath,{withCredentials: true})
       console.log("response",response)
      if (response?.data?.statuscode==201) {
        setAuth(response?.data?.data) 
      } else {
        setAuth(null)
      }
    } catch (error: unknown) {
       console.log("error123",error)
       if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        setAuth(null);
      } else {
        console.error("Unexpected error in refreshUser:", error);
      }
      setAuth(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
