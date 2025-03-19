import React, { useEffect, useState } from 'react'
import styles from '../styles/Contests.module.css'
import Trophy from '../assets/trophy.png'
import { CiClock2 } from "react-icons/ci";
import user from '../assets/user.png'
import contestImage from '../assets/contestImage.jpg';
import { Link } from 'react-router-dom';
import Pagination from '../ui/Pagination'
import { formatDateTime } from '../utils/DateFormat';
const data = [
  {
    contestId: 5,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 4,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 3,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 2,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 6,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 7,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 8,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 9,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },{
    contestId: 10,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 11,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 12,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 13,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },{
    contestId: 14,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 15,
    registeredUsers: [
      "zaxas",
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 16,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
  {
    contestId: 17,
    registeredUsers: [
      "shreesh_125"
    ],
    startTime: new Date("2025-01-01T00:00:00Z"),
    status: "ended"
  },
]

const Contests = () => {
  const [myContests, setMyContests] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const [contests, setContests] = useState(data);
  const [pageContests, setPageContests] = useState([])
  const contestsPerPage = 5;
  const [totalPages, setTotalPages] = useState(Math.ceil(contests.length / contestsPerPage));
  
  useEffect(() => {
    setTotalPages(() => {
      const newTotalPages = Math.ceil(contests.length / contestsPerPage);
      
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      
      return newTotalPages;
    });
  }, [contests]); // Runs when `contests` change
  
  useEffect(() => {
    const indexOfLastContest = currentPage * contestsPerPage;
    const indexOfFirstContest = indexOfLastContest - contestsPerPage;
    setPageContests(contests.slice(indexOfFirstContest, indexOfLastContest));
  }, [currentPage, contests]); // Runs when `currentPage` changes  


  useEffect(() => {
    if (myContests) {
      setContests(data.filter(contest => (contest.status == "ended" && contest.registeredUsers.includes("zaxas"))))
    } else {
      setContests(data.filter(contest => contest.status == "ended"))
    }
  }, [myContests])

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
            <span onClick={() => setMyContests(false)} className={`${!myContests ? styles.selected : ""} ${styles.selectedItem}`}>Previous Contests</span>
            <span onClick={() => setMyContests(true)} className={`${myContests ? styles.selected : ""} ${styles.selectedItem}`}>My Contests</span>
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
          {
            pageContests.length >0 ?
            (
            pageContests.map((contest, index) => {
              if (!contest.startTime) return null; // Prevent errors if startTime is missing

              const formattedTime = formatDateTime(contest.startTime);

              return (
                <div key={contest.contestId || index} className={styles.contestsListItem}>
                  <img src={contestImage} alt="contest" className={styles.contestImage} />

                  <span className={styles.contestName}>
                    BB Challenge #{contest.contestId}
                  </span>

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
                    <img src={user} alt="user image" className={styles.icon} />
                  </span>
                </div>
              );
            })
          ) :
          <p>Contests are loading...</p>
          }
        </div>
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  )
}

export default Contests