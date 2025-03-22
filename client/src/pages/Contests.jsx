import React, { useState, useMemo, useRef } from "react";
import styles from "../styles/Contests.module.css";
import contestImage from "../assets/contestImage.jpg";
import user from "../assets/user.png";
import { Link } from "react-router-dom";
import Pagination from "../ui/Pagination";
import { formatDateTime } from "../utils/DateFormat";
import { useQuery } from "@tanstack/react-query";
import { getAllContestWithPagination } from "../servers/getContest.js";
import next_icon from '../assets/next-icon.png'
import back_icon from '../assets/back-icon.png'

const Contests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 5;
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest"],
    queryFn: () => getAllContestWithPagination(currentPage, 10),
  });
  console.log(contestData);

  // Memoize filtered contests to prevent unnecessary recalculations
  const { endedContests, upcomingContests, totalPages } = useMemo(() => {
    if (!contestData)
      return { endedContests: [], upcomingContests: [], totalPages: 1 };

    const ended = contestData.filter((contest) => contest.status === "ended");
    const upcoming = contestData.filter(
      (contest) => contest.status !== "ended"
    );

    return {
      endedContests: ended,
      upcomingContests: upcoming,
      totalPages: Math.ceil(ended.length / contestsPerPage) || 1,
    };
  }, [contestData]);

  // Paginate contests dynamically
  const pageContests = useMemo(() => {
    const indexOfLastContest = currentPage * contestsPerPage;
    const indexOfFirstContest = indexOfLastContest - contestsPerPage;
    return endedContests.slice(indexOfFirstContest, indexOfLastContest);
  }, [currentPage, endedContests]);

  const slider = useRef();
  let tx = 0;
  const slideForward = ()=>{
      console.log("hi there");
      if(tx > -50){
          tx -=33.33;
      }
      slider.current.style.transform =`translateX(${tx}%)`;
  }
  const slideBackward = () => {
      console.log("hi there");
      if(tx < 0){
          tx +=33.33;
      }
      slider.current.style.transform =`translateX(${tx}%)`;
  }


  return (
    <div className={styles.contestsContainer}>
      <div className={styles.upcomingContestsContainer}>
        <div className={styles.contestsHeading}>Upcoming Contests</div>
        <img src={next_icon} alt="" className={styles["next-btn"]} onClick={slideForward}/>
        <img src={back_icon} alt="" className={styles["back-btn"]}  onClick={slideBackward}/>
        <div className={styles.slider}>
          <ul className={styles.upcomingContests} ref={slider}>
            {upcomingContests.map((contest) => {
              if (!contest.startTime) return null;
              const formattedTime = formatDateTime(contest.startTime);

              return (
                <li key={contest.contestId} className={styles.upcomingContest}>
                  <img
                    src={contestImage}
                    alt="contest"
                    className={styles.upcomingContestImage}
                  />
                  <div className={styles.upcomingContestInformation}>
                    <div className={styles.info1}>
                      <p>BB Challenge #{contest.contestId}</p>
                      <p>
                        <span>{formattedTime.formattedDate}</span>
                        <span>{formattedTime.formattedTime}</span>
                      </p>
                    </div>
                    <div className={styles.info2}>
                      <div className={styles.registeredUsers}>
                        <p>{contest.registeredUsers.length}</p>
                        <img src={user} alt="user" className={styles.icon} />
                      </div>
                      <button className={styles.registerBtn}>Register Now</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={styles.pastContestsContainer}>
        <div className={styles.previousContests}>
          <span className={styles.contestsHeading}>Previous Contests</span>
          <div className={styles.contests}>
            <div className={styles.contestsListHeading}>
              <span>Contest</span>
              <span>Name</span>
              <span>Time</span>
              <span>Standings</span>
              <span>Participants</span>
            </div>
          </div>
          {isLoading ? (
            <p>Loading contests...</p>
          ) : pageContests.length > 0 ? (
            pageContests.map((contest) => {
              if (!contest.startTime) return null;
              const formattedTime = formatDateTime(contest.startTime);

              return (
                <div
                  key={contest.contestId}
                  className={styles.contestsListItem}
                >
                  <img
                    src={contestImage}
                    alt="contest"
                    className={styles.contestImage}
                  />
                  <span className={styles.contestName}>
                    BB Challenge #{contest.contestId}
                  </span>
                  <span>
                    <p>{formattedTime.formattedDate}</p>
                    <span className={styles.contestTiming}>
                      {formattedTime.dayName} {formattedTime.formattedTime}
                    </span>
                  </span>
                  <Link
                    to={`/contests/${contest.contestId}/standings`}
                    className={styles.LinkStyles}
                  >
                    <span>Standings</span>
                  </Link>
                  <span className={styles.registeredUsers}>
                    <p>{contest.registeredUsers.length}</p>
                    <img src={user} alt="user" className={styles.icon} />
                  </span>
                </div>
              );
            })
          ) : (
            <p>No contests available.</p>
          )}
        </div>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Contests;
