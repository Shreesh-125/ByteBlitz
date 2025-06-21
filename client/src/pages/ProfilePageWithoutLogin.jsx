import React, { useState, useEffect } from 'react';
import styles from '../styles/ProfilePageWithoutLogin.module.css';
import { useNavigate } from 'react-router-dom';

const ProfilePageWithoutLogin = () => {
  const [isVisible, setIsVisible] = useState(false);
   const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    navigate('/login');
    
  };

  const handleSignup = () => {
     navigate('/signup')
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundPattern}></div>
      
      <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>Access Required</h1>
          <p className={styles.subtitle}>Please Login/SignUp for Profile Page</p>
          <p className={styles.description}>
            Looks like you've wandered into uncharted territory! 
            No worries though – just a quick login or signup and you'll be back on track.
          </p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.button} ${styles.loginButton}`}
            onClick={handleLogin}
          >
            Login
          </button>
          
          <button 
            className={`${styles.button} ${styles.signupButton}`}
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </div>
        
        <div className={styles.footer}>
          <p>Don't have an account? No problem! | Already a member? Welcome back!</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageWithoutLogin;