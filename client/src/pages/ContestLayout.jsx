// ContestLayout.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { checkRegisteredUser, getContestStatus } from '../servers/contestProblem';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useSocket } from '../context/SocketContext';
import Loader from '../ui/Loader';

const ContestLayout = () => {
    const { contestId } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { socket, setSocket, setIsrunning, setIsRegister } = useSocket();

    // Fetch contest status
    const { data: contestStatus } = useQuery({
        queryKey: ['contest', contestId],
        queryFn: () => getContestStatus(contestId),
        enabled: !!contestId,
    });

    // Redirect if contest is upcoming
    useEffect(() => {
        if (contestStatus?.status === "upcoming") {
            navigate(-1);
        }
    }, [contestStatus]);

    // Handle socket connection
    useEffect(() => {
        if (contestStatus?.status === "running") {
            setIsrunning(true);
            
            if (!socket) {
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
        } else {
            setIsrunning(false);
        }

        return () => {
            // Don't disconnect socket here - let App handle it
        };
    }, [contestStatus, contestId, setSocket]);

    // Check user registration
    const { data: isregisteredData } = useQuery({
        queryKey: ['contestregister', { contestId, userId: user?._id }],
        queryFn: () => checkRegisteredUser({ contestId, userId: user?._id }),
        enabled: !!contestId && !!user?._id && contestStatus?.status === "running",
    });

    useEffect(() => {
        setIsRegister(isregisteredData?.isregister);
    }, [isregisteredData]);

    if (!contestStatus) return <Loader />;

    return <Outlet />;
};

export default ContestLayout;