import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/Ranking.module.css';
import Loader from '../ui/Loader';
import { useQuery } from '@tanstack/react-query';
import { getRankingList } from '../servers/rankingpage'; // Make sure this path is correct

const Ranking = () => {
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["rankinglist", page], // Removed user dependency
    queryFn: () => getRankingList(page, 20),
    keepPreviousData: true,
  });

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading rankings: {error.message}</div>;

  // Safely access nested data with defaults
  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination || { 
    totalPages: 1,
    currentPage: page 
  };

  return (
    <div className={styles.container}>
      <div className={styles.pagetitle}>
        <p>Global Rankings</p>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          <p className={styles.headerrank}>Rank</p>
          <p className={styles.headerusername}>Username</p>
          <p className={styles.headerrating}>Rating</p>
          <p className={styles.headermaxrating}>Max Rating</p>
        </div>

        <div className={styles.list}>
          <ul>
            {users.map((user) => (
              <li key={user._id} className={styles.listitem}>
                <p className={styles.rank}>#{user.rank}</p>
                <p className={styles.username}>
                  {/* <img 
                    src={user.profilePhoto || '/default-avatar.png'} 
                    alt="profile" 
                    className={styles.avatar}
                  /> */}
                  {user.username}
                </p>
                <p className={styles.rating}>{user.rating}</p>
                <p className={styles.maxrating}>{user.maxRating}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {pagination.totalPages}
        </span>
        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Ranking;