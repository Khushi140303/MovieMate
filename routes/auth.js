import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import User from "../user.js";

const router = express.Router();

// Register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).send("Username, email, and password are required.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    await new User({ username, email, password: hashedPassword }).save();

    // Redirect to login
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error registering user.");
  }
});

// Login user
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

// Logout
router.post("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
