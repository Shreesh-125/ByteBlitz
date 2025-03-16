import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Reusing the Login styles
import byteblitzLogo from '../assets/byteblitz-logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormContainer}>
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <h1>Forgot Password</h1>
            <p>Enter your email to reset your password</p>
          </div>

          {!submitted ? (
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

              <button type="submit" className={styles.loginBtn}>Reset Password</button>
            </form>
          ) : (
            <div className={styles.successMessage}>
              <p>Password reset link has been sent to your email.</p>
              <p>Please check your inbox and follow the instructions.</p>
            </div>
          )}

          <div className={styles.signUpPrompt} style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" className={styles.signUpLink}>Back to Login</Link>
          </div>
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

export default ForgotPassword; 