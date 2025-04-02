import React from 'react';
import Profilecontainer from '../ui/Profilecontainer';
import Profilepagesidebar from './Profilepagesidebar';
import styles from '../styles/Friendspage.module.css'
import FriendsTable from '../ui/FriendsTable';
const Friendspage = () => {
    return (
        <div style={{ marginTop: 40 }}>
            <div className={styles.container}
            >
                <FriendsTable />
                <div className={styles.right}>
                    <Profilepagesidebar/>
                </div>
            </div>
        </div>
    );
};

export default Friendspage;