const catchError = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
};

export { catchError };
