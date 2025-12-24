# 🎬 MERN Movie Application – Backend

This is the **backend service** for the Movie Application built using **Node.js, Express, MongoDB, Redis, and JWT authentication**.

The backend provides:

* Movie listing, search, sorting, pagination

* Role-based access control (Admin / User)

* Async movie insertion using a Redis queue

* Secure REST APIs

## 🚀 Tech Stack

* Node.js

* Express.js

* MongoDB (MongoDB Atlas)

* Mongoose

* Redis (Queue)

* BullMQ

* JWT Authentication

## 🔐 Authentication & Authorization

* **JWT-based authentication**

* **Roles supported:**

  * `user` → can view/search/sort movies

  * `admin` → can add, edit, delete movies

* Admin routes are protected using middleware

## ⚙️ Backend Setup & Installation

### 1️⃣ Clone Repository


```bash
# 1. Clone the repository and enter the backend folder
git clone <your-repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file in the root folder
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/movies
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# 4. Start Redis (choose one option)

# Option A: Using Docker (recommended)
docker pull redis
docker run --name redis-local -p 6379:6379 -d redis

# Option B: Locally
redis-server

# 5. Seed initial movie data (pushes to Redis queue)
node src/seed/seedMovies.js

# 6. Start the queue worker (keep this running in a separate terminal)
node src/workers/movie.worker.js

# 7. Start the backend server
npm run dev
# or
node src/index.js
```
## 📦 Redis Queue (Lazy Insertion)

1. Movie data is **not inserted directly** into MongoDB.

2. Each movie is pushed into a **Redis queue**.

3. A background **worker processes movies one-by-one**.

**Benefits:**

* Prevents database overload

* Prevents data loss if DB goes down

* Supports concurrency safely

**Resilience:**

* If the server or worker stops, Redis keeps pending jobs.

* On restart, processing resumes automatically.

---

## 📡 API Endpoints

### 🔓 Public Routes

**Get Movies (Paginated)**
`GET /movies?page=1&limit=10`

**Search Movies**
`GET /movies/search?q=batman`

**Sort Movies**
`GET /movies/sorted?by=imdbRating`

* Supported sort fields: `title`, `imdbRating`, `year`, `runtime`

### 🔐 Admin Routes (JWT Required)

**Add Movie**
`POST /movies`

* Header: `Authorization: Bearer <token>`

**Update Movie**
`PUT /movies/:id`

* Header: `Authorization: Bearer <token>`

**Delete Movie**
`DELETE /movies/:id`

* Header: `Authorization: Bearer <token>`

---

## ⚡ Performance & Scalability

* **MongoDB indexes** on:

  * `imdbID`

  * `imdbRating`

  * text search (`title`, `description`)

* **Pagination limits** enforced on backend

* **Redis queue** handles high-volume inserts

* **Non-blocking async processing**

---
