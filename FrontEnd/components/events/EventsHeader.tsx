"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
 import { getAllCategoryThunk } from "../ReduxSlices/CategorySlice"
 import { useAppDispatch,useAppSelector } from "@/lib/store"
 import { useEffect,useState } from "react"
 import { useAuth } from "@/lib/auth/auth-provider"


export default function EventsHeader({setCategoryName,setSearchTerm,searchTerm}:{setCategoryName:any,setSearchTerm:any,searchTerm:any}) {

  const {auth} = useAuth()
  const dispatch = useAppDispatch()
  const {allcategory} = useAppSelector((state) => state.category)

  let  organizationId = auth?._id ? auth?._id : "";
  
  useEffect(() => {
    if(auth?._id){
      dispatch(getAllCategoryThunk(organizationId))
    }
  }, [dispatch])


  return (
    <div className="bg-gray-50 py-12 mb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find and explore events that match your interests. From weddings to corporate events, we have something for
            everyone.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
              type="text" 
               placeholder="Search events by title, description, or location..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-10 h-12" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Button 
            className="hover:text-white"
             onClick={()=>setCategoryName("All Events")}
              variant="outline" size="sm">
              All Events
            </Button>
            <Button
            className="hover:text-white"
             onClick={()=>setCategoryName("Today")}
             variant="outline" size="sm">
              Today
            </Button>
            <Button
            className="hover:text-white"
             onClick={()=>setCategoryName("This Weekend")}
            variant="outline" size="sm">
              This Weekend
            </Button>
            <Button 
            className="hover:text-white"
             onClick={()=>setCategoryName("This Month")}
            variant="outline" size="sm">
              This Month
            </Button>
             {
              allcategory.map((category) => (
                <Button
                className="hover:text-white"
                onClick={() => setCategoryName(category?.Category_name)}
                key={category?._id} variant="outline" size="sm">
                  {category?.Category_name}
                </Button>
              ))
             }
          </div>
        </div>
      </div>
    </div>
  )
}
