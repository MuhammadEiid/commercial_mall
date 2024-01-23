export const globalErrorHandler = (err, req, res, next) => {
  const Error = err.message;
  let statusCode = err.statusCode || 500;
  process.env.MODE == "development"
    ? res.status(statusCode).json({ Error, stack: err.stack })
    : res.status(statusCode).json({ Error, statusCode });
};
