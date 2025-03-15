import axios from "axios";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ContestPage from "./pages/ContestPage";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "./redux/appSlice";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogin = async () => {
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        dispatch(setUser(res.data.user));
        navigate("/contest");

    }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
  } finally {
      dispatch(setLoading(false));
  }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="border p-2 mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/contest" element={<ContestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
