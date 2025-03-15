import React from 'react'
import styles from '../styles/ProblemNav.module.css'
import { LANGUAGE_VERSION } from '../utils/languagesConstants'
import { Link } from 'react-router-dom';

const languages = Object.entries(LANGUAGE_VERSION)

const ProblemNav = ({ language, onSelectLanguage, value, setIsExecuted, setTheme, setIsSubmitting, setHasSubmitted }) => {
    const handleRunCode = () => {
        setIsExecuted(true);
    }
    const handleSubmitCode = () => {
        try {
            setIsSubmitting(true);
            setHasSubmitted("pending");
            setTimeout(() => {
                setHasSubmitted("accepted")
            }, 1000)
        } catch (error) {

        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className={styles.nav}>
            <div className={styles.leftNav}>
                <span>&lt;</span>
                <Link className={styles.linkStyle} to='/problems/20'>
                    <span>Statement</span>
                </Link>
                <Link className={styles.linkStyle} to='/problems/20/submissions'>
                    <span>Submissions</span>
                </Link>
            </div>
            <div className={styles.rightNav}>
                <div className={styles.editorSelections}>

                    <div className={styles.Select}>
                        <label htmlFor="language">Language:</label>
                        <select name="language" id="language"
                            onChange={(e) => onSelectLanguage(e.target.value)}
                        >
                            {
                                languages.map(([language, version]) => (

                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    {/* <div className={styles.Select}>
                        <label htmlFor="theme">Theme:</label>
                        <select name="theme" id="theme" onChange={(e) => setTheme(e.target.value)}>
                            <option value="vs-dark">Dark</option>
                            <option value="vs">Light</option>
                            <option value="hc-black">High Contrast</option>
                            <option value="hc-light">High Contrast Light</option>
                        </select>
                    </div> */}

                </div>

                <div className={styles.codeButtons}>
                    <div className={styles.codeButton} onClick={handleRunCode}>Run Code</div>
                    <div className={styles.codeButton} onClick={handleSubmitCode}>Submit Code</div>
                </div>
            </div>
        </div>
    )
}

export default ProblemNav