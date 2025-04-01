import React from "react";
import styles from "../styles/Problempagenavbar.module.css";
import { Link, useLocation, useParams } from "react-router-dom";

const Problempagenavbar = () => {
    const location = useLocation(); // Detects current URL
    const {contestId}=useParams();

    return (
        <div
            className={`${location.pathname === "/standings" ? styles.containerwhenstandings : ""}`}
        >
            <div 
                className={`${styles.navbar} ${location.pathname === "/standings" ? styles.standings : ""}`}
            >
                <Link to={`/contests/${contestId}/problems`}>
                    <button className={styles.problembtn}>Problems</button>
                </Link>
                <Link to={`/contests/${contestId}/standings`}>
                    <button className={styles.standingbtn}>Standings</button>
                </Link>
                <div className={styles.slider}></div>
            </div>
        </div>
    );
};

export default Problempagenavbar;
