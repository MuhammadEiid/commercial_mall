import { newsletterModel } from "../../../Database/models/Newsletter.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

const subscribe = catchError(async (req, res, next) => {
  const { email } = req.body;
  let isEmailExist = await newsletterModel.findOne({
    email: email.toLowerCase(),
  });
  if (!isEmailExist) {
    const subscriber = new newsletterModel({ email });
    await subscriber.save();
    res.status(201).send("Subscription successful!");
  } else {
    return next(new AppError("Email already exists", 409));
  }
});

const getAllSubscribers = handler.getAll(newsletterModel, "Subscribers");

export { subscribe, getAllSubscribers };
