import express from "express";
import { connectDB } from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movie.routes.js";
import authRoutes from "./routes/auth.routes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(cors({
  origin: [
      "http://localhost:5173",
      "https://movie-app-six-lovat.vercel.app",
    ],
  credentials: true,
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});