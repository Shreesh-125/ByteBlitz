import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/Login.module.css";
import googleIcon from "../assets/google.png";
import byteblitzLogo from "../assets/byteblitz-logo.png";
import { useDispatch } from "react-redux";
import { login } from "../servers/signInAndLogin.js";
import { useMutation } from "@tanstack/react-query";
import { loginSuccess } from "../store/authStore.js";
import GoolgeLogin from "../features/googleLogin/googleLogin.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState("student");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from || "/";

  // Mutation for login
  const mutation = useMutation({
    mutationFn: (data) => login(data), // Call API
    onSuccess: (data) => {
      dispatch(loginSuccess(data)); //Save user info to Redux
      toast.success("Login successfully");
      navigate(from, { replace: true });
    },
    onError: (error) => {
      if (error) {
        console.log(error);
      }
      setError(error.response?.data?.message || "Login failed. Try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    mutation.mutate({ username, password, userType });
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <h1>Welcome Back</h1>
            <p>Continue your coding journey</p>
          </div>

          <div className={styles.userTypeSelector}>
            <button
              className={`${styles.userTypeBtn} ${
                userType === "student" ? styles.active : ""
              }`}
              onClick={() => setUserType("student")}
            >
              Student
            </button>
            <button
              className={`${styles.userTypeBtn} ${
                userType === "admin" ? styles.active : ""
              }`}
              onClick={() => setUserType("admin")}
            >
              Admin
            </button>
          </div>

          <GoolgeLogin className={styles.googleLoginBtn}>
            <img src={googleIcon} alt="Google" />
            <span>Google</span>
          </GoolgeLogin>

          <div className={styles.divider}>
            <hr />
            <span>Or continue with</span>
            <hr />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <input
                type="username"
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.loginBtn}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>

        <div className={styles.signUpPrompt}>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.signUpLink}>
              Sign up!
            </Link>
          </p>
        </div>
      </div>

      <div className={styles.loginBanner}>
        <div className={styles.logoContainer}>
          <img
            src={byteblitzLogo}
            alt="ByteBlitz Logo"
            className={styles.byteblitzLogo}
          />
        </div>
        <div className={styles.loginCta}>
          <button className={styles.sharpenSkillsBtn}>
            <span className={styles.lightningIcon}>⚡</span>
            Sharpen your coding skills
          </button>
          <p className={styles.ctaText}>
            Practice, compete, and improve your programming skills with our
            innovative challenges and competitions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
