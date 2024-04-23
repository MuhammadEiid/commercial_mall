import { AppError } from "../utils/AppError.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

const handleCastError = (err, res) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateValueError = (err, res) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate Field: ${value}, please enter another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.MODE === "development") {
    sendErrorDev(err, res);
  } else if (process.env.MODE === "production") {
    if (err.name === "CastError") err = handleCastError(err);
    if (err.code === "11000") err = handleDublicateValueError(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    sendErrorProd(err, res);
  }
};
