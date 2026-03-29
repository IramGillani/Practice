import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import express, { Application } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import todoRoutes from "./routes/todoRoutes";

const app: Application = express();
console.log("Attempting to start server...");

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
