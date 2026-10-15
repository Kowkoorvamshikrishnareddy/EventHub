"use client"
import { Suspense, use } from "react"
import EventsHeader from "@/components/events/EventsHeader"
import EventsList from "@/components/events/EventsList"
import EventsLoading from "@/components/events/EventsLoading"
import { useState, useEffect } from "react"
import { filterEvents } from "@/components/ApiServices/ApiServices"
import { AddTofaverate } from "@/components/ApiServices/ApiServices"
import { useToast } from "@/components/ui/use-toast"
import { useAuth, } from "@/lib/auth/auth-provider"
import type { Event } from "@/lib/types"
import axios from "axios"

export default function EventsPage() {

  const [categoryName, setCategoryName] = useState("All Events")
  const [favariteId, setFavariteId] = useState<Event | null>(null)
  const [favarvoate, setfavorate] = useState<any[]>([])
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);

  const { auth, setAuth } = useAuth()

  const { toast } = useToast()

  const [filterData, setFilterdata] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")


useEffect(() => {
  const handleFavoriteToggle = async () => {
    if (!favariteId?._id) return;

    try {
      setLoading(true);

      const res = await AddTofaverate(favariteId._id);

      if (res?.data) {
        toast({
          title: res.message?.includes("removed")
            ? "Event Removed from Favorites"
            : "Event Added to Favorites",
          description: res.message,
        });

        setAuth((prev) => {
          if (!prev) return prev
          const favorites = prev.favorate_events ?? []
          const targetId = favariteId._id ?? favariteId.id
          const alreadyFavorited = favorites.some(
            (event) => (event._id ?? event.id) === targetId
          );

          const updatedFavorites = alreadyFavorited
            ? favorites.filter((event) => (event._id ?? event.id) !== targetId)
            : [...favorites, favariteId];

          return {
            ...prev,
            favorate_events: updatedFavorites,
          };
        });

        setfavorate(res.data);
      } else {
        toast({
          title: "Error",
          description:
            res?.data?.message || "Something went wrong while toggling favorite.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {

        console.log("err", err)
      toast({
        title: "Error",
        description:
          (axios.isAxiosError(err) && err.response?.data?.message) || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  handleFavoriteToggle();
}, [favariteId]);

  const organizaionId = auth?._id ?? ""
 useEffect(() => {
  if (!categoryName) return;
  setLoading(true);
  filterEvents(organizaionId, categoryName, auth?.role ?? "attendee", auth?.membershipType ?? "outer").then((res) => {
    setFilterdata(res?.data);
    setLoading(false);
  });
}, [categoryName, auth]);


  const filteredEvents =
    filterData?.filter(
      (event: any) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []


  return (
    <div className="pt-24 pb-16">
      <EventsHeader setCategoryName={setCategoryName} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <Suspense fallback={<EventsLoading />}>
        <EventsList allevents={filteredEvents} loading={loading} setFavariteId={setFavariteId} setPendingEvent={setPendingEvent} />
      </Suspense>
    </div>
  )
}
