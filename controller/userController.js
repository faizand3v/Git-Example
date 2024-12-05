const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const ErrorHandler = require("../utils/errorhandler");
const sendToken = require("../utils/jwtToken");

exports.registeruser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    console.log(req.body.email);
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.json({
      message: err.message,
    });
  }
};

exports.loginuser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    // checking if user has given password and email both

    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    console.log(isPasswordMatched);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
};

exports.logout = (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out successfully",
  });
};

exports.getuser = async (req, res, next) => {
  try {
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    console.log(user);

    res.status(200).json({
      sucess: true,
      user,
    });
  } catch (err) {
    res.send({
      err: err,
    });
  }
};
