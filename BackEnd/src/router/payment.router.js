import { Router } from "express";
import { isAuth } from "../middleware/Auth.middleware.js";
 import { Createorder,getAdminPayments,getAdminRevenueFromOrganizer,getAllPayments,getBookingDetailsByCheckinNo,getEventWiseRevenue,getMonthlyRevenue,getRevenue,getTopEventStats,organizerDashboardstats,verifyPayment } from "../controller/razorpay.controller.js";
const router = Router();

router.post("/create-order", isAuth, Createorder);
router.post("/verify-payment", verifyPayment);
router.get('/get-revenue',isAuth,getRevenue)
 router.get('/get-top-status',isAuth,getTopEventStats)
 router.get('/get-monthly-revenue',isAuth,getMonthlyRevenue)
 router.get('/get-event-revenue',isAuth,getEventWiseRevenue)
 router.get('/get-all-payments',isAuth,getAllPayments)
 router.get('/get-admin-payments',isAuth,getAdminPayments)

 router.get('/get-organizer-earning-status',isAuth,organizerDashboardstats)

 router.get('/get-admin-revenue-from-organizer',isAuth,getAdminRevenueFromOrganizer)

 router.get('/get-booking-data',isAuth,getBookingDetailsByCheckinNo)

export default router;
