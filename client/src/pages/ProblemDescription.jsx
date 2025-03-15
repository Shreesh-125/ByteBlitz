import React, { useState } from 'react'
import Latex from 'react-latex'
import styles from '../styles/ProblemDescription.module.css'
import { MdOutlineContentCopy } from "react-icons/md";

const ProblemDescription = ({sampleInput,sampleOutput}) => {

    const handleInputCopy = () => {
        navigator.clipboard.writeText(sampleInput);
    }

    const handleOutputCopy = () => {
        navigator.clipboard.writeText(sampleOutput);
    }
    

    return (
        <div className={`${styles.problemDescription} ${styles.problemScrollbar}`}>
            <div className={styles.problemTitle}>
                <div className={styles.title}>
                    Constant Subsequence
                </div>
                <div className={styles.timeLimit}>
                    Time Limit: 2 seconds
                </div>
                <div className={styles.memoryLimit}>
                    Memory Limit: 256 megabytes
                </div>
            </div>
            <div className={styles.problemItem}>
                Alice has an array A of length N, and her goal is to rearrange the array in a way that minimises the maximum subarray sum of the resulting array.
                However, Alice must keep the relative order of all non-negative and negative elements the same as in the original array. In other words:
                The non-negative numbers should appear in the same order as they originally appeared in A.
                The negative numbers should appear in the same order as they originally appeared in A.
                You are tasked with finding the minimum possible value of the maximum subarray sum after rearranging the array according to these rules.
                Note: The sum of an empty subarray is 0.
            </div>
            <div className={styles.problemItem}>
                <p>Input Format</p>
                <div>
                    The first line of input will contain a single integer T, denoting the number of test cases.
                    Each test case consists of multiple lines of input.
                    The first line of each test case contains a integer N — the length of the array.
                    The second line of each test case contains N space-separated integers - values of the array A.
                </div>
            </div>
            <div className={styles.problemItem}>
                <p>Output Format</p>
                <div>
                    For each test case, output on a new line the minimum possible value of the maximum subarray sum after rearranging the array according to these rules.
                </div>
            </div>
            <div className={styles.problemItem}>
                <p>Constraints</p>
                <div className={styles.constraints}>
                    <Latex font="Bentham">
                        {`$$1 \\le T \\le 10^5$$ \n $$1 \\le Q \\le 10^5$$ \n $$1 \\le N \\le 10^5$$ \n $$ The\\ sum\\ of\\ n\\ over\\ all\\ test\\ cases\\ does\\ not\\ exceed\\ 10^5.$$`}
                    </Latex>
                </div>
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
                        {sampleInput}
                    </div>
                    <div className={styles.sampleOutput}>
                        {sampleOutput}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProblemDescription