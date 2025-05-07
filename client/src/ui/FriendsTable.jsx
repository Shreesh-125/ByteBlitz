import React, { useState } from 'react';
import styles from '../styles/FriendsTable.module.css';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

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

    const navigate=useNavigate();

    return (
        <div className={styles.friendsTable}>
            <div className={`${styles.friendRow} ${styles.header}`}>
                <span>Friends</span>
                <span className={`${styles.centerGridInfo} ${styles.ratingInfo} `}>Rating</span>
                <span className={styles.centerGridInfo}>Unfriend</span>
            </div>
            {friendsList.map(({ profile, rating, isFriend }, index) => (
                <div key={index} className={styles.friendRow}>
                    <span className={styles.username} onClick={()=>navigate(`/profile/${profile}`)}>{profile}</span>
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