 
"use client"
import { useState } from "react"
import { TrendingUp, ArrowLeft, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface PaymentHistory {
  orderId: string
  paymentId: string
  username: string
  eventName: string
  amount: number
  status: string
  date: string
  adminCommission: number
}

interface MonthlyRevenueItem {
  _id: string
  totalRevenue: number
  paymentHistory: PaymentHistory[]
}

interface MonthlyRevenueDashboardProps {
  monthlyRevenue: MonthlyRevenueItem[]
}

export default function MonthlyRevenueDashboard({ monthlyRevenue }: MonthlyRevenueDashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Transform API data to the format expected by the component
  const transformedMonthlyRevenue = monthlyRevenue.reduce((acc, item) => {
    acc[item._id] = {
      totalRevenue: item.totalRevenue,
      payments: item.paymentHistory,
      averagePrice: item.paymentHistory.length > 0 
        ? item.totalRevenue / item.paymentHistory.length 
        : 0
    }
    return acc
  }, {} as Record<string, any>)

  // Prepare chart data for all months that have data
  const chartData = monthlyRevenue.map((item) => ({
    month: item._id,
    revenue: item.totalRevenue,
    payments: item.paymentHistory.length,
    averagePrice: item.paymentHistory.length > 0 
      ? item.totalRevenue / item.paymentHistory.length 
      : 0,
  }))

  // Check if there's no data
  const hasData = monthlyRevenue.length > 0

  const handleBarClick = (data: any) => {
    setSelectedMonth(data.month)
    setShowDetails(true)
  }

  const getBarColor = (month: string) => {
    if (selectedMonth === month) return "#10B981" // Green for selected
    return "#3B82F6" // Blue for default
  }

  return (
    <div className="bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {!hasData ? (
          /* No Data Available Card */
          <Card className="bg-white shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Revenue Data Available</h3>
              <p className="text-gray-500 text-center max-w-md">
                There's no monthly revenue data to display at the moment. Revenue data will appear here once
                transactions are processed.
              </p>
            </CardContent>
          </Card>
        ) : !showDetails ? (
          /* Main Chart View */
          <div className="space-y-8">
            {/* Monthly Revenue Chart */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                  <div className="p-2 bg-blue-100 rounded-full backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  Monthly Revenue Overview - 2025
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Interactive chart showing revenue for all months • Hover for details • Click for breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-gray-50 rounded-lg">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#374151" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#374151" }}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}K`}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(value), "Monthly Revenue"]}
                      labelFormatter={(label) => `${label} 2025`}
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        fontSize: "14px",
                        backdropFilter: "blur(10px)",
                      }}
                      labelStyle={{
                        color: "#374151",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    />
                    <Bar dataKey="revenue" cursor="pointer" onClick={handleBarClick} radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getBarColor(entry.month)}
                          stroke={selectedMonth === entry.month ? "#059669" : "#2563eb"}
                          strokeWidth={selectedMonth === entry.month ? 2 : 0}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Detailed Month View - Only Payment Details */
          <div className="space-y-6">
            {/* Back Button */}
            <Button
              onClick={() => setShowDetails(false)}
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 border-blue-200 bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
            {/* Selected Month Payment Details */}
            {selectedMonth && transformedMonthlyRevenue[selectedMonth] && (
              <Card className="bg-white shadow-sm">
                <CardHeader className="bg-gray-50 rounded-t-lg border-b">
                  <CardTitle className="flex items-center gap-3 text-2xl text-gray-900">
                    <div className="p-2 bg-blue-100 rounded-full backdrop-blur-sm">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    {selectedMonth} 2025 - Payment Details
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Complete breakdown of all {transformedMonthlyRevenue[selectedMonth].payments.length} payments • Total Revenue:{" "}
                    {formatCurrency(transformedMonthlyRevenue[selectedMonth].totalRevenue)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">S.No.</th>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">
                            Event Name
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">
                            Customer
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">Amount</th>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">Status</th>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">
                            Date & Time
                          </th>
                          <th className="text-left p-4 font-semibold text-gray-900 border-b border-gray-200">
                            Commission
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transformedMonthlyRevenue[selectedMonth].payments.map((payment: PaymentHistory, index: number) => (
                          <tr
                            key={payment.orderId}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-25"
                            }`}
                          >
                            <td className="p-4 border-b border-gray-200">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 backdrop-blur-sm">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="font-medium text-gray-900">{payment.eventName}</div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-gray-900">{payment.username}</span>
                              </div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="font-bold text-gray-900 text-lg">{formatCurrency(payment.amount)}</div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-blue-200 backdrop-blur-sm">
                                ✓ {payment.status}
                              </Badge>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="text-gray-700 text-sm">{formatDate(payment.date)}</div>
                            </td>
                            <td className="p-4 border-b border-gray-200">
                              <div className="text-gray-700 font-medium">{formatCurrency(payment.adminCommission)}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Summary Footer */}
                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        Total {transformedMonthlyRevenue[selectedMonth].payments.length} payments in {selectedMonth}
                      </span>
                      <span className="font-bold text-gray-900 text-lg">
                        Total: {formatCurrency(transformedMonthlyRevenue[selectedMonth].totalRevenue)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
