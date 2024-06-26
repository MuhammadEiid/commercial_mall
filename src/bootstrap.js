import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import authRouter from "./modules/Authentication/authRouter.js";
import backgroundRouter from "./modules/Background/Background.Router.js";
import adminRouter from "./modules/admin/adminRouter.js";
import blogRouter from "./modules/blog/Blog.Router.js";
import brandRouter from "./modules/brands/Brands.Router.js";
import chatRouter from "./modules/chatbot/Chatbot.Router.js";
import contactRouter from "./modules/contact/Contact.Router.js";
import featureRouter from "./modules/features/Features.Router.js";
import galleryRouter from "./modules/gallery/Gallery.Router.js";
import homeRouter from "./modules/home/Home.Router.js";
import mallRouter from "./modules/mall/Mall.Router.js";
import newsletterRouter from "./modules/newsletter/newsletter.Router.js";
import portfolioRouter from "./modules/portfolio/Portfolio.Router.js";
import reviewRouter from "./modules/review/reviewRouter.js";
import serviceRouter from "./modules/services/Service.Router.js";
import timelineRouter from "./modules/timeline/Timeline.Router.js";
import userRouter from "./modules/user/userRouter.js";
import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/auth/admin", adminRouter);
  app.use("/reviews", reviewRouter);
  app.use("/blogs", blogRouter);
  app.use("/gallery", galleryRouter);
  app.use("/service", serviceRouter);
  app.use("/feature", featureRouter);
  app.use("/contact", contactRouter);
  app.use("/chatbot", chatRouter);
  app.use("/brands", brandRouter);
  app.use("/mall", mallRouter);
  app.use("/newsletter", newsletterRouter);
  app.use("/timeline", timelineRouter);
  app.use("/home", homeRouter);
  app.use("/portfolio", portfolioRouter);
  app.use("/background", backgroundRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint not found", 404));
  });

  app.use(globalErrorHandler);
}
