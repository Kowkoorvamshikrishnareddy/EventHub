import crypto from "crypto";
 import {Enquiry} from "../models/Enquiry.model.js";
 import { sendVerificationEmail } from "../utils/Nodemailer/sendverificationemail.js";
 import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
 import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import ApiError from "../utils/ApiError/ApiError.js";

const pendingEnquiries = {};  

export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    pendingEnquiries[token] = { name, email, phone, address };

    const verificationLink = `${process.env.FRONTEND_URL}/verify-enquiry/${token}`;
    await sendVerificationEmail({ 
      to: email,
      subject: "New Enquiry Confirmation",
      name, email, phone, address, link: verificationLink 
    });


    return res.status(200).json({ message: "Verification link send your Email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const verifyEnquiry = async (req, res) => {
  try {
    const { token } = req.params;
    const enquiryData = pendingEnquiries[token];
    if (!enquiryData) return res.status(400).json({ message: "Invalid or expired token" });

    const enquiry = await Enquiry.create(enquiryData);
    delete pendingEnquiries[token];

    return res.status(201).json({ message: "Enquiry saved successfully", enquiry });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};





 export const getAllEnquiry = asynchandler(async (req, res) => {
   try {
     const getAllEnquiry = await Enquiry.find();
     if(!getAllEnquiry){
       throw new ApiError(400,"Enquiry not found")
     }
     return res.status(201).json(new ApiResponse(200,getAllEnquiry,"Enquiry found successfully"))
   } catch (error) {
      throw new ApiError(400,error.message)
   }
 })
