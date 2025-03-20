import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { LIMIT } from "./constants.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: LIMIT }));
app.use(express.urlencoded({ extended: true, limit: LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/test-cookies", (req, res) => {
  console.log("Cookies Received:", req.cookies);
  res.json(req.cookies);
});
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import productRouter from "./routes/products.route.js";
app.use("/api/v1/products", productRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message: errMessage,
  });
});

export { app };
