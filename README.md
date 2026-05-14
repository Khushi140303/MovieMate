<h1 align="center">MovieMate 🎬</h1>
<p align="center">
  <b>A full-stack movie discovery and review platform with authenticated watchlists and dynamic movie metadata.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/Passport.js-34E27A?style=flat&logo=passport&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white">
</p>

---

## What it does

MovieMate lets users discover movies, build watchlists, and write reviews. The app fetches real-time movie metadata from the OMDb API and persists everything to MongoDB via Mongoose. Authentication is handled through Passport.js with hashed password storage and protected routes.

**Core flows:**
- Search any movie by title and view aggregated reviews/ratings
- Build a personal watchlist via referenced relationships
- Submit ratings (1–5) and comment-based reviews
- Register, log in, and access protected pages

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js · Express |
| Database | MongoDB (Mongoose ODM) |
| Auth | Passport.js (hashed passwords, session-protected routes) |
| External API | OMDb (Axios) |
| Frontend | EJS templates · client-side form validation |
| Tooling | ESLint · Dev Containers |

---

## Data model

The app stores three collections — **Users, Movies, and Reviews** — connected by referenced relationships.

```js
// User
{
  username: "moviefan23",
  email: "user@email.com",
  password: "<hashed>",
  watchlist: [movie_id, ...]
}

// Movie
{
  title: "Inception",
  genre: ["Sci-Fi", "Thriller"],
  year: 2010,
  reviews: [review_id, ...]
}

// Review
{
  user: user_id,
  movie: movie_id,
  rating: 4.5,
  comment: "Amazing movie with mind-blowing visuals!",
  timestamp: "2025-03-20T12:00:00Z"
}
```

---

## What's interesting about this build

**Authentication is hashed end-to-end.** Passport.js handles login/registration, but passwords are hashed before they ever hit the database. Protected routes redirect unauthenticated users back to the login flow rather than exposing partial state.

**Client-side validation prevents bad submits.** Empty review fields, missing ratings, and malformed inputs are caught before the form posts, with inline error messaging.

**OMDb integration via Axios** allows dynamic movie lookups — type a title, get back real metadata (cast, year, plot, poster), then attach reviews to the matched record rather than free-text duplicates.

---

## Run it locally

```bash
git clone https://github.com/Khushi140303/MovieMate.git
cd MovieMate
npm install

# Set up .env with MongoDB URI and OMDb API key
cp .env.example .env

# Test MongoDB connection
node testMongoConnection.js

# Start the server
node app.mjs
```

Visit `http://localhost:3000`.

---

## Built for

NYU CSCI-UA 467 — Applied Internet Technology
