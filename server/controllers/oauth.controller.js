import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { oauth2Client } from "../utils/googleClient.js";

/* GET Google Authentication API. */
export const googleAuth = async (req, res, next) => {
  const code = req.query.code;
  // console.log(code);
  try {
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    // console.log(userRes.data)
    let user = await User.findOne({ email });

    if (!user) {
 
        const newUserName = email.split('@')[0];
        
        user = await User.create({
          username: newUserName,
          email: email,
          name:name,
  });
}

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const modifieduser = {
      username: user.username,
      email: user.email,
      _id: user._id
    };
    res.status(200).json({
      message: "success",
      token,
      user: modifieduser,
 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
