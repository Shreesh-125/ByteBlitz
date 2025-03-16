import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import googleIcon from '../assets/google.png';
import byteblitzLogo from '../assets/byteblitz-logo.png'; 

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState('student'); 
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsAuthenticated(true);
    console.log('Login successful with:', { email, password, rememberMe, userType });

    navigate(from, { replace: true });
  };

  const handleGoogleLogin = () => {
    setIsAuthenticated(true);
    console.log('Google login successful');
    navigate(from, { replace: true });
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
              className={`${styles.userTypeBtn} ${userType === 'student' ? styles.active : ''}`}
              onClick={() => setUserType('student')}
            >
              Student
            </button>
            <button 
              className={`${styles.userTypeBtn} ${userType === 'admin' ? styles.active : ''}`}
              onClick={() => setUserType('admin')}
            >
              Admin
            </button>
          </div>

          <button className={styles.googleLoginBtn} onClick={handleGoogleLogin}>
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
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                {showPassword ? '👁️' : '👁️‍🗨️'}
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

            <button type="submit" className={styles.loginBtn}>Log In</button>
          </form>
        </div>

        <div className={styles.signUpPrompt}>
          <p>Don't have an account? <Link to="/signup" className={styles.signUpLink}>Sign up!</Link></p>
        </div>
      </div>

      <div className={styles.loginBanner}>
        <div className={styles.logoContainer}>
          <img src={byteblitzLogo} alt="ByteBlitz Logo" className={styles.byteblitzLogo} />
        </div>
        <div className={styles.loginCta}>
          <button className={styles.sharpenSkillsBtn}>
            <span className={styles.lightningIcon}>⚡</span>
            Sharpen your coding skills
          </button>
          <p className={styles.ctaText}>
            Practice, compete, and improve your 
            programming skills with our innovative 
            challenges and competitions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 