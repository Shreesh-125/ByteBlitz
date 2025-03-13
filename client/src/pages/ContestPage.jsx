import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ContestPage = () => {
  const [socket, setSocket] = useState(null);
  const [leaderboard, setLeaderboard] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    let newSocket = io("http://localhost:8000", { transports: ["websocket", "polling"] });
  
    newSocket.on("connect", () => {
      console.log("Connected to WebSocket with ID:", newSocket.id);
    });
  
    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });
  
    newSocket.on("contest_started", () => {
      console.log("Contest started!");
    });
  
    newSocket.on("leaderboard_update", (data) => {
      setLeaderboard(data);
    });
  
    newSocket.on("submission_result", (data) => {
      setMessage(data.message);
    });
  
    newSocket.on("contest_ended", () => {
      console.log("Contest ended! Disconnecting...");
      newSocket.disconnect();
    });
  
    setSocket(newSocket);
  
    return () => {
      if (newSocket) {
        console.log("Disconnecting socket...");
        newSocket.disconnect();
      }
    };
  }, []);
  

  const submitCode = () => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
  
    if (socket.connected) {
      console.log("Emitting submit_code event...");
      socket.emit("submit_code", {
        problemId: "p1",
        code: `console.log(5 + 5);`,
        language: "javascript",
        userId: "user123"
      });
    } else {
      console.error("Socket is disconnected!");
    }
  };
  
  return (
    <div>
      <h1>Contest</h1>
      <button onClick={submitCode}>Submit Code</button>
      <p>{message}</p>
      <h3>Leaderboard</h3>
      <ul>
        {Object.entries(leaderboard).map(([user, score]) => (
          <li key={user}>{user}: {score} points</li>
        ))}
      </ul>
    </div>
  );
};

export default ContestPage;
