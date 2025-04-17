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
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await new User({ username, password: hashedPassword }).save();
  res.redirect("/auth/login");
});

// Login user
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
}));

// Logout
router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

export default router;
