import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import dotenv from "dotenv";
import { bootstrap } from "./src/bootstrap.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import { globalErrorHandler } from "./src/middleware/globalErrorHandler.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

const app = express();
// Secure HTTP Headers
app.use(helmet());

// Limit Requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in 15 minutes",
});

app.use(limiter);
dotenv.config();
app.use(globalErrorHandler);
app.use(express.json());

// Data Sanitization against NoSQL Injections
app.use(ExpressMongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Prevent parameters pollution
app.use(
  hpp()
  // {whitelist: ["x", "y"],}
);

if (process.env.MODE === "development") {
  app.use(morgan("dev"));
}

app.use(bodyParser.json());
app.use(cors()); //allow cross-origin requests from CLIENT_URL and send cookies
// app.set("trust proxy", 1); //trust the first proxy in front of the app (if running on Heroku or similar) and not required for local envs

app.use(cookieParser());
app.use("/backend/", express.static("uploads"));

dbConnection();

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception! Shutting down ...");

  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});

bootstrap(app);

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());
const server = app.listen(process.env.SERVER_PORT, () =>
  console.log(
    `Server is running on https://nexusbhub.com/backend/${process.env.SERVER_PORT}/ `
  )
);

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection! Shutting down ...");

  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});
