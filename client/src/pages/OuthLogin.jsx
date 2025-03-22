const OauthLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/v1/oauth/auth/google";
  };

  return (
    <div>
      <h2>OauthLogin with Google</h2>
      <button onClick={handleGoogleLogin}>OauthLogin with Google</button>
    </div>
  );
};

export default OauthLogin;
