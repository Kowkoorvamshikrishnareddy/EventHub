
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Calendar,
  Heart,
  Edit3,
  MapPin,
  Clock,
  Star,
  Trophy,
  Gift,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  QrCode,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import Link from "next/link"
import StatsCard from "@/components/Profile/StarCard"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { EditUsers } from "@/components/ApiServices/ApiServices"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"
import CommonLoader from "@/components/commonloader/CommonLoader"

// Add custom scrollbar styles
const scrollbarStyles = `
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 0.375rem;
  }
  .scrollbar-track-gray-100::-webkit-scrollbar-track {
    background-color: #f3f4f6;
  }
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
  }
`

export default function UserProfile() {
  const { auth, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loader, setLoader] = useState(false)
  const [editUser, setEditUser] = useState({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditUser({
      ...editUser,
      [name]: value,
    })
  }

  const handleSubmit = async () => {
    try {
      setLoader(true)
      const response = await EditUsers(editUser)
      if (response?.statuscode == 200) {
        toast({
          title: "Profile Updated Successfully",
          description: "Your profile has been updated successfully.",
          variant: "default",
        })
        await refreshUser()
        setLoader(false)
        setIsSheetOpen(false)
      }
    } catch (error) {
      setLoader(false)
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (auth) {
      setEditUser({
        name: auth.name,
        email: auth.email,
        phone: auth.phone,
        address: auth.address,
        currentPassword: "",
        newPassword: "",
      })
    }
  }, [auth])

  // Helper function to get attendance status badge
  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Attended
          </Badge>
        )
      case "not_attended":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Not Attended
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  if (!auth) {
    return <CommonLoader />
  }

  const stats = {
    totalRegistrations: auth.registered_attendees?.length || 0,
    favoriteEvents: auth.favorate_events?.length || 0,
    upcomingEvents: auth.registered_attendees?.filter((event) => new Date(event.Date) > new Date()).length || 0,
    pastEvents: auth.registered_attendees?.filter((event) => new Date(event.Date) <= new Date()).length || 0,
  }

  const memberSince = format(new Date(auth.createdAt), "MMMM yyyy")
  const lastUpdated = format(new Date(auth.updatedAt), "MMM dd, yyyy")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <>
      <style jsx global>
        {scrollbarStyles}
      </style>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto p-6 space-y-8 mt-10"
      >
        {/* Profile Header */}
        <motion.div variants={item}>
          <Card className="relative overflow-hidden">
            {/* Background Pattern */}
            <div
              className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30`}
            />
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${auth.name}`} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {auth.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {/* User Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">{auth.name}</h1>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {auth.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{auth.email}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Last updated {lastUpdated}</span>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsSheetOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Events"
            value={stats.totalRegistrations}
            icon={Calendar}
            description="Events registered"
            color="bg-blue-500"
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Favorites"
            value={stats.favoriteEvents}
            icon={Heart}
            description="Saved events"
            color="bg-red-500"
            gradient="from-red-500 to-pink-500"
          />
          <StatsCard
            title="Upcoming"
            value={stats.upcomingEvents}
            icon={Star}
            description="Events coming up"
            color="bg-green-500"
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Completed"
            value={stats.pastEvents}
            icon={Trophy}
            description="Events attended"
            color="bg-purple-500"
            gradient="from-purple-500 to-indigo-500"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                  <Badge variant="outline" className="ml-auto">
                    {stats.totalRegistrations} Events
                  </Badge>
                </CardTitle>
                <CardDescription>Your latest event interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {auth.registered_attendees?.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {auth.registered_attendees.map((event, index) => (
                      <div
                        key={event._id}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {event.Event_title?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-2">{event.Event_title}</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(event.Date), "MMM dd, yyyy")}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.Time}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-green-600 font-semibold">₹{event.Price}</span>
                            </div>
                          </div>

                          {/* Entry Code Section - Better UI */}
                          {event.entrycode && event.entrycode !== "undefined" ? (
                            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-blue-600 font-medium">Entry Code:</span>
                                <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono font-bold">
                                  {event.entrycode}
                                </code>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded-md">
                              <div className="flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500">Entry code will be generated soon</span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Badge variant={new Date(event.Date) > new Date() ? "default" : "secondary"}>
                              {new Date(event.Date) > new Date() ? "Upcoming" : "Past"}
                            </Badge>
                            {getAttendanceStatusBadge(event.attendanceStatus || "pending")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No events yet</h3>
                    <p className="text-gray-500 mb-4">Start exploring amazing events!</p>
                    <Button asChild>
                      <Link href="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Favorites */}
          <motion.div variants={item} className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/events" className="hover:text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Browse Events
                  </Link>
                </Button>
                
              </CardContent>
            </Card>

            {/* Favorite Events Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-red-500" />
                  Favorite Events
                  {auth.favorate_events?.length > 0 && (
                    <Badge variant="outline" className="ml-auto">
                      {auth.favorate_events.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auth.favorate_events?.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {auth.favorate_events.map((event) => (
                      <div
                        key={event._id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <h4 className="font-medium text-sm text-gray-900 mb-2">{event.Event_title}</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(event.Date), "MMM dd")}
                            <MapPin className="w-3 h-3 ml-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="text-green-600 font-semibold">₹{event.Price}</span>
                            <Clock className="w-3 h-3 ml-2" />
                            {event.Time}
                          </div>
                          <div className="flex gap-1">
                            {getAttendanceStatusBadge(event.attendanceStatus || "pending")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No favorite events yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex items-center justify-between">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
              <div className="p-6">
                <SheetHeader>
                  <SheetTitle>Edit Profile</SheetTitle>
                  <SheetDescription>Make changes to your profile information and password here.</SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-8">
                  {/* Profile Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Profile Information</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          className="px-4 py-3"
                          defaultValue={editUser?.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          className="px-4 py-3"
                          type="email"
                          defaultValue={editUser?.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          className="px-4 py-3"
                          name="phone"
                          defaultValue={editUser?.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          className="px-4 py-3"
                          name="address"
                          defaultValue={editUser?.address}
                          onChange={handleChange}
                        />
                      </div>
                      <Button onClick={handleSubmit} className="w-full mt-4">
                        {loader ? (
                          <div className="flex justify-center gap-1">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>updating...</span>
                          </div>
                        ) : (
                          "Save Profile Changes"
                        )}
                      </Button>
                    </div>
                  </div>
                  {/* Password Change Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="old-password">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="old-password"
                            name="currentPassword"
                            className="px-4 py-3"
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            onChange={handleChange}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            name="newPassword"
                            className="px-4 py-3"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            onChange={handleChange}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            className="px-4 py-3"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            onChange={handleChange}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleSubmit} className="w-full mt-4">
                        <Lock className="h-4 w-4 mr-2" />
                        {loader ? (
                          <div className="flex justify-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span>updating...</span>
                          </div>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>
    </>
  )
}
