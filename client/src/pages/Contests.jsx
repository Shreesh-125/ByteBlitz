import React, { useEffect, useState } from 'react'
import styles from '../styles/Contests.module.css'
import Trophy from '../assets/trophy.png'
import { CiClock2 } from "react-icons/ci";
import user from '../assets/user.png'
import contestImage from '../assets/contestImage.jpg';
import { Link } from 'react-router-dom';
import Pagination from '../ui/Pagination'
const data = []

const Contests = () => {
  const [isPrevious, setIsPrevious] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [problems, setProblems] = useState([]);
  const problemsPerPage = 15;
  const totalPages = Math.ceil(data.length / problemsPerPage);

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(indexOfFirstProblem, indexOfLastProblem);

  useEffect(() => {
    const indexOfLastProblem = currentPage * problemsPerPage;
    const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
    setProblems(data.slice(indexOfFirstProblem, indexOfLastProblem));

  }, [currentPage])

  return (
    <div className={styles.contestsContainer}>
      <div className={styles.upcomingContestsContainer}>
        <div className={styles.upcomingContestsHeading}>
          Upcoming Contests
        </div>
        <div className={styles.upcomingContests}>

          <div className={styles.upcomingContest}>
            <div>
              <img src={contestImage} alt="contest image" className={styles.upcomingContestImage} />
            </div>
            <div className={styles.upcomingContestInformation}>
              <div className={styles.info1}>
                <p>BB Challenge #2</p>
                <p>
                  <span>
                    20th March 2025
                  </span>
                  <span>
                    8:00 PM
                  </span>
                </p>
              </div>
              <div className={styles.info2}>
                <div className={styles.registeredUsers}>
                  <p>3500</p>
                  <img src={user} alt="user image" className={styles.icon} />
                </div>
                <button className={styles.registerBtn}>
                  Register Now
                </button>
              </div>
            </div>
          </div>
          <div className={styles.upcomingContest}>
            <div>
              <img src={contestImage} alt="contest image" className={styles.upcomingContestImage} />
            </div>
            <div className={styles.upcomingContestInformation}>
              <div className={styles.info1}>
                <p>BB Challenge #2</p>
                <p>
                  <span>
                    20th March 2025
                  </span>
                  <span>
                    8:00 PM
                  </span>
                </p>
              </div>
              <div className={styles.info2}>
                <div className={styles.registeredUsers}>
                  <p>3500</p>
                  <img src={user} alt="user image" className={styles.icon} />
                </div>
                <button className={styles.registerBtn}>
                  Register Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className={styles.pastContestsContainer}>
        <div className={styles.previousContests}>
          <div className={styles.contestSelect}>
            <span onClick={() => setIsPrevious(true)} className={`${isPrevious ? styles.selected : ""} ${styles.selectedItem}`}>Previous Contests</span>
            <span onClick={() => setIsPrevious(false)} className={`${!isPrevious ? styles.selected : ""} ${styles.selectedItem}`}>My Contests</span>
          </div>
          <div className={styles.contests}>
            <div className={styles.contestsListHeading}>
              <span>Contest</span>
              <span>Name</span>
              <span>Time</span>
              <span>Standings</span>
              <span>Participants</span>
            </div>
          </div>
          <div className={styles.contestsListItem}>
            <img src={contestImage} alt="contest" className={styles.contestImage} />
            <span className={styles.contestName}>BB Challenge #2</span>
            <span>
              <p>19 March 2025</p>
              <span className={styles.contestTiming}>Wed 20:00</span>
            </span>
            <Link to='/contests/2/standings' className={styles.LinkStyles}>
              <span>Standings</span>
            </Link>
            <span className={styles.registeredUsers}>
              <p>3500</p>
              <img src={user} alt="user image" className={styles.icon} />
            </span>
          </div>
          <div className={styles.contestsListItem}>
            <img src={contestImage} alt="contest" className={styles.contestImage} />
            <span className={styles.contestName}>BB Challenge #2</span>
            <span>
              <p>19 March 2025</p>
              <span className={styles.contestTiming}>Wed 20:00</span>
            </span>
            <Link to='/contests/2/standings' className={styles.LinkStyles}>
              <span>Standings</span>
            </Link>
            <span className={styles.registeredUsers}>
              <p>3500</p>
              <img src={user} alt="user image" className={styles.icon} />
            </span>
          </div>
          <div className={styles.contestsListItem}>
            <img src={contestImage} alt="contest" className={styles.contestImage} />
            <span className={styles.contestName}>BB Challenge #2</span>
            <span>
              <p>19 March 2025</p>
              <span className={styles.contestTiming}>Wed 20:00</span>
            </span>
            <Link to='/contests/2/standings' className={styles.LinkStyles}>
              <span>Standings</span>
            </Link>
            <span className={styles.registeredUsers}>
              <p>3500</p>
              <img src={user} alt="user image" className={styles.icon} />
            </span>
          </div>
          <div className={styles.contestsListItem}>
            <img src={contestImage} alt="contest" className={styles.contestImage} />
            <span className={styles.contestName}>BB Challenge #2</span>
            <span>
              <p>19 March 2025</p>
              <span className={styles.contestTiming}>Wed 20:00</span>
            </span>
            <Link to='/contests/2/standings' className={styles.LinkStyles}>
              <span>Standings</span>
            </Link>
            <span className={styles.registeredUsers}>
              <p>3500</p>
              <img src={user} alt="user image" className={styles.icon} />
            </span>
          </div>
        </div>
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Contests