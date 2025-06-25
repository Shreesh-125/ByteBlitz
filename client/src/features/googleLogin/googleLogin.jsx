import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../servers/oauthApi";
import { useNavigate } from "react-router-dom";
import styles from "./googleLogin.module.css";
import Loader from "../../ui/Loader";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authStore";

const GoogleLogin = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const responseGoogle = async (authResult) => {
    try {
      setLoading(true);
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const user = result.data.user;
        const token = result.data.token;
       
          dispatch(loginSuccess({ user, token }));
          navigate("/home");
        
      } else {
        throw new Error(authResult);
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      className={styles.googleLoginBtn}
      onClick={googleLogin}
      disabled={loading}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};

export default GoogleLogin;
