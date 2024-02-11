import express from "express";
import { dbConnection } from "./Database/dbConnection.js";
import dotenv from "dotenv";
import { bootstrap } from "./src/bootstrap.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import cookieSession from "cookie-session";

const app = express();

dotenv.config();
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({})); //allow cross-origin requests from CLIENT_URL and send cookies
// app.set("trust proxy", 1); //trust the first proxy in front of the app (if running on Heroku or similar) and not required for local envs

app.use(cookieParser());
app.use("/backend/", express.static("uploads"));

dbConnection();
bootstrap(app);

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());
app.listen(process.env.SERVER_PORT, () =>
  console.log(
    `Server is running on https://nexusbhub.com/backend/${process.env.SERVER_PORT}/ `
  )
);
