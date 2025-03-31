import React from 'react';
import Latex from 'react-latex';
import styles from '../styles/ProblemDescription.module.css';
import { MdOutlineContentCopy } from 'react-icons/md';
import { useOutletContext } from 'react-router-dom';

// Function to replace ^ with e
const formatExponent = (str) => {
  return (str || "").replace(/\^(\d+)/g, 'e$1'); // Default to empty string if str is undefined
};


const ProblemDescription = () => {
  const { problem } = useOutletContext();
    const sampleInput = problem?.sampleTestCase?.input;
  const sampleOutput = problem?.sampleTestCase?.output;

  const handleInputCopy = () => {
    navigator.clipboard.writeText(sampleInput);
    alert('Input copied to clipboard!');
  };

  const handleOutputCopy = () => {
    navigator.clipboard.writeText(sampleOutput);
    alert('Output copied to clipboard!');
  };

  return (
    <div className={`${styles.problemDescription} ${styles.problemScrollbar}`}>
      <div className={styles.problemTitle}>
        <div className={styles.title}>{problem?.questionTitle}</div>
        <div className={styles.timeLimit}>
          Time Limit: {problem?.timeLimit.replace('s', '')} seconds
        </div>
        <div className={styles.memoryLimit}>
          Memory Limit: {problem?.memoryLimit.replace('MB', '')} MB
        </div>
      </div>
      <div className={styles.problemItem}>
        {problem?.questionDescription?.questionDesc}
      </div>
      <div className={styles.problemItem}>
        <p>Input Format</p>
        <div>{problem?.questionDescription?.input}</div>
      </div>
      <div className={styles.problemItem}>
        <p>Output Format</p>
        <div>{formatExponent(problem?.questionDescription?.output)}</div>
      </div>
      <div className={styles.problemItem}>
        <p>Constraints</p>
        <div className={styles.constraints}>
          {problem?.questionDescription?.constraint.map((cons, index) => (
            <Latex key={index}>{formatExponent(cons)}</Latex>
          ))}
        </div>
      </div>
      <div className={styles.problemItem}>
        <p>Sample 1:</p>
        <div className={styles.sample}>
          <div className={styles.input}>
            <span>Input</span>
            <span className={styles.copyIcon}>
              <MdOutlineContentCopy onClick={handleInputCopy} />
            </span>
          </div>
          <div className={styles.output}>
            <span>Output</span>
            <span className={styles.copyIcon}>
              <MdOutlineContentCopy onClick={handleOutputCopy} />
            </span>
          </div>
          <div className={styles.sampleInput}>
            <pre>{sampleInput}</pre>
          </div>
          <div className={styles.sampleOutput}>
            <pre>{sampleOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;