
"use client"

import { useState } from "react"
import type React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import OtpModel from "../Otp/Otp"
import ForgetPasswordModal from "../forgetpassword/forgetPassword"
import { useToast } from "@/components/ui/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setloginformdata, resetFormData, setFormData, registerUserThunk } from "../ReduxSlices/UserSlice"
import { Camera, Loader2, Upload, UserPlus, X } from 'lucide-react'
import { loginUserThunk } from "../ReduxSlices/UserSlice"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginForm() {
  const { loginformdata, loading } = useAppSelector((state) => state.user)
  const [openotpModel, setopenotpModel] = useState(false)
  const { loading: isRegisterLoding, formdata } = useAppSelector((state) => state.user)
  const [openforgetPasswordModal, setopenforgetPasswordModal] = useState(false)
  const [showAttendeeSignup, setShowAttendeeSignup] = useState(false)
  const dispatch = useAppDispatch()
  const { toast } = useToast()
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
      const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: loginformdata.email,
      password: loginformdata.password,
    },
  })

  const handleloginFormChange = (field: string, value: string) => {
    form.setValue(field, value)
    dispatch(setloginformdata({ [field]: value }))
  }

  const handleChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(
      setFormData({
        ...formdata,
        [name]: value,
        role: "admin",
      }),
    )
  }

  const handleAttendeeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(
      setFormData({
        ...formdata,
        [name]: value,
        role: "attendee",
        membershipType: "outer",
      }),
    )
  }

  

  const handleCreateAdmin = async () => {
    const fd = new FormData();
    fd.append("file", avatarFile);  
  
    
    Object.entries(formdata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, value as string);
      }
    });
  
    const response: any = await dispatch(registerUserThunk(fd));
  
    if (
      response.type === "user/registerUserThunk/fulfilled" &&
      response.payload?.statuscode === 201
    ) {
      toast({
        title: "Success",
        description:
          response.payload.message || "User created successfully",
      });
      dispatch(resetFormData());
    } else {
      toast({
        title: "Error",
        description: response.payload || "Failed to create user",
        variant: "destructive",
      });
    }
  };

 


   const handleCreateAttendee = async () => {
    const fd = new FormData();
    fd.append("file", avatarFile);  
    fd.append("role", "attendee");
    fd.append("membershipType", "outer");
     
    Object.entries(formdata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, value as string);
      }
    });
  
    const response: any = await dispatch(registerUserThunk(fd));
  
    if (
      response.type === "user/registerUserThunk/fulfilled" &&
      response.payload?.statuscode === 201
    ) {
      toast({
        title: "Success",
        description:
          response.payload.message || "User created successfully",
      });
      dispatch(resetFormData());
    } else {
      toast({
        title: "Error",
        description: response.payload || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const HandleCloseOtpModel = () => {
    setopenotpModel(false)
  }

  const HandleCloseForgetPasswordModel = () => {
    setopenforgetPasswordModal(false)
  }


  
  const onSubmit = async (data: FormValues) => {
    try {
      const res = await dispatch(loginUserThunk(data)).unwrap()
      if (res?.statuscode === 200) {
        toast({
          title: "OTP Sent Successfully",
          description: res?.message || "An OTP has been sent to your email. Please verify to continue.",
        })
        localStorage.setItem("user", JSON.stringify(res?.data))
        setopenotpModel(true)
        dispatch(resetFormData())
      }
    } catch (error: any) {
      console.log("error", error)
      setopenotpModel(false)
      toast({
        title: "Error",
        description: error || "Something went wrong during login.",
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


   const clearAvatarPreview = () => {
    setAvatarPreview(null)
    setAvatarFile(null)
  }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setAvatarFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }



  return (
    <>
      {openotpModel && <OtpModel openotpModel={openotpModel} HandleCloseOtpModel={HandleCloseOtpModel} />}
      {openforgetPasswordModal && (
        <ForgetPasswordModal
          openforgetPasswordModal={openforgetPasswordModal}
          HandleCloseForgetPasswordModel={HandleCloseForgetPasswordModel}
        />
      )}
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to EventHub</CardTitle>
          <CardDescription className="text-center">Login to your account or register</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Admin Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              {!showAttendeeSignup ? (
                <>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="your.email@example.com"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleloginFormChange("email", e.target.value)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="••••••••"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e)
                                  handleloginFormChange("password", e.target.value)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full flex justify-center items-center bg-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-1">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                          </div>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAttendeeSignup(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign up as Attendee
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Create Attendee Account</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAttendeeSignup(false)
                        dispatch(resetFormData())
                      }}
                    >
                      Back to Login
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                      <div className="grid gap-2">
                                           
                                          <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                              <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-blue-100">
                                                <AvatarImage src={avatarPreview || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                                  {formdata?.name ? getInitials(formdata.name) : <Camera className="h-8 w-8" />}
                                                </AvatarFallback>
                                              </Avatar>
                                              {avatarPreview && (
                                                <Button
                                                  type="button"
                                                  variant="destructive"
                                                  size="sm"
                                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                  onClick={clearAvatarPreview}
                                                >
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              )}
                                            </div>
                                            <div className="flex gap-2">
                                              <Label htmlFor="avatar-upload" className="cursor-pointer">
                                                <Button type="button" variant="outline" size="sm" asChild>
                                                  <span>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Photo
                                                  </span>
                                                </Button>
                                              </Label>
                                              <Input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                              />
                                            </div>
                                          </div>
                                        </div>
                    <div className="grid gap-2">
                      <Label htmlFor="attendee-name" className="font-poppins">
                        Full Name *
                      </Label>
                      <Input
                        id="attendee-name"
                        name="name"
                        value={formdata?.name || ""}
                        onChange={handleAttendeeFormChange}
                        placeholder="Enter full name"
                        className="font-inter"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="attendee-email" className="font-poppins">
                        Email Address *
                      </Label>
                      <Input
                        id="attendee-email"
                        name="email"
                        type="email"
                        value={formdata?.email || ""}
                        onChange={handleAttendeeFormChange}
                        placeholder="Enter email address"
                        className="font-inter"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="attendee-password" className="font-poppins">
                        Password *
                      </Label>
                      <Input
                        id="attendee-password"
                        name="password"
                        type="password"
                        value={formdata?.password || ""}
                        onChange={handleAttendeeFormChange}
                        placeholder="Enter password"
                        className="font-inter"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="attendee-phone" className="font-poppins">
                        Phone Number
                      </Label>
                      <Input
                        id="attendee-phone"
                        name="phone"
                        type="tel"
                        value={formdata?.phone || ""}
                        onChange={handleAttendeeFormChange}
                        placeholder="Enter phone number"
                        className="font-inter"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="attendee-address" className="font-poppins">
                        Address
                      </Label>
                      <Input
                        id="attendee-address"
                        name="address"
                        value={formdata?.address || ""}
                        onChange={handleAttendeeFormChange}
                        placeholder="Enter address"
                        className="font-inter"
                      />
                    </div>
                    
                  </div>
                  
                  <Button
                    onClick={handleCreateAttendee}
                    className="w-full"
                    disabled={
                      isRegisterLoding ||
                      !formdata?.name ||
                      !formdata?.email ||
                      !formdata?.password
                    }
                  >
                    {isRegisterLoding ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-4 w-4" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Attendee Account"
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-6">


                <div className="grid gap-2">
 
                                          <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                              <Avatar className="h-20 w-20 ring-2 ring-offset-2 ring-blue-100">
                                                <AvatarImage src={avatarPreview || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                                  {formdata?.name ? getInitials(formdata.name) : <Camera className="h-8 w-8" />}
                                                </AvatarFallback>
                                              </Avatar>
                                              {avatarPreview && (
                                                <Button
                                                  type="button"
                                                  variant="destructive"
                                                  size="sm"
                                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                  onClick={clearAvatarPreview}
                                                >
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              )}
                                            </div>
                                            <div className="flex gap-2">
                                              <Label htmlFor="avatar-upload" className="cursor-pointer">
                                                <Button type="button" variant="outline" size="sm" asChild>
                                                  <span>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Upload Photo
                                                  </span>
                                                </Button>
                                              </Label>
                                              <Input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                              />
                                            </div>
                                          </div>
                                        </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="font-poppins">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formdata?.name || ""}
                      onChange={(e) => handleChangeFormData(e)}
                      placeholder="Enter full name"
                      className="font-inter"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="register-email" className="font-poppins">
                      Email Address *
                    </Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      value={formdata?.email || ""}
                      onChange={(e) => handleChangeFormData(e)}
                      placeholder="Enter email address"
                      className="font-inter"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="register-password" className="font-poppins">
                      Password *
                    </Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      value={formdata?.password || ""}
                      onChange={(e) => handleChangeFormData(e)}
                      placeholder="Enter password"
                      className="font-inter"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address" className="font-poppins">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formdata?.address || ""}
                      onChange={(e) => handleChangeFormData(e)}
                      placeholder="Enter address"
                      className="font-inter"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="organization" className="font-poppins">
                      Organization *
                    </Label>
                    <Input
                      id="organization"
                      name="organization"
                      value={formdata?.organization || ""}
                      onChange={(e) => handleChangeFormData(e)}
                      placeholder="Enter organization name"
                      className="font-inter"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="font-poppins">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formdata?.phone || ""}
                      onChange={(e) => handleChangeFormData(e)}
                      placeholder="Enter phone number"
                      className="font-inter"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateAdmin}
                  className="w-full"
                  disabled={
                    isRegisterLoding ||
                    !formdata?.name ||
                    !formdata?.email ||
                    !formdata?.password ||
                    !formdata?.address ||
                    !formdata?.organization
                  }
                >
                  {isRegisterLoding ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Admin Account"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            <Link onClick={() => setopenforgetPasswordModal(true)} href="#" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}


