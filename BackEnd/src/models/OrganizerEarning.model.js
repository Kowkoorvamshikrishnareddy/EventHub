import mongoose from "mongoose";

const OrganizerEarningSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attendeeName: String,
  eventName: String,
  totalAmount: Number,
  amountPaidToAdmin: Number,  
  organizerEarning: Number, 
  monthName: String,
}, { timestamps: true });

export const OrganizerEarning = mongoose.model("OrganizerEarning", OrganizerEarningSchema);
