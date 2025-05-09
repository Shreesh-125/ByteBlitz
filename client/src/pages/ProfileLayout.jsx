import React from 'react';
import Profilepagesidebar from './Profilepagesidebar';
import styles from '../styles/Friendspage.module.css'
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
    return (
        <div style={{ marginTop: 40 }}>
            <div className={styles.container}
            >
                {/* <FriendsTable /> */}
                <Outlet/>
                <div className={styles.right}>
                    <Profilepagesidebar/>
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;