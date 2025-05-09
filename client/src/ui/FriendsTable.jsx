import React, { useState } from 'react';
import styles from '../styles/FriendsTable.module.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAllFriends, togglefriend } from '../servers/profilePage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const friends = [
    {
        profile: 'Manu_codeup',
        rating: 1699
    },
    {
        profile: 'Shreesh_125',
        rating: 1899
    },
    {
        profile: 'Enum2',
        rating: 1950
    },
];

const FriendsTable = () => {
    const { username } = useParams();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch friends data using React Query
    const { data: friendsList, isLoading, isError, error } = useQuery({
        queryKey: ['friends', username],
        queryFn: () => getAllFriends(username || user?.username),
        enabled: !!username || !!user?.username, // Only run if username or user.username exists
        select: (data) => {
            if (!data?.data) return [];
            return data.data.map(friend => ({
                profile: friend,
                rating: 0 // You might want to fetch actual ratings here
            }));
        }
    });

     // Toggle friend status mutation
    const toggleFriendMutation = useMutation({
        mutationFn: ({ userid, friendUsername }) => 
            togglefriend(userid, friendUsername),
        onSuccess: () => {
            queryClient.invalidateQueries(['friends', username]);
            
        },
        onError: (error) => {
            console.error("Error toggling friend:", error);
            toast.error("Failed to update friend status");
        }
    });


    const handleToggleFriend = (friendUsername) => {
        if (!user?._id || !friendUsername) return;
        toggleFriendMutation.mutate({
            userid: user._id,
            friendUsername
        });
    };

    if (isLoading) {
        return <div className={styles.loading}>Loading friends...</div>;
    }

    if (isError) {
        return <div className={styles.error}>Error: {error.message}</div>;
    }


    return (
        <div className={styles.friendsTable}>
            <div className={`${styles.friendRow} ${styles.header}`}>
                <span>Friends</span>
                <span className={`${styles.centerGridInfo} ${styles.ratingInfo} `}>Rating</span>
                <span className={styles.centerGridInfo}>Unfriend</span>
            </div>
            {friendsList?.length > 0 ? (
                friendsList.map(({ profile, rating }, index) => (
                    <div key={index} className={styles.friendRow}>
                        <span 
                            className={styles.username} 
                            onClick={() => navigate(`/profile/${profile}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            {profile}
                        </span>
                        <span className={`${styles.centerGridInfo} ${styles.ratingInfo} `}>
                            {rating}
                        </span>
                        <span
                            className={`${styles.centerGridInfo} ${styles.heartIcon}`}
                            onClick={() => handleToggleFriend(profile)}
                            style={{ cursor: 'pointer' }}
                        >
                            <FaHeart color="blue" />
                        </span>
                    </div>
                ))
            ) : (
                <div className={styles.noFriends}>No friends found</div>
            )}
        </div>
    );
};

export default FriendsTable;