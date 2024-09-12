const ErrorHandler = require("../utils/errorHandler.js");
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "internal server errror";

  //Wrong Mongodb id handler
  if (err.name === "CastError") {
    const message = `Resource not found invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }
  //wrong jwt
  if (err.name === "JsonWebTokenError") {
    const message = `json web token is invalid, please try again`;
    err = new ErrorHandler(message, 400);
  }
  //jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `json web token is expired, please try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
