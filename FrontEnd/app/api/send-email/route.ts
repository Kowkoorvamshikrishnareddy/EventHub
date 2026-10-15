import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, html, text, otp } = await req.json();

    if (!to) {
      return NextResponse.json({ success: false, error: "Recipient email is required" }, { status: 400 });
    }

    const emailUser = process.env.SMTP_EMAIL || "vamshikrishnareddy6060@gmail.com";
    const emailPass = process.env.SMTP_PASSWORD || "lwkamekyxoyytnvo";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const info = await transporter.sendMail({
      from: `"EventHub" <${emailUser}>`,
      to,
      subject: subject || (otp ? `Your EventHub Verification Code: ${otp}` : "Your EventHub Notification"),
      text: text || (otp ? `Your verification code is: ${otp}` : "Notification from EventHub"),
      html: html || (otp ? `<div style="font-family:sans-serif;padding:20px;text-align:center;"><h2>EventHub Verification Code</h2><div style="font-size:32px;font-weight:bold;color:#4f46e5;letter-spacing:4px;padding:15px;background:#f3f4f6;border-radius:8px;display:inline-block;">${otp}</div><p>Valid for 5 minutes.</p></div>` : undefined),
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Vercel email route failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
