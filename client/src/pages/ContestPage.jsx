import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import { logoutUser } from "../redux/appSlice";
import { useNavigate } from "react-router-dom";

const ContestPage = () => {
  const [socket, setSocket] = useState(null);
  const { user } = useSelector((store) => store.app);
  const dispatch = useDispatch();
  const [leaderboard, setLeaderboard] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false); // Prevent repeated navigation

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage("Please log in to participate in the contest.");
      if (!redirected) {
        setRedirected(true); // Ensure navigation happens only once
        navigate("/");
      }
      return;
    }

    const fetchContestStatus = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/contest/67d80237f77f6325a8dbd430");

        if (data.status === "running") {
          const newSocket = io("http://localhost:8000", {
            transports: ["websocket", "polling"],
            withCredentials: true,
            token: localStorage.getItem("token"),
          });

          newSocket.on("connect", () => setMessage("Connected to contest."));
          newSocket.on("contest_not_running", (data) => setMessage(data.message));
          newSocket.on("contest_started", () => setMessage("Contest started!"));
          newSocket.on("leaderboard_update", setLeaderboard);
          newSocket.on("see_output", (data) => {setMessage(data.message);console.log(data)}
          );
          newSocket.on("contest_ended", () => {
            setMessage("Contest ended! Disconnecting...");
            newSocket.disconnect();
          });
          newSocket.on("connect_error", (err) => setMessage(`WebSocket error: ${err.message}`));

          setSocket(newSocket);
        } else {
          setMessage("Contest is not running.");
        }
      } catch (error) {
        setMessage("Error fetching contest status.");
      }
    };

    fetchContestStatus();

    return () => {
      if (socket) {
        socket.off();
        socket.disconnect();
      }
    };
  }, [redirected]); // Add `redirected` as a dependency

  const submitCode = () => {
    if (!socket) {
      setMessage("No active contest. Please check your connection.");
      return;
    }

    socket.emit("submit_code", {
      problemId: 1,
      code: `print(1+2)`,
      language: "python",
      userId: "67cc4cc3964068fd0a6a2730",
      contestId:4
    });

    setMessage("Code submitted successfully!");
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      dispatch(logoutUser());
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      setMessage("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Contest</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={submitCode}>Submit Code</button>
      <p>{message}</p>
      <h3>Leaderboard</h3>
      <ul>
        {Object.entries(leaderboard).map(([user, score]) => (
          <li key={user}>
            {user}: {score} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContestPage;
