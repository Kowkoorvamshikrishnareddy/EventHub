/** Data shapes returned by the EventHub API and used by the UI. */
export interface User {
  id?: string
  _id?: string
  name: string
  email: string
  phone?: string
  address?: string
  image?: string
  role: "admin" | "organizer" | "attendee"
  status?: string
  membershipType?: "inner" | "outer" | string
  otp?: string
  otpExpiry?: string
  organization?: string
  assignedEvents?: Array<string | Event>
  favorate_events?: Event[]
  registered_attendees?: Event[]
  createdBy?: string | User
  createdAt?: string
  updatedAt?: string
}

export interface Event {
  id: string
  _id?: string
  title: string
  Event_title?: string
  description: string
  Description?: string
  date: string
  Date?: string | Date
  Organizer?: string | User
  eventdate?: string | Date
  Time?: string
  time?: string
  location?: string
  category: string
  Category?: string | Category
  Category_name?: string
  price: number
  Price?: number | string
  image: string
  organizer?: string
  organizerId?: string
  attendees?: number
  attendee?: Array<string | User>
  attendanceStatus?: string
  eventstatus?: string
  entrycode?: string
  payments?: Payment[]
  totalRevenue?: number
  averagePrice?: number
  isFeatured?: boolean
  createdBy?: string | User
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  _id?: string
  name: string
  Category_name?: string
  slug?: string
  image?: string
  description?: string
  icon?: string
  eventCount?: number
  createdBy?: string | User
}

export interface Payment {
  _id?: string
  id?: string
  amount?: number
  status?: string
  paymentId?: string
  orderId?: string
  userId?: string | User
  eventId?: string | Event
  createdAt?: string
}

export interface Booking {
  id: string
  userId: string
  eventId: string
  bookingDate: string
  status: "confirmed" | "cancelled"
  event: Event
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
  rating?: number
  createdAt?: string
}
