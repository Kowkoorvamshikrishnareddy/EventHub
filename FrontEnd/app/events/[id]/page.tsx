"use client"

import { Suspense } from "react"
import EventDetail from "@/components/events/EventDetail"
import EventDetailLoading from "@/components/events/EventDetailLoading"
 

export default function EventPage() {
  return (
    <div className="pt-24 pb-16">
      <Suspense fallback={<EventDetailLoading />}>
        <EventDetail/>
      </Suspense>
    </div>
  )
}
