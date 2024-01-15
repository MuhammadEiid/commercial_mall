import { AppError } from "../utils/AppError.js";
import { catchError } from "../utils/catchError.js";
import { APIFeatures } from "../utils/APIFeature.js";
import bcrypt from "bcrypt";
import { userModel } from "../../Database/models/User.model.js";
import { blogModel } from "../../Database/models/Blog.model.js";

// Add User or Admin
const addOne = (model, type, role) => {
  return catchError(async (req, res, next) => {
    let email = req.body.email;

    const emailExists = await model.findOne({ email });
    if (emailExists) {
      return next(new AppError("This email already exists", 400));
    }

    // If User Added Profile Picture
    if (req.file) {
      req.body.profilePic = req.file.profilePic;
    }

    if (role === "admin") {
      req.body.verified = true;
    }
    const document = new model({
      ...req.body,
      createdBy: req.user._id,
    });

    let response = {};
    response[type] = document;
    await document.save();
    res.status(200).json({
      message: `${type} Added Successfully`,
      response,
    });
  });
};

// Get All Data
const getAll = (model, type, role) => {
  return catchError(async (req, res, next) => {
    let apiFeatures;

    if (model === blogModel) {
      apiFeatures = new APIFeatures(model.find().populate("user"), req.query);
    } else {
      apiFeatures = new APIFeatures(model.find(), req.query);
    }

    apiFeatures = apiFeatures.fields().pagination().search().sort();

    if (role === "admin") {
      apiFeatures.filter().mongooseQuery.find({ role: "admin" });
    }
    if (role === "user") {
      apiFeatures.filter().mongooseQuery.find({ role: "user" });
    }

    const document = await apiFeatures.mongooseQuery;

    let response = {};
    response[type] = document;

    if (document.length > 0) {
      res.status(200).json({
        message: "Success",
        page: apiFeatures.page,
        response,
      });
    } else {
      next(new AppError(`No ${type} Found`, 404));
    }
  });
};

const getAllWithoutPagination = (model, type, role) => {
  return catchError(async (req, res, next) => {
    let apiFeatures;

    if (model === blogModel) {
      apiFeatures = new APIFeatures(model.find().populate("user"), req.query);
    } else {
      apiFeatures = new APIFeatures(model.find(), req.query);
    }

    apiFeatures = apiFeatures.sort();

    if (role === "admin") {
      apiFeatures.filter().mongooseQuery.find({ role: "admin" });
    }
    if (role === "user") {
      apiFeatures.filter().mongooseQuery.find({ role: "user" });
    }

    const document = await apiFeatures.mongooseQuery;

    let response = {};
    response[type] = document;

    if (document.length > 0) {
      res.status(200).json({
        message: "Success",
        page: apiFeatures.page,
        response,
      });
    } else {
      next(new AppError(`No ${type} Found`, 404));
    }
  });
};
const getAllWithoutPaginationNoRole = (model, type) => {
  return catchError(async (req, res, next) => {
    let apiFeatures;

    if (model === blogModel) {
      apiFeatures = new APIFeatures(model.find().populate("user"), req.query);
    } else {
      apiFeatures = new APIFeatures(model.find(), req.query);
    }

    apiFeatures = apiFeatures.sort();

    const document = await apiFeatures.mongooseQuery;

    let response = {};
    response[type] = document;

    if (document.length > 0) {
      res.status(200).json({
        message: "Success",
        page: apiFeatures.page,
        response,
      });
    } else {
      next(new AppError(`No ${type} Found`, 404));
    }
  });
};

const getUserSpecificItem = (model, param) => {
  return catchError(async (req, res, next) => {
    let apiFeatures = new APIFeatures(
      model.find({ _id: req.user.id }).select(`${param}`).populate(`${param}`),
      req.query
    ).pagination();

    const document = await apiFeatures.mongooseQuery;

    let response = {};
    response = document;

    if (document.length > 0) {
      res.status(200).json({
        page: apiFeatures.page,
        response,
      });
    } else {
      next(new AppError(`Not Found`, 404));
    }
  });
};

// Update User or Admin  Profile
const updateProfile = (model, type) => {
  return catchError(async (req, res, next) => {
    const { name, email, gender, phone, DOB, address, profilePic } = req.body;

    if (gender) {
      const validMainTypes = ["male", "female"];
      if (gender && !validMainTypes.includes(gender)) {
        return next(new AppError("Invalid gender", 400));
      }
    }

    let updateFields = {};

    if (req.file) {
      updateFields.profilePic = req.file.filename;
    }

    // Update name field for each language individually
    if (name) {
      ["ar", "en"].forEach((key) => {
        updateFields[`name.${key}`] =
          name[key] !== undefined ? name[key] : req.user.name[key];
      });
    }

    // Update other fields
    ["email", "gender", "phone", "DOB", "address"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    let document = await model.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new AppError(`${type} Not Found`, 404));
    }

    let response = {};
    response[type] = document;

    res.status(200).json({
      message: `${type} Updated Successfully`,
      response,
    });
  });
};

const deleteUser = (model, type) => {
  return catchError(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `${type} is Deleted Successfully`,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

// To change password for a user from admin panel
const changeUserPasword = (model, type) => {
  return catchError(async (req, res, next) => {
    const { newPassword } = req.body;
    const { id } = req.params;

    let passwordChangedAt = Date.now();

    const document = await model.findByIdAndUpdate(
      id,
      {
        password: newPassword,
        passwordChangedAt,
        isActive: false,
        isBlocked: false,
      },
      { new: true }
    );

    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `Password Changed Successfully`,
      });
    } else {
      return next(new AppError(`${type} Not Found`, 404));
    }
  });
};

// Change Password
const changePassword = (model, type) => {
  return catchError(async (req, res, next) => {
    const { oldPassword, newPassword, repeat_password } = req.body;
    const { _id } = req.user;
    let passwordChangedAt = Date.now();

    const user = await model.findById(_id);

    if (!user) {
      return next(new AppError("Something went wrong!", 404));
    }

    if (!user.isActive || user.isBlocked) {
      return next(new AppError("Please Login First", 401));
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return next(new AppError("Current password is incorrect", 401));
    }

    if (newPassword !== repeat_password) {
      return next(new AppError("Please Re-enter the password", 401));
    }

    const document = await model.findByIdAndUpdate(
      _id,
      { password: newPassword, passwordChangedAt },
      { new: true }
    );

    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `Password updated  Successfully`,
      });
    } else {
      return next(new AppError(`${type} Not Found`, 404));
    }
  });
};

const getOne = (model, type) => {
  return catchError(async (req, res, next) => {
    const { id } = req.params;

    let document = await model.findById(id);
    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        message: `${type} Found Successfully`,
        response,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};
const checkEmail = (type) => {
  return catchError(async (req, res, next) => {
    const { email } = req.body;

    let document = await userModel.findOne({ email: email.toLowerCase() });

    if (document) {
      return next(new AppError(`${type} already exists`, 200));
    }
    let response = {};
    response[type] = document;

    res.json({
      message: `${type} Not found`,
    });
  });
};

const getUserProfile = (model, type) => {
  return catchError(async (req, res, next) => {
    let document = await model.findById(req.user._id);
    let response = {};
    response[type] = document;

    if (document) {
      res.status(200).json({
        response,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

const logout = (model, type) => {
  return catchError(async (req, res, next) => {
    let user = await model.findByIdAndUpdate(
      req.user._id,
      {
        isActive: false,
      },
      { new: true }
    );

    let response = {};
    response[type] = user;

    if (user) {
      res.status(200).json({
        message: `Logout Successfully`,
      });
    } else {
      next(new AppError(`${type} Not Found`, 404));
    }
  });
};

export {
  addOne,
  changeUserPasword,
  getAll,
  updateProfile,
  changePassword,
  getOne,
  deleteUser,
  logout,
  getUserProfile,
  getUserSpecificItem,
  checkEmail,
  getAllWithoutPagination,
  getAllWithoutPaginationNoRole,
};
