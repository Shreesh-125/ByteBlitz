import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/Contestproblempage.module.css';
import contestimage from '../assets/contest.png';
import Problempagenavbar from '../ui/Problempagenavbar';
import { useQuery } from '@tanstack/react-query';
import { getContestProblem } from '../servers/contestProblem';
import Loader from '../ui/Loader';
import SmallLoader from '../ui/smallLoader';

const Contestproblempage = () => {
    const { contestId } = useParams();  // Get contestId from URL params
    const navigate = useNavigate();   // Hook for navigation
    const ContestName = `BB Challenge ${contestId}`;
    const [toendtime, setToendtime] = useState(""); // Initialize timer as empty

    // Fetch problems using React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['contestProblems', contestId], 
        queryFn: () => getContestProblem(contestId),
        enabled: !!contestId,  // Prevent fetching if contestId is undefined
    });

    // Handle contest not found or not started
    useEffect(() => {
        if (data?.success === false || data?.contestAccessible === false) {
            // If the contest is not found or not started, show a message and redirect
            alert(data.message); // Display the backend error message
            navigate(-1); // Go back to the previous page
        }
    }, [data, navigate]);

    // Countdown timer logic
    useEffect(() => {
        if (data?.isrunning && data?.endTime) {
            // Convert endTime from UTC to IST (UTC+5:30)
            const endTimeUTC = new Date(data.endTime).getTime(); // Get UTC timestamp

            const interval = setInterval(() => {
                const now = new Date().getTime(); // Current time in local time zone (IST)
                const timeLeft = endTimeUTC - now; // Time remaining in milliseconds

                if (timeLeft > 0) {
                    // Calculate hours, minutes, and seconds
                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                    // Format the time as "HH : MM : SS"
                    setToendtime(
                        `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
                    );
                } else {
                    // Contest has ended
                    setToendtime("00 : 00 : 00");
                    clearInterval(interval); // Stop the timer
                }
            }, 1000); // Update every second

            return () => clearInterval(interval); // Cleanup interval on unmount
        }
    }, [data?.isrunning, data?.endTime]);

    // Handle loading and error states
    if (isLoading) return <Loader />;
    if (isError) return <div>Failed to load problems. Please try again.</div>;

    // Extract problems from the data
    const problems = data?.problems || [];

    return (
        <div className={styles.container}>
            <Problempagenavbar/>
            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.problemlistheader}>
                        <p className={styles.srno}>Sr. No.</p>
                        <p className={styles.problemtitle}>Problem Name</p>
                        <p className={styles.submissions}>Submissions</p>
                        <p className={styles.accuracy}>Accuracy</p>
                    </div>
                    
                    <div className={styles.problemtable}>
                        {
                            problems?.map((problem, index) => (
                                <div key={index} className={styles.problemrow}>
                                    <p className={styles.srnox}>{index + 1}</p>
                                    <p className={styles.problemtitlex} onClick={()=>navigate(`${problem.problemId}`)}>{problem.problemTitle}</p>
                                    <p className={styles.submissionsx}>{problem.solvedBy}</p>
                                    <p className={styles.accuracyx}>{problem.attemptedBy ? ((problem.solvedBy / problem.attemptedBy) * 100).toFixed(2) : 0}%</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
                
                <div className={styles.right}>
                    <div className={styles.contestinfo}>
                        <img src={contestimage} className={styles.contestimg} alt="Contest" />
                        <div className={styles.contestname}>
                            <p>{ContestName}</p>
                        </div>
                    </div>
                    {/* Conditionally render the timer or loader */}
                    {data?.isrunning && (
                        <div className={styles.timer}>
                            <p className={styles.timertext}>Contest will end in</p>
                            {toendtime ? (
                                <p className={styles.time}>{toendtime}</p>
                            ) : (
                                <SmallLoader/> // Show spinner while loading
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contestproblempage;