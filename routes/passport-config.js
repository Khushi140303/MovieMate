import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../user.js";

export function initialize(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: "No user found" });

      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? done(null, user) : done(null, false, { message: "Incorrect password" });
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
}
