import React from 'react';
import styles from '../styles/ContestsTable.module.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getUserContests } from '../servers/getContest';

const ContestsTable = () => {
  const user = useSelector((state) => state.auth.user);

  const { 
    data: contestList = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['contests', user?.username],
    queryFn: () => getUserContests(user?.username),
    enabled: !!user?.username,
  });
 
  if (isLoading) {
    return <div className={styles.contestsContainer}>Loading contests...</div>;
  }

  if (isError) {
    return (
      <div className={styles.contestsContainer}>
        Error loading contests: {error.message}
      </div>
    );
  }
  
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
            {contestList.length > 0 ? (
              contestList.map((contest, index) => (
                <tr key={contest.id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/contests/${contest.contestNo}`}>
                      #{contest.contestNo}
                    </Link>
                  </td>
                  <td>
                    {contest.startTime && (
                      <>
                        <p>{contest.startTime.split(',')[0]}</p>
                        <p>{contest.startTime.split(',')[1]}</p>
                      </>
                    )}
                  </td>
                  <td>{contest.rank}</td>
                  <td
                    className={
                      contest.ratingChange>0
                        ? styles.positive
                        : styles.negative
                    }
                  >
                    {contest.ratingChange}
                  </td>
                  <td>{contest.newRating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No contests participated</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContestsTable;