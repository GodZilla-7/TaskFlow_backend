import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import AuthRoute from "./routes/auth.js";
import TodoRoute from "./routes/todo.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection Function
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Middleware
app.use(
  cors({
    origin: "*", // Update for production
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from server!");
});

// API Routes
app.use("/api/user", AuthRoute);
app.use("/api/todos", TodoRoute);

// Global Error Handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Server error";
  res.status(status).json({ message });
});

// Start Server after connecting to DB
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });

});
