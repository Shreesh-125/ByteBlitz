import React, { useState } from 'react';
import styles from '../styles/FriendsTable.module.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
    const [friendsList, setFriendsList] = useState(friends);
    const handleUnfriend = (profile) => {
        setFriendsList((prevFriends) =>{
            return prevFriends.filter(friend => friend.profile !== profile)
        });
    };

    return (
        <div className={styles.friendsTable}>
            <div className={`${styles.friendRow} ${styles.header}`}>
                <span>Friends</span>
                <span className={`${styles.centerGridInfo} ${styles.ratingInfo} `}>Rating</span>
                <span className={styles.centerGridInfo}>Unfriend</span>
            </div>
            {friendsList.map(({ profile, rating, isFriend }, index) => (
                <div key={index} className={styles.friendRow}>
                    <span>{profile}</span>
                    <span className={`${styles.centerGridInfo} ${styles.ratingInfo} `}>{rating}</span>
                    <span
                        className={`${styles.centerGridInfo} ${styles.heartIcon}`}
                        onClick={() => handleUnfriend(profile)}
                    >
                    <FaHeart color="blue" />
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FriendsTable;