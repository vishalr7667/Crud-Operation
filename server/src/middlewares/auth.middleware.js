import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"
import ApiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const verifyJwt = asyncHandler(async(req, res, next) => {
    try {
        const {access_token} = req.cookies;
        if (!access_token) {
            return res.status(401).json(new ApiError(401, "Unauthorized"))
        }

        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");
        console.log(user);
        
        if (!user) {
            return res.status(401).json(new ApiError(401, "Unauthorized"))
        }

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json(new ApiError(401, error.message))
    }
})
