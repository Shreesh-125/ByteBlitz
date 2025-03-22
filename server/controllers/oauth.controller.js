import passport from "passport";
import { User } from "../models/user.model";
export const oauthCallback = async (req, res) => {
  if (!req.user.username) {
    req.session.tempUser = req.user; // Store temp user session
    return res.redirect("http://localhost:5173/complete-signup");
  }
  res.redirect("http://localhost:5173/dashboard");
};

export const oauthSignUp = async (req, res) => {
  const { username, country } = req.body;
  if (!req.session.tempUser)
    return res.status(400).send("Session expired. Please login again.");

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).send("Username is already taken.");

  const newUser = new User({
    googleId: req.session.tempUser.googleId,
    email: req.session.tempUser.email,
    name: req.session.tempUser.name,
    username,
    country,
  });

  await newUser.save();
  req.session.tempUser = null;
  res.redirect("/dashboard");
};
