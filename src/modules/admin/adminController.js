import { reviewModel } from "../../../Database/models/Review.model.js";
import { userModel } from "../../../Database/models/User.model.js";
import { blogModel } from "../../../Database/models/Blog.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import * as handler from "../controllersHandler.js";

// Add Doctor or Patient or Admin
const addAdmin = catchError(async (req, res, next) => {
  let email = req.body.email;

  const emailExists = await userModel.findOne({ email });
  if (emailExists) {
    return next(new AppError("This email already exists", 400));
  }
  // If User Added Profile Picture
  if (req.file) {
    req.body.profilePic = req.file.profilePic;
  }

  req.body.role = "admin";
  req.body.verified = true;

  const document = new userModel({
    ...req.body,
    createdBy: req.user._id,
  });

  let response = {};
  response = document;
  await document.save();
  res.status(200).json({
    message: `Admin Added Successfully`,
  });
});

const getAllAdmins = handler.getAllWithoutPagination(
  userModel,
  "Admins",
  "admin"
);
const getAdmin = handler.getOne(userModel, "Admin");
const updateAdminProfile = handler.updateProfile(userModel, "Admin");
const changePassword = handler.changePassword(userModel, "Admin");
const changeAdminPassword = handler.changeUserPasword(userModel, "Admin");
const logout = handler.logout(userModel, "Admin");
const getAdminProfile = handler.getUserProfile(userModel, "Admin");

const addUser = handler.addOne(userModel, "User", "user");
const deleteUser = handler.deleteUser(userModel, "User");
const getAllUsers = handler.getAllWithoutPagination(userModel, "Users", "user");
const getUser = handler.getOne(userModel, "User");
const changeUserPassword = handler.changeUserPasword(userModel, "User");
const checkEmail = handler.checkEmail("User");

// Reviews
const deleteReview = catchError(async (req, res, next) => {
  const review = await reviewModel.findByIdAndDelete({
    _id: req.params.id,
  });

  if (review) {
    res.status(200).json({
      message: `Review Deleted Successfully`,
    });
  } else {
    next(new AppError(`Review Not Found`, 404));
  }
});
const changeRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await userModel.updateOne(
    { _id: id, role: { $ne: "admin" } },
    { role },
    { new: true }
  );
  if (!user.modifiedCount) {
    return next(
      new AppError(`User is not found or role can't be changed !`, 400)
    );
  }
  return res
    .status(200)
    .json({ message: "Role has been updated successfully !" });
};

const getAllBlogs = handler.getAllWithoutPaginationNoRole(blogModel, "Blogs");
const getAllReviews = handler.getAllWithoutPaginationNoRole(
  reviewModel,
  "Reviews"
);

export {
  addUser,
  getAllBlogs,
  getAllReviews,
  getAllUsers,
  deleteUser,
  getUser,
  getAdmin,
  addAdmin,
  updateAdminProfile,
  changeAdminPassword,
  getAllAdmins,
  changeUserPassword,
  changePassword,
  logout,
  getAdminProfile,
  deleteReview,
  changeRole,
  checkEmail,
};
