
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
}) 
import nodemailer from "nodemailer"
class ApiError extends Error {
  statusCode

  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}


export const sendOtpToMail = async (options) => {
  const isPasswordType = options?.type === "password";
  const credential = isPasswordType ? options?.password : options?.otp;

  console.log(`[EventHub Mailer] Dispatching ${isPasswordType ? "password" : "OTP"} (${credential}) for ${options.email}`);

  // 1. Try HTTPS email relay via Vercel (bypasses Render SMTP port blocking)
  try {
    const relayUrl = "https://frontend-mocha-xi-55.vercel.app/api/send-email";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const relayRes = await fetch(relayUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: options.email,
        subject: options.subject || (isPasswordType ? "Your Admin Login Credentials" : "Your Verification Code"),
        text: options.message || `Your ${isPasswordType ? "password" : "OTP"} is ${credential}`,
        otp: credential,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (relayRes.ok) {
      console.log(`[EventHub Mailer] Successfully sent via HTTPS relay to ${options.email}`);
      return;
    }
  } catch (relayErr) {
    console.warn("[EventHub Mailer] HTTPS relay attempt:", relayErr.message);
  }

  // 2. Direct SMTP fallback (with short 3-second timeouts)
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP credentials not configured. OTP for " + options.email + ": " + credential);
      return;
    }

    const port = Number.parseInt(process.env.SMTP_PORT || "465");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 3000,
      greetingTimeout: 3000,
      socketTimeout: 3000,
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${isPasswordType ? "Login Credentials" : "OTP Verification"}</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: sans-serif; background-color: #f8f9fa;">
        <table role="presentation" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="text-align: center;">
              <h2 style="color: #4f46e5; margin-bottom: 20px;">${isPasswordType ? "🔐 Login Credentials" : "🔐 Verification Code"}</h2>
              <p style="font-size: 16px; color: #374151;">Hello ${options?.user || "User"},</p>
              <p style="font-size: 14px; color: #6b7280;">Your verification code for EventHub is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5; background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0; display: inline-block;">
                ${credential}
              </div>
              <p style="font-size: 13px; color: #9ca3af;">This code is valid for 5 minutes. Do not share it with anyone.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const message = {
      from: `"${process.env.FROM_NAME || "EventHub"}" <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
      to: options.email,
      subject: options.subject || (isPasswordType ? "Your Admin Login Credentials" : "Your Verification Code"),
      text: options.message || `Your ${isPasswordType ? "password" : "OTP"} is ${credential}`,
      html: htmlContent,
    };

    await transporter.sendMail(message);
    console.log(`[EventHub Mailer] Direct SMTP sent to ${options.email}`);
  } catch (error) {
    console.warn(`[EventHub Mailer] Direct SMTP fallback failed: ${error.message}. OTP code: ${credential}`);
  }
};

