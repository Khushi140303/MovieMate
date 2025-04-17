import express from "express";
import Review from "../review.js";
import Movie  from "../movie.js";    // ← import your Movie model

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/auth/login");
}

// GET /reviews — fetch movies and render the form
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.render("review", { movies });    // ← pass movies into EJS
  } catch (err) {
    console.error(err);
    res.status(500).send("Unable to load review form");
  }
});

// POST /reviews — unchanged
router.post("/", isAuthenticated, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  try {
    const review = new Review({
      user: req.user._id,
      movie: movieId,
      rating,
      comment,
    });
    await review.save();
    res.send("Thank you for your review!");
  } catch (error) {
    console.error("Review save error:", error);
    res.status(500).send("Error submitting review.");
  }
});

export default router;
