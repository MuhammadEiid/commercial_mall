import express from "express";
import * as user from "./authController.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema } from "./authValidation.js";
import passport from "passport";

const authRouter = express.Router();

authRouter.route("/signup").post(user.signup);
authRouter.route("/login").post(validate(loginSchema), user.login);

authRouter.route("/login/success").get(user.loginSuccess);
authRouter.route("/login/failed").get(user.loginFailed);
authRouter.route("/logout").get(user.logout);
authRouter.route("/handle-google-login").get(user.googleLogin);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    // Ensure that the user object is attached to the req object
    const { token, refreshToken } = req.user || {};

    // Redirect to the success URL with the token as a query parameter
    res.redirect(
      `${process.env.FRONTEND}/?token=${token}&refreshToken=${refreshToken}`
    );
  }
);

authRouter.route("/confirmEmail/:token").get(user.activateAccount);
authRouter.route("/newConfirmEmail/:token").get(user.newConfirmEmail);

authRouter.post("/forget", user.forgetPassword);
authRouter.post("/reset/:token", user.resetPassword);

export default authRouter;
