 

"use client"
import { use, useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Mail, MapPin, Phone, Shield, Lock, Eye, EyeOff, Loader2, Upload, X } from "lucide-react"
import { EditUsers } from "../ApiServices/ApiServices"
import { useAuth } from "@/lib/auth/auth-provider"
import { useEffect } from "react"
import { useToast } from "../ui/use-toast"

export default function UserProfile() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loader, setLoader] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [editUser, setEditUser] = useState({})
  const { toast } = useToast()
  const { auth, refreshUser } = useAuth()
  const[avatarImage,setAvatarImage] = useState(null)

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
      setImagePreview(auth.image || null)
    }
  }, [auth])



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditUser({
      ...editUser,
      [name]: value,
    })
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "organizer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    return status.toLowerCase() === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200"
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

  
    


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
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
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 rounded-none">
  {auth?.image ? (
    <AvatarImage
      src={auth.image || "/placeholder.svg"}
      alt={auth.name}
      className="rounded-none"
    />
  ) : (
    <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-600 rounded-none">
      {getInitials(auth?.name)}
    </AvatarFallback>
  )}
</Avatar>

              <div className="space-y-2">
                <CardTitle className="text-2xl">{auth?.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleColor(auth?.role)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {auth?.role.charAt(0).toUpperCase() + auth?.role.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(auth?.status)}>{auth?.status}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <span>{auth?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{auth?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{auth?.address}</span>
                  </div>
                </div>
              </div>
              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{auth?.role == "admin" ? "" : "Membership"}</span>
                    <Badge variant="outline">
                      {auth?.role == "admin"
                        ? ""
                        : auth?.membershipType.charAt(0).toUpperCase() + auth?.membershipType.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-sm">{formatDate(auth?.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="text-sm">{formatDate(auth?.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
