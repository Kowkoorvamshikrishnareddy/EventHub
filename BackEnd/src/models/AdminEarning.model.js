import mongoose from "mongoose";

const AdminEarningSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
  attendeeName: String,
  eventName: String,
  commissionAmount: Number,
  amountFromOrganizers: { type: Number, default: 0 }, 
  monthName: String,
}, { timestamps: true });

export const AdminEarning = mongoose.model("AdminEarning", AdminEarningSchema);
