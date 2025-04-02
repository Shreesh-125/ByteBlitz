import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { oauth2Client } from "../utils/googleClient.js";

/* GET Google Authentication API. */
export const googleAuth = async (req, res, next) => {
  const code = req.query.code;
  console.log(code);
  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    let user = await User.findOne({ email });
    let isexit = true;
    if (!user) {
      isexit = false;
      user = await User.create({
        name,
        email,
      });
    }
    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const modifieduser = {
      username: user.username,
      email: user.email,
    };
    res.status(200).json({
      message: "success",
      token,
      user: modifieduser,
      isexit,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
