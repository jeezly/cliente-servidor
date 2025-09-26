import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { ensureDefaultAdmin } from "./controllers/authController.js";

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;

const start = async () => {
  await connectDB();
  await ensureDefaultAdmin();
  app.listen(PORT, () => console.log(`🚀 API escuchando en http://localhost:${PORT}`));
};

start();
