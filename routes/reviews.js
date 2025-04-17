import express from "express";
import Review from "../models/review.js"; // or "../review.js" if not moved yet

const router = express.Router();

// ✅ Auth guard
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

// ✅ GET - Show Review Form (only for logged-in users)
router.get("/", isAuthenticated, (req, res) => {
  res.render("review");
});

// ✅ POST - Submit Review (only for logged-in users)
router.post("/", isAuthenticated, async (req, res) => {
  const { movieId, rating, comment } = req.body;

  try {
    const review = new Review({
      user: req.user._id, // grab user from session
      movie: movieId,
      rating,
      comment,
    });

    await review.save();
    res.send("Thank you for your review!"); // or redirect
  } catch (error) {
    console.error(error);
    res.status(500).send("Error submitting review.");
  }
});

export default router;
