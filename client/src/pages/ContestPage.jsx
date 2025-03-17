import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ContestPage = () => {
  console.log("Rendering ContestPage component...");

  const [socket, setSocket] = useState(null);
  const { user } = useSelector((store) => store.app);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problems, setProblems] = useState([]); // Stores contest problems
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "useEffect triggered to check user authentication and contest status..."
    );

    const storedUser = localStorage.getItem("user");
    console.log("Stored user in localStorage:", storedUser);

    if (!storedUser) {
      console.log("User is not logged in. Redirecting...");
      setMessage("Please log in to participate in the contest.");
      navigate("/");
      return;
    }

    const fetchContestData = async () => {
      console.log("Fetching contest status and problems...");
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/contest/67d576a11822d55aba25f3b7"
        );
        console.log("Contest data received:", data);

        if (data.status === "running") {
          console.log("Contest is running. Connecting to WebSocket...");
          setProblems(data.problems); // Store fetched problems

          const newSocket = io("http://localhost:8000", {
            transports: ["websocket", "polling"],
            withCredentials: true,
          });

          newSocket.on("connect", () => {
            console.log("WebSocket connected successfully!");
            setMessage("Connected to contest.");
          });

          newSocket.on("see_output", (data) => {
            console.log("Received output from server:", data);
          });

          newSocket.on("leaderboard_update", (data) => {
            console.log("Leaderboard updated:", data);
            setLeaderboard(data);
          });

          newSocket.on("contest_ended", () => {
            console.log("Contest ended. Disconnecting socket...");
            setMessage("Contest ended! Disconnecting...");
            newSocket.disconnect();
          });

          setSocket(newSocket);
        } else {
          console.log("Contest is not currently running.");
          setMessage("Contest is not running.");
        }
      } catch (error) {
        console.error("Error fetching contest data:", error);
        setMessage("Error fetching contest data.");
      }
    };

    fetchContestData();
  }, []);

  const handleSubmit = () => {
    console.log("Submit button clicked!");

    if (!socket) {
      console.warn("No active contest socket found!");
      setMessage("No active contest. Please check your connection.");
      return;
    }

    if (!selectedProblem) {
      console.warn("No problem selected!");
      setMessage("Please select a problem first.");
      return;
    }

    const submissionData = {
      code,
      language,
      problemId: selectedProblem.problemId, // Using problemId from API
      userId: user._id,
      contestId: 19, // Contest ID from received data
    };

    console.log("Submitting code:", submissionData);
    socket.emit("submit_code", submissionData);
  };

  return (
    <div>
      <h1>Contest</h1>

      <h2>Problems</h2>
      {problems.length === 0 ? (
        <p>Loading problems...</p>
      ) : (
        <ul>
          {problems.map((problem) => (
            <li
              key={problem.problemId}
              onClick={() => setSelectedProblem(problem)}
              style={{ cursor: "pointer" }}
            >
              <strong>{problem.problemTitle}</strong> - Attempted:{" "}
              {problem.attemptedBy}, Solved: {problem.solvedBy}
            </li>
          ))}
        </ul>
      )}

      {selectedProblem && (
        <div>
          <h3>Selected Problem</h3>
          <h4>{selectedProblem.problemTitle}</h4>
          <p>Attempted: {selectedProblem.attemptedBy}</p>
          <p>Solved: {selectedProblem.solvedBy}</p>
        </div>
      )}

      <h2>Submit Your Code</h2>
      <textarea
        value={code}
        onChange={(e) => {
          console.log("Code updated:", e.target.value);
          setCode(e.target.value);
        }}
        rows="5"
        cols="50"
        placeholder="Write your code here..."
      />

      <label>Language:</label>
      <select
        value={language}
        onChange={(e) => {
          console.log("Language changed to:", e.target.value);
          setLanguage(e.target.value);
        }}
      >
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>

      <button onClick={handleSubmit}>Submit Code</button>

      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={user.userId}>
            {index + 1}. {user.userId}: {user.score} points
          </li>
        ))}
      </ul>

      <p>{message}</p>
    </div>
  );
};

export default ContestPage;
