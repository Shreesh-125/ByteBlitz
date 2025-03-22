export const oauthCallback = (req, res) => {
  res.redirect("/dashboard");
};

export const oauthSignUp = (req, res) => {
  res.send("Complete signup process here!");
};
