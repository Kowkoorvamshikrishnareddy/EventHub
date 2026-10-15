import ApiError from "../utils/ApiError/ApiError.js";
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
 import { Enquiry } from "../models/Enquiry.model.js";
 import { sendEnquiryStatusEmail } from "../utils/Nodemailer/enquirystatus.js";

export const updateEnquiryStatus = asynchandler(async (req, res) => {
  try {
    const { enquiryId, status,reason } = req.body;
    const adminId = req.user?._id;  
    
    if (!enquiryId || !status) {
      throw new ApiError(400, "Enquiry ID and status are required");
    }
    
    // Validate status value
    if (!["accepted", "rejected"].includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }

    // Update or insert enquiry status
    const enquiryStatus = await Enquiry.findOneAndUpdate(
      { _id: enquiryId },             
      { status: status, updatedBy: adminId },  
      { new: true, upsert: true }          
    );

     const user = await Enquiry.findOne({ _id: enquiryId });

     sendEnquiryStatusEmail({
      to: user.email,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      status: status,
      reason: reason,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, enquiryStatus, "Enquiry status updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to update enquiry status");
  }
});
