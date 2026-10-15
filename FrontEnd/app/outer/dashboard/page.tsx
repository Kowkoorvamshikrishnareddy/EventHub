
"use client"
import { useEffect, useState } from "react"
import {
  Users,
  Calendar,
  DollarSign,
  Bell,
  BarChart3,
  Lock,
  MessageCircleQuestion, CalendarCheck, Grid,
  Settings
} from "lucide-react"
import { Card, CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card"
import OrganizerDashboardHome from "@/components/organizerdashboard/homedashboard"
import EventManagement from "@/components/organizerdashboard/eventmanagement"
import RevenueDashboard from "@/components/organizerdashboard/revenueanalytics"
import { useAuth } from "@/lib/auth/auth-provider"
import { getAllEnquiry,getOrganizerDashboardstats } from "@/components/ApiServices/ApiServices"
 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
  import CategoriesTable from "@/components/organizerdashboard/categoryes"
import AssignEvents from "@/components/organizerdashboard/AssignEvents"
import BookingDetailsTable from "@/components/organizerdashboard/Bookingdetails"
import UserProfile from "@/components/organizerdashboard/Profile"
   
 
const sidebarItems = [
  { title: "Dashboard", icon: BarChart3, id: "dashboard" },
  { title: "Events Management", icon: Calendar, id: "events" },
  { title: "Revenue Analytics", icon: DollarSign, id: "revenue" },
  { title: "Assign Events", icon: MessageCircleQuestion, id: "AssignEvents" },
   { title: "Categoryes", icon: Grid, id: "Categoryes" },
  { title: "Booking Details", icon: CalendarCheck, id: "BookingDetails" },
  {title:"Setting",icon:Settings, id:"Setting"}
]


function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const {auth} = useAuth()



  if(auth?.status=="inActive"){
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-800">Account Inactive</CardTitle>
            <CardDescription className="text-red-600">
              You are currently inactive and cannot use any services
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-red-700 text-sm">
              Your account is currently inactive. Please contact support to reactivate your services.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

  useEffect(()=>{
    getAllEnquiry()
  },[auth])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <OrganizerDashboardHome />
      case "events":
        return <EventManagement />
      case "revenue":
        return <RevenueDashboard />
      case "Categoryes":
        return <CategoriesTable />
        case "AssignEvents":
        return <AssignEvents/>
        case "BookingDetails":
        return <BookingDetailsTable/>
        case "Setting" :
         return <UserProfile/>
    }
  }
  return (
    <SidebarProvider className="mt-[50px]">
      <Sidebar className="border-r border-gray-200 bg-white">
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-900 text-lg font-bold px-4 py-6">
              Organizer Control Panel
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(item.id)}
                      isActive={activeTab === item.id}
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 data-[active=true]:bg-blue-100 data-[active=true]:text-blue-700"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
          </div>
        </header>
        <span className="flex-1 p-6 bg-gray-50 overflow-auto">{renderContent()}</span>
      </SidebarInset>

      
    </SidebarProvider>
  )
}

export default AdminDashboard





