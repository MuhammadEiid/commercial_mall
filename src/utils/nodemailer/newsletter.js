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
          background-color: #f4f4f4;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        img {
          max-width: 100%;
          height: auto;
          border-radius: 5px;
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
    <body>
      <div class="container">
        <h1>${blogTitle}</h1>
        <img src="data:image/jpeg;base64,${imageBase64}" alt="Blog Cover Image">
        <p>${blogDescription}</p>

        <div class="footer">
          <p>Check it out on our website!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
