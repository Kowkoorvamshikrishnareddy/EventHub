


"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CalendarDays,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPinIcon,
  Edit,
  Eye,
  MoreHorizontal,
  Calendar,
  Activity,
  EyeOff,
  Loader2,
  User,
  Shield,
  Crown,
  Upload,
  X,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EventStatusModal } from "@/components/models/Eventstatusmodel"
import { EventDetailsModal } from "@/components/models/EventUpdatemodel"
import { getAssignedEvents } from "@/components/ApiServices/ApiServices"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Lock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EditUsers } from "@/components/ApiServices/ApiServices"
import CommonLoader from "@/components/commonloader/CommonLoader"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { set } from "date-fns"

// Type definitions
interface Event {
  _id: string
  Event_title: string
  Description: string
  Date: string
  Time: string
  location: string
  Price: number
  eventstatus: "completed" | "delayed" | "cancelled" | "upcoming"
  image?: string
  attendee?: Attendee[]
}

interface Attendee {
  _id: string
  status: "confirmed" | "pending" | "no-show" | "attended"
  name: string
  email: string
}

interface AuthUser {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  status: "Active" | "inActive"
  membershipType: string
  createdAt: string
  createdBy: string
  assignedEvents: string[]
  favorate_events: string[]
  registered_attendees: string[]
}

interface EditUserData {
  name: string
  email: string
  phone: string
  address: string
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

interface SelectEvent {
  eventIds: Event[]
}

export default function OrganizerDashboard() {
  const [isLoading, setIsLoading] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectEvent, setSelectEvent] = useState<SelectEvent[]>([])
  const { auth, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loader, setLoader] = useState(false)
  const [editUser, setEditUser] = useState<EditUserData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [avatarImage, setAvatarImage] = useState(null)
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
      const fd = new FormData();
      fd.append("file", avatarImage);
      Object.entries(editUser).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, value as string);
        }
      });

      const response = await EditUsers(fd)
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
        confirmPassword: "",
      })
    }
    setImagePreview(auth?.image)
  }, [auth])



  const getAssignEvents = async (organizationId: string, userId: string) => {
    try {
      setIsLoading(true)
      const response = await getAssignedEvents(organizationId, userId)
      if (response.statuscode == 200) {
        setSelectEvent(response?.data)
        setIsLoading(false)
      }
      return response
    } catch (error) {
      console.error("Error fetching assigned events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (auth && auth._id) {
      getAssignEvents(auth.createdBy, auth._id)
    }
  }, [auth])




  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    console.log("timeString", timeString)
    const [hours, minutes] = timeString.split(":")
    const time = new Date()
    time.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Completed: {
        className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300",
        text: "Completed",
      },
      Delayed: {
        className: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300",
        text: "Delayed",
      },
      Cancelled: {
        className: "bg-red-100 text-red-800 hover:bg-red-200 border-red-300",
        text: "Cancelled",
      },
      Upcoming: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
        text: "Upcoming",
      },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
    return <Badge className={`${config.className} border font-medium`}>{config.text}</Badge>
  }


  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }
  const getAttendeeStatusCount = (attendees: Attendee[]) => {
    const confirmed = attendees.filter((a) => a.status === "confirmed" || a.status === "attended").length
    const pending = attendees.filter((a) => a.status === "pending").length
    const noShow = attendees.filter((a) => a.status === "no-show").length
    return { confirmed, pending, noShow, total: attendees.length }
  }

  const isUserInactive = auth?.status === "inActive"
  const shouldShowContent = !isUserInactive

  if (auth?.status === "inActive") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900">Access Denied</CardTitle>
            <CardDescription className="text-gray-600">Your account is currently inactive</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              <span>You do not have access to this system at the moment</span>
            </div>
            <p className="text-sm text-gray-600">
              Please contact your administrator or support team to activate your account.
            </p>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
              <Button variant="ghost" className="w-full text-sm">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview URL
      setAvatarImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setEditUser({
      ...editUser,
      image: "",
    })
    // Reset file input
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  if (isLoading) {
    return <CommonLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!shouldShowContent ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
                <Building2 className="w-16 h-16 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Account Temporarily Unavailable</h2>
              <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                Your account access has been temporarily suspended. Don't worry - we're here to help you get back on
                track!
              </p>
            </div>
            <Alert className="max-w-md border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Need help?</strong> Contact our support team at{" "}
                <span className="font-semibold">{auth?.email}</span> for immediate assistance.
              </AlertDescription>
            </Alert>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
              Contact Support
            </Button>
          </div>
        ) : (
          <>
            {/* Clean Profile Section */}
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
                  <div className="flex items-center justify-between">





                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                      <Avatar className="h-20 w-20 rounded-none">
                        {auth?.image ? (
                          <AvatarImage
                            src={auth?.image || "/placeholder.svg"}
                            alt={auth.name}
                            className="rounded-none"
                          />
                        ) : (
                          <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600 rounded-none">
                            {/* {getInitials(auth?.name)} */}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div>
                        <h1 className="text-2xl font-bold text-white">{auth?.name}</h1>
                        <p className="text-blue-100">{auth?.email}</p>
                      </div>
                    </div>




                    <Button
                      variant="secondary"
                      onClick={() => setIsSheetOpen(true)}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
                {/* Profile Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Contact Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contact</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{auth?.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{auth?.address}</span>
                        </div>
                      </div>
                    </div>
                    {/* Role & Status */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Role & Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline" className="capitalize">
                            {auth?.role}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <Badge variant={auth?.status === "Active" ? "default" : "destructive"}>{auth?.status}</Badge>
                        </div>
                      </div>
                    </div>
                    {/* Membership */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Membership</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Crown className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline" className="capitalize">
                            {auth?.membershipType}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            Since {new Date(auth?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Statistics */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Statistics</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Assigned Events</span>
                          <span className="text-lg font-bold text-blue-600">{selectEvent[0]?.eventIds?.length || 0}</span>
                        </div>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Table Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
                    <CalendarDays className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Your Events</h2>
                    <p className="text-gray-600 text-lg">
                      Manage and track your assigned events with real-time updates
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-base bg-indigo-50 text-indigo-700 border-indigo-200 px-4 py-2">
                  📊 {selectEvent[0]?.eventIds?.length || auth?.assignedEvents.length} Events
                </Badge>
              </div>

              {!selectEvent[0]?.eventIds || selectEvent[0]?.eventIds?.length === 0 ? (
                <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="p-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-6 shadow-inner">
                      <CalendarDays className="w-16 h-16 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Events Yet</h3>
                    <p className="text-gray-600 text-center max-w-md text-lg leading-relaxed mb-6">
                      You don't have any events assigned yet. Once your administrator assigns events, they'll appear
                      here for you to manage.
                    </p>

                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white shadow-lg border-gray-200 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-gray-50 to-slate-100 border-b-2 border-gray-200">
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Event Details</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Schedule</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Location</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Attendees</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Price</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Status</TableHead>
                            <TableHead className="font-bold text-gray-900 text-sm py-4">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectEvent[0]?.eventIds?.map((event: Event, index: number) => {
                            const attendeeStats = getAttendeeStatusCount(event.attendee || [])
                            return (
                              <TableRow
                                key={event?._id}
                                className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                  }`}
                              >
                                <TableCell className="py-6">
                                  <div className="flex items-center space-x-4">
                                    <div className="relative">
                                      <img
                                        src={event?.image || "/placeholder.svg?height=60&width=60"}
                                        alt={event?.Event_title}
                                        className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white"
                                      />
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-bold text-gray-900 text-base line-clamp-1">
                                        {event?.Event_title}
                                      </p>
                                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{event?.Description}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <CalendarDays className="w-4 h-4 text-blue-500" />
                                      <span className="text-sm font-semibold text-gray-900">
                                        {formatDate(event?.Date)}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4 text-green-500" />
                                      <span className="text-sm text-gray-600">{formatTime(event?.Time)}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-gray-900 capitalize font-medium">
                                      {event?.location}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4 text-purple-500" />
                                      <span className="text-sm font-semibold text-gray-900">{attendeeStats.total}</span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-bold text-green-600 text-base">
                                      {event.Price === 0 ? "Free" : `₹${event?.Price}`}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                      {getStatusBadge(event?.eventstatus)}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="py-6">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="hover:bg-blue-100 rounded-lg">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 shadow-lg border-gray-200">
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedEvent(event)
                                          setIsDetailsModalOpen(true)
                                        }}
                                        className="hover:bg-blue-50 cursor-pointer"
                                      >
                                        <Eye className="w-4 h-4 mr-2 text-blue-600" />
                                        <span className="font-medium">View Details</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedEvent(event)
                                          setIsStatusModalOpen(true)
                                        }}
                                        className="hover:bg-green-50 cursor-pointer"
                                      >
                                        <Edit className="w-4 h-4 mr-2 text-green-600" />
                                        <span className="font-medium">Update Status</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>

        </SheetTrigger>
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
                  {/* Avatar Upload Section */}
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        {imagePreview ? (
                          <AvatarImage src={imagePreview || "/placeholder.svg"} alt="Profile preview" />
                        ) : (
                          <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                            {getInitials(editUser?.name || auth?.name || "User")}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                              <Upload className="h-4 w-4" />
                              <span className="text-sm">Upload</span>
                            </div>
                          </Label>
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={removeImage}
                              className="px-3 py-2 bg-transparent"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 5MB)</p>
                      </div>
                    </div>
                  </div>

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

      {/* Modals */}
      {selectedEvent && (
        <>
          <EventStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false)
              setSelectedEvent(null)
            }}
            event={selectedEvent}
            onStatusUpdate={getAssignEvents}
          />



          <EventDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false)
              setSelectedEvent(null)
            }}
            event={selectedEvent}
            onEventUpdate={() => {
              // Refresh events after update
              if (auth && auth.createdBy && auth._id) {
                getAssignEvents(auth.createdBy, auth._id)
              }
            }}
          />
        </>
      )}
    </div>
  )
}
