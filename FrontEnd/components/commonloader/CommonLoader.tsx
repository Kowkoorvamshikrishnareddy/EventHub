import React from 'react'

const CommonLoader = () => {
  return (
     <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-50">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
                  style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                ></div>
              </div>
              {/* <p className="text-gray-600 font-medium">Verifying your enquiry...</p>
              <p className="text-gray-400 text-sm mt-1">Please wait a moment</p> */}
            </div>
          </div>
  )
}

export default CommonLoader