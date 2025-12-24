// import Movie from "../models/movie.model.js";
// import { nanoid } from "nanoid";
// export const getMovies = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const MAX_LIMIT = 50;
//     let limit = parseInt(req.query.limit) || 10;
//    limit = Math.min(limit, MAX_LIMIT);
//     const skip = (page - 1) * limit;

//     const movies = await Movie.find()
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const total = await Movie.countDocuments();

//     res.json({
//       page,
//       limit,
//       total,
//       movies,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch movies" });
//   }
// };

// export const searchMovies = async (req, res) => {
//   const q = req.query.q;

//   if (!q) {
//     return res.status(400).json({
//       success: false,
//       message: "Search query is required",
//     });
//   }

//   // Escape special regex characters to prevent regex injection
//   const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//   const regex = new RegExp(escapedQuery, "i"); // case-insensitive

//   const movies = await Movie.find({
//     $or: [
//       { title: regex },
//       { description: regex },
//     ],
//   })
//     .limit(20);

//   res.json({
//     success: true,
//     query: q,
//     count: movies.length,
//     movies,
//   });
// };


// // SORT movies
// export const getSortedMovies = async (req, res) => {
//   const { by = "imdbRating", order = "desc" } = req.query;
  
//   const allowedFields = ["title", "imdbRating", "year", "runtime"];
//   if (!allowedFields.includes(by)) {
//     return res.status(400).json({ message: "Invalid sort field" });
//   }

//   let sortOrder = order === "asc" ? 1 : -1;
// if (by==='title'){
//     sortOrder=1
//   }
//   const movies = await Movie.find().sort({ [by]: sortOrder });

//   res.json({
//     success: true,
//     sortBy: by,
//     order,
//     movies,
//   });
// };
// /* ================= ADMIN ================= */

// // ADD movie
// export const addMovie = async (req, res) => {
//     const movieData = {
//     ...req.body,
//     imdbID: req.body.imdbID || `admin-${nanoid(10)}`,
//     createdBy: req.user.userId,
//   };

//   const movie = await Movie.create(movieData);
//   res.status(201).json(movie);
// };

// // UPDATE movie
// export const updateMovie = async (req, res) => {
//   const movie = await Movie.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true }
//   );

//   if (!movie) {
//     return res.status(404).json({ message: "Movie not found" });
//   }

//   res.json(movie);
// };

// // DELETE movie
// export const deleteMovie = async (req, res) => {
//   const movie = await Movie.findByIdAndDelete(req.params.id);

//   if (!movie) {
//     return res.status(404).json({ message: "Movie not found" });
//   }

//   res.json({ message: "Movie deleted" });
// };
import Movie from "../models/movie.model.js";
import { nanoid } from "nanoid";

// Helper to calculate pagination
const getPagination = (query) => {
  const page = parseInt(query.page) || 1;
  const MAX_LIMIT = 50;
  let limit = parseInt(query.limit) || 12;
  limit = Math.min(limit, MAX_LIMIT);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/* ================= PUBLIC ROUTES ================= */

// GET movies (Paginated)
export const getMovies = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const movies = await Movie.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments();

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch movies" });
  }
};

// SEARCH movies (Paginated)
export const searchMovies = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query is required" });
    }

    const { page, limit, skip } = getPagination(req.query);
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "i");

    const queryCondition = {
      $or: [{ title: regex }, { description: regex }],
    };

    const movies = await Movie.find(queryCondition)
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments(queryCondition);

    res.json({
      success: true,
      query: q,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

// SORT movies (Paginated)
export const getSortedMovies = async (req, res) => {
  try {
    const { by = "imdbRating", order = "desc" } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const allowedFields = ["title", "imdbRating", "year", "runtime"];
    if (!allowedFields.includes(by)) {
      return res.status(400).json({ success: false, message: "Invalid sort field" });
    }

    let sortOrder = order === "asc" ? 1 : -1;
    if (by === 'title') sortOrder = 1; // Titles usually default to A-Z

    const movies = await Movie.find()
      .sort({ [by]: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments();

    res.json({
      success: true,
      sortBy: by,
      order,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      movies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sorting failed" });
  }
};

/* ================= ADMIN ROUTES ================= */

// ADD movie
export const addMovie = async (req, res) => {
  try {
    const movieData = {
      ...req.body,
      imdbID: req.body.imdbID || `admin-${nanoid(10)}`,
      createdBy: req.user.userId,
    };

    const movie = await Movie.create(movieData);
    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      movie,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to add movie" });
  }
};

// UPDATE movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    res.json({
      success: true,
      message: "Movie updated successfully",
      movie,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Update failed" });
  }
};

// DELETE movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    res.json({ 
      success: true, 
      message: "Movie deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};