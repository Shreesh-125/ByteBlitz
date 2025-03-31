import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "../styles/Contests.module.css";
import { Link } from "react-router-dom";
import Pagination from "../ui/Pagination";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllContestWithPagination,
  registerUser,
} from "../servers/getContest.js";
import next_icon from "../assets/next-icon.png";
import back_icon from "../assets/back-icon.png";
import Loader from "../ui/Loader.jsx";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ContestCard, PastContestCard } from "../ui/ContestsCard.jsx";

const Contests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const contestsPerPage = 5;

  const user = useSelector((state) => state.auth.user);

  const slider = useRef();
  const [tx, setTx] = useState(0);

  // First fetch all contests without user dependency
  const { data: contestData, isLoading } = useQuery({
    queryKey: ["contest"],
    queryFn: () => getAllContestWithPagination(currentPage, 5),
  });

  // State for contests with registration status
  const [processedContests, setProcessedContests] = useState({
    ended: [],
    upcoming: [],
    running: [],
  });

  // Update contests with registration status when user or contestData changes
  useEffect(() => {
    if (contestData) {
      const processContests = () => {
        const ended = contestData.filter((c) => c.status === "ended");
        const upcoming = contestData.filter((c) => c.status === "upcoming");
        const running = contestData.filter((c) => c.status === "running");

        // Only add registered status if user is logged in
        if (user?._id) {
          const addRegisteredStatus = (contests) =>
            contests.map((c) => ({
              ...c,
              registered: c.registeredUsers?.includes(user._id) || false,
            }));

          setProcessedContests({
            ended,
            upcoming: addRegisteredStatus(upcoming),
            running: addRegisteredStatus(running),
          });
        } else {
          setProcessedContests({
            ended,
            upcoming,
            running,
          });
        }
      };

      processContests();
    }
  }, [contestData, user?._id]);

  //register User + update Registration State
  const { mutate: registerMutation, isLoading: isRegistering } = useMutation({
    mutationFn: ({ contestId, userId }) => registerUser({ contestId, userId }),
    onSuccess: (data) => {
      if (data.status === 200) {
        // Update the specific contest's registered status
        setProcessedContests((prev) => ({
          ...prev,
          upcoming: prev.upcoming.map((c) =>
            c.contestId === data.contestId
              ? {
                  ...c,
                  registered: true,
                  registeredUsers: [...c.registeredUsers, user._id],
                }
              : c
          ),
          running: prev.running.map((c) =>
            c.contestId === data.contestId
              ? {
                  ...c,
                  registered: true,
                  registeredUsers: [...c.registeredUsers, user._id],
                }
              : c
          ),
        }));
        toast.success("Registered successfully!");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const handleRegister = (contestId) => {
    if (!user?._id) {
      toast.error("Please login to register");
      return;
    }
    registerMutation({ contestId, userId: user._id });
  };

  const renderContestAction = (contest) => {
    //for running contest
    if (contest.status === "running") {
      if (!user) {
        return (
          <button
            className={styles.enterBtn}
            onClick={() => toast.error("Please login to enter the contest")}
          >
            Enter Contest
          </button>
        );
      }
      if (!contest.registered) {
        return (
          <button
            className={styles.enterBtn}
            onClick={() =>
              toast.error("You need to register first to enter this contest")
            }
          >
            Enter Contest
          </button>
        );
      }
      return (
        <Link
          to={`/contests/${contest.contestId}/problems`}
          className={styles.enterBtn}
        >
          Enter Contest
        </Link>
      );
    }

    // For upcoming contests
    if (!user) {
      return (
        <button
          className={styles.registerBtn}
          onClick={() => toast.error("Please login to register")}
        >
          Register Now
        </button>
      );
    }

    return (
      <button
        className={`${styles.registerBtn} ${
          contest.registered ? styles.registeredBtn : ""
        }`}
        onClick={() => handleRegister(contest.contestId)}
        disabled={contest.registered || isRegistering}
      >
        {contest.registered ? "Registered" : "Register Now"}
        {isRegistering && <span className={styles.loadingSpinner}></span>}
      </button>
    );
  };

  // Pagination for ended contests
  const paginatedEndedContests = useMemo(() => {
    const start = (currentPage - 1) * contestsPerPage;
    const end = start + contestsPerPage;
    return processedContests.ended.slice(start, end);
  }, [currentPage, processedContests.ended]);

  // Slider functions
  const slideForward = () => {
    if (tx > -50) setTx(tx - 33.33);
  };

  const slideBackward = () => {
    if (tx < 0) setTx(tx + 33.33);
  };

  return (
    <div className={styles.contestsContainer}>
      {/* Running Contests */}
      {processedContests.running.length > 0 && (
        <div className={styles.runningContestsContainer}>
          <div className={styles.contestsHeading}>Live Contests</div>
          <div className={styles.slider}>
            <ul className={styles.upcomingContests} ref={slider}>
              {processedContests.running.map((contest) => (
                <ContestCard
                  key={contest.contestId}
                  contest={contest}
                  renderAction={renderContestAction}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Upcoming Contests */}
      <div className={styles.upcomingContestsContainer}>
        <div className={styles.contestsHeading}>Upcoming Contests</div>
        <img
          src={next_icon}
          alt=""
          className={styles["next-btn"]}
          onClick={slideForward}
        />
        <img
          src={back_icon}
          alt=""
          className={styles["back-btn"]}
          onClick={slideBackward}
        />
        <div className={styles.slider}>
          <ul className={styles.upcomingContests}>
            {processedContests.upcoming.map((contest) => (
              <ContestCard
                key={contest.contestId}
                contest={contest}
                renderAction={renderContestAction}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* Past Contests */}
      <div className={styles.pastContestsContainer}>
        <div className={styles.previousContests}>
          <span className={styles.contestsHeading}>Past Contests</span>
          {isLoading ? (
            <Loader />
          ) : paginatedEndedContests.length > 0 ? (
            paginatedEndedContests.map((contest) => (
              <PastContestCard key={contest.contestId} contest={contest} />
            ))
          ) : (
            <p>No past contests available</p>
          )}
        </div>
      </div>

      <Pagination
        totalPages={Math.ceil(processedContests.ended.length / contestsPerPage)}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Contests;
