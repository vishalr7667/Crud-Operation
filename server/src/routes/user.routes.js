import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { register, login, refreshToken, logout, forgotPassword, resetPassword } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/test").get((req, res) => {
  return res.status(200).json({
    message: "working",
  });
});
userRouter.route("/register").post(upload.single("avatar"), register);
userRouter.route("/login").post(login);
userRouter.route("/refresh-token").post(refreshToken);
userRouter.route("/logout").post(logout);
userRouter.route("/forgot-password").post(forgotPassword);
userRouter.route("/reset-password").post(resetPassword);

export default userRouter;
