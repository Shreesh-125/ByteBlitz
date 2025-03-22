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
    const { contestId } = useParams();  
    const navigate = useNavigate();  
    const ContestName = `BB Challenge ${contestId}`;
    const [toendtime, setToendtime] = useState(""); 

    // Fetch problems using React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['contestProblems', contestId], 
        queryFn: () => getContestProblem(contestId),
        enabled: !!contestId,  
    });

   
    useEffect(() => {
        if (data?.success === false || data?.contestAccessible === false) {
            alert(data.message); 
            navigate(-1); 
        }
    }, [data, navigate]);

    
    useEffect(() => {
        if (data?.isrunning && data?.endTime) {
            
            const endTimeUTC = new Date(data.endTime).getTime(); 

            const interval = setInterval(() => {
                const now = new Date().getTime(); 
                const timeLeft = endTimeUTC - now; 

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

            return () => clearInterval(interval); 
        }
    }, [data?.isrunning, data?.endTime]);

    
    if (isLoading) return <Loader />;
    if (isError) return <div>Failed to load problems. Please try again.</div>;


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
                    
                    {data?.isrunning && (
                        <div className={styles.timer}>
                            <p className={styles.timertext}>Contest will end in</p>
                            {toendtime ? (
                                <p className={styles.time}>{toendtime}</p>
                            ) : (
                                <SmallLoader/> 
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contestproblempage;