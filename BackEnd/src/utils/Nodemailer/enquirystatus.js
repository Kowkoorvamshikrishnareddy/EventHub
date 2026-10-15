import nodemailer from "nodemailer"
export const sendEnquiryStatusEmail = async ({
  to,
  name,
  email,
  phone,
  address,
  status,  
  reason,  
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  // Dynamic content based on status
  const isAccepted = status === "accepted"
  const statusIcon = isAccepted ? "✅" : "❌"
  const statusText = isAccepted ? "Accepted" : "Rejected"
  const statusColor = isAccepted ? "#28a745" : "#dc3545"
  const statusBgColor = isAccepted ? "#d4edda" : "#f8d7da"
  const statusBorderColor = isAccepted ? "#c3e6cb" : "#f5c6cb"

  const subject = `Profile Status: ${statusText} - ${name}`

  let mainMessage = ""
  let nextStepsContent = ""
  let additionalInfoSection = ""

  if (isAccepted) {
    mainMessage = `Congratulations ${name}! Your profile has been successfully selected.`
    nextStepsContent = `You will soon receive a separate email with your login credentials and further instructions to access our platform.`
    additionalInfoSection = `
      <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; color: #0c5460; font-size: 14px;">
          <strong>🚀 Get Ready:</strong> Keep an eye on your inbox for your login details. We're excited to have you on board!
        </p>
      </div>
    `
  } else {
    mainMessage = `Dear ${name},`
    nextStepsContent = `Thank you for your interest. Unfortunately, your profile could not be selected at this time.`
    additionalInfoSection = `
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; color: #856404; font-size: 14px;">
          <strong>💡 Reason for Rejection:</strong> ${reason || "No specific reason provided."}
        </p>
        <p style="margin: 10px 0 0 0; color: #856404; font-size: 14px;">
          We appreciate your application and encourage you to explore other opportunities with us in the future.
        </p>
      </div>
    `
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Profile Status: ${statusText}</title>
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
                    ${statusIcon} Profile Status: ${statusText}
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <p style="margin: 0 0 20px 0; color: #2c3e50; font-size: 16px;">
                    ${mainMessage}
                  </p>
                  
                  <p style="margin: 0 0 30px 0; color: #5a6c7d; font-size: 15px;">
                    ${nextStepsContent}
                  </p>

                  <!-- Status Alert Box -->
                  <div style="background-color: ${statusBgColor}; border-left: 4px solid ${statusColor}; padding: 20px; margin: 30px 0; border-radius: 4px;">
                    <p style="margin: 0; color: ${statusColor}; font-size: 16px; font-weight: 600;">
                      <strong>${statusIcon} Status: ${statusText.toUpperCase()}</strong>
                    </p>
                  </div>
                  
                  <!-- Enquiry Details Box (Only for rejected, or if you want to keep it for both) -->
                  ${!isAccepted ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; background-color: #f8f9ff; border: 2px solid #667eea; border-radius: 8px; margin: 20px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="margin: 0 0 20px 0; color: #667eea; font-size: 18px; font-weight: 600;">
                          Your Submitted Details
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
                  ` : ''}

                  ${additionalInfoSection}
                  
                  <p style="margin: 20px 0 0 0; color: #5a6c7d; font-size: 14px;">
                    If you have any questions, please don't hesitate to contact us.
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
