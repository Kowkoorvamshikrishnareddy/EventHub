//  "use client"

// import type React from "react"
// import { useState, useCallback, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Skeleton } from "@/components/ui/skeleton"

// import {
//   Search,
//   CheckCircle,
//   Clock,
//   User,
//   CreditCard,
//   Calendar,
//   AlertCircle,
//   Loader2,
//   Copy,
//   Mail,
//   Shield,
//   UserCheck,
//   UserX,
//   Lock,
// } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// // Types
// interface BookingData {
//   entrycode: string
//   ordername: string
//   monthName: string
//   status: string // This is for payment status
//   attendanceStatus: string // This is for attendance status
//   role: string
//   username: string
//   email: string
//   amount: number
//   currency: string
//   orderId: string
//   paymentId: string
//   eventId?: string
//   userId?: string
//   success?: boolean
// }

// interface ApiResponse {
//   statuscode: number
//   data: BookingData
//   success: boolean
//   message?: string
// }

// interface DetailItem {
//   label: string
//   value: string | number
//   icon: React.ReactNode
//   type?: "text" | "badge" | "status" | "code" | "email" | "currency"
//   variant?: "default" | "secondary" | "outline" | "destructive"
// }

// import { useAuth } from "@/lib/auth/auth-provider"
// import { updateAttendence, getBookingDetailsByCheckinNo,getEvents } from "../ApiServices/ApiServices"

// export default function BookingDetailsTable() {
//   const [checkInNumber, setCheckInNumber] = useState("")
//   const [bookingData, setBookingData] = useState<BookingData | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const { auth } = useAuth()
//   const[allevents,setallevents]=useState([])

//   const validStatuses = ["pending", "attended", "not_attended"]

//   const formatAmount = useCallback((amount: number, currency: string): string => {
//     try {
//       return new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: currency || "USD",
//       }).format(amount)
//     } catch {
//       return `${currency || "USD"} ${amount}`
//     }
//   }, [])


//   useEffect(()=>{
//      if(auth){
//       getEvents(auth?._id).then((response) => {
//          console.log("res11",response)
//         if (response?.statuscode === 201 && response?.success) {
//           setallevents(response.data)
//         }
//       })
//      }
//   },[auth])

  

//   const copyToClipboard = useCallback(async (text: string, label: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast({
//         title: "Copied!",
//         description: `${label} copied to clipboard`,
//       })
//     } catch {
//       toast({
//         title: "Copy failed",
//         description: "Unable to copy to clipboard",
//         variant: "destructive",
//       })
//     }
//   }, [])

//   const validateCheckInNumber = (value: string): boolean => {
//     return /^[A-Z]{3}-\d{6}$/.test(value.trim())
//   }

//   // Function to update attendance status
//   const handleUpdateAttendenceStatus = async (eventId: string, status: string, userId: string) => {
//     try {
//       setStatusUpdateLoading(status)
//       const response = await updateAttendence(eventId, status, userId)

//       if (response.statuscode === 200 && response.success) {
//         // Update local booking data with new attendanceStatus
//         setBookingData((prev) => (prev ? { ...prev, attendanceStatus: status } : null))

//         setStatusUpdateLoading(null)
//         toast({
//           title: "Success",
//           description: `Attendance marked as ${status.replace("_", " ")} successfully`,
//         })
//       }
//     } catch (error) {
//       setStatusUpdateLoading(null)
//       toast({
//         title: "Error",
//         description: "Failed to update attendance status",
//         variant: "destructive",
//       })
//     }
//   }

//   const getBookingDetailsData = useCallback(async () => {
//     if (!checkInNumber.trim()) {
//       setError("Please enter a check-in number")
//       return
//     }

//     if (!validateCheckInNumber(checkInNumber)) {
//       setError("Please enter a valid check-in number (format: EVT-123456)")
//       return
//     }

//     if (!auth?._id) {
//       setError("Authentication required. Please log in.")
//       return
//     }

//     try {
//       setLoading(true)
//       setError(null)
//       setBookingData(null)

//       const response = await getBookingDetailsByCheckinNo(auth._id, checkInNumber.trim())

//       if (response.statuscode === 200 && response.success) {
//         setBookingData(response.data)
//         toast({
//           title: "Booking found!",
//           description: "Your booking details have been loaded successfully.",
//         })
//       } else {
//         setError(response.message || "Booking not found. Please check your check-in number and try again.")
//       }
//     } catch (err: any) {
//       const errorMessage =
//         err?.response?.data?.message || err?.message || "Failed to fetch booking details. Please try again."
//       setError(errorMessage)
//       toast({
//         title: "Search failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }, [checkInNumber, auth?._id])

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !loading) {
//       getBookingDetailsData()
//     }
//   }

//   const getStatusBadgeVariant = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "attended":
//         return "default" // Green
//       case "not_attended":
//         return "destructive" // Red
//       case "pending":
//         return "secondary" // Gray
//       default:
//         return "outline"
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "attended":
//         return <UserCheck className="h-3 w-3 mr-1" />
//       case "not_attended":
//         return <UserX className="h-3 w-3 mr-1" />
//       case "pending":
//         return <Clock className="h-3 w-3 mr-1" />
//       default:
//         return <CheckCircle className="h-3 w-3 mr-1" />
//     }
//   }

//   const basicDetails: DetailItem[] = [
//     {
//       label: "Entry Code",
//       value: bookingData?.entrycode || "",
//       icon: <Shield className="h-4 w-4" />,
//       type: "code",
//     },
//     {
//       label: "Event Name",
//       value: bookingData?.ordername || "",
//       icon: <Calendar className="h-4 w-4" />,
//     },
//     {
//       label: "Month",
//       value: bookingData?.monthName || "",
//       icon: <Clock className="h-4 w-4" />,
//     },
//     {
//       label: "Payment Status",
//       value: bookingData?.status || "",
//       icon: <CheckCircle className="h-4 w-4" />,
//       type: "status",
//     },
//     {
//       label: "Attendance Status",
//       value: bookingData?.attendanceStatus || "",
//       icon: <UserCheck className="h-4 w-4" />,
//       type: "status",
//     },
//     {
//       label: "Role",
//       value: bookingData?.role || "",
//       icon: <User className="h-4 w-4" />,
//       type: "badge",
//       variant: "outline",
//     },
//   ]

//   const userDetails: DetailItem[] = [
//     {
//       label: "Full Name",
//       value: bookingData?.username || "",
//       icon: <User className="h-4 w-4" />,
//     },
//     {
//       label: "Email Address",
//       value: bookingData?.email || "",
//       icon: <Mail className="h-4 w-4" />,
//       type: "email",
//     },
//   ]

//   const paymentDetails: DetailItem[] = [
//     {
//       label: "Amount",
//       value: bookingData ? formatAmount(bookingData.amount, bookingData.currency) : "",
//       icon: <CreditCard className="h-4 w-4" />,
//       type: "currency",
//     },
//     {
//       label: "Currency",
//       value: bookingData?.currency || "",
//       icon: <CreditCard className="h-4 w-4" />,
//       type: "badge",
//     },
//     {
//       label: "Order ID",
//       value: bookingData?.orderId || "",
//       icon: <CreditCard className="h-4 w-4" />,
//       type: "code",
//     },
//     {
//       label: "Payment ID",
//       value: bookingData?.paymentId || "",
//       icon: <CreditCard className="h-4 w-4" />,
//       type: "code",
//     },
//     {
//       label: "Payment Status",
//       value: bookingData?.status || "",
//       icon: <CheckCircle className="h-4 w-4" />,
//       type: "status",
//     },
//   ]

//   const renderTableCell = (detail: DetailItem) => {
//     const { value, type, variant = "default" } = detail

//     if (!value) return <span className="text-muted-foreground">-</span>

//     switch (type) {
//       case "code":
//         return (
//           <div className="flex items-center gap-2">
//             <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{value}</code>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => copyToClipboard(value.toString(), detail.label)}
//               className="h-6 w-6 p-0"
//             >
//               <Copy className="h-3 w-3" />
//             </Button>
//           </div>
//         )
//       case "email":
//         return (
//           <a href={`mailto:${value}`} className="text-primary hover:underline flex items-center gap-1">
//             {value}
//           </a>
//         )
//       case "status":
//         return (
//           <Badge variant={getStatusBadgeVariant(value.toString())} className="capitalize">
//             {getStatusIcon(value.toString())}
//             {value.toString().replace("_", " ")}
//           </Badge>
//         )
//       case "badge":
//         return (
//           <Badge variant={variant as any} className="capitalize">
//             {value}
//           </Badge>
//         )
//       case "currency":
//         return <span className="text-2xl font-bold text-green-600">{value}</span>
//       default:
//         return <span className="font-medium">{value}</span>
//     }
//   }

//   const renderTable = (details: DetailItem[], title: string, description: string, icon: React.ReactNode) => (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           {icon}
//           {title}
//         </CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[200px]">Field</TableHead>
//               <TableHead>Value</TableHead>
//               <TableHead className="w-[100px]">Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {details.map((detail, index) => (
//               <TableRow key={index}>
//                 <TableCell className="font-medium">
//                   <div className="flex items-center gap-2">
//                     {detail.icon}
//                     {detail.label}
//                   </div>
//                 </TableCell>
//                 <TableCell>{renderTableCell(detail)}</TableCell>
//                 <TableCell>
//                   <CheckCircle className="h-4 w-4 text-green-500" />
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )

//   const renderLoadingSkeleton = () => (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <Skeleton className="h-6 w-48" />
//           <Skeleton className="h-4 w-64" />
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="flex justify-between items-center">
//                 <Skeleton className="h-4 w-32" />
//                 <Skeleton className="h-4 w-48" />
//                 <Skeleton className="h-4 w-4 rounded-full" />
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   // Attendance Status Buttons Component
//   const AttendanceButtons = () => {
//     if (!bookingData) return null

//     const currentAttendanceStatus = (bookingData.attendanceStatus || "pending").toLowerCase()
//     const isAttended = currentAttendanceStatus === "attended"
//     const isNotAttended = currentAttendanceStatus === "not_attended"
//     const isPending = currentAttendanceStatus === "pending"

//     // Check if attendance status is final (attended or not_attended)
//     const isFinalAttendanceStatus = isAttended || isNotAttended
//     const isUpdating = statusUpdateLoading !== null

//     return (
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <UserCheck className="h-5 w-5" />
//             Attendance Status
//             {isFinalAttendanceStatus && <Lock className="h-4 w-4 text-muted-foreground ml-2" />}
//           </CardTitle>
//           <CardDescription>
//             {isFinalAttendanceStatus
//               ? "Attendance status has been finalized and cannot be changed"
//               : "Mark the attendance status for this booking"}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {/* Current Attendance Status Display */}
//           <div className="mb-6 p-4 bg-muted rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground mb-1">Current Attendance Status:</p>
//                 <Badge variant={getStatusBadgeVariant(currentAttendanceStatus)} className="capitalize text-sm">
//                   {getStatusIcon(currentAttendanceStatus)}
//                   {currentAttendanceStatus.replace("_", " ")}
//                 </Badge>
//               </div>
//               {isFinalAttendanceStatus && (
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <Lock className="h-4 w-4" />
//                   <span>Status Locked</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons - Only show if attendance status is pending */}
//           {isPending && (
//             <div className="space-y-4">
//               <div className="flex gap-4">
//                 <Button
//                   onClick={() =>
//                     handleUpdateAttendenceStatus(bookingData?.eventId || "", "attended", bookingData?.userId || "")
//                   }
//                   disabled={isUpdating}
//                   variant="default"
//                   className="flex-1 bg-green-600 hover:bg-green-700"
//                 >
//                   {statusUpdateLoading === "attended" ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Marking as Attended...
//                     </>
//                   ) : (
//                     <>
//                       <UserCheck className="mr-2 h-4 w-4" />
//                       Mark as Attended
//                     </>
//                   )}
//                 </Button>

//                 <Button
//                   onClick={() =>
//                     handleUpdateAttendenceStatus(bookingData?.eventId || "", "not_attended", bookingData?.userId || "")
//                   }
//                   disabled={isUpdating}
//                   variant="destructive"
//                   className="flex-1"
//                 >
//                   {statusUpdateLoading === "not_attended" ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Marking as Not Attended...
//                     </>
//                   ) : (
//                     <>
//                       <UserX className="mr-2 h-4 w-4" />
//                       Mark as Not Attended
//                     </>
//                   )}
//                 </Button>
//               </div>

//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   <strong>Warning:</strong> Once you mark the attendance status, it cannot be changed later.
//                 </AlertDescription>
//               </Alert>
//             </div>
//           )}

//           {/* Final Attendance Status Message */}
//           {isFinalAttendanceStatus && (
//             <Alert className={isAttended ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
//               <CheckCircle className="h-4 w-4" />
//               <AlertDescription>
//                 <strong>Attendance Finalized:</strong> This booking has been marked as{" "}
//                 <span className="font-semibold">{currentAttendanceStatus.replace("_", " ")}</span> and cannot be
//                 modified.
//               </AlertDescription>
//             </Alert>
//           )}
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="w-full max-w-6xl mx-auto space-y-6">
//         {/* Search Form */}
//         <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
//           <CardHeader className="text-center pb-4">
//             <CardTitle className="text-2xl font-bold text-gray-800">Find Your Booking</CardTitle>
//             <CardDescription className="text-gray-600">
//               Enter your check-in number to view booking details
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="checkin" className="text-sm font-semibold">
//                 Check-in Number
//               </Label>
//               <Input
//                 id="checkin"
//                 placeholder="e.g., EVT-440874"
//                 value={checkInNumber}
//                 onChange={(e) => {
//                   setCheckInNumber(e.target.value.toUpperCase())
//                   setError(null)
//                 }}
//                 onKeyPress={handleKeyPress}
//                 className="h-12 text-lg"
//                 disabled={loading}
//                 aria-describedby={error ? "error-message" : undefined}
//               />
//               {error && (
//                 <Alert variant="destructive" id="error-message">
//                   <AlertCircle className="h-4 w-4" />
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               )}
//             </div>
//             <Button
//               onClick={getBookingDetailsData}
//               className="w-full h-12 text-base font-semibold"
//               disabled={loading || !checkInNumber.trim()}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Searching...
//                 </>
//               ) : (
//                 <>
//                   <Search className="mr-2 h-4 w-4" />
//                   Search Booking
//                 </>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Loading State */}
//         {loading && renderLoadingSkeleton()}

//         {/* Booking Details */}
//         {bookingData && !loading && (
//           <div className="space-y-6">
//             {/* Attendance Status Buttons */}
//             <AttendanceButtons />

//             <Tabs defaultValue="overview" className="w-full">
//               <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
//                 <TabsTrigger
//                   value="overview"
//                   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//                 >
//                   Overview
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="user"
//                   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//                 >
//                   User Info
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="payment"
//                   className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//                 >
//                   Payment
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="overview">
//                 {renderTable(
//                   basicDetails,
//                   "Booking Overview",
//                   "Essential booking information and status",
//                   <Calendar className="h-5 w-5" />,
//                 )}
//               </TabsContent>

//               <TabsContent value="user">
//                 {renderTable(
//                   userDetails,
//                   "User Information",
//                   "Personal and identification details",
//                   <User className="h-5 w-5" />,
//                 )}
//               </TabsContent>

//               <TabsContent value="payment">
//                 {renderTable(
//                   paymentDetails,
//                   "Payment Information",
//                   "Transaction and payment details",
//                   <CreditCard className="h-5 w-5" />,
//                 )}
//               </TabsContent>
//             </Tabs>
//           </div>
//         )}

//         {/* No Results */}
//         {!loading && checkInNumber && !bookingData && error && (
//           <Card className="text-center py-12 shadow-lg">
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//                   <Search className="h-8 w-8 text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">No Booking Found</h3>
//                   <p className="text-gray-500 mt-2 max-w-md mx-auto">{error}</p>
//                   <p className="text-sm text-gray-400 mt-1">Please verify your check-in number and try again.</p>
//                 </div>
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setCheckInNumber("")
//                     setError(null)
//                   }}
//                   className="mt-4"
//                 >
//                   Try Again
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }






"use client"

import type React from "react"
import { useState, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  CheckCircle,
  Clock,
  User,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  Copy,
  Mail,
  Shield,
  UserCheck,
  UserX,
  Lock,
  Info,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Types
interface BookingData {
  entrycode: string
  ordername: string
  monthName: string
  status: string // This is for payment status
  attendanceStatus: string // This is for attendance status
  role: string
  username: string
  email: string
  amount: number
  currency: string
  orderId: string
  paymentId: string
  eventId?: string
  userId?: string
  success?: boolean
}

interface EventData {
  _id: string
  Event_title: string
  Description: string
  Date: string
  Time: string
  location: string
  Price: number
  attendanceStatus: string
  attendee: any[]
  eventstatus: string
  status: string
  Category: {
    _id: string
    Category_name: string
    createdBy: string
    __v: number
  }
  createdBy: {
    _id: string
    name: string
    email: string
    phone: string
    address: string
  }
  image: string
  organizer: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  statuscode: number
  data: BookingData
  success: boolean
  message?: string
}

interface DetailItem {
  label: string
  value: string | number
  icon: React.ReactNode
  type?: "text" | "badge" | "status" | "code" | "email" | "currency"
  variant?: "default" | "secondary" | "outline" | "destructive"
}

import { useAuth } from "@/lib/auth/auth-provider"
import { updateAttendence, getBookingDetailsByCheckinNo, getEvents } from "../ApiServices/ApiServices"

export default function BookingDetailsTable() {
  const [checkInNumber, setCheckInNumber] = useState("")
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { auth } = useAuth()
  const [allevents, setallevents] = useState<EventData[]>([])

  const validStatuses = ["pending", "attended", "not_attended"]

  const formatAmount = useCallback((amount: number, currency: string): string => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount)
    } catch {
      return `${currency || "USD"} ${amount}`
    }
  }, [])

  useEffect(() => {
    if (auth) {
      getEvents(auth?._id).then((response) => {
        console.log("Events response:", response)
        if (response?.statuscode === 201 && response?.success) {
          setallevents(response.data)
        }
      })
    }
  }, [auth])

  // Find the corresponding event for the current booking
  const currentEvent = useMemo(() => {
    if (!bookingData || !allevents.length) return null

    // Try to match by event ID first
    if (bookingData.eventId) {
      const eventById = allevents.find((event) => event._id === bookingData.eventId)
      if (eventById) return eventById
    }

    // Fallback: try to match by event title/name
    const eventByName = allevents.find(
      (event) =>
        event.Event_title.toLowerCase().includes(bookingData.ordername.toLowerCase()) ||
        bookingData.ordername.toLowerCase().includes(event.Event_title.toLowerCase()),
    )

    return eventByName || null
  }, [bookingData, allevents])

  // Get the actual attendance status from the event data
  const actualAttendanceStatus = useMemo(() => {
    if (!currentEvent) return bookingData?.attendanceStatus || "pending"

    // Check if the user is in the attendee list with attended status
    const userAttendee = currentEvent.attendee?.find(
      (attendee) => attendee.userId === bookingData?.userId || attendee.email === bookingData?.email,
    )

    if (userAttendee && userAttendee.attendanceStatus) {
      return userAttendee.attendanceStatus
    }

    // Fallback to event's general attendance status
    return currentEvent.attendanceStatus || bookingData?.attendanceStatus || "pending"
  }, [currentEvent, bookingData])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }, [])

  const validateCheckInNumber = (value: string): boolean => {
    return /^[A-Z]{3}-\d{6}$/.test(value.trim())
  }

  // Function to update attendance status
  const handleUpdateAttendenceStatus = async (eventId: string, status: string, userId: string) => {
    try {
      setStatusUpdateLoading(status)
      const response = await updateAttendence(eventId, status, userId)
      if (response.statuscode === 200 && response.success) {
        // Update local booking data with new attendanceStatus
        setBookingData((prev) => (prev ? { ...prev, attendanceStatus: status } : null))

        // Refresh events data to get updated attendance status
        if (auth) {
          const eventsResponse = await getEvents(auth._id)
          if (eventsResponse?.statuscode === 201 && eventsResponse?.success) {
            setallevents(eventsResponse.data)
          }
        }

        setStatusUpdateLoading(null)
        toast({
          title: "Success",
          description: `Attendance marked as ${status.replace("_", " ")} successfully`,
        })
      }
    } catch (error) {
      setStatusUpdateLoading(null)
      toast({
        title: "Error",
        description: "Failed to update attendance status",
        variant: "destructive",
      })
    }
  }

  const getBookingDetailsData = useCallback(async () => {
    if (!checkInNumber.trim()) {
      setError("Please enter a check-in number")
      return
    }
    if (!validateCheckInNumber(checkInNumber)) {
      setError("Please enter a valid check-in number (format: EVT-123456)")
      return
    }
    if (!auth?._id) {
      setError("Authentication required. Please log in.")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setBookingData(null)
      const response = await getBookingDetailsByCheckinNo(auth._id, checkInNumber.trim())
      if (response.statuscode === 200 && response.success) {
        setBookingData(response.data)
        toast({
          title: "Booking found!",
          description: "Your booking details have been loaded successfully.",
        })
      } else {
        setError(response.message || "Booking not found. Please check your check-in number and try again.")
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || "Failed to fetch booking details. Please try again."
      setError(errorMessage)
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [checkInNumber, auth?._id])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      getBookingDetailsData()
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "attended":
        return "default" // Green
      case "not_attended":
        return "destructive" // Red
      case "pending":
        return "secondary" // Gray
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "attended":
        return <UserCheck className="h-3 w-3 mr-1" />
      case "not_attended":
        return <UserX className="h-3 w-3 mr-1" />
      case "pending":
        return <Clock className="h-3 w-3 mr-1" />
      default:
        return <CheckCircle className="h-3 w-3 mr-1" />
    }
  }

  const basicDetails: DetailItem[] = [
    {
      label: "Entry Code",
      value: bookingData?.entrycode || "",
      icon: <Shield className="h-4 w-4" />,
      type: "code",
    },
    {
      label: "Event Name",
      value: bookingData?.ordername || "",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "Month",
      value: bookingData?.monthName || "",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Payment Status",
      value: bookingData?.status || "",
      icon: <CheckCircle className="h-4 w-4" />,
      type: "status",
    },
    {
      label: "Attendance Status",
      value: actualAttendanceStatus,
      icon: <UserCheck className="h-4 w-4" />,
      type: "status",
    },
    {
      label: "Role",
      value: bookingData?.role || "",
      icon: <User className="h-4 w-4" />,
      type: "badge",
      variant: "outline",
    },
  ]

  const userDetails: DetailItem[] = [
    {
      label: "Full Name",
      value: bookingData?.username || "",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Email Address",
      value: bookingData?.email || "",
      icon: <Mail className="h-4 w-4" />,
      type: "email",
    },
  ]

  const paymentDetails: DetailItem[] = [
    {
      label: "Amount",
      value: bookingData ? formatAmount(bookingData.amount, bookingData.currency) : "",
      icon: <CreditCard className="h-4 w-4" />,
      type: "currency",
    },
    {
      label: "Currency",
      value: bookingData?.currency || "",
      icon: <CreditCard className="h-4 w-4" />,
      type: "badge",
    },
    {
      label: "Order ID",
      value: bookingData?.orderId || "",
      icon: <CreditCard className="h-4 w-4" />,
      type: "code",
    },
    {
      label: "Payment ID",
      value: bookingData?.paymentId || "",
      icon: <CreditCard className="h-4 w-4" />,
      type: "code",
    },
    {
      label: "Payment Status",
      value: bookingData?.status || "",
      icon: <CheckCircle className="h-4 w-4" />,
      type: "status",
    },
  ]

  const renderTableCell = (detail: DetailItem) => {
    const { value, type, variant = "default" } = detail
    if (!value) return <span className="text-muted-foreground">-</span>

    switch (type) {
      case "code":
        return (
          <div className="flex items-center gap-2">
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{value}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(value.toString(), detail.label)}
              className="h-6 w-6 p-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )
      case "email":
        return (
          <a href={`mailto:${value}`} className="text-primary hover:underline flex items-center gap-1">
            {value}
          </a>
        )
      case "status":
        return (
          <Badge variant={getStatusBadgeVariant(value.toString())} className="capitalize">
            {getStatusIcon(value.toString())}
            {value.toString().replace("_", " ")}
          </Badge>
        )
      case "badge":
        return (
          <Badge variant={variant as any} className="capitalize">
            {value}
          </Badge>
        )
      case "currency":
        return <span className="text-2xl font-bold text-green-600">{value}</span>
      default:
        return <span className="font-medium">{value}</span>
    }
  }

  const renderTable = (details: DetailItem[], title: string, description: string, icon: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Field</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {detail.icon}
                    {detail.label}
                  </div>
                </TableCell>
                <TableCell>{renderTableCell(detail)}</TableCell>
                <TableCell>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Event Information Card
  const EventInfoCard = () => {
    if (!currentEvent) return null

    return (
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Event Information
          </CardTitle>
          <CardDescription className="text-blue-600">
            Details about the event associated with this booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Event Title:</p>
              <p className="text-blue-900 font-semibold">{currentEvent.Event_title}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Category:</p>
              <Badge variant="outline" className="text-blue-800 border-blue-300">
                {currentEvent.Category.Category_name}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Date & Time:</p>
              <p className="text-blue-900">
                {new Date(currentEvent.Date).toLocaleDateString()} at {currentEvent.Time}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Location:</p>
              <p className="text-blue-900">{currentEvent.location}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Event Status:</p>
              <Badge variant={currentEvent.eventstatus === "Upcoming" ? "secondary" : "default"}>
                {currentEvent.eventstatus}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-700">Total Attendees:</p>
              <p className="text-blue-900">{currentEvent.attendee?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Attendance Status Buttons Component
  const AttendanceButtons = () => {
    if (!bookingData) return null

    const currentAttendanceStatus = actualAttendanceStatus.toLowerCase()
    const isAttended = currentAttendanceStatus === "attended"
    const isNotAttended = currentAttendanceStatus === "not_attended"
    const isPending = currentAttendanceStatus === "pending"

    // Check if attendance status is final (attended or not_attended)
    const isFinalAttendanceStatus = isAttended || isNotAttended
    const isUpdating = statusUpdateLoading !== null

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Attendance Status Management
            {isFinalAttendanceStatus && <Lock className="h-4 w-4 text-muted-foreground ml-2" />}
          </CardTitle>
          <CardDescription>
            {isFinalAttendanceStatus
              ? "Attendance status has been finalized and cannot be changed"
              : "Mark the attendance status for this booking"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Attendance Status Display */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Current Attendance Status:</p>
                <Badge variant={getStatusBadgeVariant(currentAttendanceStatus)} className="capitalize text-sm">
                  {getStatusIcon(currentAttendanceStatus)}
                  {currentAttendanceStatus.replace("_", " ")}
                </Badge>
                {currentEvent && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Status synced with event: {currentEvent.Event_title}
                  </p>
                )}
              </div>
              {isFinalAttendanceStatus && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Status Locked</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons - Only show if attendance status is pending */}
          {isPending && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    handleUpdateAttendenceStatus(
                      currentEvent?._id || bookingData?.eventId || "",
                      "attended",
                      bookingData?.userId || "",
                    )
                  }
                  disabled={isUpdating}
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {statusUpdateLoading === "attended" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Marking as Attended...
                    </>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Mark as Attended
                    </>
                  )}
                </Button>
                <Button
                  onClick={() =>
                    handleUpdateAttendenceStatus(
                      currentEvent?._id || bookingData?.eventId || "",
                      "not_attended",
                      bookingData?.userId || "",
                    )
                  }
                  disabled={isUpdating}
                  variant="destructive"
                  className="flex-1"
                >
                  {statusUpdateLoading === "not_attended" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Marking as Not Attended...
                    </>
                  ) : (
                    <>
                      <UserX className="mr-2 h-4 w-4" />
                      Mark as Not Attended
                    </>
                  )}
                </Button>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Once you mark the attendance status, it cannot be changed later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Final Attendance Status Message */}
          {isFinalAttendanceStatus && (
            <Alert className={isAttended ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Attendance Finalized:</strong> This booking has been marked as{" "}
                <span className="font-semibold">{currentAttendanceStatus.replace("_", " ")}</span> and cannot be
                modified. This status was previously set and is now locked.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Search Form */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Find Your Booking</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your check-in number to view booking details and attendance status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkin" className="text-sm font-semibold">
                Check-in Number
              </Label>
              <Input
                id="checkin"
                placeholder="e.g., EVT-440874"
                value={checkInNumber}
                onChange={(e) => {
                  setCheckInNumber(e.target.value.toUpperCase())
                  setError(null)
                }}
                onKeyPress={handleKeyPress}
                className="h-12 text-lg"
                disabled={loading}
                aria-describedby={error ? "error-message" : undefined}
              />
              {error && (
                <Alert variant="destructive" id="error-message">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              onClick={getBookingDetailsData}
              className="w-full h-12 text-base font-semibold"
              disabled={loading || !checkInNumber.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Booking
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && renderLoadingSkeleton()}

        {/* Booking Details */}
        {bookingData && !loading && (
          <div className="space-y-6">
            {/* Event Information */}
            <EventInfoCard />

            {/* Attendance Status Buttons */}
            <AttendanceButtons />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="user"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  User Info
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Payment
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {renderTable(
                  basicDetails,
                  "Booking Overview",
                  "Essential booking information and current status",
                  <Calendar className="h-5 w-5" />,
                )}
              </TabsContent>

              <TabsContent value="user">
                {renderTable(
                  userDetails,
                  "User Information",
                  "Personal and identification details",
                  <User className="h-5 w-5" />,
                )}
              </TabsContent>

              <TabsContent value="payment">
                {renderTable(
                  paymentDetails,
                  "Payment Information",
                  "Transaction and payment details",
                  <CreditCard className="h-5 w-5" />,
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* No Results */}
        {!loading && checkInNumber && !bookingData && error && (
          <Card className="text-center py-12 shadow-lg">
            <CardContent>
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No Booking Found</h3>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">{error}</p>
                  <p className="text-sm text-gray-400 mt-1">Please verify your check-in number and try again.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCheckInNumber("")
                    setError(null)
                  }}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

