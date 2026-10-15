 
import { get } from "http";
import api from "../axiosIntance/axiosinstance";


export const getData = async (url: string) => {
   try {
      const response = await api.get(url)
      return response?.data
   } catch (error) {
      throw error
   }
}

export const postData = async (url: string, formData: any) => {
   try {
      const response = await api.post(url, formData)
      return response?.data
   } catch (error) {
      throw error
   }
}

export const putData = async (url: string, formData: any) => {
   try {
      const response = await api.put(url, formData)
      return response?.data
   } catch (error) {
      throw error
   }
}

export const putDataWIthId = async (url: string, formData: any) => {
   try {
      const response = await api.put(url, formData)
      return response?.data
   } catch (error) {
      throw error
   }
}




export const deleteDataWithId = async (url: string) => {
   try {
      const response = await api.delete(`${url}`)
      return response?.data
   } catch (error) {
      throw error
   }
}


export const registerUser = async (formData: any) => {
   try {
      const response = await postData("/user/register", formData,)
      return response
   } catch (error) {
      throw error
   }
}


export const loginUser = async (formData: any) => {
   try {
      const response = await postData("/user/login", formData,)
      return response
   } catch (error) {
      throw error
   }
}


export const logoutUser = async () => {
   try {
      const response = await getData("/user/logout")
      return response
   } catch (error) {
      throw error
   }
}

export const getAllOrganizer = async () => {
   try {
      const response = await getData("/user/allorganizer")
      return response
   } catch (error) {
      throw error
   }
}

export const getAllUsers = async () => {
   try {
      const response = await getData("/user/get-all-users")
      return response
   } catch (error) {
      throw error
   }
}


export const getUserById = async (organizationId:string,userId: string) => {
   try {
      const response = await getData(`/user/get-userby-id?organizationId=${organizationId}&userId=${userId}`)
      return response
   } catch (error) {
      throw error
   }
}

export const EditProfile = (formData: any) => {
   try {
      const response = putData("/user/update-profile", formData,)
      return response
   } catch (error) {
      throw error
   }
}


 export const EditUsers = async (formData: any) => {
   try {
      const response = await putDataWIthId('/user/edit-user-profile', formData,)
      return response
   } catch (error) {
      throw error
   }
}

 export const EditUser = async (formData: any) => {
   try {
      const response = await putDataWIthId('/user/edit-user', formData,)
      return response
   } catch (error) {
      throw error
   }
}


export const DeleteUser = async (organizationId:string,userId: string) => {
   try {
      const response = await deleteDataWithId(`/user/delete-user?organizationId=${organizationId}&userId=${userId}`)
      return response
   } catch (error) {
      throw error
   }
}

export const deleteAdminUser = async (organizationId:string,userId: string) => {
   try {
      const response = await deleteDataWithId(`/user/delete-admin?organizaionId=${organizationId}&userID=${userId}`)
      return response
   } catch (error) {
      throw error
   }
}

// =================Event================

export const craeteEvents = async (formData: any) => {
   try {
      const response = await postData("/event/create-event", formData,)
      return response
   } catch (error) {
      throw error
   }
}

export const updateEvents = async (id: any,formData: any) => {
   try {
      const response = await putDataWIthId(`event/update-event?eventId=${id}`, formData,)
      return response
   } catch (error) {
      throw error
   }
}



export const getEvents = async (organizationId:string) => {
   try {
      const response = await getData(`/event/get-events?organizationId=${organizationId}`)
      return response
   } catch (error) {
      throw error
   }
}

 

export const addRegisterEvent = async(id: string,entrycode:string) => {
   try {
      const response = await getData(`/event/add-register-event?eventId=${id}&entrycode=${entrycode}`)
      return response
   } catch (error) {
      throw error
   }
}

 export const getEventById = async (id: string,) => {
   try {
      const response = await getData(`/event/get-event-byid?eventId=${id}`)
      return response
   } catch (error) {
      throw error
   }
 }

export const deleteEvent = async (organizationId:string,id: string) => {
   try {
      const response = await deleteDataWithId(`/event/delete-event?organizationId=${organizationId}&eventId=${id}`)
      return response
   } catch (error) {
      throw error
   }
}

export const filterEvents = async (organizationId:string,category:string,role:string,membershipType:string) => {
   try {
      const response = await getData(`/event/filter-events?organizationId=${organizationId}&category=${category}&role=${role}&membershipType=${membershipType}`)
      return response
   } catch (error) {
      throw error
   }
}

export const removeRegisterEvent = async(id: string) => {
   try {
      const response = await getData(`/event/remove-register-event?eventId=${id}`)
      return response
   } catch (error) {
      throw error
   }
}

export const getCurrentUser = async () => {
   try {
      const response = await getData("/user/getprofile")
      return response
   } catch (error) {
      throw error
   }
}

// ================Category================

export const createCategory = async (formData: any) => {
   try {
      const response = await postData("/category/create-category", formData,)
      return response
   } catch (error) {
      throw error
   }
}

export const updateCategory = async (formData: any) => {
   try {
      const response = await putData("/category/update-category", formData,)
      return response
   } catch (error) {
      throw error
   }
}


export const deleteCategory = async (id: string) => {
   try {
      const response = await deleteDataWithId(`/category/delete-category?categoryId=${id}`)
      return response
   } catch (error) {
      throw error
   }
}


export const getAllCategory = async (organizationId:string) => {
   try {
      const response = await getData(`/category/get-all-category?organizationId=${organizationId}`)
      return response
   } catch (error) {
      throw error
   }
}


   export const AddTofaverate = async (id: string) => {
      try {
         const response = await getData(`/user/aad-favorite?eventId=${id}`)
         return response
      } catch (error) {
            console.log("error123",error)
         throw error
      }
   }

   // =====================Verify Otp ========================

     export const VerifyOtp = (formData: any) => {
      try {
         const response = postData("/user/verify-otp", formData,)
         return response
      } catch (error) {
         throw error
      }
   }

   
    export const resendOtp = (formData: any)=>{
      try {
         const response = postData("/user/resend-otp", formData,)
         return response
      } catch (error) {
         throw error
      }
    }

    export const EmailVarification = (formData: any)=>{
      try {
         const response = postData("/user/verify-email", formData,)
         return response
      } catch (error) {
         throw error
      }
    }

    export const resetPassword = (formData: any)=>{
      try {
         const response = postData("/user/reset-password", formData,)
         return response
      } catch (error) {
         throw error
      }
    }


    export const getAllAdmins = async () => {
      try {
         const response = await getData("/user/get-all-admins")
         return response
      } catch (error) {
         throw error
      }
   }

   export const updateSubscriptionStatus = async (formData: any) => {
      try {
         const response = await putData("/user/update-status", formData,)
         return response
      } catch (error) {
         throw error
      }
   }

   export const getAllOrganizerAndAttendee = async (organizaionId:string) => {
      try {
         const response = await getData(`/user/get-organizer-attendee?organizaionId=${organizaionId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   //  ========================Aasign Events =======================


    export const AssignEvents = async (formData: any) => {
      try {
         const response = await postData("/assignevnents/assign-event", formData,)
         return response
      } catch (error) {
         throw error
      }
   }

   export const  getAssignEvents = async(organizationId:string,userId:string) => {
      try {
         const response = await getData(`/assignevnents/get-assign-event?organizationId=${organizationId}&userId=${userId}`)
         return response
      } catch (error) {
         throw error
      }
   }

   // ======================  update status of oranizer =====================


    export const updateOrganizerStatus = async (formData: any) => {
      try {
         const response = await postData("/user/update-status-organizer", formData)
         return response
      } catch (error) {
         throw error
      }
   }

   // ======================get Assigned Events =======================================

    export const getAssignedEvents = async(organizationId:string,userId:string) => {
      try {
         const response = await getData(`/assignevnents/get-assign-event?organizationId=${organizationId}&userId=${userId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   // ====================update event status ============================

    export const UpdateEventStaus = async(formData: any) => {
      try {
         const response = await putData("/event/update-event-status", formData,)
         return response
      } catch (error) {
         throw error
      }
   }

   // ===================== Payments ====================

   export const CreateOrder = async (formData: any) => {
      try {
         const response = await postData("/payment/create-order", formData,)
         return response
      } catch (error) {
         throw error
      }
   }

   export const VerifyPayment = async (formData: any) => {
      try {
         const response = await postData("/payment/verify-payment", formData,)
         return response
      } catch (error) {
         throw error
      }
   }

   export const getRevenue = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-revenue?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   export const getTopPayments = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-top-status?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }

   export const getMonthlyRevenue = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-monthly-revenue?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   export const getEventsRevenue = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-event-revenue?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }

   export const getAllPayments = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-all-payments?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   export const getAllAdminPayments = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-admin-payments?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   // ==============Enquiry Section ====================

   export const getAllEnquiry = async() => {
      try {
         const response = await getData(`/enquiry/get-all-enquiry`)
         return response
      } catch (error) {
         throw error
      }
   }

   export const updateEnquiryStatus = async(formData: any) => {
      try {
         const response = await putData("/enquiry/update-enquiry-status", formData,)
         return response
      } catch (error) {
         throw error
      }
   }


   export const getOrganizerDashboardstats = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-organizer-earning-status?organizerId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }


   export const getAdmincommitionfromorganizer = async(organizationId:string) => {
      try {
         const response = await getData(`/payment/get-admin-revenue-from-organizer?organizationId=${organizationId}`)
         return response
      } catch (error) {
         throw error
      }
   }

   export const getBookingDetailsByCheckinNo = async(organizationId:string,checkinNo:string) => {
      try {
         const response = await getData(`/payment/get-booking-data?organizationId=${organizationId}&checkInNo=${checkinNo}`)
         return response
      } catch (error) {
         throw error
      }
   }


   export const updateAttendence = async(eventId:string,attendencestatus:string,userId:string) => {
       try {
          const response = await getData(`/event/update-attendence?eventId=${eventId}&attendencestatus=${attendencestatus}&userId=${userId}`)
          return response
       } catch (error) {
         throw error
       }
   }


  




