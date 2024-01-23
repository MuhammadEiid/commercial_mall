import { contactModel } from "../../../Database/models/Contact.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { catchError } from "../../utils/catchError.js";
import { contactMail } from "../../utils/nodemailer/contactMail.js";
import { contactEmail } from "../../utils/nodemailer/sendEmail.js";
import * as handler from "../controllersHandler.js";

// Add blog
const sendEmail = catchError(async (req, res, next) => {
  const { name, email, message, phone } = req.body;

  await contactEmail({
    from: email,
    html: contactMail(name, email, message, phone),
  });

  let user = await userModel.findOne({ email: email.toLowerCase() });
  if (user && user.isActive === true && user.role === "user") {
    const newContact = new contactModel(req.body);
    await newContact.save();

    if (!user.contactForm) {
      user.contactForm = []; // Initialize contactForm array if it doesn't exist
    }

    user.contactForm.push(newContact._id);
    await user.save();
  } else {
    const newContact = new contactModel(req.body);
    await newContact.save();
  }

  res.status(200).json({
    message: `Message Sent`,
  });
});

const getAllEmails = handler.getAll(contactModel, "Messages");

export { sendEmail, getAllEmails };
