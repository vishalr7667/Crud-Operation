import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { isValidEmail } from "../utils/checkEmail.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {stringify} from "flatted"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      `Something went wrong while generating access and refresh token: ${error}`
    );
  }
};


const register = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, userName, password } = req.body;
    console.log(req.body);
    if (
      [fullName, email, userName, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if (!isValidEmail(email)) {
      throw new ApiError(400, "Email must be valid");
    }

    const existedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });

    if (existedUser) {
      return res.status(409).json(new ApiError(409, "Email or UserName is already Existed"))
    }

    if (password.length < 8) {
      throw new ApiError(400, "Password must be atleast 8 characters");
    }

    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json(new ApiResponse(400, "Avatar file is required"));
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      return res.status(400).json(new ApiResponse(400, "Avatar file is required"));
    }

    const user = await User.create({
      fullName,
      email,
      userName,
      password,
      avatar: avatar?.url,
    });

    if (!user) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    const createdUser = await User.findById(user._id).select(
      "-refreshToken -password"
    );

    return res
      .status(201)
      .json(new ApiResponse(201, "User Registered Successfully", createdUser));
  } catch (error) {
    console.log(error);
  }
});

const login = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  console.log(req.body);

  if (!userName && !email) {
    throw new ApiError(400, "Email or UserName is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User doesn't exist");
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Imvalid User Credential");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-refreshToken -password"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("access_token", accessToken, option)
    .cookie("refresh_token", refreshToken, option)
    .json(new ApiResponse(201, "User logged In successfully", loggedInUser));
});

const logout = asyncHandler(async (req, res) => { 
  try {
    console.log(req.cookies);
    const { access_token } = req.cookies || req.body;
    if (!access_token) {
      throw new ApiError(401, "Access Token is required");
    }
    
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    const option = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("access_token", option);
    res.clearCookie("refresh_token", option);
    return res.status(200).json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    console.log("logout error", error);
    return res.status(500).json(new ApiResponse(500,  "Something went wrong while logging out", stringify(req.cookies)));
  }
})

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const resetToken = user.generatePasswordResetToken();
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiresAt = new Date(Date.now() +  60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailOptions = {
      to: user.email,
      subject: "Reset Password",
      html: `<p>Click <a href="${resetPasswordUrl}">here</a> to reset your password</p>`,
    };

    await sendEmail(emailOptions);
    return res.status(200).json(new ApiResponse(200, "Password reset email sent"));
  } catch (error) {
    console.log("forgotPassword error", error);
    return res.status(500).json(new ApiResponse(500, error, "Something went wrong while sending password reset email"));
  }
})

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json(new ApiError(400, "Password and Confirm Password do not match"));
    }

    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(400).json(new ApiError(400, "Invalid Password Reset Token"));
    }

    if (user.passwordResetTokenExpiresAt < Date.now()) {
      return res.status(400).json(new ApiError(400, "Password Reset Token expired"));
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, "Password reset successfully"));

  } catch (error) {
    console.log("resetPassword error", error);
    return res.status(500).json(new ApiResponse(500, error, "Something went wrong while resetting password"));
  }
})

const refreshToken = asyncHandler(async (req, res) => {
  try {
    
    const { refresh_token } = req.cookies || req.body;
  
    if (!refresh_token) {
      throw new ApiError(401, "Refresh Token is required");
    }
  
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);
    
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
  
    const isValidRefreshToken = user.isRefreshTokenValid(refreshToken);
  
    if (!isValidRefreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );  
  
    const loggedInUser = await User.findById(user._id).select(
      "-refreshToken -password"
    );
  
    const option = {
      httpOnly: true,
      secure: true,
    };    
  
    return res
      .status(201)
      .cookie("access_token", accessToken, option)
      .cookie("refresh_token", refreshToken, option)
      .json(new ApiResponse(201, loggedInUser, "User logged In successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error, "Something went wrong while refreshing token"));
  }
});

export { register, login, refreshToken, logout, forgotPassword, resetPassword };
