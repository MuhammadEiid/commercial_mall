import { blogModel } from "../../../Database/models/Blog.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";
import { addContentSchema } from "./blogValidation.js";
import { promisify } from "util";
import fs from "fs";
import { sendEmail } from "../../utils/nodemailer/sendEmail.js";
import { newsletter } from "../../utils/nodemailer/newsletter.js";
import { newsletterModel } from "../../../Database/models/Newsletter.js";

// Function to promisify fs.unlink
const unlinkAsync = promisify(fs.unlink);

// Add blog
const addBlog = catchError(async (req, res, next) => {
  const { error } = addContentSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }
  req.body.imageCover = req.file.filename;

  const blog = new blogModel({
    ...req.body,
    user: req.user._id,
  });

  await blog.save();

  await userModel.findByIdAndUpdate(
    req.user._id,
    { $push: { blogs: blog._id } },
    { new: true }
  );

  const emailSubject = "New Blog Added";
  const title = `${blog.title.en}`;
  const description = `${blog.description.en}`;
  const cover = `${blog.imageCover}`;
  let newsletterHTML = newsletter(title, description, cover);

  // Fetch all subscribers
  const subscribers = await newsletterModel.find();

  if (subscribers.length > 0) {
    // Send newsletters to subscribers
    for (const subscriber of subscribers) {
      try {
        await sendEmail({
          to: subscriber.email,
          subject: emailSubject,
          html: newsletterHTML,
        });
      } catch (error) {
        return next(
          new AppError(
            `Error sending email to ${subscriber.email}: ${error.message}`,
            400
          )
        );
      }
    }
  }
  res.status(200).json({
    message: `Blog Added Successfully`,
    blog,
  });
});

const getAllBlogs = handler.getAll(blogModel, "Blogs");

const updateBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  if (req.file) {
    req.body.imageCover = req.file.filename;
  }

  const updatedBlog = await blogModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { $set: req.body },
    { new: true }
  );

  if (updatedBlog) {
    res.status(200).json({
      message: `Blog Updated Successfully`,
      updatedBlog,
    });
  } else {
    next(new AppError(`Blog Not Found`, 404));
  }
});

const deleteBlog = catchError(async (req, res, next) => {
  const { id } = req.params;

  const blog = await blogModel.findByIdAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (blog) {
    // Remove the Blog from the user's Blogs array
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { blogs: blog._id } },
      { new: true }
    );

    res.status(200).json({
      message: `Blog is Deleted Successfully`,
    });
  } else {
    next(new AppError(`Blog Not Found`, 404));
  }
});

const getBlog = handler.getOne(blogModel, "Blog");

export { addBlog, getAllBlogs, updateBlog, deleteBlog, getBlog };
