import { appointmentModel } from "../../../Database/models/Appointment.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { catchError } from "../../utils/catchError.js";
import { appointmentMail } from "../../utils/nodemailer/appointmentMail.js";
import { sendEmail } from "../../utils/nodemailer/sendEmail.js";
import * as handler from "../controllersHandler.js";

const makeAppointment = catchError(async (req, res, next) => {
  const { mainType, secondaryType, name, email } = req.body;

  // Validate Main Type
  const validMainTypes = ["Administrative", "Medical", "Commercial"];
  if (mainType && !validMainTypes.includes(mainType)) {
    return next(new AppError("Invalid Main Type value", 400));
  }

  if (!secondaryType || (!secondaryType.ar && !secondaryType.en)) {
    return next(
      new AppError(
        "At least one of secondaryType.ar or secondaryType.en is required",
        400
      )
    );
  }
  await sendEmail({
    to: email,
    subject: "Appointment Confirmation",
    html: appointmentMail(name),
  });

  let user = await userModel.findOne({ email: email.toLowerCase() });
  if (user && user.role === "user") {
    const appointment = new appointmentModel(req.body);
    await appointment.save();

    if (!user.appointment) {
      user.appointment = []; // Initialize appointment array if it doesn't exist
    }

    user.appointment.push(appointment._id);
    await user.save();
  } else {
    const appointment = new appointmentModel(req.body);
    await appointment.save();
  }

  res.status(200).json({
    message: `Message Sent`,
  });
});

const getAllEmails = handler.getAll(appointmentModel, "Appointments");

export { makeAppointment, getAllEmails };
