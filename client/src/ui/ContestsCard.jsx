import { formatDateTime } from "../utils/DateFormat";
import styles from "../styles/Contests.module.css";
import contestImage from "../assets/contestImage.jpg";
import user from "../assets/user.png";
import { Link } from "react-router-dom";

export const ContestCard = ({ contest, renderAction }) => {
    const formattedTime = formatDateTime(contest.startTime);
    
    return (
      <li className={styles.upcomingContest}>
        <img src={contestImage} alt="contest" className={styles.upcomingContestImage} />
        <div className={styles.upcomingContestInformation}>
          <div className={styles.info1}>
            <p>BB Challenge #{contest.contestId}</p>
            <p>
              <span>{formattedTime.formattedDate}</span>
              <span>{formattedTime.formattedTime}</span>
            </p>
          </div>
          <div className={styles.info2}>
            <div className={styles.registeredUsers}>
              <p>{contest.registeredUsers.length}</p>
              <img src={user} alt="user" className={styles.icon} />
            </div>
            {renderAction(contest)}
          </div>
        </div>
      </li>
    );
  };
  
export const PastContestCard = ({ contest }) => {
    const formattedTime = formatDateTime(contest.startTime);
  
    return (
      <div className={styles.contestsListItem}>
        <img src={contestImage} alt="contest" className={styles.contestImage} />
        <span className={styles.contestName}>BB Challenge #{contest.contestId}</span>
        <span>
          <p>{formattedTime.formattedDate}</p>
          <span className={styles.contestTiming}>
            {formattedTime.dayName} {formattedTime.formattedTime}
          </span>
        </span>
        <Link to={`/contests/${contest.contestId}/standings`} className={styles.LinkStyles}>
          <span>Standings</span>
        </Link>
        <span className={styles.registeredUsers}>
          <p>{contest.registeredUsers.length}</p>
          <img src={user} alt="user" className={styles.icon} />
        </span>
      </div>
    );
  };