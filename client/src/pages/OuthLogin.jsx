const OauthLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://byteblitz-backend.onrender.com/api/v1/oauth/auth/google";
  };

  return (
    <div>
      <h2>OauthLogin with Google</h2>
      <button onClick={handleGoogleLogin}>OauthLogin with Google</button>
    </div>
  );
};

export default OauthLogin;
