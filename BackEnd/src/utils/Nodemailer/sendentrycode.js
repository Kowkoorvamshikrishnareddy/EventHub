// // // utils/sendEntryCodeEmail.ts
// // import nodemailer from "nodemailer";
// // export const sendEntryCodeEmail = async ({
// //   to,
// //   username,
// //   ordername,
// //   amount,
// //   entrycode,
// // }) => {
// //   const transporter = nodemailer.createTransport({
// //     host: process.env.SMTP_HOST,
// //     port: Number.parseInt(process.env.SMTP_PORT || "587"),
// //     secure: false,
// //     auth: {
// //       user: process.env.SMTP_EMAIL,
// //       pass: process.env.SMTP_PASSWORD,
// //     },
// //   });

// //   const subject = `✅ Your Event Entry Code - ${ordername}`;

// //   const html = `
// //     <h2>Hi ${username},</h2>
// //     <p>Thank you for your payment of ₹${amount.toFixed(2)} for the event <strong>${ordername}</strong>.</p>
// //     <p>Your unique <strong>Entry Code</strong> is:</p>
// //     <h1 style="background: #f4f4f4; padding: 10px 20px; border-radius: 5px; display: inline-block; font-family: monospace;">
// //       ${entrycode}
// //     </h1>
// //     <p>Please present this code at the event for entry.</p>
// //     <br>
// //     <p>Thanks,<br/>Event Management Team</p>
// //   `;

// //   await transporter.sendMail({
// //     from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
// //     to,
// //     subject,
// //     html,
// //   });
// // };



// import nodemailer from "nodemailer";

// const sendEntryCodeEmail = async ( email, name, eventName, entryCode) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number.parseInt(process.env.SMTP_PORT || "587"),
//     secure: false,
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: `"Event Management" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `Your Entry Code for ${eventName}`,
//     html: `
//       <h2>Hi ${name},</h2>
//       <p>Thank you for booking <strong>${eventName}</strong>.</p>
//       <p>Your entry code is: <strong>${entryCode}</strong></p>
//       <p>Please bring this code to the event for verification.</p>
//       <br/>
//       <p>Regards,<br/>Event Management Team</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };

// export default sendEntryCodeEmail


import nodemailer from "nodemailer";

 const sendEntryCodeEmail = async (
  to,
  username,
  ordername,
  amount,
  entrycode,
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const subject = `✅ Your Event Entry Code - ${ordername}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Entry Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fa; line-height: 1.6;">
      
      <!-- Email Container -->
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
        <tr>
          <td style="padding: 40px 20px;">
            
            <!-- Main Content Card -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                    🎟️ Event Entry Code
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <p style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px;">
                    Hi ${username},
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #5a6c7d; font-size: 15px;">
                    Thank you for your payment of <strong>₹${amount.toFixed(2)}</strong> for the event <strong>${ordername}</strong>. Your booking has been confirmed successfully!
                  </p>
                  
                  <!-- Event Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; margin: 20px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="margin: 0 0 20px 0; color: #10b981; font-size: 18px; font-weight: 600;">
                          Event Information
                        </h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <strong style="color: #2c3e50; font-size: 14px;">Event Name:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">${ordername}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <strong style="color: #2c3e50; font-size: 14px;">Amount Paid:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">₹${amount.toFixed(2)}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #2c3e50; font-size: 14px;">Attendee:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">${username}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Entry Code Section -->
                  <div style="text-align: center; margin: 30px 0;">
                    <p style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">
                      Your Unique Entry Code:
                    </p>
                    
                    <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 20px 30px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3); margin: 10px 0;">
                      <span style="color: #ffffff; font-size: 32px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 3px;">
                        ${entrycode}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Instructions -->
                  <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">
                      📋 Important Instructions:
                    </h4>
                    <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px;">
                      <li style="margin-bottom: 5px;">Please present this entry code at the event venue for verification</li>
                      <li style="margin-bottom: 5px;">Keep this email handy or take a screenshot of your entry code</li>
                      <li style="margin-bottom: 5px;">Arrive at least 15 minutes before the event starts</li>
                      <li>Contact support if you face any issues at the venue</li>
                    </ul>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #5a6c7d; font-size: 14px; text-align: center;">
                    We're excited to see you at the event! If you have any questions, please don't hesitate to contact our support team.
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; color: #6c757d; font-size: 13px; text-align: center;">
                    Best regards,<br>
                    <strong>Event Management Team</strong><br>
                    <span style="color: #adb5bd;">This is an automated confirmation - please save this email for your records</span>
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  });
};

export default sendEntryCodeEmail
