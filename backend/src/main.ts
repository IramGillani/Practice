import dns from "node:dns";
// Added to fix MongoDB Atlas SRV resolution failures in some network environments.
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express, { Application } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import mongoose from "mongoose";

const app: Application = express();

import path from "path";

app.use("/profile", express.static(path.join(__dirname, "../public/profile")));

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle Nodemon reloads gracefully
process.once("SIGUSR2", async () => {
  await mongoose.connection.close();
  process.kill(process.pid, "SIGUSR2");
});

startServer();
