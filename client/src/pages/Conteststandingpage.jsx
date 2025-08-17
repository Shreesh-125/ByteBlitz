import React, { useEffect, useState } from 'react'
import Conteststandingspagination from '../ui/Conteststandingspagination'
import Standings from '../ui/Standings'
import StandingsPageSearchBar from '../ui/StandingsPageSearchBar'
import Problempagenavbar from '../ui/Problempagenavbar'
import styles from '../styles/ContestStandingPage.module.css'
import { useSocket } from '../context/SocketContext'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Loader from '../ui/Loader'
import { fetchLeaderboard } from '../servers/contestProblem'

const Conteststandingpage = () => {
  const { contestId } = useParams();
    const { socket, isrunning } = useSocket();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [NumberOfProblems,setNumberOfProblems]=useState(null);

    // Query for leaderboard (fallback when socket is not available)
    const { refetch: fetchLeaderboardAPI } = useQuery({
        queryKey: ['leaderboard', contestId],
        queryFn: () => fetchLeaderboard(contestId),
        enabled: false, // We'll trigger this manually
    });

    // Handle socket events
    useEffect(() => {
        if (!socket) {
            // If no socket, use regular API
            fetchLeaderboardAPI().then(({ data }) => {
                setLeaderboardData(data.leaderboardData);
                setNumberOfProblems(data.NumberOfProblems)
                setIsLoading(false);
            });
            return;
        }

        // Socket is available - setup listeners
        const handleLeaderboardUpdate = (data) => {
            setLeaderboardData(data.leaderboardData);
            setNumberOfProblems(data.NumberOfProblems)
            setIsLoading(false);
        };

        const handleLeaderboardError = (error) => {
            toast.error(error.message);
            // Fallback to API if socket fails
            fetchLeaderboardAPI().then(({ data }) => {
                setLeaderboardData(data);
                setIsLoading(false);
            });
        };

        // Request leaderboard data
        socket.emit("fetch_leaderboard", contestId);

        // Listen for updates
        socket.on("leaderboard_update", handleLeaderboardUpdate);
        socket.on("leaderboard_error", handleLeaderboardError);

        // Cleanup
        return () => {
            socket.off("leaderboard_update", handleLeaderboardUpdate);
            socket.off("leaderboard_error", handleLeaderboardError);
        };
    }, [socket, contestId]);

    // Refresh interval for non-socket users
    useEffect(() => {
        if (!socket) {
            const interval = setInterval(() => {
                fetchLeaderboardAPI().then(({ data }) => {
                    setLeaderboardData(data);
                });
            }, 10000); // Refresh every 10 seconds
            
            return () => clearInterval(interval);
        }
    }, [socket, contestId]);

  
    if (isLoading) return <Loader />;
  return (
    <div className={styles.container}>
        <Problempagenavbar/>
        <StandingsPageSearchBar/>
        <Standings leaderboardData={leaderboardData} NumberOfProblems={NumberOfProblems}/>
    </div>
  )
}

export default Conteststandingpage
