import express from "express";
import {
  getMovies,
  searchMovies,
  getSortedMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ===== PUBLIC ===== */
router.get("/",authenticate, getMovies);
router.get("/search",authenticate, searchMovies);
router.get("/sorted",authenticate, getSortedMovies);

/* ===== ADMIN ONLY ===== */
router.post("/", authenticate, isAdmin, addMovie);
router.put("/:id", authenticate, isAdmin, updateMovie);
router.delete("/:id", authenticate, isAdmin, deleteMovie);

export default router;
