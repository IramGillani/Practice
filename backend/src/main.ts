import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express, { Application } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import mongoose from "mongoose";

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle Nodemon reloads gracefully
process.once("SIGUSR2", async () => {
  await mongoose.connection.close();
  process.kill(process.pid, "SIGUSR2");
});

startServer();
