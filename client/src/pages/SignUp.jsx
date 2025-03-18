import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "../styles/SignUp.module.css";
import googleIcon from "../assets/google.png";
import byteblitzLogo from "../assets/byteblitz-logo.png";
import { useAppDispatch } from "../store/authStore.js"; // Custom Redux hook
import { loginSuccess } from "../store/authStore.js"; // Redux action
import { signup } from "../servers/signInAndLogin.js"; // API request function
import toast from "react-hot-toast";

const SignUp = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // React Query Mutation for signup
  const mutation = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: (data) => {
      dispatch(loginSuccess(data)); // Save user info to Redux
      toast.success("Successfully singed In");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Signup failed. Try again.");
      toast.error("Signup failed. Try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !fullname ||
      !email ||
      !password ||
      !confirmPassword ||
      !username ||
      !country
    ) {
      setError("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    setError("");
    mutation.mutate({ fullname, email, password, username, country });
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
    // Implement Google authentication logic here
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftBanner}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoContainer}>
            <div className={styles.byteblitzLogoText}>ByteBlitz</div>
            <div className={styles.titleWrapper}>
              <div className={styles.challengesText}>Challenges</div>
              <div className={`${styles.challengesText} ${styles.awaitText}`}>
                await.
              </div>
            </div>
          </div>
          <div className={styles.skillsQuestion}>
            <p>
              Are you ready to prove your skills?
              <span className={styles.cursorIcon}>▋</span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.loginFormContainer}>
        <div className={styles.haveAccount}>
          <p>
            Have an account?{" "}
            <Link to="/login" className={styles.signInLink}>
              Sign in!
            </Link>
          </p>
        </div>

        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <h1>Get Started With ByteBlitz</h1>
            <p>Begin your coding journey today</p>
          </div>

          <button
            className={styles.googleLoginBtn}
            onClick={handleGoogleSignup}
          >
            <img src={googleIcon} alt="Google" />
            <span>Google</span>
          </button>

          <div className={styles.divider}>
            <hr />
            <span>Or continue with</span>
            <hr />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="fullname"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                id="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <div className={`${styles.formGroup} ${styles.passwordGroup}`}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            <button
              type="submit"
              className={styles.createAccountBtn}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <div className={styles.termsNotice}>
              <p>
                By continuing, you indicate that you read and agreed to the
                Terms of Use
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
