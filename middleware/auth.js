const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../model/userModel");

exports.isAuthenticatedusers = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(token);

    if (!token) {
      return next(new ErrorHandler("please login to access the resourse"));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodedData");

    req.user = await User.findById(decodedData.id);
    console.log(req.user);

    next();
  } catch (err) {
    console.log(err);
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
