import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { LIMIT } from "./constants.js";
// import { OpenAI } from "openai";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

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

// const portfolioDetails = `
// John is a web developer specializing in React, Node.js, and Docker.
// He has 5 years of experience and has worked on multiple projects.
// Contact him at john@example.com.
// `;

// app.post("/api/v1/chat", async (req, res) => {
//   try {
//       const userMessage = req.body.message;

//       const response = await openai.chat.completions.create({
//           model: "gpt-3.5-turbo",  // Use "gpt-3.5-turbo" to avoid GPT-4 rate limits
//           messages: [
//               { role: "system", content: "You are a chatbot that answers only based on the portfolio details given." },
//               { role: "user", content: `Here are John's details: ${portfolioDetails}` },
//               { role: "user", content: userMessage }
//           ]
//       });

//       res.json({ reply: response.choices[0].message.content });

//   } catch (error) {
//       console.error("OpenAI API Error:", error);

//       res.status(500).json({
//           error: "Something went wrong while processing your request. Please try again later.",
//           details: error.message,
//       });
//   }
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errMessage = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message: errMessage,
  });
});

export { app };
