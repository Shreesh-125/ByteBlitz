import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/SignUp.module.css'; 
import googleIcon from '../assets/google.png';
import byteblitzLogo from '../assets/byteblitz-logo.png';

const SignUp = ({ setIsAuthenticated }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setIsAuthenticated(true);
    console.log('Signup successful with:', { fullName, email, password });

    navigate('/', { replace: true });
  };

  const handleGoogleSignup = () => {
    setIsAuthenticated(true);
    console.log('Google signup successful');
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftBanner}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoContainer}>
            <div className={styles.byteblitzLogoText}>ByteBlitz</div>
            <div className={styles.titleWrapper}>
              <div className={styles.challengesText}>Challenges</div>
              <div className={`${styles.challengesText} ${styles.awaitText}`}>await.</div>
            </div>
          </div>
          <div className={styles.skillsQuestion}>
            <p>Are you ready to prove your skills?<span className={styles.cursorIcon}>▋</span></p>
          </div>
        </div>
      </div>

      <div className={styles.loginFormContainer}>
        <div className={styles.haveAccount}>
          <p>have an account? <Link to="/login" className={styles.signInLink}>Sign in!</Link></p>
        </div>
        
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <h1>Get Started With ByteBlitz</h1>
            <p>Begin your coding journey today</p>
          </div>

          <button className={styles.googleLoginBtn} onClick={handleGoogleSignup}>
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
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button type="submit" className={styles.createAccountBtn}>Create Account</button>
            
            <div className={styles.termsNotice}>
              <p>By continuing you indicate that you read and agreed to the Terms of Use</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;