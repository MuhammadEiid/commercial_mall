const catchError = (handler) => {
  return (req, res, next) => {
    try {
      handler(req, res, next);
    } catch (error) {
      // Handle the error
      next(error);
    }
  };
};

export { catchError };
