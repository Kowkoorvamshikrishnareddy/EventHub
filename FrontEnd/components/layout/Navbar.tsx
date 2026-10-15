"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/auth-provider"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useToast } from "@/hooks/use-toast"
import { useAppDispatch } from "@/lib/store"
import { logoutUserThunk } from "../ReduxSlices/UserSlice"

type NavItem = {
  label: string
  path: string
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const [users, setUsers] = useState<any>(null)

  const { auth, refreshUser } = useAuth()

  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  const canCreateEvent =
    auth &&
    (auth?.role === "admin" || auth?.role === "organizer")

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      router.push("/login")
    } else {
      setUsers(JSON.parse(user))
    }
  }, [auth, router])

  const handlelogoutUser = async () => {
    const response = await dispatch(logoutUserThunk())

    if (response?.payload?.statuscode == 201) {
      localStorage.removeItem("user")
      localStorage.removeItem("accessToken")
      document.cookie = "role=; path=/; max-age=0"
      document.cookie = "membershipType=; path=/; max-age=0"
      toast({
        title: "Logout Successful",
        description: "You have successfully logged out.",
      })

      await refreshUser()
      router.push("/login")
    } else {
      toast({
        title: "Error",
        description: "Something went wrong while logging out.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  }

  /*
   * Convert auth image safely.
   * Your current User type does not declare "image",
   * so we access it safely without causing a TypeScript error.
   */
  const userImage = (auth as any)?.image || ""

  /*
   * Desktop navigation items
   */
  const desktopNavItems: NavItem[] = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Contact", path: "/contact" },
    { label: "About", path: "/about" },

    ...(auth && auth.role !== "attendee"
      ? [
          auth.role === "admin"
            ? {
                label: "Dashboard",
                path: "/dashboard",
              }
            : auth.role === "organizer" &&
                auth.membershipType === "outer"
              ? {
                  label: "Dashboard",
                  path: "/outer/dashboard",
                }
              : auth.role === "organizer" &&
                  auth.membershipType === "inner"
                ? {
                    label: "Dashboard",
                    path: "/organizerdashboard",
                  }
                : null,
        ].filter((item): item is NavItem => item !== null)
      : []),

    ...(auth?.role === "attendee"
      ? [{ label: "Favorites", path: "/favorites" }]
      : []),
  ]

  /*
   * Mobile navigation items
   */
  const mobileNavItems: NavItem[] = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Contact", path: "/contact" },
    { label: "About", path: "/about" },

    ...(auth && auth.role !== "attendee"
      ? [
          auth.role === "admin"
            ? {
                label: "Dashboard",
                path: "/dashboard",
              }
            : auth.role === "organizer" &&
                auth.membershipType === "outer"
              ? {
                  label: "Dashboard",
                  path: "/outer/dashboard",
                }
              : auth.role === "organizer" &&
                  auth.membershipType === "inner"
                ? {
                    label: "Dashboard",
                    path: "/organizerdashboard",
                  }
                : null,
        ].filter((item): item is NavItem => item !== null)
      : []),

    ...(auth?.role === "attendee"
      ? [{ label: "Favorites", path: "/favorites" }]
      : []),
  ]

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
        isScrolled || pathname !== "/"
          ? "bg-white/90 shadow-md py-2"
          : "bg-gradient-to-b from-black/50 to-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.span
              className="font-satisfy text-3xl text-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              EventHub
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {desktopNavItems.map((item, i) => {
              const isLinkActive = pathname === item.path

              return (
                <motion.div
                  key={item.label}
                  custom={i}
                  variants={menuItemVariants}
                >
                  <Link
                    href={item.path}
                    className={cn(
                      "text-foreground transition-colors relative group",
                      isLinkActive
                        ? "text-primary font-medium"
                        : "hover:text-primary",
                      pathname === "/" && !isScrolled
                        ? "text-white hover:text-white"
                        : ""
                    )}
                  >
                    {item.label}

                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                        isLinkActive ? "w-full" : ""
                      )}
                    />
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Desktop Login / User */}
          <div className="hidden md:flex items-center space-x-4">
            {auth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary">
                      <AvatarImage src={userImage} />

                      <AvatarFallback>
                        {auth?.name
                          ? getInitials(auth.name)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {auth?.name}
                      </p>

                      <p className="text-xs leading-none text-muted-foreground">
                        {auth?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {auth?.role === "attendee" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="cursor-pointer data-[highlighted]:text-white data-[highlighted]:bg-accent"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handlelogoutUser}
                    className="cursor-pointer text-destructive focus:text-destructive hover:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    pathname === "/" && !isScrolled
                      ? "text-white hover:text-white hover:bg-white/20"
                      : ""
                  )}
                >
                  <Link href="/login">Login</Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
          >
            <SheetTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden"
              >
                <Menu
                  size={24}
                  className={cn(
                    pathname === "/" && !isScrolled
                      ? "text-white"
                      : "text-foreground"
                  )}
                />
              </motion.button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 bg-black/20 backdrop-blur-md border-l border-gray-200/20"
            >
              <SheetHeader>
                <SheetTitle className="text-left">
                  <span className="font-satisfy text-2xl text-white">
                    EventHub
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col space-y-6 mt-8">

                {/* Mobile Links */}
                <nav className="flex flex-col space-y-4">
                  {mobileNavItems.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        className={cn(
                          "text-white transition-colors block py-3 px-2 rounded-lg text-lg",
                          isActive(item.path)
                            ? "hover:text-white hover:bg-primary"
                            : "hover:text-white hover:bg-primary"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile User Section */}
                <div className="border-t border-white/30 pt-6">
                  {auth ? (
                    <div className="space-y-4">

                      <div className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                          <AvatarImage src={userImage} />

                          <AvatarFallback>
                            {auth?.name
                              ? getInitials(auth.name)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {auth?.name}
                          </p>

                          <p className="text-xs text-gray-300 truncate">
                            {auth?.email}
                          </p>
                        </div>
                      </div>

                      {auth?.role === "attendee" && (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-start bg-white/10 border-white/30 hover:bg-white/20 text-white hover:text-white"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href="/profile">
                            Profile
                          </Link>
                        </Button>
                      )}

                      {canCreateEvent && (
                        <Button
                          asChild
                          className="w-full justify-start bg-primary/80 hover:bg-primary text-white"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href="/events">
                            Create Event
                          </Link>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-300 hover:text-red-200 bg-white/10 border-white/30 hover:bg-red-500/20"
                        onClick={() => {
                          handlelogoutUser()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">

                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-white/10 border-white/30 hover:bg-white/20 text-white hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/login">
                          Login
                        </Link>
                      </Button>

                      <Button
                        asChild
                        className="w-full bg-primary/80 hover:bg-primary text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/register">
                          Register
                        </Link>
                      </Button>

                    </div>
                  )}
                </div>

              </div>
            </SheetContent>
          </Sheet>

        </div>
      </div>
    </motion.header>
  )
}