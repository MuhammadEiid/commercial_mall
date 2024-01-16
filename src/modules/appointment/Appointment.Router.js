import express from "express";
import * as appointment from "./Appointment.Controller.js";
import { validate } from "../../middleware/validate.js";
import { appointmentSchema } from "./appointmentValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authController.js";

const appointmentRouter = express.Router();

appointmentRouter
  .route("/")
  .post(validate(appointmentSchema), appointment.makeAppointment)
  .get(protectedRoutes, allowedTo("admin"), appointment.getAllEmails);

export default appointmentRouter;
