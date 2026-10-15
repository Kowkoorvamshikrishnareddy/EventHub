 import jwt from "jsonwebtoken";
 import { asynchandler } from "../utils/AsyncHandler/AsyncHandler.js";
 import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError/ApiError.js";


   export const isAuth = asynchandler(async (req, res, next) => {
     try {
       let token = null;

       // 1. Check Authorization Bearer header
       if (
         req.headers.authorization &&
         req.headers.authorization.startsWith("Bearer ")
       ) {
         token = req.headers.authorization.split(" ")[1];
       }

       // 2. Fallback to cookies
       if (!token && req.cookies) {
         token = req.cookies.accessToken || req.cookies.refreshToken;
       }

       if (!token) {
         throw new ApiError(401, "Unauthorized User Please Log in");
       }

       let decoded = null;
       try {
         decoded = jwt.verify(token, process.env.JWT_SECRET);
       } catch {
         try {
           decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
         } catch {
           throw new ApiError(401, "Invalid or expired session token");
         }
       }

       const userId = decoded?.userId || decoded?.id || decoded?._id;
       if (!userId) {
         throw new ApiError(401, "Invalid token payload");
       }

       const user = await User.findById(userId);
       if (!user) {
         throw new ApiError(401, "User not found");
       }

       req.user = user;
       next();
     } catch (error) {
       throw new ApiError(401, error.message || "Unauthorized");
     }
   })