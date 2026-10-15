import { Router } from "express";
import { isAuth } from "../middleware/Auth.middleware.js";
 
import { createEnquiry, getAllEnquiry, verifyEnquiry } from "../controller/Enquiry.controller.js";
import { updateEnquiryStatus } from "../controller/updateEnquiry.controller.js";
const router = Router();

router.post("/create-enquire", createEnquiry);
router.get("/verify/:token", verifyEnquiry);
router.get('/get-all-enquiry',getAllEnquiry)
router.put('/update-enquiry-status',isAuth,updateEnquiryStatus)
 

export default router;
