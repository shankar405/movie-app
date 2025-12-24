import { Queue } from "bullmq";

export const movieQueue = new Queue("movie-queue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
