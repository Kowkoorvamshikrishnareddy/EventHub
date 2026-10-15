import mongoose from "mongoose";

const updateStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"], // ✅ Consistent enum
      default: "pending",
    },
    enquiry: {
      type: mongoose.Types.ObjectId,
      ref: "Enquiry",  
      required: true,
    },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",  
      required: true,
    },
  },
  { timestamps: true }
);

export const UpdateEnquiryStatus = mongoose.model("updateEnquiryStatus", updateStatusSchema);
