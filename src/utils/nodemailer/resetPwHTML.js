export const resetPasswordHTML = (userName, resetLink) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
  
      <style>
          body,
          html {
              margin: 0;
              padding: 0;
          }
  
          /* Set background color for the whole email */
          body {
              background-color: #13263D;
              /* Updated background color */
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              /* Text color updated to match the darker color */
          }
  
          /* Container for the email content */
          .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #13263D;
              /* Match the background color */
              padding: 20px;
              border-radius: 8px;
              box-sizing: border-box;
              /* Added to include padding in width calculation */
          }
  
          /* Header styles */
          .header {
              text-align: center;
          }
  
          /* Logo styles */
          .logo {
              font-size: 24px;
              font-weight: bold;
              color: white !important;
              margin-bottom: 10px;
              /* Add some decorative styling */
              border-bottom: 2px solid white;
              padding-bottom: 5px;
          }
  
          /* Body content styles */
          .content {
              padding: 5px 0 20px 0;
          }
  
          /* Button styles */
          .button {
              display: inline-block;
              padding: 8px 16px;
              background-color: rgb(90, 9, 9);
              color: #fafafa;
              text-decoration: none;
              border-radius: 20px;
              text-align: center;
          }
  
          /* Footer styles */
          .footer {
              text-align: center;
              color: white;
              /* Accent color remains the same */
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="header">
              <!-- Replace the image logo with text -->
              <div class="logo" style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 10px;">
                  <span>Ne<span style="color: red; letter-spacing: 1.2;">x</span>us</span>
              </div>
              <h2 style="color: whitesmoke;">Password Reset</h2>
          </div>
          <div class="content">
              <p style="color: white;">Dear ${userName},</p>
              <p style="color: white;">You have requested a password reset. Please click the button below to reset your
                  password:</p>
              <div style="text-align: center;">
                  <a href="${resetLink}" class="button" style="color: #fafafa;">Reset Password</a>
              </div>
              <br>
              <p style="color: white">If you did not request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>This is an automated message. Please do not reply.</p>
          </div>
      </div>
  </body>
  
  </html>`;
};
