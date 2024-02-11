import fs from "fs";

export const newsletter = (blogTitle, blogDescription, imageCover) => {
  const imagePath = `./uploads/blogs/${imageCover}`;

  // Read the image file and encode it to Base64
  const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #13263D;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #13263D;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          img {
              max-width: 100%;
              height: auto;
              border-radius: 5px;
          }
  
          a {
              text-decoration: none;
          }
  
          h1 {
              color: #333333;
          }
  
          p {
              color: #666666;
          }
  
          .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #dddddd;
              text-align: center;
              color: #888888;
          }
      </style>
  </head>
  
  <body margin: 0; padding: 20px; box-sizing: border-box; background-color: #13263D;">
  
  
      <div class="container">
          <h2
              style="color: white; border-bottom: 1px solid #dddddd; padding-bottom: 10px; font-size: 21px; line-height: 1.3;">
              Ne<span style="color: red;">x</span>us Newsletter</h2>
          <h1 style="color: white; font-size: 18px; text-align: center;">${blogTitle}</h1>
          <div style="text-align: center;">
              <img src="data:image/jpeg;base64,${imageBase64}" alt="Blog Cover Image" style="width:60%">
          </div>
          <p style="font-size: 14px">${blogDescription}</p>
  
          <div class="footer">
              <p>Check it out on our <a href="https://nexusbhub.com/" style="color:red;">website!</a></p>
          </div>
      </div>
  </body>
  
  </html>`;
};
