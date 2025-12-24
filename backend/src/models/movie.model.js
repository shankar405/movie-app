
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    year: Number,
    runtime: Number,
    genre: [String],
    director: String,
    actors: [String],

    imdbRating: {
      type: Number,
      index: true,
    },
    imdbID: {
      type: String,
      unique: true,
      required: true,
    },

    poster: String,

    createdBy: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Movie", movieSchema);
