import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const ContestPage = () => {
  const [socket, setSocket] = useState(null);
  const [leaderboard, setLeaderboard] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    let newSocket; // 🔹 Use a local variable instead of directly modifying state

    fetch("http://localhost:8000/api/v1/contest/67d2f70adb2314797a0809ab") // API to check contest status
      .then(res => res.json())
      .then(data => {
        if (data.status === "running") {
          newSocket = io("http://localhost:8000", { transports: ["websocket", "polling"] }); // 🔹 Add transports for stability

          newSocket.on("connect", () => {
            console.log("Connected to WebSocket");
          });

          newSocket.on("contest_not_running", (data) => {
            console.log(data.message); // "Contest is not running!"
          });
          
          newSocket.on("leaderboard_update", (data) => {
            console.log("Leaderboard updated:", data);
          });
          
          // newSocket.on("submission_result", (data) => {
          //   console.log(data.message); // "Submission successful!"
          // });

          newSocket.on("contest_started", () => {
            console.log("Contest started!");
          });

          newSocket.on("leaderboard_update", (data) => {
            setLeaderboard(data);
          });

          newSocket.on("see_output",(data)=>{
            console.log(data);
         
          })

          // newSocket.on("submission_result", (data) => {
          //   setMessage(data.message);
          // });

          newSocket.on("contest_ended", () => {
            console.log("Contest ended! Disconnecting...");
            newSocket.disconnect();
          });

          setSocket(() => newSocket); // 🔹 Update state using a callback function
        } else {
          console.log("Contest not running");
        }
      })
      .catch(error => console.error("Error fetching contest status:", error));

    return () => {
      if (newSocket) {
        console.log("Disconnecting socket...");
        newSocket.disconnect(); // 🔹 Ensure disconnection happens
      }
    };
  }, []); // 🔹 Keep empty, no dependencies needed

  const submitCode = () => {
    if (!socket) {
      console.log("No active contest!");
      return;
    }

    socket.emit("submit_code", {
      problemId: "p1",
      code: `console.log(5 + 30);`,
      language: "javascript",
      userId: "user123"
    });
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
