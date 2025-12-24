import fs from "fs/promises";
import path from "path";
import { movieQueue } from "../queue/movie.queue.js";

const filePath = path.join(process.cwd(), "movies-250.json");

async function seed() {
  const file = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(file);

  for (const movie of data.movies) {
    await movieQueue.add("add-movie", movie);
  }

  console.log("✅ Movies pushed to Redis queue");
  process.exit();
}

seed();
