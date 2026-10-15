import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import ApiError from "./utils/ApiError/ApiError.js";
import { connectDB } from "./dbconfig/ConnectDb.js";
import userRouter from "./router/user.router.js";
import createEventRouter from "./router/event.router.js";
import CategoryRouter from "./router/category.router.js";
import assignEventRouter from "./router/assignevent.router.js";
import paymentRouter from "./router/payment.router.js";
import enquiryRouter from "./router/enquiry.router.js";

const app = express();
const port = Number(process.env.PORT || 6000);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = new Set(
  ["http://localhost:3000", process.env.FRONTEND_URL]
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, "")),
);

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header are server-to-server or command-line calls.
      if (!origin || allowedOrigins.has(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

const uploadPath = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadPath, { recursive: true });

app.get("/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  return res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "starting",
    database: databaseReady ? "connected" : "disconnected",
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", createEventRouter);
app.use("/api/v1/category", CategoryRouter);
app.use("/api/v1/assignevnents", assignEventRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/enquiry", enquiryRouter);

app.use((err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  console.error("Unhandled request error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

async function startServer() {
  const requiredVariables = [
    "MONGO_URI",
    "JWT_SECRET",
    "REFRESH_TOKEN_SECRET",
  ];
  const missingVariables = requiredVariables.filter((key) => !process.env[key]);
  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
  }

  const optionalVariables = [
    "CLOUDINARY_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "SMTP_HOST",
    "SMTP_EMAIL",
    "SMTP_PASSWORD",
    "FROM_EMAIL",
  ];
  const missingOptional = optionalVariables.filter((key) => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn(`⚠️ Optional services unconfigured: ${missingOptional.join(", ")} (fallback modes active)`);
  }

  await connectDB();
  return app.listen(port, "0.0.0.0", () => {
    console.log(`EventHub API is listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("EventHub API failed to start:", error.message);
  process.exit(1);
});
