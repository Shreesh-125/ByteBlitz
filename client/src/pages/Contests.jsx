import React, { useState } from 'react'
import styles from '../styles/Contests.module.css'
import Trophy from '../assets/trophy.png'
import contestImage from '../assets/contest.png'
import { CiClock2 } from "react-icons/ci";
import user from '../assets/user.png'

const Contests = () => {
  const [isPrevious, setIsPrevious] = useState(true)
  return (
    <div>
      <div className={styles.contestTop}>
        <img src={Trophy} alt="" styles={{ width: "1000px" }} />
      </div>
      <div className={styles.upcomingContestsContainer}>


        <div className={styles.imageCards}>
          <div className={styles.imageCard}>
            <img src={contestImage} alt="contest" className={styles.contestImage} />
            <div className={styles.InfoAndRegister}>
              <div className={styles.startingTime}>
                <CiClock2 size='1.5em' color='white' />
                <span>
                  Starts in 2d 12h 19m 19s
                </span>
              </div>
              <div className={styles.contestInfo}>
                <p>BB Challenge #1</p>
                <span>Sunday 8:00 AM GMT+5:30</span>
              </div>
              <div className={styles.contestRegister}>
                <button>
                  Register Now
                </button>
              </div>
            </div>
          </div>
          <div className={styles.imageCard}>
            <img src={contestImage} alt="contest" className={styles.contestImage} />
            <div className={styles.InfoAndRegister}>
              <div className={styles.startingTime}>
                <CiClock2 size='1.5em' color='white' />
                <span>
                  Starts in 2d 12h 19m 19s
                </span>
              </div>
              <div className={styles.contestInfo}>
                <p>BB Challenge #1</p>
                <span>Sunday 8:00 AM GMT+5:30</span>
              </div>
              <div className={styles.contestRegister}>
                <button>
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div className={styles.contestsContainer}>
        <div className={styles.previousContests}>
          <div className={styles.contestSelect}>
            <span onClick={() => setIsPrevious(true)} className={`${isPrevious? styles.selected : ""}`}>Previous Contests</span>
            <span onClick={() => setIsPrevious(false)} className={`${!isPrevious? styles.selected : ""}`}>My Contests</span>
          </div>
          <div className={styles.contests}>
            <div className={styles.contest}>
              <img src={contestImage} alt="contest" className={styles.contestImage} />
              <p> BB Challenge #3 </p>
              <div className={styles.registeredUsers}>
                <span>3500</span>
                <img src={user} alt="" style={{width: "31px",height: "31px"}}/>
              </div>
            </div>
            <div className={styles.contest}>
              <img src={contestImage} alt="contest" className={styles.contestImage} />
              <p> BB Challenge #3 </p>
              <div className={styles.registeredUsers}>
                <span>3500</span>
                <img src={user} alt="" style={{width: "31px",height: "31px"}}/>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Contests