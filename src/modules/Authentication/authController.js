import { userModel } from "../../../Database/models/User.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { verifyHTML } from "../../utils/nodemailer/verifyHTML.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { sendEmail } from "../../utils/nodemailer/sendEmail.js";
import { customAlphabet, nanoid } from "nanoid";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { resetPasswordHTML } from "../../utils/nodemailer/resetPwHTML.js";
// ----------------------------------------------------------- //
const signup = catchError(async (req, res, next) => {
  const {
    name,
    email,
    password,
    address,
    DOB,
    repeat_password,
    phone,
    gender,
  } = req.body;

  if (await userModel.findOne({ email: email.toLowerCase() })) {
    return next(new AppError("Email already exists", 409));
  }

  let token = jwt.sign(
    {
      email,
    },
    process.env.EMAIL_SIGNATURE,
    {
      expiresIn: "5h",
    }
  );

  let refreshToken = jwt.sign(
    {
      email,
    },
    process.env.EMAIL_SIGNATURE,
    {
      expiresIn: 60 * 60 * 24,
    }
  );

  let link = `https://nexusbhub.com/backend/auth/confirmEmail/${token}`;
  let refreshLink = `https://nexusbhub.com/backend/auth/newConfirmEmail/${refreshToken}`;

  let activationHTML = verifyHTML(link, refreshLink);

  await sendEmail({
    to: email,
    subject: "Activate your Account",
    html: activationHTML,
  });

  const newUser = await userModel.create({
    name,
    email,
    password,
    phone,
    address,
    DOB,
    gender,
    provider: "System",
  });
  return res.status(201).json({
    message:
      "User Registered Successfully, Please Check your mailbox to verify your account",
  });
});
// ----------------------------------------------------------- //
const login = catchError(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!user.verified) {
    return next(
      new AppError("User not verified, please check your email", 401)
    );
  }

  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return next(new AppError("Incorrect password"), 401);
  }

  let token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.LOGIN_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  let refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.LOGIN_TOKEN,
    {
      expiresIn: "365d",
    }
  );

  await userModel.findByIdAndUpdate({ _id: user.id }, { isActive: true });

  res.status(201).json({ message: "Welcome", token, refreshToken });
});
// ----------------------------------------------------------- //
const activateAccount = catchError(async (req, res, next) => {
  const { token } = req.params;

  jwt.verify(token, process.env.EMAIL_SIGNATURE, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    } else {
      const email = decoded.email;
      if (!decoded.email) {
        return next(
          new AppError(
            "Oops! Looks like you don't have an account yet, please register",
            404
          )
        );
      }
      let user = await userModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        { verified: true },
        { new: true } // Return the updated document
      );
      if (!user) {
        return next(
          new AppError(
            "Oops! Looks like you don't have an account yet, please register",
            404
          )
        );
      }

      if (user.verified) {
        return res.redirect(process.env.FRONTEND);
      }

      // matchedCount is the number of documents found for email
      if (user.matchedCount) {
        return res.redirect(process.env.FRONTEND);
      } else {
        // return res.status(404).redirect(process.env.FRONTEND_REGISTER_URL); //Signup page
        return next(
          new AppError(
            "Oops! Looks like you you don't have account yet, please register",
            404
          )
        );
      }
    }
  });
});

// ----------------------------------------------------------- //
const newConfirmEmail = catchError(async (req, res, next) => {
  const { token } = req.params;

  jwt.verify(token, process.env.EMAIL_SIGNATURE, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    } else {
      const email = decoded.email;
      if (!email) {
        return next(new AppError("Invalid Token", 400));
      }

      // Update the user document and retrieve the updated document
      let user = await userModel.findOne({ email: email.toLowerCase() });

      if (!user) {
        return next(
          new AppError(
            "Oops! Looks like you don't have an account yet, please register",
            404
          )
        );
      }

      if (user.verified) {
        // return res.redirect(process.env.FRONTEND_LOGIN_URL);
        return res.redirect(process.env.FRONTEND);
      }

      let newToken = jwt.sign(
        {
          email,
        },
        process.env.EMAIL_SIGNATURE,
        {
          expiresIn: 60 * 2,
        }
      );
      let link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
      let refreshLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${token}`;

      // Send the new verification email
      await sendEmail({
        to: email,
        subject: "Activate your account",
        html: verifyHTML(link, refreshLink),
      });

      return res
        .status(200)
        .send(
          `<p style="color:red">A New Verification Email Has Been Sent To Your Inbox</p>`
        );
    }
  });
});

// ----------------------------------------------------------- //
const forgetPassword = catchError(async (req, res, next) => {
  const { email } = req.body;

  let user = await userModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    return next(new AppError("User not found", 404));
  }
  const code = nanoid();
  const hashedCode = bcrypt.hashSync(code, parseInt(process.env.SALT));
  let token = jwt.sign(
    {
      email,
      sentCode: hashedCode,
    },
    process.env.RESET_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  const resetPasswordLink = `${req.protocol}://localhost:3000/sign/reset/${token}`;
  const userName = user.name.en || user.name.ar;
  await sendEmail({
    to: email,
    subject: "Reset Password",
    html: resetPasswordHTML(userName, resetPasswordLink),
  });

  await userModel.findOneAndUpdate(
    { email },
    {
      forgetCode: hashedCode,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "Forget mail has been sent" });
});

//================================ reset password =================================
const resetPassword = catchError(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  jwt.verify(token, process.env.RESET_TOKEN, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    } else {
      const email = decoded.email;
      if (!email) {
        return next(new AppError("Invalid Token", 400));
      }

      let user = await userModel.findOne({
        email: decoded?.email.toLowerCase(),
        forgetCode: decoded?.sentCode,
      });

      if (!user) {
        return res.redirect(process.env.FRONTEND);
      }

      user.password = newPassword;
      user.forgetCode = null;
      user.isActive = false;

      await user.save();

      return res.redirect(process.env.FRONTEND);
    }
  });
});

// --------------------- Gmail Login/Signup ----------------------- //
// Configure Passport.js with Google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "830222166488-8a6ucqcahne2ss6l6vi16vu3360dch6p.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://nexusbhub.com/backend/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Retrieve user details from the profile object
        const { id, emails, photos, displayName } = profile;

        // Check if the email is verified
        const email_verified = profile.emails[0].verified;
        if (!email_verified) {
          return done(new AppError("Email is not verified", 400));
        }

        let user = await userModel.findOne({
          email: emails[0].value.toLowerCase(),
        });

        if (user) {
          // User already exists
          if (user.isCustomPassword) {
            // If the user has a custom password, update it with the new password and hash it
            if (user.isModified("password")) {
              user.password = bcrypt.hashSync(
                user.password,
                parseInt(process.env.SALT)
              );
              user.isCustomPassword = false; // Reset the flag for custom password
            }
          }

          // Generate tokens for the user and attach them to the user object
          user.token = jwt.sign(
            {
              id: user._id,
              email: user.email,
              role: user.role,
            },
            process.env.LOGIN_TOKEN,
            {
              expiresIn: "5h",
            }
          );

          user.refreshToken = jwt.sign(
            {
              id: user._id,
              email: user.email,
              role: user.role,
            },
            process.env.LOGIN_TOKEN,
            {
              expiresIn: "365d",
            }
          );
          user.isActive = true;

          return done(null, user); // Return the user object with tokens attached
        }

        const generatedPassword = customAlphabet(
          "12345678!_=abcdefghm.,rqwpoi*",
          8
        ); // Implement this function to generate a secure random password
        const hashedPassword = bcrypt.hashSync(generatedPassword, 8);

        // Sign up user if user is not found
        const newUser = await userModel.create({
          email: emails[0].value.toLowerCase(),
          name: {
            en: displayName,
            ar: displayName,
          },
          password: hashedPassword,
          provider: "Google",
          role: "user",
          verified: true,
          isActive: true,
          isCustomPassword: true,
        });

        // Generate tokens for the new user and attach them to the user object
        newUser.token = jwt.sign(
          {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
          },
          process.env.LOGIN_TOKEN,
          {
            expiresIn: "5h",
          }
        );

        newUser.refreshToken = jwt.sign(
          {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
          },
          process.env.LOGIN_TOKEN,
          {
            expiresIn: "365d",
          }
        );

        await newUser.save();
        return done(null, newUser); // Return the new user object with tokens attached
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, (err, doc) => {
    done(null, doc);
  });
});

// ----------------------------------------------------------- //
// ---------------- Authentication Redirect ----------------- //
const loginSuccess = catchError(async (req, res, next) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "success",
      user: req.user,
      // cookies: req.cookies
    });
  }
});

const loginFailed = catchError(async (req, res, next) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

const logout = catchError(async (req, res, next) => {
  req.logout();
  res.redirect(process.env.FRONTEND);
});

const googleLogin = catchError(async (req, res, next) => {
  const { token, refreshToken } = req.user;

  // Redirect to the success URL with the token as a query parameter
  res.redirect(
    `${process.env.FRONTEND}/sign?token=${token}&refreshToken=${refreshToken}`
  );
});

// ----------------------------------------------------------- //
// --------------------- Authentication ---------------------- //
const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("Invalid Token"), 401);

  jwt.verify(token, process.env.LOGIN_TOKEN, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token has expired", 401));
      }
      return next(new AppError("Invalid token", 400));
    }

    const { id, role, iat } = decoded;
    let user;

    if (role === "admin" || role === "user") {
      user = await userModel.findById(id);
    } else {
      return next(new AppError("Invalid role", 400));
    }

    if (!user) {
      return next(new AppError("Invalid Token", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Please login first", 401));
    }
    if (user.passwordChangedAt) {
      const changePasswordDate = parseInt(
        user.passwordChangedAt.getTime() / 1000
      );

      if (changePasswordDate > iat) {
        return next(new AppError("Please login first", 401));
      }
    }

    req.user = user;
    next();
  });
});

// ----------------------------------------------------------- //
// ---------------------- Authorization ---------------------- //

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You are not authorized to access this endpoint", 401)
      );
    next();
  });
};

export {
  protectedRoutes,
  allowedTo,
  signup,
  login,
  activateAccount,
  newConfirmEmail,
  forgetPassword,
  resetPassword,
  loginSuccess,
  loginFailed,
  logout,
  googleLogin,
};
