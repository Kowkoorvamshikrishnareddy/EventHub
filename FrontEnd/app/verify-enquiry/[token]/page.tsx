
"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"

export default function VerifyEnquiryPage() {
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isVerified, setIsVerified] = useState(false)

  const handleVerify = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
      const res = await axios.get(`${apiUrl}/enquiry/verify/${params?.token}`)

      if (res?.data) {
        setMessage(res.data.message)
        setIsVerified(true)
      } else {
        setMessage(res?.data?.message || "Verification failed!")
        setIsVerified(false)
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || "Verification failed!")
      setIsVerified(false)
    }
    setLoading(false)
  }

  return (
    <div className="mt-14 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-2">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-30 -right-40 w-100 h-auto bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Verify Enquiry</h1>
              <p className="text-blue-100 text-sm">Confirm your enquiry to proceed</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {!message ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to Verify</h2>
                  <p className="text-gray-600 text-sm">
                    Click the button below to verify and save your enquiry to our system.
                  </p>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Proceed to Verify</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center">
                {/* Success/Error Icon */}
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    isVerified
                      ? "bg-gradient-to-br from-green-100 to-green-200"
                      : "bg-gradient-to-br from-red-100 to-red-200"
                  }`}
                >
                  {isVerified ? (
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>

                {/* Message */}
                <div
                  className={`p-4 rounded-2xl mb-6 ${
                    isVerified
                      ? "bg-gradient-to-r from-green-50 to-green-100 border border-green-200"
                      : "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                  }`}
                >
                  <p className={`font-medium ${isVerified ? "text-green-800" : "text-red-800"}`}>
                    {isVerified ? "✅" : "❌"} {message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isVerified ? (
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => window.close()}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        Close Window
                      </button>
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                      >
                        Verify Another
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMessage("")
                        setIsVerified(false)
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100">
            <p className="text-center text-xs text-gray-500">Secure verification powered by your system</p>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
                  style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                ></div>
              </div>
              <p className="text-gray-600 font-medium">Verifying your enquiry...</p>
              <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

