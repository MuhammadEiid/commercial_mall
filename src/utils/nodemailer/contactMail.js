export const contactMail = (name, email, message, phone) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form</title>
  </head>
  
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; box-sizing: border-box; background-color: #13263D;">
  
      <div style="max-width: 600px; margin: 0 auto;  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 20px;">
  
          <h2 style="color: white; border-bottom: 2px solid white; padding-bottom: 10px; font-size: 24px; line-height: 1.3;">
              Nexus Contact Form</h2>
  
          <p style="font-size: 16px; line-height: 1.6; color: white;"><strong style="color: red;">Name:</strong>
              ${name}</p>
          <p style="font-size: 16px; line-height: 1.6; color: white;"><strong style="color: red;">Email:</strong>
              ${email}</p>
          <p style="font-size: 16px; line-height: 1.6; color: white;"><strong style="color: red;">Phone Number:</strong>
              ${phone}</p>
          <p style="font-size: 16px; line-height: 1.6; color: white;"><strong style="color: red;">Message:</strong>
              ${message}</p>
  
      </div>
  
  </body>
  
  </html>
  `;
};
