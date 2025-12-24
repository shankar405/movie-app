import { Worker } from "bullmq";
import Movie from "../models/movie.model.js";
import "dotenv/config";
import { connectDB } from "../config/db.js";
await connectDB();

const worker = new Worker(
  "movie-queue",
  async (job) => {
    const movie = job.data;

    await Movie.updateOne(
      { imdbID: movie.imdbID },
      {
        title: movie.Title,
        description: movie.Plot,
        year: Number(movie.Year),
        runtime: parseInt(movie.Runtime),
        genre: movie.Genre.split(",").map(g => g.trim()),
        director: movie.Director,
        actors: movie.Actors.split(",").map(a => a.trim()),
        imdbRating: Number(movie.imdbRating),
        imdbID: movie.imdbID,
        poster: movie.Poster,
      },
      { upsert: true }
    );
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    concurrency: 2, // controls DB load
  }
);

console.log(" Movie worker running...");
