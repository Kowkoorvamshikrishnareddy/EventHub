
"use client"
import { useState, useEffect } from "react"
import { ArrowUpRight, Users, Calendar, IndianRupee, Award } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-provider"
import {
  getRevenue,
  getAllOrganizerAndAttendee,
  getEvents,
  getTopPayments,
  getMonthlyRevenue,
  getOrganizerDashboardstats,
  getAllEnquiry,
  getAdmincommitionfromorganizer
} from "../ApiServices/ApiServices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import MonthlyRevenueDashboard from "./monthlyRevenueChartWise"
import CommonLoader from "../commonloader/CommonLoader"


function AdminDashboardHome() {
  // Your original state variables
  const [totalrevenue, setTotalRevenue] = useState({})
  const [users, setUsers] = useState({})
  const [allevents, setAllEvents] = useState({})
  const [bestperformenceevent, setBestPerformenceEvent] = useState({})
  const [loading, setLoading] = useState(true)
  const [monthlyRevenue, setMonthlyRevenue] = useState({})
  const [getEnquiryData, setGetEnquiryData] = useState([])
  const [totalcommision, setTotalCommition] = useState({})



  const { auth } = useAuth()
  useEffect(() => {
    const handlegetpayment = async () => {
      try {
        const response = await getRevenue(auth?._id)
        if (response?.statuscode == 200) {
          setTotalRevenue(response?.data)
        }
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }

    const getDashboardearnings = async () => {
      try {
        const response = await getAdmincommitionfromorganizer(auth?._id)
        console.log("response", response)
        if (response) {
          setTotalCommition(response)
        }
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }

    const getUsers = async () => {
      try {
        const response = await getAllOrganizerAndAttendee(auth?._id)
        if (response?.statuscode == 200) {
          setUsers(response?.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    const getAllEvents = async () => {
      try {
        const response = await getEvents(auth?._id)
        if (response?.statuscode == 201) {
          setAllEvents(response?.data)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    const getBestPerformenceEvent = async () => {
      try {
        const response = await getTopPayments(auth?._id)
        if (response?.statuscode == 200) {
          setBestPerformenceEvent(response?.data)
        }
      } catch (error) {
        console.error("Error fetching top payments:", error)
      }
    }

    const getMonthlyRevenues = async () => {
      try {
        const response = await getMonthlyRevenue(auth?._id)
        console.log("month", response)
        if (response?.statuscode == 200) {
          setMonthlyRevenue(response?.data)
        }
      } catch (error) {
        console.error("Error fetching monthly revenue:", error)
      }
    }



    if (auth?._id) {
      setLoading(true)
      Promise.all([
        getBestPerformenceEvent(),
        getAllEvents(),
        getUsers(),
        handlegetpayment(),
        getMonthlyRevenues(),
        getDashboardearnings()
      ]).finally(() => {
        setLoading(false)
      })
    }
  }, [auth])

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0)
  }

  const formatNumber = (num: any) => {
    return new Intl.NumberFormat("en-IN").format(num || 0)
  }

  const getInitials = (name: any) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  // Create pie chart data from your API response
  const pieData = bestperformenceevent?.totalAdmin
    ? [
      { name: "Admin Revenue", value: bestperformenceevent?.totalAdmin, color: "#3b82f6" },
      // { name: "Super Admin Commission", value: bestperformenceevent.totalSuperAdmin, color: "#10b981" },
    ]
    : []

  if (loading) {
    return <CommonLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards - Using your API data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


          {/* <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Commition</CardTitle>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {formatCurrency(totalcommision?.totalRevenue)}
              </div>
              
            </CardContent>
          </Card> */}


          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Revenue</CardTitle>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(totalrevenue?.totalRevenue)}</div>
              {/* <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-white/80 mr-1" />
                <span className="text-sm text-white/90 font-medium">+14.2%</span>
                <span className="text-sm text-white/70 ml-2">from last month</span>
              </div> */}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Users</CardTitle>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatNumber(users?.Users?.length)}</div>
              <p className="text-sm text-white/80 mt-2">Active platform users</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Total Events</CardTitle>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatNumber(allevents?.length)}</div>
              <p className="text-sm text-white/80 mt-2">Events created</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Revenue Chart */}
          <Card className="bg-white shadow-lg">
            <MonthlyRevenueDashboard monthlyRevenue={monthlyRevenue} />
          </Card>

          {/* Top Event Performance - Using your API data */}
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                Top Event Performance
              </CardTitle>
              <CardDescription className="text-gray-600">Best performing event this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bestperformenceevent?._id ? (
                <>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg backdrop-blur-sm">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 capitalize">{bestperformenceevent._id}</h3>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(bestperformenceevent?.totalAmount)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Price:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(bestperformenceevent.averagePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Participants:</span>
                      <span className="font-semibold text-gray-900">{bestperformenceevent.usernames?.length || 0}</span>
                    </div>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Participants</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {bestperformenceevent.usernames?.map((username, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                            <AvatarFallback className="text-xs bg-yellow-100 text-yellow-600 backdrop-blur-sm">
                              {getInitials(username)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">{username}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No event data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardHome

