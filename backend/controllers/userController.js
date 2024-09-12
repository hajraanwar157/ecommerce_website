const ErrorHandler = require("../utils/errorHandler.js");
const catchErrorHandler = require("../middleware/catchAsyncError.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/sendToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
//////////////////////////////////////////////////////////////////////
//register user
exports.registerUser = catchErrorHandler(async (req, res, next) => {
  // Upload an image
  const myCloud = await cloudinary.v2.uploader
    .upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    })
    .catch((error) => {
      console.log(error);
    });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});
//////////////////////////////////////////////////////////////////////
//login user
exports.loginUser = catchErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password is given
  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 401));
  }
  sendToken(user, 200, res);
});
//////////////////////////////////////////////////////////////////////
//logout user
exports.logoutUser = catchErrorHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "user logged out successfully",
  });
});
//////////////////////////////////////////////////////////////////////
//forget password controller
exports.forgetPassword = catchErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("no user found", 404));
  }
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log(process.env.FRONTEND_URL);
  // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;
  const message = `Your reset password token is :- \n\n ${resetPasswordUrl}
  \n\nIf you have not requested this email then, please ignore it.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery email",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});
//////////////////////////////////////////////////////////////////////
//reset password
exports.resetPassword = catchErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesnt match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
//////////////////////////////////////////////////////////////////////
//reset password
exports.getUserDetails = catchErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});
//////////////////////////////////////////////////////////////////////
//update user password
exports.updateUserPassword = catchErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password doesnt match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});
//////////////////////////////////////////////////////////////////////
//update user profile
exports.updateProfile = catchErrorHandler(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist with this id", 400));
  }
  if (req.body.avatar !== "") {
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    // Upload an image
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    updateData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
//////////////////////////////////////////////////////////////////////
//get all users (admin)
exports.getAllUsers = catchErrorHandler(async (req, res, next) => {
  const userCount = await User.countDocuments();
  const users = await User.find();
  res.status(200).json({
    sucess: true,
    users,
    userCount,
  });
});
//////////////////////////////////////////////////////////////////////
//get single user (admin)
exports.getSingleUser = catchErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist with this id", 400));
  }
  res.status(200).json({
    sucess: true,
    user,
  });
});
//////////////////////////////////////////////////////////////////////
//update user role (admin)
exports.updateRole = catchErrorHandler(async (req, res, next) => {
  const updateData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist with this id", 400));
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
//////////////////////////////////////////////////////////////////////
//delete user by admin (admin)
exports.deleteUser = catchErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("user does not exist with this id", 400));
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);
  const deleteUser = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
