import React, { useEffect, useState } from "react";
import styles from "../styles/Upcomingcontest.module.css";
// import contestImage from "../assets/contest.png";
import upcomingContestImage from "../assets/upcomingContestImage.png";

const Upcomingcontest = ({ timeData }) => {
  const contestStart = new Date(timeData?.nearestContest?.startTime); // Replace with your actual contest date
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(contestStart));
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeLeft = getTimeRemaining(contestStart);
      setTimeLeft(updatedTimeLeft);

      // Show countdown if less than 1 day remains
      setShowCountdown(
        updatedTimeLeft.total < 24 * 60 * 60 * 1000 && updatedTimeLeft.total > 0
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [contestStart]);
  
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Upcoming Contest</div>

      {
        timeData ?
        (<div className={styles.aboutContest}>
          <img src={upcomingContestImage} alt="contest" />
          <div className={styles.contestInformation}>
            <h2>BB Challenge #{timeData.nearestContest?.contestId}</h2>
            {showCountdown ? (
              <p>{formatCountdown(timeLeft)}</p>
            ) : (
              <p>
                {timeLeft.days} day{timeLeft.days !== 1 ? "s" : ""} to start
              </p>
            )}
            <h3>Register now</h3>
          </div>
        </div>) :
        <div className={styles.aboutContest}>No upcoming contest</div>
      }

    </div>
  );
};

// Helper to calculate time remaining
function getTimeRemaining(endTime) {
  const total = Date.parse(endTime) - Date.now();

  const seconds = Math.max(Math.floor((total / 1000) % 60), 0);
  const minutes = Math.max(Math.floor((total / 1000 / 60) % 60), 0);
  const hours = Math.max(Math.floor((total / (1000 * 60 * 60)) % 24), 0);
  const days = Math.max(Math.floor(total / (1000 * 60 * 60 * 24)), 0);

  return { total, days, hours, minutes, seconds };
}

// Format live countdown
function formatCountdown({ hours, minutes, seconds }) {
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default Upcomingcontest;
