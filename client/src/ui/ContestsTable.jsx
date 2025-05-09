import React from 'react';
import styles from '../styles/ContestsTable.module.css';
import { Link } from 'react-router-dom';

const ContestsTable = () => {
  const contestsData = [
    {
      id: 3,
      contestNo: 35,
      startTime: '9 May 2025, Fri 21:41',
      rank: 1421,
      ratingChange: '+35',
      newRating: 1500
    },
    {
      id: 2,
      contestNo: 20,
      startTime: '2 May 2025, Mon 11:00',
      rank: 1021,
      ratingChange: '+20',
      newRating: 1535
    },
    {
      id: 1,
      contestNo: 18,
      startTime: '1 May 2025, Tue 22:05',
      rank: 2023,
      ratingChange: '-35',
      newRating: 1515
    }
  ];

  return (
    <div className={styles.contestsContainer}>
      <h2 className={styles.title}>Your Contests</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.contestsTable}>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Contest No.</th>
              <th>Start Time</th>
              <th>Rank</th>
              <th>Rating Change</th>
              <th>New Rating</th>
            </tr>
          </thead>
          <tbody>
            {contestsData.map((contest) => (
              <tr key={contest.id}>
                <td>{contest.id}</td> 
                <td><Link to={`/contests/${contest.contestNo}`}>#{contest.contestNo}</Link></td>
                <td>
                <p>{contest.startTime.split(',')[0]}</p>
                <p>{contest.startTime.split(',')[1]}</p>
                </td>
                <td>{contest.rank}</td>
                <td className={contest.ratingChange.includes('+') ? styles.positive : styles.negative}>
                  {contest.ratingChange}
                </td>
                <td>{contest.newRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestsTable;