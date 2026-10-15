"use client"
import HeroSection from "@/components/home/HeroSection"
import FeaturedEventsPreview from "@/components/home/FeaturedEventsPreview"
import FeaturedEvents from "@/components/home/FeaturedEvents"
import CategorySection from "@/components/home/CategorySection"
import StatsSection from "@/components/home/StatsSection"
import TestimonialSection from "@/components/home/TestimonialSection"
import CTASection from "@/components/home/CTASection"
import HeroSectionPage from "@/components/ClientOnly/Home"
import { useAuth } from "@/lib/auth/auth-provider"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { getAllEventsThunk } from "@/components/ReduxSlices/CreateEventSlice"
import axios from "axios"


export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { auth } = useAuth()
  const organizationId = auth?.role == "attendee" 
                         ? ""
                         :auth?._id

  const dispatch = useAppDispatch();
  const { allevents, loading } = useAppSelector((state) => state.createEvents);
  
  useEffect(() => {
    if (auth) {
      setIsLoading(true)
      dispatch(getAllEventsThunk(organizationId)).then((res) => {
        if (res?.payload?.statuscode == 201) {
          setIsLoading(false)
        }
      })
    } else {
      const getAllEventsWithoutAuth = async () => {
        const apiURL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/event/get-allevents-without-auth`
        setIsLoading(true)
        try {
          const response = await axios.get(apiURL);

          if (response?.status == 201) {
            setEvents(response?.data?.data);
            setIsLoading(false)
          }
        } catch (error) {
          setIsLoading(false)
          setEvents([]);
        }
      };
      getAllEventsWithoutAuth();
    }
  }, [auth])


  const evetsdata = auth ? allevents : events

  return (
    <div className="flex flex-col gap-0 pb-16">
      <HeroSectionPage />
      <FeaturedEventsPreview evetsdata={evetsdata} isLoading={isLoading} />
      <CategorySection evetsdata={evetsdata} isLoading={isLoading} />
      <StatsSection />
      <FeaturedEvents evetsdata={evetsdata} isLoading={isLoading} />
      <TestimonialSection />
      <CTASection />
    </div>
  )
}
