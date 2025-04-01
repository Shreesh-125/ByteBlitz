import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import styles from "../styles/Allsubmissionpage.module.css";
import Loader from "../ui/Loader.jsx";
import { getPaginatedSubmission } from "../servers/getPaginatedSubmission.js";

const Allsubmissionpage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  // Redirect to login if no user is found
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["submissions", page, user?.userName],
    queryFn: () => getPaginatedSubmission(user.userName, page, 20, token),
    keepPreviousData: true,
    enabled: !!user,
  });
  console.log(data);

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.pagetitle}>
        <p>All My Submissions</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.table}>
            <div className={styles.header}>
              <p className={styles.headertimesubmitted}>Time Submitted</p>
              <p className={styles.headerquestion}>Question</p>
              <p className={styles.headerstatus}>Status</p>
              <p className={styles.headerruntime}>Runtime</p>
              <p className={styles.headerlanguage}>Language</p>
            </div>

            <div className={styles.list}>
              <ul>
                {data?.submissions.map(
                  (
                    { date, questionTitle, status, runtime, language },
                    index
                  ) => (
                    <li key={index} className={styles.listitem}>
                      <div className={styles.when}>
                        <p className={styles.date}>{date}</p>
                      </div>
                      <p className={styles.question}>{questionTitle}</p>
                      <p
                        className={`${styles.status} ${
                          status ? styles.accepted : styles.rejected
                        }`}
                      >
                        {status ? "Accepted" : "Rejected"}
                      </p>
                      <p className={styles.runtime}>{runtime}</p>
                      <p className={styles.runtime}>{language}</p>
                    </li>
                  )
                )}
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
              Page {page} of {data?.totalPages}
            </span>
            <button
              disabled={page === data?.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Allsubmissionpage;
