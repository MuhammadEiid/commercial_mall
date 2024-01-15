import nodemailer from "nodemailer";
import { catchError } from "../catchError.js";

export const sendEmail = catchError(async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const info = await transporter.verify();

  console.log("Server is ready to take our messages", info);

  const verify = await transporter.sendMail({
    from: `"Nexsus Mall" <${process.env.USER_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
  console.log("Message sent: %s", verify.messageId);
  return verify.accepted.length < 1 ? false : true;
});
export const contactEmail = catchError(async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  const info = await transporter.verify();

  console.log("Server is ready to take our messages", info);

  const verify = await transporter.sendMail({
    from: options.email,
    to: `${process.env.USER_EMAIL}`,
    subject: "Website Contact Form",
    html: options.html,
  });
  console.log("Message sent: %s", verify.messageId);
  return verify.accepted.length < 1 ? false : true;
});
