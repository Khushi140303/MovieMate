import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../user.js";

const router = express.Router();

// Register page
router.get("/register", (req, res) => {
  res.render("register", { errorMsg: null });
});

// Login page
router.get("/login", (req, res) => {
  res.render("login", { errorMsg: null });
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.render("register", { errorMsg: "Username, email, and password are required." });
    }

    // Check if user already exists (OPTIONAL, but better UX)
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { errorMsg: "Username already taken." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    await new User({ username, email, password: hashedPassword }).save();

    // Redirect to login
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.render("register", { errorMsg: "Error registering user." });
  }
});

// Login user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login", { errorMsg: "Invalid username or password." });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
