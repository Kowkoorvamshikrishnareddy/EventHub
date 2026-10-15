
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Mail, Phone, MapPin, Clock, Filter, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
 
import { getAllEnquiry, updateEnquiryStatus } from "../ApiServices/ApiServices"
import { useAuth } from "@/lib/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


interface Enquiry {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  __v: number
}

type EnquiryStatus = "pending" | "accepted" | "rejected"

export default function EnquiryTable() {
  const [enquiries, setEnquiries] = useState<(Enquiry & { status: EnquiryStatus })[]>([])
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const { auth } = useAuth()
  const [enquiryStatusFormData, setEnquiryStatusFormData] = useState({
    enquiryId: "",
    status: "",
    reason: "",
  })
  const { toast } = useToast()
  const [loader, setLoader] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true) // New state for initial loading

  const handleActions = async (id: string, action: "accept" | "reject", reason?: string) => {
    setLoader(true)
    try {
      const response: any = await updateEnquiryStatus({
        enquiryId: id,
        status: action === "accept" ? "accepted" : "rejected",
        reason: reason,
      })
      if (response?.statuscode == 200) {
        setEnquiries((prev) =>
          prev.map((enquiry) =>
            enquiry._id === id ? { ...enquiry, status: action === "accept" ? "accepted" : "rejected" } : enquiry,
          ),
        )
        toast({
          title: "Success",
          description: response?.message || "Enquiry status updated successfully",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error updating enquiry status:", error)
      toast({
        title: "Error",
        description: "Failed to update enquiry status",
        variant: "destructive",
      })
    } finally {
      setLoader(false)
      setIsRejectDialogOpen(false)  
      setEnquiryStatusFormData({ enquiryId: "", status: "", reason: "" })  
    }
  }

  const handleRejectClick = (id: string) => {
    setEnquiryStatusFormData({ enquiryId: id, status: "rejected", reason: "" })
    setIsRejectDialogOpen(true)
  }

  const handleRejectConfirm = () => {
    if (enquiryStatusFormData.enquiryId && enquiryStatusFormData.reason) {
      handleActions(enquiryStatusFormData.enquiryId, "rejected", enquiryStatusFormData.reason)
    } else {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const getEnquiry = async () => {
      setIsLoadingInitial(true)
      try {
        const response: any = await getAllEnquiry()
        if (response?.statuscode == 200) {
          // Ensure each enquiry has a status, default to 'pending' if not present
          setEnquiries(response?.data)
        }
      } catch (error) {
        console.error("Error fetching enquiries:", error)
        toast({
          title: "Error",
          description: "Failed to fetch enquiries.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingInitial(false)
      }
    }
    if (auth) {
      getEnquiry()
    }
  }, [auth, toast])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: EnquiryStatus) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const filteredEnquiries = filter === "all" ? enquiries : enquiries.filter((enquiry) => enquiry.status === filter)
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage)
  const goToPage = (page: number) => {
    setCurrentPage(page)
  }
  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }
  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }
  const stats = {
    total: enquiries.length,
    pending: enquiries.filter((e) => e.status === "pending").length,
    accepted: enquiries.filter((e) => e.status === "accepted").length,
    rejected: enquiries.filter((e) => e.status === "rejected").length,
  }
  const handleFilterChange = (newFilter: EnquiryStatus | "all") => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Enquiries</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-white">{stats.pending}</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Accepted</p>
                  <p className="text-3xl font-bold text-white">{stats.accepted}</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Check className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Rejected</p>
                  <p className="text-3xl font-bold text-white">{stats.rejected}</p>
                </div>
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <X className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => handleFilterChange("all")}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            All ({stats.total})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            onClick={() => handleFilterChange("pending")}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Pending ({stats.pending})
          </Button>
          <Button
            variant={filter === "accepted" ? "default" : "outline"}
            onClick={() => handleFilterChange("accepted")}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Accepted ({stats.accepted})
          </Button>
          <Button
            variant={filter === "rejected" ? "default" : "outline"}
            onClick={() => handleFilterChange("rejected")}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Rejected ({stats.rejected})
          </Button>
        </div>
        {/* Enquiries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedEnquiries.map((enquiry) => (
            <Card key={enquiry._id} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48&query=${enquiry.name}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getInitials(enquiry.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{enquiry.name}</CardTitle>
                      <Badge variant="outline" className={cn("mt-1 capitalize", getStatusColor(enquiry.status))}>
                        {enquiry.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm break-all">{enquiry.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{enquiry.phone}</span>
                  </div>
                  <div className="flex items-start space-x-3 text-gray-600">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{enquiry.address}</span>
                  </div>
                </div>
                {enquiry.status === "pending" && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => handleActions(enquiry._id, "accept")}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={loader}
                    >
                      {loader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleRejectClick(enquiry._id)}
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      disabled={loader}
                    >
                      {loader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                      Reject
                    </Button>
                  </div>
                )}
                {enquiry.status !== "pending" && (
                  <div className="pt-4 border-t">
                    <div
                      className={cn(
                        "text-center py-2 px-4 rounded-lg text-sm font-medium",
                        enquiry.status === "accepted"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200",
                      )}
                    >
                      {enquiry.status === "accepted" ? "✓ Enquiry Accepted" : "✗ Enquiry Rejected"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentPage === 1 || loader}
              className="px-3 py-2 bg-transparent"
            >
              Previous
            </Button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => goToPage(page)}
                  className="px-3 py-2 min-w-[40px]"
                  disabled={loader}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={goToNext}
              disabled={currentPage === totalPages || loader}
              className="px-3 py-2 bg-transparent"
            >
              Next
            </Button>
          </div>
        )}
        {/* Pagination Info */}
        {filteredEnquiries.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of{" "}
            {filteredEnquiries.length} enquiries
          </div>
        )}
        {paginatedEnquiries.length === 0 && (
          <div className="text-center py-12">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries found</h3>
            <p className="text-gray-500">
              {filter === "all" ? "No enquiries available at the moment." : `No ${filter} enquiries found.`}
            </p>
          </div>
        )}
      </div>

      {/* Reject Reason Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Enquiry</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this enquiry. This will be recorded.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Not within service area, Duplicate enquiry, etc."
                value={enquiryStatusFormData.reason}
                onChange={(e) => setEnquiryStatusFormData((prev) => ({ ...prev, reason: e.target.value }))}
                rows={4}
                disabled={loader}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={loader}>
              Cancel
            </Button>
            <Button onClick={handleRejectConfirm} disabled={loader || !enquiryStatusFormData.reason.trim()}>
              {loader ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}