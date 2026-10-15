 
import nodemailer from "nodemailer"

export const sendVerificationEmail = async ({ to, subject, name, email, phone, address, link }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Enquiry Request</title>
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
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                    📋 New Enquiry Request
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <p style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px;">
                    Hello Organizer,
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #5a6c7d; font-size: 15px;">
                    A new customer enquiry has been received. Please find the details below:
                  </p>
                  
                  <!-- Customer Details Box -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #f8f9ff; border: 2px solid #667eea; border-radius: 8px; margin: 20px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="margin: 0 0 20px 0; color: #667eea; font-size: 18px; font-weight: 600;">
                          Customer Information
                        </h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <strong style="color: #2c3e50; font-size: 14px;">Name:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">${name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <strong style="color: #2c3e50; font-size: 14px;">Email:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">${email}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                              <strong style="color: #2c3e50; font-size: 14px;">Phone:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">${phone}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #2c3e50; font-size: 14px;">Address:</strong>
                              <span style="color: #5a6c7d; font-size: 15px; margin-left: 10px;">${address}</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 20px 0; color: #5a6c7d; font-size: 15px; text-align: center;">
                    Click below to confirm and save this enquiry:
                  </p>
                  
                  <!-- Action Button -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); border-radius: 8px; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">
                        <a href="${link}" style="display: inline-block; padding: 15px 30px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                          ✅ Proceed & Save
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                      <strong>⏰ Important:</strong> This link is secure and will expire after use for security purposes.
                    </p>
                  </div>
                  
                  <p style="margin: 20px 0 0 0; color: #5a6c7d; font-size: 14px;">
                    If you didn't expect this enquiry, please contact your system administrator immediately.
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; color: #6c757d; font-size: 13px; text-align: center;">
                    Best regards,<br>
                    <strong>Your Business Team</strong><br>
                    <span style="color: #adb5bd;">This is an automated message - please do not reply</span>
                  </p>
                </td>
              </tr>
              
            </table>
            
          </td>
        </tr>
      </table>
      
    </body>
    </html>
  `

  await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
  })
}
