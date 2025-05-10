import React, { useState, useEffect } from "react";
import styles from "../styles/SubmissionsList.module.css";
import tickIcon from "../assets/tick.svg";
import crossIcon from "../assets/cross.svg";
import { useOutletContext } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getUserProblemSubmissions } from "../servers/problem";
import Modal from "react-modal";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCode } from "react-icons/fi"; // Import code icon

// Set app element for accessibility (needed for react-modal)
Modal.setAppElement("#root");

const SubmissionList = () => {
  const { problemId } = useOutletContext();
  const user = useSelector((state) => state.auth.user);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: submissionsData, isLoading, isError } = useQuery({
    queryKey: ["problemSubmissions", problemId, user?._id],
    queryFn: () => getUserProblemSubmissions({ problemId, userId: user?._id }),
    enabled: !!problemId && !!user,
  });
  console.log(submissionsData);
  
  useEffect(() => {
    if (submissionsData?.submissions) {
      const transformedSubmissions = submissionsData.submissions.map((sub) => ({
        id: sub._id,
        status: sub.status,
        time: sub.time ? `${parseFloat((sub.time).toFixed(2))}s` : "N/A",
        memory: sub.memory ? `${sub.memory }KB` : "N/A",
        language: sub.language,
        code: sub.code,
        icon: sub.status === "Accepted" ? tickIcon : crossIcon,
        error: sub?.error
      }));
      setSubmissions(transformedSubmissions);
    //   console.log(transformedSubmissions);
      
    }
  }, [submissionsData]);

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  if (isLoading) return <div className={styles.loading}>Loading submissions...</div>;
  if (isError) return <div className={styles.error}>Error loading submissions</div>;
  if (!submissions.length) return <div className={styles.empty}>No submissions found</div>;

  return (
    <div className={`${styles.problemSubmissions} ${styles.customScrollbar}`}>
      {/* Header */}
      <div className={styles.problemSubmissionHeader}>
        {["Submission", "Status", "Time", "Memory", "Language"].map((header, index) => (
          <div key={index} className={styles.headerItem}>
            <span>{header}</span>
          </div>
        ))}
      </div>

      {/* Submission Rows */}
      <div className={styles.submissionsContainer}>
        {submissions.map((submission) => (
          <div key={submission.id} className={styles.problemSubmissionInfo}>
            <div className={styles.infoItem}>
            <button
                onClick={() => handleViewSubmission(submission)}
                className={styles.viewButton}
              >
                <FiCode className={styles.codeIcon} />
                <span>View Code</span>
              </button>
            </div>
            <div className={styles.infoItem}>
              <img
                src={submission.icon}
                alt={submission.status}
                className={styles.icon}
                title={submission.status}
              />
              <span className={submission.status === "Accepted" ? styles.accepted : styles.rejected}>
                {submission.status}
              </span>
            </div>
            <div className={styles.infoItem}>
              <p>{submission.time}</p>
            </div>
            <div className={styles.infoItem}>
              <p>{submission.memory}</p>
            </div>
            <div className={styles.infoItem}>
              <p className={styles.language}>{submission.language}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Code Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        {selectedSubmission && (
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Submission Details</h3>
              <button onClick={closeModal} className={styles.closeButton}>
                &times;
              </button>
            </div>

            <div className={styles.submissionMeta}>
              <div>
                <strong>Status:</strong>{" "}
                <span className={selectedSubmission.status === "Accepted" ? styles.accepted : styles.rejected}>
                  {selectedSubmission.status}
                </span>
              </div>
              <div>
                <strong>Time:</strong> {selectedSubmission.time}
              </div>
              <div>
                <strong>Memory:</strong> {selectedSubmission.memory}
              </div>
              <div>
                <strong>Language:</strong> {selectedSubmission.language}
              </div>
            </div>

            {/* Error/Success Message */}
            {selectedSubmission.status !== "Accepted" ? (
              <div className={styles.errorMessage}>
                <strong>Error:</strong> {selectedSubmission.error || "Unknown error occurred"}
              </div>
            ) : (
              <div className={styles.successMessage}>
                <strong>Result:</strong> Successfully executed!
              </div>
            )}

            <div className={styles.codeContainer}>
              <SyntaxHighlighter
                language={selectedSubmission.language.toLowerCase()}
                style={vscDarkPlus}
                showLineNumbers
                wrapLines
              >
                {selectedSubmission.code}
              </SyntaxHighlighter>
            </div>

            <div className={styles.modalFooter}>
              <button onClick={closeModal} className={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubmissionList;