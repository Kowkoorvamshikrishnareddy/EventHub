import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import ApiResponse from "../utils/ApiResponse/ApiResponse.js";
import ApiError from "../utils/ApiError/ApiError.js";
import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { Payment } from "../models/Payment.model.js";
import mongoose from "mongoose";
import { Event } from "../models/Event.model.js";
import { User } from "../models/User.model.js";
import { AdminEarning } from "../models/AdminEarning.model.js";
import { OrganizerEarning } from "../models/OrganizerEarning.model.js";
import sendEntryCodeEmail from "../utils/Nodemailer/sendentrycode.js";

// Razorpay instance
const instance = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : {
      orders: {
        create: async () => {
          throw new ApiError(500, "Razorpay credentials are not configured on this server");
        },
      },
    };

export const Createorder = asynchandler(async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      ordername,
      username,
      role,
    } = req.body;
    if (!amount) throw new ApiError(400, "Amount is required");
    if (!ordername) throw new ApiError(400, "Order name is required");
    if (!username) throw new ApiError(400, "Username is required");
    
    if (!role) throw new ApiError(400, "Role is required");

    //  Razorpay Order Create (amount converted to paise)
    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency,
      receipt: `order_rcpt_${Date.now()}`,
      notes: { ordername, username },
    };

    const order = await instance.orders.create(options);
    //  Convert Razorpay's paise amount back to INR for response
    const formattedOrder = {
      ...order,
      amount: order.amount, //  Convert paise to INR
      amount_due: order.amount_due,
      amount_paid: order.amount_paid,
      ordername,
      username,
      role,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, formattedOrder, "Order created successfully"));
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to create order");
  }
});



const generateEntryCode = () => {
  return 'EVT-' + Math.floor(100000 + Math.random() * 900000); // e.g., EVT-123456
};



export const verifyPayment = asynchandler(async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      currency,
      username,
      ordername,
      organizationId,
      eventId,
      role,
      userId,
      email
    } = req.body;

    console.log("req.body",req.body)

    

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, "All payment verification fields are required");
    }

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isValidSignature = generatedSignature === razorpay_signature;
    const status = isValidSignature ? "paid" : "failed";
    const monthName = new Date().toLocaleString("default", { month: "long" });

    const entrycode = generateEntryCode();
    const amountinrupees = amount / 100;

    const paymentData = await Payment.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: amountinrupees,
      currency,
      username,
      ordername,
      organizationId,
      eventId,
      role,
      userId,
      email,
      entrycode,
      status,
      monthName,
    });

    if (!isValidSignature) {
      return res.status(400).json(
        new ApiResponse(
          400,
          paymentData,
          "Payment verification failed, saved as failed"
        )
      );
    }


    const event = await Event.findById(eventId).populate("createdBy");

     console.log("event",event)
    if (!event) throw new ApiError(404, "Event not found");

    const admin = await User.findOne({ role: "admin" }).select("_id");

    console.log("admin",admin)
    let commissionAmount = 0;
    let organizerAmount = 0;
    let adminEarning = null;
    let organizerEarning = null;

    if (event.createdBy.role === "admin") {
      commissionAmount = amountinrupees;
      adminEarning = await AdminEarning.create({
        eventId,
        adminId: event.createdBy._id,
        organizerId: null,
        attendeeName: username,
        eventName: ordername,
        commissionAmount,
        amountFromOrganizers: 0,
        monthName,
      });
    } else if (
      event.createdBy.role === "organizer" &&
      event.createdBy.membershipType === "outer"
    ) {
      commissionAmount = (amountinrupees * 25) / 100;
      organizerAmount = amountinrupees - commissionAmount;

      adminEarning = await AdminEarning.create({
        eventId,
        adminId: admin._id,
        organizerId: event.createdBy._id,
        attendeeName: username,
        eventName: ordername,
        commissionAmount,
        amountFromOrganizers: commissionAmount,
        monthName,
      });

      organizerEarning = await OrganizerEarning.create({
        eventId,
        organizerId: event.createdBy._id,
        attendeeName: username,
        eventName: ordername,
        totalAmount: amountinrupees,
        amountPaidToAdmin: commissionAmount,
        organizerEarning: organizerAmount,
        monthName,
      });
    }

    // ✅ Send Entry Code Email
  await sendEntryCodeEmail(email, username, ordername,amountinrupees,entrycode);

    return res.status(200).json(
      new ApiResponse(
        200,
        { paymentData, adminEarning, organizerEarning },
        "Payment verified, code generated & email sent successfully"
      )
    );
  } catch (error) {
    console.error("Payment Verification Error:", error);
    throw new ApiError(400, error?.message || "Payment verification failed");
  }
});


export const getRevenue = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const total_revenue = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid", // Sirf paid status wale filter karenge
        },
      },
      {
        $addFields: {
          superAdminCommission: { $multiply: ["$amount", 0.02] },
          adminRevenue: {
            $subtract: ["$amount", { $multiply: ["$amount", 0.02] }],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }, // Total revenue ka sum
          superAdminTotal: { $sum: "$superAdminCommission" }, // Super admin ka total commission
          adminTotal: { $sum: "$adminRevenue" },
        },
      },
    ]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalRevenue: total_revenue[0]?.totalAmount || 0,
          superAdminCommission: total_revenue[0]?.superAdminTotal || 0,
          adminRevenue: total_revenue[0]?.adminTotal || 0,
        },
        "Revenue, Super Admin Commission & Admin Revenue fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to get revenue");
  }
});

export const getTopEventStats = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const eventStats = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid", // Sirf paid payments consider karenge
        },
      },
      {
        $addFields: {
          superAdminCommission: { $multiply: ["$amount", 0.02] }, // Har payment ka 2%
          adminRevenue: {
            $subtract: ["$amount", { $multiply: ["$amount", 0.02] }],
          }, // Amount - 2%
        },
      },
      {
        $group: {
          _id: "$ordername", // Event-wise group karenge
          totalAmount: { $sum: "$amount" }, // Event ka total revenue
          averagePrice: { $avg: "$amount" }, // Avg ticket price
          totalSuperAdmin: { $sum: "$superAdminCommission" }, // Super Admin commission ka sum
          totalAdmin: { $sum: "$adminRevenue" }, // Admin revenue ka sum
          usernames: { $push: "$username" }, // All usernames (repeat allowed)
          payments: { $push: "$$ROOT" }, // Full payment docs
        },
      },
      {
        $sort: { totalAmount: -1 }, // Highest revenue event first
      },
      {
        $limit: 1, // Sirf top event
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          eventStats[0] || {},
          "Top event stats fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch event stats");
  }
});

export const getMonthlyRevenue = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid",
        },
      },
      {
        $addFields: {
          monthName: {
            $dateToString: { format: "%B", date: "$createdAt" }, // Extract month name (e.g., January, February)
          },
        },
      },
      {
        $group: {
          _id: "$monthName",
          totalRevenue: { $sum: "$amount" },
          averagePrice: { $avg: "$amount" },
          payments: {
            $push: {
              _id: "$_id",
              amount: "$amount",
              username: "$username",
              ordername: "$ordername",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month name alphabetically (optional)
      },
    ]);

    // Convert array to object with month names as keys
    const revenueByMonth = {};
    monthlyRevenue.forEach((month) => {
      revenueByMonth[month._id] = month;
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          revenueByMonth,
          "Monthly revenue fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to get monthly revenue");
  }
});

export const getEventWiseRevenue = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const eventRevenue = await Payment.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(organizationId),
          status: "paid",
        },
      },
      {
        $group: {
          _id: "$ordername", // Event-wise group
          totalRevenue: { $sum: "$amount" }, // Total revenue for event
          averagePrice: { $avg: "$amount" }, // Average payment per event
          payments: {
            $push: {
              _id: "$_id",
              amount: "$amount",
              username: "$username",
              ordername: "$ordername",
              status: "$status",
              createdAt: "$createdAt",
            },
          },
        },
      },
      {
        $sort: { totalRevenue: -1 }, // Sort by highest revenue event
      },
    ]);

    // Format response as eventName: { details... }
    const formattedResponse = {};
    eventRevenue.forEach((event) => {
      formattedResponse[event._id] = {
        _id: event._id,
        totalRevenue: event.totalRevenue,
        averagePrice: event.averagePrice,
        payments: event.payments,
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formattedResponse,
          "Event-wise revenue fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      400,
      error?.message || "Failed to fetch event-wise revenue"
    );
  }
});

export const getAllPayments = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const payments = await Payment.find({ organizationId });

    return res
      .status(200)
      .json(
        new ApiResponse(200, payments, "All payments fetched successfully")
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch all payments");
  }
});

export const getAdminPayments = asynchandler(async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      throw new ApiError(400, "OrganizationId is required");
    }

    const payments = await Payment.find({ organizationId, role: "admin" });

    return res
      .status(200)
      .json(
        new ApiResponse(200, payments, "All payments fetched successfully")
      );
  } catch (error) {
    throw new ApiError(400, error?.message || "Failed to fetch all payments");
  }
});

 

export const organizerDashboardstats = asynchandler(async (req, res) => {
  try {
    const { organizerId } = req.query;

    if (!organizerId) {
      return res.status(400).json({ success: false, message: "organizerId is required" });
    }

    const organizerObjectId = new mongoose.Types.ObjectId(organizerId);

    // 1. Total amount paid to admin (by this organizer)
    const adminEarning = await AdminEarning.aggregate([
      { $match: { organizerId: organizerObjectId } },
      {
        $group: {
          _id: null,
          totalAmountFromOrganizers: { $sum: "$amountFromOrganizers" }
        }
      }
    ]);

    // 2. Total earnings of this organizer
    const organizerEarning = await OrganizerEarning.aggregate([
      { $match: { organizerId: organizerObjectId } },
      {
        $group: {
          _id: null,
          totalOrganizerEarning: { $sum: "$organizerEarning" }
        }
      }
    ]);

    // 3. Total Revenue (sum of all payments of this organizer)
    const totalRevenueResult = await Payment.aggregate([
      { $match: { organizationId: organizerObjectId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }
        }
      }
    ]);

    // 4. Monthly revenue with payments + admin commission
    const monthlyRevenue = await Payment.aggregate([
      { $match: { organizationId: organizerObjectId } },
      {
        $lookup: {
          from: "adminearnings",
          localField: "eventId",
          foreignField: "eventId",
          as: "adminCommission"
        }
      },
      {
        $group: {
          _id: "$monthName",
          totalRevenue: { $sum: "$amount" },
          paymentHistory: {
            $push: {
              orderId: "$orderId",
              paymentId: "$paymentId",
              username: "$username",
              eventName: "$ordername",
              amount: "$amount",
              status: "$status",
              date: "$createdAt",
              adminCommission: { $arrayElemAt: ["$adminCommission.commissionAmount", 0] }
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // ✅ Final Response
    res.status(200).json({
      success: true,
      totalAmountFromOrganizers: adminEarning[0]?.totalAmountFromOrganizers || 0,
      totalOrganizerEarning: organizerEarning[0]?.totalOrganizerEarning || 0,
      totalRevenue: totalRevenueResult[0]?.totalRevenue || 0,
      monthlyRevenue
    });

  } catch (error) {
    console.error("Error in organizer dashboard stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

 
     export const getAdminRevenueFromOrganizer = asynchandler(async(req,res)=>{
         try {
       const {organizationId} = req.query

    const result = await AdminEarning.aggregate([
      {
        $match: {
          adminId: new mongoose.Types.ObjectId(organizationId),
        },
      },
      {
        $group: {
          _id: "$adminId",
          totalRevenue: { $sum: "$amountFromOrganizers" },
        },
      },
    ]);

    const totalRevenue = result[0]?.totalRevenue || 0;

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ error: "Server error" });
  }
     })


     export const  getBookingDetailsByCheckinNo = asynchandler(async(req,res)=>{
        try {
           const {organizationId,checkInNo} = req.query;

           if(!checkInNo){
            throw new ApiError(400, "checkInNo is required");
           }

           const result = await Payment.findOne({organizationId,entrycode:checkInNo});
           if(!result){
            throw new ApiError(400, "Booking not found");
           }
           return res.status(200).json(new ApiResponse(200,result,"Booking details found successfully"));
        } catch (error) {
           throw new ApiError(400, error.message);
        }
     })
