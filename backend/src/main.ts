import dns from "node:dns";

// Added to fix MongoDB Atlas SRV resolution failures in some network environments.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import path from "path";
import http from "node:http";
import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import WebSocket, { WebSocketServer } from "ws";
import { activeConnections } from "./config/websocketManager";

import { connectDB } from "./config/db";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import planRoutes from "./routes/planRoutes";
import onboardingRoutes from "./routes/onboardingRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import * as UserRepo from "@/repositories/userRepo";

const app: Application = express();

app.use("/profile", express.static(path.join(__dirname, "../public/profile")));

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRoutes,
);

app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/plans", planRoutes);
app.use(errorHandler);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws, req) => {
  const urlParams = new URLSearchParams(req.url?.split("?")[1] || "");
  const userId = urlParams.get("userId");

  if (!userId) {
    ws.close(1008, "userId query parameter required");
    console.log("There is no userId");
    return;
  }

  activeConnections.set(userId, ws);
  console.log(`User ${userId} connected to WebSocket.`);
  console.log("WS REGISTERED:", {
    userId,
    connections: [...activeConnections.keys()],
  });

  const currentUser = await UserRepo.findById(userId);
  if (currentUser && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        event: "USER_SYNC",
        payload: currentUser,
      }),
    );
  }

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on("close", () => {
    activeConnections.delete(userId);
    console.log(`User ${userId} disconnected from WebSocket.`);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server running on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdowns
process.once("SIGUSR2", async () => {
  await mongoose.connection.close();
  process.kill(process.pid, "SIGUSR2");
});

startServer();
