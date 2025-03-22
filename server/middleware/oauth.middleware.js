import passport from "passport";

export const oauthValidate = () => {
  passport.authenticate("google", { scope: ["profile", "email"] });
};

export const oauthFailureCheck = () => {
  passport.authenticate("google", { failureRedirect: "/login" });
};
