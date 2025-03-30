import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Outlet } from 'react-router-dom';
import styles from '../styles/Contestproblempage.module.css';
import contestimage from '../assets/contest.png';
import Problempagenavbar from '../ui/Problempagenavbar';
import { useQuery } from '@tanstack/react-query';
import { checkRegisteredUser, getContestProblem, getContestStatus } from '../servers/contestProblem';
import Loader from '../ui/Loader';
import SmallLoader from '../ui/smallLoader';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useSocket } from '../context/SocketContext';

const Contestproblempage = () => {
    const { contestId, problemId } = useParams();  // Get problemId to check if we're viewing a single problem
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const ContestName = `BB Challenge ${contestId}`;
    const [toendtime, setToendtime] = useState(""); 
    const { socket, setSocket,setIsrunning,setIsRegister } = useSocket();

    const { data: contestStatus } = useQuery({
        queryKey: ['contest', contestId],
        queryFn: () => getContestStatus(contestId),
        enabled: !!contestId,
    });

    if (contestStatus?.status === "upcoming") {
        navigate(-1);
    }

    const [contestRunning, setContestRunning] = useState(false);

    useEffect(() => {
        if (contestStatus?.status === "running") {
            setContestRunning(true);
            setIsrunning(true);   // isrunning of context
        }
        else{
            setIsrunning(false);
        }
    }, [contestStatus]);

    useEffect(() => {
        if (contestRunning && !user) {
            navigate(-1);
        }
    }, [contestRunning, user, navigate]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['contestProblems', contestId],
        queryFn: () => getContestProblem(contestId),
        enabled: !!contestId,
    });

    const { data: isregisteredData } = useQuery({
        queryKey: ['contestregister', { contestId, userId: user?._id }],
        queryFn: () => checkRegisteredUser({ contestId, userId: user?._id }),
        enabled: !!contestId && !!user?._id && data?.contestRunning,
    });
    useEffect(()=>{
        setIsRegister(isregisteredData?.isregister);
    },[isregisteredData])
    
    
    
    
    
    useEffect(() => {
        if (contestRunning && !socket) {
            const newSocket = io("http://localhost:8000", {
                transports: ["websocket", "polling"],
                withCredentials: true,
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
                newSocket.emit('join_contest', { contestId });
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            setSocket(newSocket);
        }

        return () => {
            // Cleanup will be handled at the app level
        };
    }, [contestRunning, contestId, setSocket]);

    useEffect(() => {
        if (data?.contestRunning && data?.endTime) {
            const endTimeUTC = new Date(data.endTime).getTime();
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const timeLeft = endTimeUTC - now;

                if (timeLeft > 0) {
                    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    setToendtime(
                        `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
                    );
                } else {
                    setToendtime("00 : 00 : 00");
                    clearInterval(interval);
                    setContestRunning(false);
                    setIsrunning(false); // isrunning of context
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [data?.contestRunning, data?.endTime]);

    if (isLoading) return <Loader />;
    if (isError) return <div>Failed to load problems. Please try again.</div>;

    const problems = data?.problems || [];

    return (
        <>
            {/* If a problemId is in the URL, show the problem description */}
            {problemId ? (
                <Outlet />
            ) : (
                // Otherwise, show the problem list
                <div className={styles.container}>
                    <Problempagenavbar />
                    <div className={styles.content}>
                        <div className={styles.left}>
                            <div className={styles.problemlistheader}>
                                <p className={styles.srno}>Sr. No.</p>
                                <p className={styles.problemtitle}>Problem Name</p>
                                <p className={styles.submissions}>Submissions</p>
                                <p className={styles.accuracy}>Accuracy</p>
                            </div>
    
                            <div className={styles.problemtable}>
                                {problems?.map((problem, index) => (
                                    <div key={index} className={styles.problemrow}>
                                        <p className={styles.srnox}>{index + 1}</p>
                                        <Link className={styles.problemtitlex} to={`${problem.problemId}`}>
                                            {problem.problemTitle}
                                        </Link>
                                        <p className={styles.submissionsx}>{problem.solvedBy}</p>
                                        <p className={styles.accuracyx}>
                                            {problem.attemptedBy
                                                ? ((problem.solvedBy / problem.attemptedBy) * 100).toFixed(2)
                                                : 0}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
    
                        <div className={styles.right}>
                            <div className={styles.contestinfo}>
                                <img src={contestimage} className={styles.contestimg} alt="Contest" />
                                <div className={styles.contestname}>
                                    <p>{ContestName}</p>
                                </div>
                            </div>
    
                            {data?.contestRunning && (
                                <div className={styles.timer}>
                                    <p className={styles.timertext}>Contest will end in</p>
                                    {toendtime ? (
                                        <p className={styles.time}>{toendtime}</p>
                                    ) : (
                                        <SmallLoader />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
    
    // ✅ Ensure the export statement is at the top level, after the return
    export default Contestproblempage;
    