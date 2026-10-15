'use client'
import { Suspense } from "react"
import EventFormEdit from "@/components/events/EventFormEdit"
import EventFormLoading from "@/components/events/EventFormLoading"
import { useAppDispatch } from "@/lib/store"
import { useAuth } from "@/lib/auth/auth-provider"
import { getEventById } from "@/components/ApiServices/ApiServices"
import type { EventEditData } from "@/components/events/EventFormEdit"
import { useState,useEffect } from "react"
import { useParams } from 'next/navigation'

export default function EditEventPage() {
    const dispatch = useAppDispatch()
    const { auth } = useAuth()
    const param = useParams<{ id: string }>()

const [editdata, setEditData] = useState<EventEditData>({});
     
useEffect(() => {
  const fetchEventData = async () => {
    const res = await getEventById(param.id)
    const event = res?.data
    setEditData({
      Event_title: event?.Event_title || "",
      Description: event?.Description || "",
      eventdate: event?.Date ? new Date(event.Date) : new Date(),
      Time: event?.Time || "",
      location: event?.location || "",
      Category: event?.Category?._id || event?.Category || "",
      Price: Number(event?.Price) || 0,
      Date: event?.Date || "",
      image: event?.image || null,
    });
  };
  
  fetchEventData();
}, [dispatch, param.id]);

 
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
          <Suspense fallback={<EventFormLoading />}>
            <EventFormEdit editdata={editdata} setEditData={setEditData} id={param.id}/>
          </Suspense>
        </div>
      </div>
    </div>
  )
}
